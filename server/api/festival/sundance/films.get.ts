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
        let sql = `SELECT * FROM festival_films WHERE festival_name = 'Sundance Film Festival' AND festival_year = 2026`

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
            if (!film.release_date) return true;
            const year = parseInt(film.release_date.split('-')[0]);
            return year >= 2025;
        });

        films = films.filter((f: any) => f.title)
        if (query.sort === 'rating') {
            const FEATURED_ORDER = [
                'Give Me the Ball!',
                'Queen of Chess',
                'Broken English',
                'Leviticus',
                'The Undertone',
                'The Weight',
                'The Gallerist',
                'Tuner',
                'Ghost in the Machine',
                'The Moment',
                'I Want Your Sex',
                'The Invite',
                'Wicker',
                'Gail Daughtry and the Celebrity Sex Pass',
                'The History of Concrete',
                'Josephine',
                'Chasing Summer',
                'Knife: The Attempted Murder of Salman Rushdie',
                'Ha-Chan, Shake Your Booty!',
                'The Only Living Pickpocket in New York',
                'Time and Water',
                'See You When I See You',
                'The Shitheads',
                "Big Girls Don't Cry",
                'Antiheroine',
                'In The Blink of An Eye',
                'Once Upon A Time In Harlem',
                'THE DISCIPLE',
                'The AI Doc: Or How I Became an Apocaloptimist',
                'The Brittney Griner Story',
                'The Oldest Person in the World',
                'Troublemaker'
            ];

            films.sort((a: any, b: any) => {
                const indexA = FEATURED_ORDER.indexOf(a.title);
                const indexB = FEATURED_ORDER.indexOf(b.title);

                const priorityA = indexA !== -1 ? indexA : 999;
                const priorityB = indexB !== -1 ? indexB : 999;

                if (priorityA !== priorityB) {
                    return priorityA - priorityB;
                }

                return b.vote_average - a.vote_average;
            });

            films = films.filter((f: any) => FEATURED_ORDER.includes(f.title));

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
        console.error('Sundance Films Fetch Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to fetch Sundance films: ${error.message || error}`,
        })
    }
})
