import { createClient } from '@libsql/client'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const dbUrl = config.rssDbUrl
    const dbToken = config.rssDbToken

    const body = await readBody(event)

    if (!body || !body.tmdb_id || !body.media_type || !body.source || !body.content_en || !body.content_es || !body.content_hash || !body.author_name) {
        throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
    }

    const db = createClient({ url: dbUrl.trim(), authToken: dbToken.trim() })

    try {
        await db.execute({
            sql: `INSERT OR IGNORE INTO reviews_cache (
                tmdb_id, media_type, source, author_name, content_en, content_es,
                content_hash, author_rating, author_avatar, author_alias,
                review_url, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                Number(body.tmdb_id), body.media_type, body.source,
                body.author_name, body.content_en, body.content_es,
                body.content_hash, body.author_rating || null,
                body.author_avatar || null, body.author_alias || null,
                body.review_url || null, body.created_at || null
            ]
        })

        return { success: true }
    } catch (error: any) {
        console.error('Reviews cache save error:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to save review cache' })
    }
})
