import { createClient } from '@libsql/client'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const page = parseInt(String(query.page)) || 1
    const limit = parseInt(String(query.limit)) || 100
    const rawLang = String(query.lang || config.public.apiLang || 'es')
    const lang = rawLang.substring(0, 2).toLowerCase()
    const source = query.source ? String(query.source) : null
    const searchQuery = query.q ? String(query.q).trim() : null

    const dbUrl = config.rssDbUrl || config.imdbDbUrl
    const dbToken = config.rssDbToken || config.imdbDbToken

    if (!dbUrl || !dbToken) {
        console.error('[API-ES] Missing DB Config. URL:', !!dbUrl, 'Token:', !!dbToken)
        throw createError({
            statusCode: 500,
            statusMessage: 'Database configuration missing'
        })
    }

    const db = createClient({
        url: dbUrl.trim(),
        authToken: dbToken.trim()
    })

    try {
        const offset = (page - 1) * limit

        // Cinemagoria source — query cinemagoria_articles
        if (source === 'Cinemagoria') {
            const titleCol = lang === 'es' ? 'title_es' : 'title_en'
            const descCol = lang === 'es' ? 'description_es' : 'description_en'

            let sql = `SELECT id, slug, ${titleCol} AS title, ${descCol} AS description,
                              image_url, published_at, topics_json
                       FROM cinemagoria_articles
                       WHERE is_visible = 1 AND is_cinemagoria = 1`
            let args: any[] = []

            if (searchQuery) {
                sql += ` AND (${titleCol} LIKE ? OR ${descCol} LIKE ?)`
                args.push(`%${searchQuery}%`, `%${searchQuery}%`)
            }

            sql += ` ORDER BY published_at DESC LIMIT ? OFFSET ?`
            args.push(limit, offset)

            const result = await db.execute({ sql, args })

            const items = result.rows.map(row => ({
                id: row.id,
                title: row.title,
                href: `/news/${row.slug}`,
                image: row.image_url,
                published_at: row.published_at,
                description: row.description,
                source: { name: 'Cinemagoria' },
                video_id: null,
                is_internal: true,
                slug: row.slug
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

        const result = await db.execute({ sql, args })

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
                                  image_url, published_at
                           FROM cinemagoria_articles
                           WHERE is_visible = 1 AND is_cinemagoria = 1`
            let cineArgs: any[] = []

            if (searchQuery) {
                cineSql += ` AND (${titleCol} LIKE ? OR ${descCol} LIKE ?)`
                cineArgs.push(`%${searchQuery}%`, `%${searchQuery}%`)
            }

            cineSql += ` ORDER BY published_at DESC LIMIT 20`

            const cineResult = await db.execute({ sql: cineSql, args: cineArgs })

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
                slug: row.slug
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
