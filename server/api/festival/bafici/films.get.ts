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
        let sql = `SELECT * FROM festival_films WHERE festival_name = 'BAFICI' AND festival_year = 2026`

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

            const normalize = (str: string) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, '') : '';

            const rowTitle = normalize(row.title);
            const tmdbTitle = normalize(tmdbData.title || tmdbData.original_title);

            let tmdbDirStr = "";
            if (Array.isArray(tmdbData.director)) {
                tmdbDirStr = tmdbData.director.join(' ');
            } else if (typeof tmdbData.director === 'string') {
                tmdbDirStr = tmdbData.director;
            }

            const getTokens = (s: string) => s ? s.toLowerCase().split(/[^a-z0-9]+/).filter(x => x.length >= 2) : [];
            const rowTokens = getTokens(row.director);
            const tmdbTokens = getTokens(tmdbDirStr);

            let directorsMatch = false;

            if (rowTokens.length > 0 && tmdbTokens.length > 0) {
                const overlap = rowTokens.filter(t => tmdbTokens.includes(t));
                if (overlap.length > 0) directorsMatch = true;
            } else if (rowTokens.length === 0 && tmdbTokens.length === 0) {
                directorsMatch = true;
            }

            let shouldUseTmdb = false;

            const rowImdbId = row.imdb_id;
            const tmdbImdbId = tmdbData.imdb_id || tmdbData.external_ids?.imdb_id;

            const idsMatch = (rowImdbId && tmdbImdbId && rowImdbId === tmdbImdbId);
            const titlesMatch = (rowTitle && tmdbTitle && (rowTitle === tmdbTitle || ((rowTitle.includes(tmdbTitle) || tmdbTitle.includes(rowTitle)) && Math.abs(rowTitle.length - tmdbTitle.length) < 5)));

            if ((idsMatch || titlesMatch) && directorsMatch) {
                shouldUseTmdb = true;
            }

            const tmdbPoster = tmdbData.tmdb_poster || tmdbData.poster_path;
            const finalPoster = (shouldUseTmdb && tmdbPoster)
                ? (tmdbPoster.startsWith('http') ? tmdbPoster : `https://image.tmdb.org/t/p/w500${tmdbPoster}`)
                : row.image_url;

            return {
                ...(shouldUseTmdb ? tmdbData : {}),

                id: row.tmdb_id || row.id,
                internal_id: row.id,
                has_valid_tmdb_id: shouldUseTmdb,

                title: (shouldUseTmdb && tmdbData.title) ? tmdbData.title : row.title,
                director: row.director,
                overview: row.description || (shouldUseTmdb ? (tmdbData.overview || '') : ''),
                runtime: row.runtime_minutes || (shouldUseTmdb ? tmdbData.runtime : 0) || 0,
                section: row.section || row.category,

                poster_path: finalPoster,
                backdrop_path: (shouldUseTmdb && tmdbData.backdrop_path) ? `https://image.tmdb.org/t/p/w1280${tmdbData.backdrop_path}` : null,

                release_date: (shouldUseTmdb ? (tmdbData.release_date || tmdbData.tmdb_release_date) : '') || '',
                vote_average: (shouldUseTmdb ? tmdbData.vote_average : 0) || 0,
                genres: (shouldUseTmdb ? tmdbData.genres : []) || [],

                imdb_id: row.imdb_id,
                tmdb_id: row.tmdb_id,

                _debug_match: shouldUseTmdb,
                _debug_tmdb_title: tmdbData.title || tmdbData.original_title
            }
        }).filter((film: any) => {
            if (!film.release_date) return true;
            const year = parseInt(film.release_date.split('-')[0]);
            return isNaN(year) || year >= 2025;
        });

        films = films.filter((f: any) => f.title)

        films.sort((a: any, b: any) => a.title.localeCompare(b.title))

        if (query.limit) {
            const limit = parseInt(query.limit as string)
            films = films.slice(0, limit)
        }

        return {
            results: films
        }

    } catch (error: any) {
        console.error('BAFICI Films Fetch Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to fetch BAFICI films: ${error.message || error}`,
        })
    }
})
