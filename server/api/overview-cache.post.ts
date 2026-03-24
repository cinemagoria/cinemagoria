import { createClient } from '@libsql/client'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const dbUrl = config.rssDbUrl
    const dbToken = config.rssDbToken

    const body = await readBody(event)

    if (!body || !body.tmdb_id || !body.media_type || !body.content_en || !body.content_es || !body.content_hash) {
        throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
    }

    const db = createClient({ url: dbUrl.trim(), authToken: dbToken.trim() })

    try {
        await db.execute({
            sql: `INSERT INTO overviews_cache (tmdb_id, media_type, content_en, content_es, content_hash)
                  VALUES (?, ?, ?, ?, ?)
                  ON CONFLICT(tmdb_id, media_type) DO UPDATE SET
                    content_en = excluded.content_en,
                    content_es = excluded.content_es,
                    content_hash = excluded.content_hash,
                    updated_at = unixepoch()`,
            args: [
                Number(body.tmdb_id), body.media_type,
                body.content_en, body.content_es, body.content_hash
            ]
        })

        return { success: true }
    } catch (error: any) {
        console.error('Overview cache save error:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to save overview cache' })
    }
})
