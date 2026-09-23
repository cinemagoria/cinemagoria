// Slim projection for carousel/card consumers (homepage). Keeps every field
// the festival cards, QuickFav and mapItemToDbPayload read, but drops the
// full tmdb_data spread (cast, crew, videos, production_companies, …) that
// only the festival detail pages need. Cuts the homepage's serialized Nuxt
// payload and the Turso→origin transfer dramatically.
export function slimFestivalFilm(film: any) {
    return {
        id: film.id,
        internal_id: film.internal_id,
        tmdb_id: film.tmdb_id,
        imdb_id: film.imdb_id,
        title: film.title,
        name: film.name,
        overview: film.overview,
        poster_path: film.poster_path,
        image_url: film.image_url,
        backdrop_path: film.backdrop_path,
        release_date: film.release_date,
        first_air_date: film.first_air_date,
        vote_average: film.vote_average,
        vote_count: film.vote_count,
        runtime: film.runtime,
        genres: film.genres,
        director: film.director,
        section: film.section,
        media_type: film.media_type,
        external_ids: film.external_ids,
        imdb_rating: film.imdb_rating,
        imdb_votes: film.imdb_votes,
        rating_source: film.rating_source,
    }
}

export function mapFestivalRow(row: any) {
    let tmdbData: any = {}
    try {
        tmdbData = typeof row.tmdb_data === 'string' ? JSON.parse(row.tmdb_data) : (row.tmdb_data || {})
    } catch {
        tmdbData = {}
    }

    // Clean TMDB poster, or null when TMDB hasn't backfilled one yet.
    const tmdbPoster = tmdbData.tmdb_poster
        ? tmdbData.tmdb_poster
        : tmdbData.poster_path
            ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
            : null

    // Universal Tribeca pattern: keep poster_path as TMDB-or-null, expose image_url
    // separately. This lets the Details `poster` mixin resolve the full chain:
    //   title_overrides (force) → TMDB → title_overrides (fallback) → festival image_url.
    // poster_path & image_url are set AFTER the spread so tmdbData can't clobber them.
    return {
        id: row.tmdb_id || row.id,
        internal_id: row.id,
        title: row.title,
        overview: row.description || tmdbData.overview || '',
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
        poster_path: tmdbPoster,
        image_url: row.image_url || null,
    }
}
