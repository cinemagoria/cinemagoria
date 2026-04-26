import { createClient } from '@libsql/client'


export default defineEventHandler(async (event) => {
    const type = getRouterParam(event, 'type')
    const table = type === 'movies'
        ? 'spotlight_movies'
        : type === 'tv'
            ? 'spotlight_tv'
            : null

    if (!table) {
        throw createError({ statusCode: 400, statusMessage: 'type must be "movies" or "tv"' })
    }

    const config = useRuntimeConfig()
    const dbUrl = (config.rssDbUrl as string | undefined)?.trim()
    const dbToken = (config.rssDbToken as string | undefined)?.trim()
    if (!dbUrl || !dbToken) {
        throw createError({ statusCode: 500, statusMessage: 'Database configuration missing' })
    }

    const db = createClient({ url: dbUrl, authToken: dbToken })

    let rows
    try {
        const r = await db.execute(`SELECT * FROM ${table} ORDER BY sort_index ASC`)
        rows = r.rows
    } catch (e: any) {
        console.error(`[spotlight] ${table} query failed:`, e?.message || e)
        throw createError({ statusCode: 500, statusMessage: 'Spotlight query failed' })
    }

    const safeJson = (v: unknown, fallback: unknown) => {
        if (v == null) return fallback
        if (typeof v !== 'string') return v
        try { return JSON.parse(v) } catch { return fallback }
    }

    const isMovie = type === 'movies'
    const mediaType = isMovie ? 'movie' : 'tv'

    const results = rows.map((row: any) => {
        const va = row.vote_average == null ? null : Number(row.vote_average)
        const base = {
            id: Number(row.id),
            media_type: mediaType,
            title: row.title,
            title_es: row.title_es ?? row.title,
            overview: row.overview ?? '',
            overview_es: row.overview_es ?? row.overview ?? '',
            poster_path: row.poster_path,
            backdrop_path: row.backdrop_path,
            vote_average: va == null ? null : va.toFixed(1),
            genre_ids: safeJson(row.genre_ids, []),
            genres: safeJson(row.genres, []),
            original_language: row.original_language,
            imdb_id: row.imdb_id,
            imdb_rating: row.imdb_rating == null ? null : Number(row.imdb_rating),
            imdb_votes: row.imdb_votes == null ? null : Number(row.imdb_votes),
            rating_source: row.rating_source,
            _curated: true,
            _score: null,
            _verdict: row.verdict,
            _reasoning: row.reasoning,
            _pinned: !!row.pinned,
            _noir_match: false,
        }
        if (isMovie) {
            return {
                ...base,
                release_date: row.release_date,
                theatrical_anchor: row.theatrical_anchor,
                _is_currently_airing: false,
            }
        }
        return {
            ...base,
            first_air_date: row.first_air_date,
            last_air_date: row.last_air_date,
            status: row.status,
            _is_currently_airing: !!row.is_currently_airing,
        }
    })

    return {
        generated_at: new Date().toISOString(),
        engine_version: 'manual-1.0.0',
        media_type: mediaType,
        count: results.length,
        results,
    }
})
