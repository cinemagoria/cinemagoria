import { createError, defineEventHandler, getQuery } from 'h3'
import { dbExecute } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)


    try {
        let sql = `SELECT * FROM festival_films WHERE festival_name = 'BFI London Film Festival' AND festival_year = 2026`

        const args: any[] = []

        if (query.tmdb_id) {
            sql += ` AND tmdb_id = ?`
            args.push(query.tmdb_id)
        } else if (query.imdb_id) {
            sql += ` AND imdb_id = ?`
            args.push(query.imdb_id)
        }

        const result = await dbExecute({ sql, args })

        let films = result.rows.map((row: any) => {
            let tmdbData: any = {}
            try {
                tmdbData = typeof row.tmdb_data === 'string' ? JSON.parse(row.tmdb_data) : (row.tmdb_data || {})
            } catch (e) {
                tmdbData = {}
            }

            return {
                id: row.tmdb_id,
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
                ...tmdbData,
                source_url: row.source_url || null
            }
        }).filter((film: any) => {
            return film.tmdb_id && film.title && film.title.trim() !== '';
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
        console.error('BFI London Films Fetch Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to fetch BFI London films: ${error.message || error}`,
        })
    }
})
