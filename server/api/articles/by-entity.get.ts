import { dbExecute } from '~~/server/utils/db'

const MAX_ENTITIES = 24
const MAX_PER_ENTITY = 4
const QUERY_TIMEOUT_MS = 8000
const ALLOWED_TYPES = new Set(['movie', 'tv'])

export default defineEventHandler(async (event) => {
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

        const result = await dbExecute({
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

        const results: Record<string, any[]> = {}

        for (const row of result.rows) {
            const key = row.entity_key as string
            if (!key) continue
            const bucket = results[key] || (results[key] = [])
            if (bucket.length >= MAX_PER_ENTITY) continue
            bucket.push({
                id: row.id,
                slug: row.slug,
                title_en: row.title_en,
                title_es: row.title_es,
                description_en: row.description_en,
                description_es: row.description_es,
                image_url: row.image_url,
                published_at: row.published_at,
                requires_auth: Number(row.requires_auth ?? 0) === 1 ? 1 : 0,
            })
        }

        setResponseHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=600')

        return { status: 'ok', results }
    } catch (error: any) {
        console.error('[Articles by-entity API] Error:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch related articles' })
    }
})
