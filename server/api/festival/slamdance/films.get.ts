import { createError, defineEventHandler, getQuery } from 'h3'
import { createClient } from '@libsql/client'

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
        let sql = `SELECT * FROM festival_films WHERE festival_name = 'Slamdance Film Festival' AND festival_year = 2026`

        const args: any[] = []

        if (query.tmdb_id) {
            sql += ` AND tmdb_id = ?`
            args.push(query.tmdb_id)
        } else if (query.imdb_id) {
            sql += ` AND imdb_id = ?`
            args.push(query.imdb_id)
        }

        const result = await db.execute({ sql, args })

        let films = result.rows.map((row: any) => {
            let tmdbData: any = {}
            try {
                tmdbData = typeof row.tmdb_data === 'string' ? JSON.parse(row.tmdb_data) : (row.tmdb_data || {})
            } catch (e) {
                tmdbData = {}
            }

            return {
                id: row.tmdb_id || row.id,
                internal_id: row.id,
                title: row.title,
                overview: row.description || tmdbData.overview || '',
                poster_path: (tmdbData.tmdb_poster ? tmdbData.tmdb_poster : (tmdbData.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}` : row.image_url)),
                backdrop_path: tmdbData.backdrop_path ? `https://image.tmdb.org/t/p/w1280${tmdbData.backdrop_path}` : null,
                release_date: tmdbData.release_date || tmdbData.tmdb_release_date || '',
                vote_average: tmdbData.vote_average || 0,
                runtime: row.runtime_minutes || tmdbData.runtime || 0,
                genres: tmdbData.genres || [],
                director: row.director,
                section: row.section || row.category,
                imdb_id: row.imdb_id,
                tmdb_id: row.tmdb_id,
                _debug_tmdb_data: row.tmdb_data,
                ...tmdbData
            }
        }).filter((film: any) => {
            return film.title && film.title.trim() !== '';
        });

        if (query.limit) {
            const limit = parseInt(query.limit as string)
            films = films.slice(0, limit)
        }

        films.sort((a: any, b: any) => a.title.localeCompare(b.title))

        return {
            results: films
        }

    } catch (error: any) {
        console.error('Slamdance Films Fetch Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to fetch Slamdance films: ${error.message || error}`,
        })
    }
})
