import { createClient } from '@libsql/client'
import { createError, defineEventHandler } from 'h3'

interface ScheduleRow {
    id: number;
    festival_film_id: number;
    start_time: string;
    end_time: string | null;
    venue: string | null;
    is_online: number;
    is_in_person: number;
    is_sold_out: number;
    timezone: string;
    film_data: string;
    screening_id: number;
    film_id: number;
    title: string;
    image_url: string | null;
    source_url: string | null;
    director: string | null;
    runtime_minutes: number | null;
    tmdb_data: string | null;
}

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
            WHERE f.festival_name = 'Rotterdam Film Festival' AND f.festival_year = 2026
            ORDER BY s.start_time ASC
        `

        const result = await db.execute(sql)

        const screenings = result.rows.map((row) => {
            const typedRow = row as unknown as ScheduleRow;
            let tmdbData: any = {}
            try {
                tmdbData = typeof typedRow.tmdb_data === 'string' ? JSON.parse(typedRow.tmdb_data) : (typedRow.tmdb_data || {})
            } catch (e) {
                tmdbData = {}
            }

            return {
                id: typedRow.screening_id,
                start_time: typedRow.start_time,
                timezone: typedRow.timezone,
                is_in_person: !!typedRow.is_in_person,
                is_online: !!typedRow.is_online,
                is_sold_out: !!typedRow.is_sold_out,
                venue: typedRow.venue,
                film: {
                    id: typedRow.film_id,
                    title: typedRow.title,
                    image_url: typedRow.image_url,
                    source_url: typedRow.source_url,
                    director: typedRow.director,
                    runtime: typedRow.runtime_minutes,
                    poster_path: typedRow.image_url || tmdbData.tmdb_poster || (tmdbData?.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}` : null)
                }
            }
        })

        return {
            success: true,
            count: screenings.length,
            results: screenings
        }

    } catch (error: any) {
        console.error('Rotterdam Schedule Fetch Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to fetch Rotterdam schedule: ${error.message}`,
        })
    }
})
