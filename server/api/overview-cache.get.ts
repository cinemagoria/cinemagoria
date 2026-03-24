import { createClient } from '@libsql/client'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const dbUrl = config.rssDbUrl
    const dbToken = config.rssDbToken

    const query = getQuery(event)
    const tmdbId = Number(query.tmdb_id)
    const mediaType = String(query.media_type || '')

    if (!tmdbId || !['movie', 'tv'].includes(mediaType)) {
        throw createError({ statusCode: 400, statusMessage: 'tmdb_id and media_type (movie|tv) required' })
    }

    const db = createClient({ url: dbUrl.trim(), authToken: dbToken.trim() })

    try {
        const result = await db.execute({
            sql: `SELECT content_es, content_hash FROM overviews_cache WHERE tmdb_id = ? AND media_type = ?`,
            args: [tmdbId, mediaType]
        })

        if (result.rows.length === 0) {
            return { found: false, contentEs: null }
        }

        return {
            found: true,
            contentEs: result.rows[0].content_es,
            contentHash: result.rows[0].content_hash
        }
    } catch (error: any) {
        console.error('Overview cache fetch error:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch overview cache' })
    }
})
