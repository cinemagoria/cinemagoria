import { createClient } from '@libsql/client'
import { createError, defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    const dbUrl = config.rssDbUrl || config.imdbDbUrl
    const dbToken = config.rssDbToken || config.imdbDbToken

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
        const sql = `
            SELECT 
                s.id as screening_id,
                s.start_time,
                s.time_zone as timezone,
                s.is_in_person,
                s.is_online,
                s.is_sold_out,
                s.venue,
                f.id as film_id,
                f.title,
                f.image_url,
                f.source_url,
                f.director,
                f.runtime_minutes,
                f.tmdb_data
            FROM festival_screenings s
            JOIN festival_films f ON s.film_id = f.id
            WHERE f.festival_name = 'Berlinale Film Festival' AND f.festival_year = 2026
            ORDER BY s.start_time ASC
        `

        const result = await db.execute(sql)

        const screenings = result.rows.map((row: any) => {
            let tmdbData: any = {}
            try {
                tmdbData = typeof row.tmdb_data === 'string' ? JSON.parse(row.tmdb_data) : (row.tmdb_data || {})
            } catch (e) {
                tmdbData = {}
            }

            return {
                id: row.screening_id,
                start_time: row.start_time,
                timezone: row.timezone,
                is_in_person: Boolean(row.is_in_person),
                is_online: Boolean(row.is_online),
                is_sold_out: Boolean(row.is_sold_out),
                venue: row.venue,
                film: {
                    id: row.film_id,
                    title: row.title,
                    image_url: row.image_url,
                    source_url: row.source_url,
                    director: row.director,
                    runtime: row.runtime_minutes,
                    poster_path: row.image_url || (tmdbData?.tmdb_poster ? tmdbData.tmdb_poster : (tmdbData?.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}` : null))
                }
            }
        })

        return {
            success: true,
            count: screenings.length,
            results: screenings
        }

    } catch (error: any) {
        console.error('Berlinale Schedule Fetch Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to fetch Berlinale schedule: ${error.message}`,
        })
    }
})
