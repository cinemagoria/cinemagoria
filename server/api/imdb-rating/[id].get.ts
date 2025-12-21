import { createClient } from '@libsql/client'

export default defineEventHandler(async (event) => {
    // Enable CORS
    setResponseHeaders(event, {
        "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Expose-Headers": "*"
    })

    if (getMethod(event) === 'OPTIONS') {
        event.node.res.statusCode = 204
        return
    }

    const start = Date.now()
    const id = getRouterParam(event, 'id')
    const config = useRuntimeConfig()

    if (!id) {
        return { found: false, error: 'Missing ID parameter' }
    }

    if (!config.imdbDbUrl || !config.imdbDbToken) {
        console.error('Missing Turso DB credentials')
        return { found: false, error: 'Database configuration missing' }
    }

    // Initialize LibSQL Client
    const client = createClient({
        url: config.imdbDbUrl,
        authToken: config.imdbDbToken,
    })

    try {
        const result = await client.execute({
            sql: 'SELECT average_rating, num_votes FROM imdb_ratings WHERE tconst = ? LIMIT 1',
            args: [id]
        })

        if (result.rows && result.rows.length > 0) {
            const row = result.rows[0]
            // Safe parsing for potential null values
            const score = row.average_rating ? parseFloat(String(row.average_rating)) : 0
            const votes = row.num_votes ? parseInt(String(row.num_votes)) : 0

            return {
                found: true,
                score: score,
                votes: votes,
                source: 'imdb'
            }
        } else {
            // console.log(`[IMDb] No rating found for ${id}`)
            return { found: false, source: 'tmdb' }
        }
    } catch (error: any) {
        console.error(`[IMDb] Error fetching rating for ${id}:`, error)
        return { found: false, source: 'tmdb', error: error.message || 'Unknown error' }
    }
})
