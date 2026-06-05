import { createError, defineEventHandler, getQuery } from 'h3'
import { useDb } from '~~/server/utils/db'

// slug → festival_name as stored in Turso. Keep in sync with the per-festival
// endpoints — those still exist for direct callers (festival landing pages,
// schedule pages, etc.). This batch endpoint exists so the homepage can fetch
// all 11 in one round trip instead of 11 parallel HTTP/2 streams.
const FESTIVAL_NAME_BY_SLUG: Record<string, string> = {
    sundance: 'Sundance Film Festival',
    berlinale: 'Berlinale Film Festival',
    rotterdam: 'Rotterdam Film Festival',
    slamdance: 'Slamdance Film Festival',
    sxsw: 'SXSW Film & TV Festival',
    romford: 'Romford Horror Festival',
    bifff: 'BIFFF',
    bafici: 'BAFICI',
    cannes: 'Cannes Film Festival',
    tribeca: 'Tribeca Festival',
    cuff: 'Calgary Underground Film Festival',
    kviff: 'Karlovy Vary International Film Festival',
    fantasia: 'Fantasia International Film Festival',
}

const NAME_TO_SLUG: Record<string, string> = Object.fromEntries(
    Object.entries(FESTIVAL_NAME_BY_SLUG).map(([slug, name]) => [name, slug])
)

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

    const db = useDb()

    try {
        const placeholders = festivalNames.map(() => '?').join(', ')
        const sql = `SELECT * FROM festival_films
                     WHERE festival_name IN (${placeholders})
                       AND festival_year = ?`
        const args = [...festivalNames, year]

        const result = await db.execute({ sql, args })

        // Bucket by slug for easy client consumption.
        const buckets: Record<string, any[]> = {}
        for (const slug of requestedSlugs) buckets[slug] = []

        for (const row of result.rows as any[]) {
            const slug = NAME_TO_SLUG[row.festival_name as string]
            if (!slug || !buckets[slug]) continue
            const film = mapRow(row)
            if (!film.title || !String(film.title).trim()) continue
            buckets[slug].push(film)
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
