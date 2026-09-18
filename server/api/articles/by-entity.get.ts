import { dbExecute } from '~~/server/utils/db'
import { FIRST_PARTY_SOURCE } from '~/utils/newsSources'

const MAX_ENTITIES = 24
const MAX_PER_ENTITY = 4
const QUERY_TIMEOUT_MS = 8000
const ALLOWED_TYPES = new Set(['movie', 'tv'])

const publisherOrigin = (link: string): string | null => {
    try {
        return new URL(link).origin
    } catch {
        return null
    }
}

const publishedTime = (value: unknown): number => {
    const time = new Date(String(value || '')).getTime()
    return Number.isFinite(time) ? time : 0
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const lang = String(config.public.apiLang || 'en').substring(0, 2).toLowerCase()
    const query = getQuery(event)
    const raw = String(query.entities || '').trim()

    if (!raw) {
        return { status: 'ok', results: {} }
    }

    const keys = Array.from(new Set(
        raw.split(',')
            .map(pair => pair.trim())
            .filter(Boolean)
            .map(pair => {
                const [type, id] = pair.split(':')
                const numericId = Number(id)
                if (!ALLOWED_TYPES.has(type) || !Number.isInteger(numericId) || numericId <= 0) return ''
                return `${type}:${numericId}`
            })
            .filter(Boolean)
    )).slice(0, MAX_ENTITIES)

    if (keys.length === 0) {
        return { status: 'ok', results: {} }
    }

    try {
        const placeholders = keys.map(() => '?').join(',')

        const entityKey = `json_extract(related_tmdb_ids, '$[0].type') || ':' || json_extract(related_tmdb_ids, '$[0].id')`

        const firstParty = await dbExecute({
            sql: `SELECT id, slug, title_en, title_es, description_en, description_es,
                         image_url, published_at, requires_auth,
                         ${entityKey} AS entity_key
                  FROM cinemagoria_articles
                  WHERE is_visible = 1
                    AND (datetime(published_at) IS NULL OR datetime(published_at) <= datetime('now'))
                    AND ${entityKey} IN (${placeholders})
                  ORDER BY datetime(published_at) DESC`,
            args: keys,
        }, QUERY_TIMEOUT_MS)

        const entityPairs = keys.map(() => '(?, ?)').join(',')
        const entityArgs = keys.flatMap(key => {
            const [type, id] = key.split(':')
            return [type, Number(id)]
        })

        const thirdParty = await dbExecute({
            sql: `SELECT id, publisher, title, description, link, image, published_at,
                         tmdb_type || ':' || tmdb_id AS entity_key
                  FROM approved_news
                  WHERE language = ? AND is_visible = 1
                    AND (tmdb_type, tmdb_id) IN (VALUES ${entityPairs})
                  ORDER BY published_at DESC`,
            args: [lang, ...entityArgs],
        }, QUERY_TIMEOUT_MS).catch((error: any) => {
            console.error('[Articles by-entity API] Third-party lookup skipped:', error?.message || error)
            return { rows: [] as any[] }
        })

        const rows: any[] = [
            ...firstParty.rows.map(row => ({
                entity_key: row.entity_key as string,
                id: row.id,
                slug: row.slug,
                title_en: row.title_en,
                title_es: row.title_es,
                description_en: row.description_en,
                description_es: row.description_es,
                image_url: row.image_url,
                published_at: row.published_at,
                requires_auth: Number(row.requires_auth ?? 0) === 1 ? 1 : 0,
                href: `/news/${row.slug}`,
                is_internal: true,
                source: { name: FIRST_PARTY_SOURCE },
            })),
            ...thirdParty.rows.map(row => ({
                entity_key: row.entity_key as string,
                id: `ext-${row.id}`,
                title: row.title,
                description: row.description,
                image_url: row.image,
                published_at: row.published_at,
                requires_auth: 0,
                href: row.link,
                is_internal: false,
                source: { name: row.publisher, url: publisherOrigin(String(row.link)) },
            })),
        ]

        rows.sort((a, b) => publishedTime(b.published_at) - publishedTime(a.published_at))

        const results: Record<string, any[]> = {}

        for (const { entity_key: key, ...item } of rows) {
            if (!key) continue
            const bucket = results[key] || (results[key] = [])
            if (bucket.length >= MAX_PER_ENTITY) continue
            bucket.push(item)
        }

        setResponseHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=600')

        return { status: 'ok', results }
    } catch (error: any) {
        console.error('[Articles by-entity API] Error:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch related articles' })
    }
})
