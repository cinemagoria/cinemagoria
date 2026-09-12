import { dbExecute } from '~~/server/utils/db'
import { FIRST_PARTY_SOURCE } from '~/utils/newsSources'

const FIRST_PARTY_DATE_GUARD =
    `(datetime(published_at) IS NULL OR datetime(published_at) <= datetime('now'))`

const publisherOrigin = (link: string): string | null => {
    try {
        return new URL(link).origin
    } catch {
        return null
    }
}

const parseJsonArray = (raw: unknown): string[] => {
    try {
        if (!raw) return []
        const parsed = JSON.parse(raw as string)
        return Array.isArray(parsed) ? parsed.map((entry: any) => String(entry)) : []
    } catch {
        return []
    }
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const limit = parseInt(String(query.limit)) || 100
    const rawLang = String(query.lang || config.public.apiLang || 'en')
    const lang = rawLang.substring(0, 2).toLowerCase()
    const source = query.source ? String(query.source) : null

    // Require >=2 chars: a single-char `LIKE '%a%'` matches almost everything and
    // forces a full-table scan with no usable index — the shape that hung for 60s
    // and 504'd. Short/empty terms fall back to the normal recent-news listing.
    const rawSearch = query.q ? String(query.q).trim() : null
    const searchQuery = rawSearch && rawSearch.length >= 2 ? rawSearch : null

    const wantsFirstParty = !source || source === FIRST_PARTY_SOURCE
    const wantsThirdParty = !source || source !== FIRST_PARTY_SOURCE

    try {
        const items: any[] = []

        if (wantsFirstParty) {
            const titleCol = lang === 'es' ? 'title_es' : 'title_en'
            const descCol = lang === 'es' ? 'description_es' : 'description_en'

            let sql = `SELECT id, slug, ${titleCol} AS title, ${descCol} AS description,
                              image_url, published_at, topics_json,
                              requires_auth, editorial_category, secondary_categories_json
                       FROM cinemagoria_articles
                       WHERE is_visible = 1 AND is_cinemagoria = 1
                         AND ${FIRST_PARTY_DATE_GUARD}`
            const args: any[] = []

            if (searchQuery) {
                sql += ` AND (${titleCol} LIKE ? OR ${descCol} LIKE ?)`
                args.push(`%${searchQuery}%`, `%${searchQuery}%`)
            }

            sql += ` ORDER BY published_at DESC`

            const result = await dbExecute({ sql, args })

            items.push(...result.rows.map(row => ({
                id: row.id,
                title: row.title,
                href: `/news/${row.slug}`,
                image: row.image_url,
                published_at: row.published_at,
                description: row.description,
                source: { name: FIRST_PARTY_SOURCE },
                video_id: null,
                is_internal: true,
                slug: row.slug,
                topics: parseJsonArray(row.topics_json),
                requires_auth: Number(row.requires_auth ?? 0) === 1 ? 1 : 0,
                editorial_category: (row.editorial_category as string) || 'feature',
                secondary_categories: parseJsonArray(row.secondary_categories_json),
            })))
        }

        if (wantsThirdParty) {
            let sql = `SELECT id, publisher, title, description, link, image, published_at
                       FROM approved_news
                       WHERE language = ? AND is_visible = 1`
            const args: any[] = [lang]

            if (source) {
                sql += ` AND publisher = ?`
                args.push(source)
            }

            if (searchQuery) {
                sql += ` AND (title LIKE ? OR description LIKE ?)`
                args.push(`%${searchQuery}%`, `%${searchQuery}%`)
            }

            sql += ` ORDER BY published_at DESC LIMIT ?`
            args.push(limit)

            const result = await dbExecute({ sql, args })

            items.push(...result.rows.map(row => ({
                id: `ext-${row.id}`,
                title: row.title,
                href: row.link,
                image: row.image,
                published_at: row.published_at,
                description: row.description,
                source: { name: row.publisher, url: publisherOrigin(String(row.link)) },
                video_id: null,
                is_internal: false,
            })))
        }

        items.sort((a: any, b: any) => {
            const dateA = new Date(a.published_at || 0).getTime()
            const dateB = new Date(b.published_at || 0).getTime()
            return dateB - dateA
        })

        return {
            status: 'ok',
            total_items: items.length,
            results: items
        }

    } catch (error: any) {
        console.error('DB News Fetch Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch news from database',
        })
    }
})
