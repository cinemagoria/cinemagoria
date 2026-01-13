import { createClient } from '@libsql/client'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const page = parseInt(String(query.page)) || 1
    const limit = parseInt(String(query.limit)) || 100
    const rawLang = String(query.lang || config.public.apiLang || 'es')
    const lang = rawLang.substring(0, 2).toLowerCase()

    const source = query.source ? String(query.source) : null

    const dbUrl = config.rssDbUrl || config.imdbDbUrl
    const dbToken = config.rssDbToken || config.imdbDbToken

    if (!dbUrl || !dbToken) {
        console.error('[API-ES] Missing DB Config. URL:', !!dbUrl, 'Token:', !!dbToken)
        throw createError({
            statusCode: 500,
            statusMessage: 'Database configuration missing'
        })
    }
    console.log('[API-ES] DB Configured. URL starts with:', dbUrl.substring(0, 10))

    const db = createClient({
        url: dbUrl.trim(),
        authToken: dbToken.trim()
    })

    try {
        const offset = (page - 1) * limit
        let sql = `SELECT * FROM curated_news WHERE language = ?`
        let args: any[] = [lang]

        if (source) {
            sql += ` AND source = ?`
            args.push(source)
        }

        sql += ` ORDER BY published_at DESC LIMIT ? OFFSET ?`
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
