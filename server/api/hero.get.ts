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
            SELECT * FROM hero_selections 
            WHERE title IS NOT NULL 
            AND poster_path IS NOT NULL 
            AND backdrop_path IS NOT NULL
        `)

        if (result.rows.length === 0) {
            return { result: null }
        }

        const randomIndex = Math.floor(Math.random() * result.rows.length);
        const row = result.rows[randomIndex];

        const cert = row.certification;

        const item = {
            id: row.tmdb_id,
            type: row.media_type,
            title: row.title,
            name: row.title,
            original_title: row.title,

            poster_path: row.poster_path,
            backdrop_path: row.backdrop_path,
            overview: row.overview,

            release_date: row.release_date,
            first_air_date: row.release_date,

            vote_average: row.vote_average,
            vote_count: row.vote_count,

            imdb_rating: row.imdb_rating,
            imdb_votes: row.imdb_votes,
            rating_source: 'imdb',

            genres: String(row.genres).split(', ').map(g => ({ name: g })),

            videos: {
                results: await (async () => {
                    const videos = [];

                    if (row.trailer_key) {
                        videos.push({
                            site: 'YouTube',
                            key: row.trailer_key,
                            type: 'CustomPriority',
                            name: 'Trailer'
                        });
                    }

                    try {
                        interface TMDBResponse {
                            results: Array<{
                                key: string;
                                site: string;
                                type: string;
                                name: string;
                            }>;
                        }
                        const tmdbRes = await $fetch<TMDBResponse>(`https://api.themoviedb.org/3/${row.media_type}/${row.tmdb_id}/videos`, {
                            params: { api_key: config.public.apiKey }
                        });
                        if (tmdbRes.results) {
                            videos.push(...tmdbRes.results);
                        }
                    } catch (e) {
                        // Ignore TMDB errors
                    }

                    return videos;
                })()
            },

            runtime: row.runtime,

            release_dates: {
                results: [
                    { iso_3166_1: 'US', release_dates: [{ certification: cert || '' }] }
                ]
            },
            content_ratings: {
                results: [
                    { iso_3166_1: 'US', rating: cert || '' }
                ]
            },
            original_overview_language: 'en'
        }

        return { result: item }

    } catch (error: any) {
        console.error('Hero Fetch Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch hero selection',
        })
    }
})
