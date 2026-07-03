import { createError, defineEventHandler, getQuery } from 'h3'
import { dbExecute } from '~~/server/utils/db'
// Shared slug ↔ festival_name mapping (also used by /api/hero badge
// embedding and /api/festival/status) so the endpoints can't drift apart.
import { FESTIVAL_NAME_BY_SLUG, NAME_TO_SLUG } from '~~/server/utils/festivals'

// Slim projection for carousel/card consumers (homepage). Keeps every field
// the festival cards, QuickFav and mapItemToDbPayload read, but drops the
// full tmdb_data spread (cast, crew, videos, production_companies, …) that
// only the festival detail pages need. Cuts the homepage's serialized Nuxt
// payload and the Turso→origin transfer dramatically.
function slimFilm(film: any) {
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

function mapRow(row: any) {
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

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const slugsParam = String(query.festivals || '').trim()
    const limitPerFestival = query.limit ? parseInt(String(query.limit), 10) : 1000
    const year = query.year ? parseInt(String(query.year), 10) : 2026
    const slimFields = query.fields === 'card'

    if (!slugsParam) {
        throw createError({ statusCode: 400, statusMessage: 'festivals query param required (comma-separated slugs)' })
    }

    const requestedSlugs = slugsParam.split(',').map((s) => s.trim()).filter(Boolean)
    const festivalNames = requestedSlugs
        .map((slug) => FESTIVAL_NAME_BY_SLUG[slug])
        .filter((n): n is string => !!n)

    if (festivalNames.length === 0) {
        return { results: {} }
    }

    try {
        const placeholders = festivalNames.map(() => '?').join(', ')
        const sql = `SELECT * FROM festival_films
                     WHERE festival_name IN (${placeholders})
                       AND festival_year = ?`
        const args = [...festivalNames, year]

        const result = await dbExecute({ sql, args })

        // Bucket by slug for easy client consumption.
        const buckets: Record<string, any[]> = {}
        for (const slug of requestedSlugs) buckets[slug] = []

        for (const row of result.rows as any[]) {
            const slug = NAME_TO_SLUG[row.festival_name as string]
            if (!slug || !buckets[slug]) continue
            const film = mapRow(row)
            if (!film.title || !String(film.title).trim()) continue
            buckets[slug].push(slimFields ? slimFilm(film) : film)
        }

        // Apply per-festival limit + stable alphabetical sort, matching the
        // single-festival endpoints' default behavior.
        for (const [slug, list] of Object.entries(buckets)) {
            list.sort((a, b) => String(a.title).localeCompare(String(b.title)))
            if (list.length > limitPerFestival) {
                buckets[slug] = list.slice(0, limitPerFestival)
            }
        }

        return { results: buckets }
    } catch (error: any) {
        console.error('Festival films-batch Fetch Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to fetch festival films batch: ${error.message || error}`,
        })
    }
})
