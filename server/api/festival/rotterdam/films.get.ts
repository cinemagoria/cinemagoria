import { createError, defineEventHandler, getQuery } from 'h3'
import { createClient } from '@libsql/client'

interface DatabaseRow {
    id: number;
    tmdb_id: number | null;
    imdb_id: string | null;
    title: string;
    description: string | null;
    image_url: string | null;
    runtime_minutes: number | null;
    director: string | null;
    section: string | null;
    category: string | null;
    tmdb_data: string | null;
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)

    const dbUrl = config.rssDbUrl || config.imdbDbUrl
    const dbToken = config.rssDbToken || config.imdbDbToken

    if (!dbUrl || !dbToken) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Database configuration missing'
        })
    }

    const db = createClient({
        url: dbUrl,
        authToken: dbToken
    })

    try {
        let sql = `SELECT * FROM festival_films WHERE festival_name = 'Rotterdam Film Festival' AND festival_year = 2026`

        const args: any[] = []

        if (query.tmdb_id) {
            sql += ` AND tmdb_id = ?`
            args.push(query.tmdb_id)
        } else if (query.imdb_id) {
            sql += ` AND imdb_id = ?`
            args.push(query.imdb_id)
        }

        const result = await db.execute({ sql, args })

        let films = result.rows.map((row) => {
            const typedRow = row as unknown as DatabaseRow;
            let tmdbData: any = {}
            try {
                tmdbData = typeof typedRow.tmdb_data === 'string' ? JSON.parse(typedRow.tmdb_data) : (typedRow.tmdb_data || {})
            } catch (e) {
                tmdbData = {}
            }

            return {
                id: typedRow.tmdb_id || typedRow.id,
                internal_id: typedRow.id,
                title: typedRow.title,
                overview: typedRow.description || tmdbData.overview || '',
                poster_path: (tmdbData.tmdb_poster ? tmdbData.tmdb_poster : (tmdbData.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}` : typedRow.image_url)),
                backdrop_path: tmdbData.backdrop_path ? `https://image.tmdb.org/t/p/w1280${tmdbData.backdrop_path}` : null,
                release_date: tmdbData.release_date || tmdbData.tmdb_release_date || '',
                vote_average: tmdbData.vote_average || 0,
                runtime: typedRow.runtime_minutes || tmdbData.runtime || 0,
                genres: tmdbData.genres || [],
                director: typedRow.director,
                section: typedRow.section || typedRow.category,
                imdb_id: typedRow.imdb_id,
                tmdb_id: typedRow.tmdb_id
            }
        }); // Removed the >= 2025 year filter as IFFR might have older films in some sections (Cinema Regained)

        films = films.filter((f: any) => f.title)

        if (query.sort === 'rating') {
            films.sort((a: any, b: any) => b.vote_average - a.vote_average);
        } else {
            films.sort((a: any, b: any) => a.title.localeCompare(b.title))
        }

        if (query.limit) {
            const limit = parseInt(query.limit as string)
            films = films.slice(0, limit)
        }

        return {
            results: films
        }

    } catch (error: any) {
        console.error('Rotterdam Films Fetch Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to fetch Rotterdam films: ${error.message || error}`,
        })
    }
})
