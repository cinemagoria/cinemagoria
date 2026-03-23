import { createClient } from '@libsql/client'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const dbUrl = config.rssDbUrl
    const dbToken = config.rssDbToken

    if (!dbUrl || !dbToken) {
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
        const result = await db.execute(`
            SELECT * FROM noir_historical
            ORDER BY release_date DESC
        `)

        const items = result.rows.map(row => ({
            id: row.tmdb_id,
            type: row.media_type,
            title: row.title,
            name: row.title,
            poster_path: row.poster_path,
            backdrop_path: row.backdrop_path,
            overview: row.overview,
            release_date: row.release_date,
            first_air_date: row.media_type === 'tv' ? row.release_date : undefined,
            vote_average: row.vote_average,
            vote_count: row.vote_count,
            imdb_rating: row.imdb_rating,
            imdb_votes: row.imdb_votes,
            rating_source: 'imdb',
            genres: row.genres ? String(row.genres).split(', ').map(g => ({ name: g })) : [],
            runtime: row.runtime,
            media_type: row.media_type,
            added_to_noir_at: row.added_to_noir_at
        }))

        return {
            results: items,
            total_results: items.length,
            page: 1,
            total_pages: 1
        }

    } catch (error: any) {
        console.error('Noir Archive Fetch Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch noir archive',
        })
    }
})
