import { dbExecute } from '~~/server/utils/db'

// Third-party RSS items (curated_news, ~28k rows) are off on the public sites:
// browsing already defaults to source=Cinemagoria, and only search reached them,
// walking the whole language partition because LIKE cannot use an index. Flip to
// true to bring the aggregated sources back — the code paths below are intact.
const CURATED_NEWS_ENABLED = false

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const page = parseInt(String(query.page)) || 1
    const limit = parseInt(String(query.limit)) || 100
    const rawLang = String(query.lang || config.public.apiLang || 'es')
    const lang = rawLang.substring(0, 2).toLowerCase()
    const requestedSource = query.source ? String(query.source) : null
    const source = CURATED_NEWS_ENABLED ? requestedSource : 'Cinemagoria'
    // Require >=2 chars: a single-char `LIKE '%a%'` matches almost everything and
    // forces a full-table scan on curated_news with no usable index — the exact
    // shape that hung for 60s and 504'd. Short/empty terms fall back to the
    // normal indexed recent-news listing.
    const rawSearch = query.q ? String(query.q).trim() : null
    const searchQuery = rawSearch && rawSearch.length >= 2 ? rawSearch : null

    try {
        const offset = (page - 1) * limit

        // Cinemagoria source — query cinemagoria_articles
        if (source === 'Cinemagoria') {
            const titleCol = lang === 'es' ? 'title_es' : 'title_en'
            const descCol = lang === 'es' ? 'description_es' : 'description_en'

            let sql = `SELECT id, slug, ${titleCol} AS title, ${descCol} AS description,
                              image_url, published_at, topics_json,
                              requires_auth, editorial_category, secondary_categories_json
                       FROM cinemagoria_articles
                       WHERE is_visible = 1 AND is_cinemagoria = 1
                         AND (datetime(published_at) IS NULL OR datetime(published_at) <= datetime('now'))`
            let args: any[] = []

            if (searchQuery) {
                sql += ` AND (${titleCol} LIKE ? OR ${descCol} LIKE ?)`
                args.push(`%${searchQuery}%`, `%${searchQuery}%`)
            }

            sql += ` ORDER BY published_at DESC`

            const result = await dbExecute({ sql, args })

            const items = result.rows.map(row => ({
                id: row.id,
                title: row.title,
                href: `/news/${row.slug}`,
                image: row.image_url,
                published_at: row.published_at,
                description: row.description,
                // source.name stays 'Cinemagoria' — it's the identity marker the page
                // uses for filter (selectedSource) and the mixed-source sort tiebreak.
                // The display badge swap lives in the UI layer via editorial_category.
                source: { name: 'Cinemagoria' },
                video_id: null,
                is_internal: true,
                slug: row.slug,
                topics: row.topics_json ? JSON.parse(row.topics_json as string) : [],
                requires_auth: Number(row.requires_auth ?? 0) === 1 ? 1 : 0,
                editorial_category: (row.editorial_category as string) || 'feature',
                secondary_categories: (() => {
                    try {
                        const raw = row.secondary_categories_json
                        if (!raw) return [] as string[]
                        const parsed = JSON.parse(raw as string)
                        return Array.isArray(parsed) ? parsed.map((s: any) => String(s)) : []
                    } catch { return [] as string[] }
                })(),
            }))

            return {
                status: 'ok',
                total_items: items.length,
                results: items
            }
        }

        // Regular sources — query curated_news
        let sql = `SELECT * FROM curated_news WHERE language = ?`
        let args: any[] = [lang]

        if (source) {
            sql += ` AND source = ?`
            args.push(source)
        }

        if (searchQuery) {
            sql += ` AND (title LIKE ? OR description LIKE ?)`
            args.push(`%${searchQuery}%`, `%${searchQuery}%`)
        }

        sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`

        args.push(limit, offset)

        const result = await dbExecute({ sql, args })

        const items = result.rows.map(row => ({
            id: row.id,
            title: row.title,
            href: row.link,
            image: row.image,
            published_at: row.published_at,
            description: row.description,
            source: { name: row.source },
            video_id: row.video_id
        }))

        // If no source filter (All Sources), also include Cinemagoria articles
        if (!source) {
            const titleCol = lang === 'es' ? 'title_es' : 'title_en'
            const descCol = lang === 'es' ? 'description_es' : 'description_en'

            let cineSql = `SELECT id, slug, ${titleCol} AS title, ${descCol} AS description,
                                  image_url, published_at, topics_json,
                                  requires_auth, editorial_category, secondary_categories_json
                           FROM cinemagoria_articles
                           WHERE is_visible = 1 AND is_cinemagoria = 1
                             AND (datetime(published_at) IS NULL OR datetime(published_at) <= datetime('now'))`
            let cineArgs: any[] = []

            if (searchQuery) {
                cineSql += ` AND (${titleCol} LIKE ? OR ${descCol} LIKE ?)`
                cineArgs.push(`%${searchQuery}%`, `%${searchQuery}%`)
            }

            cineSql += ` ORDER BY published_at DESC LIMIT 20`

            const cineResult = await dbExecute({ sql: cineSql, args: cineArgs })

            const cineItems = cineResult.rows.map(row => ({
                id: `cine-${row.id}`,
                title: row.title,
                href: `/news/${row.slug}`,
                image: row.image_url,
                published_at: row.published_at,
                description: row.description,
                source: { name: 'Cinemagoria' },
                video_id: null,
                is_internal: true,
                slug: row.slug,
                topics: row.topics_json ? JSON.parse(row.topics_json as string) : [],
                requires_auth: Number(row.requires_auth ?? 0) === 1 ? 1 : 0,
                editorial_category: (row.editorial_category as string) || 'feature',
                secondary_categories: (() => {
                    try {
                        const raw = row.secondary_categories_json
                        if (!raw) return [] as string[]
                        const parsed = JSON.parse(raw as string)
                        return Array.isArray(parsed) ? parsed.map((s: any) => String(s)) : []
                    } catch { return [] as string[] }
                })(),
            }))

            items.push(...cineItems)
            items.sort((a: any, b: any) => {
                const dateA = new Date(a.published_at || 0).getTime()
                const dateB = new Date(b.published_at || 0).getTime()
                return dateB - dateA
            })
        }

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
