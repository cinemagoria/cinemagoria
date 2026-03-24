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
            sql: `SELECT source, author_name, content_en, content_es, content_hash,
                         author_rating, author_avatar, author_alias, review_url, created_at
                  FROM reviews_cache
                  WHERE tmdb_id = ? AND media_type = ?
                  ORDER BY created_at DESC`,
            args: [tmdbId, mediaType]
        })

        return {
            reviews: result.rows.map(r => ({
                source: r.source,
                authorName: r.author_name,
                contentEn: r.content_en,
                contentEs: r.content_es,
                contentHash: r.content_hash,
                authorRating: r.author_rating,
                authorAvatar: r.author_avatar,
                authorAlias: r.author_alias,
                reviewUrl: r.review_url,
                createdAt: r.created_at
            }))
        }
    } catch (error: any) {
        console.error('Reviews cache fetch error:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch reviews cache' })
    }
})
