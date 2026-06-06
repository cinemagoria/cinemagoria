import { useDb } from '~~/server/utils/db'

const MAX_SLUGS = 20

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const raw = String(query.slugs || '').trim()

    if (!raw) {
        return { status: 'ok', results: [] }
    }

    const slugs = Array.from(new Set(
        raw.split(',')
            .map(s => s.trim())
            .filter(Boolean)
    )).slice(0, MAX_SLUGS)

    if (slugs.length === 0) {
        return { status: 'ok', results: [] }
    }

    const db = useDb()

    try {
        const placeholders = slugs.map(() => '?').join(',')
        const sql = `SELECT id, slug, title_en, title_es, description_en, description_es,
                            image_url, published_at, topics_json
                     FROM cinemagoria_articles
                     WHERE is_visible = 1
                       AND slug IN (${placeholders})
                       AND (datetime(published_at) IS NULL OR datetime(published_at) <= datetime('now'))`

        const result = await db.execute({ sql, args: slugs })

        const bySlug = new Map<string, any>()
        for (const row of result.rows) {
            bySlug.set(row.slug as string, row)
        }

        const parseTopics = (raw: unknown): string[] => {
            if (!raw) return []
            try {
                const parsed = JSON.parse(raw as string)
                return Array.isArray(parsed) ? parsed : []
            } catch {
                return []
            }
        }

        const items = slugs
            .map(slug => bySlug.get(slug))
            .filter(Boolean)
            .map(row => ({
                id: row.id,
                slug: row.slug,
                title_en: row.title_en,
                title_es: row.title_es,
                description_en: row.description_en,
                description_es: row.description_es,
                image_url: row.image_url,
                published_at: row.published_at,
                topics: parseTopics(row.topics_json),
            }))

        setResponseHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=600')

        return { status: 'ok', results: items }
    } catch (error: any) {
        console.error('[Articles by-slugs API] Error:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch related articles' })
    }
})
