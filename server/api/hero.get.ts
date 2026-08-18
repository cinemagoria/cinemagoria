import { dbExecute, useDb } from '~~/server/utils/db'
import { getFestivalStatusByTmdbId } from '~~/server/utils/festivals'
import { loadTvDetailsCached, type MinimalTv } from '~~/server/utils/tvDetails'

export default defineEventHandler(async (event) => {
    try {
        const result = await dbExecute(`
            SELECT * FROM hero_selections
            WHERE title IS NOT NULL
            AND backdrop_path IS NOT NULL
        `)

        if (result.rows.length === 0) {
            return { result: [] }
        }
        const selectedRows = result.rows.sort(() => 0.5 - Math.random());

        const config = useRuntimeConfig();
        const apiKey = (config.public as any)?.apiKey || '';
        const apiLang = (config.public as any)?.apiLang || 'en-US';

        // Embed festival membership per item (one indexed IN query for the
        // whole carousel). The Hero renders badges straight from this during
        // SSR — zero client-side festival requests and no badge pop-in.
        // Non-fatal: the hero must never fail because of badges.
        let festivalsByTmdbId: Record<string, any> = {};
        let tvDetailsByTmdbId = new Map<number, MinimalTv>();

        const [festivalsResult, tvDetailsResult] = await Promise.allSettled([
            getFestivalStatusByTmdbId(selectedRows.map((row: any) => row.tmdb_id)),
            loadTvDetailsCached(
                useDb(),
                selectedRows
                    .filter((row: any) => row.media_type === 'tv')
                    .map((row: any) => row.tmdb_id),
                apiKey,
                apiLang
            ),
        ]);

        if (festivalsResult.status === 'fulfilled') {
            festivalsByTmdbId = festivalsResult.value;
        } else {
            console.error('Hero festival-status enrichment failed:', festivalsResult.reason);
        }

        if (tvDetailsResult.status === 'fulfilled') {
            tvDetailsByTmdbId = tvDetailsResult.value;
        } else {
            console.error('Hero TV episode-context enrichment failed:', tvDetailsResult.reason);
        }

        const items = await Promise.all(selectedRows.map(async (row) => {
            const cert = row.certification;
            const tvDetails = row.media_type === 'tv'
                ? tvDetailsByTmdbId.get(Number(row.tmdb_id))
                : undefined;

            return {
                id: row.tmdb_id,
                type: row.media_type,
                title: row.title,
                name: row.title,
                original_title: row.title,

                festivals: festivalsByTmdbId[String(row.tmdb_id)] || {},

                seasons: tvDetails ? tvDetails.seasons : undefined,
                number_of_seasons: tvDetails ? tvDetails.number_of_seasons : undefined,
                number_of_episodes: tvDetails ? tvDetails.total_episodes : undefined,
                last_episode_to_air: tvDetails ? tvDetails.last_episode_to_air : undefined,

                poster_path: row.poster_path,
                backdrop_path: row.backdrop_path,
                overview: row.overview,
                available_watch: row.available_watch,

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
                }
            };
        }));

        return { result: items }

    } catch (error: any) {
        console.error('Hero Fetch Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch hero selection',
        })
    }
})
