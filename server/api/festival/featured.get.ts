import { createError, defineEventHandler } from 'h3'
import { dbExecute } from '~~/server/utils/db'
import { cachedWithRefresh } from '~~/server/utils/staleCache'
import { NAME_TO_SLUG } from '~~/server/utils/festivals'
import { mapFestivalRow, slimFestivalFilm } from '~~/server/utils/festivalCards'

const FEATURED_FRESH_MS = 60 * 1000

const CARD_FIELDS = [
    'id', 'title', 'name', 'overview', 'poster_path', 'tmdb_poster', 'backdrop_path', 'release_date',
    'tmdb_release_date', 'first_air_date', 'vote_average', 'vote_count', 'runtime', 'genres', 'director',
    'media_type', 'external_ids', 'imdb_rating', 'imdb_votes', 'rating_source', 'imdb_id', 'tmdb_id',
]

const CARD_DATA = `CASE WHEN json_valid(f.tmdb_data) THEN json_object(${CARD_FIELDS
    .map((key) => `'${key}', json_extract(f.tmdb_data, '$.${key}')`)
    .join(', ')}) END AS tmdb_data`

function presentFields(json: unknown) {
    try {
        return Object.fromEntries(Object.entries(JSON.parse(String(json || '{}'))).filter(([, value]) => value !== null))
    } catch {
        return {}
    }
}

async function loadFeatured() {
    const result = await dbExecute({
        sql: `SELECT f.id, f.festival_name, f.title, f.category, f.description, f.image_url, f.director,
                     f.runtime_minutes, f.tmdb_id, f.imdb_id, ${CARD_DATA}
              FROM festival_featured x
              JOIN festival_films f ON f.id = x.film_id
              WHERE x.enabled = 1
              ORDER BY x.position`,
        args: [],
    })
    return (result.rows as any[])
        .map((row) => ({
            ...slimFestivalFilm(mapFestivalRow({ ...row, tmdb_data: presentFields(row.tmdb_data) })),
            festival_source: NAME_TO_SLUG[row.festival_name as string],
        }))
        .filter((film) => film.festival_source && String(film.title || '').trim())
}

export default defineEventHandler(async () => {
    try {
        return { results: await cachedWithRefresh('festival-featured', FEATURED_FRESH_MS, loadFeatured) }
    } catch (error: any) {
        console.error('Festival featured fetch error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to fetch festival selections: ${error.message || error}`,
        })
    }
})
