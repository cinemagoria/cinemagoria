import { createError, defineEventHandler, getQuery } from 'h3'
import { dbExecute } from '~~/server/utils/db'
import { cachedWithRefresh } from '~~/server/utils/staleCache'
// Shared slug ↔ festival_name mapping (also used by /api/hero badge
// embedding and /api/festival/status) so the endpoints can't drift apart.
import { FESTIVAL_NAME_BY_SLUG, NAME_TO_SLUG } from '~~/server/utils/festivals'
import { mapFestivalRow, slimFestivalFilm } from '~~/server/utils/festivalCards'

const CARD_BATCH_FRESH_MS = 10 * 60 * 1000

async function loadBuckets(
    requestedSlugs: string[],
    festivalNames: string[],
    year: number,
    limitPerFestival: number,
    slimFields: boolean,
) {
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
        const film = mapFestivalRow(row)
        if (!film.title || !String(film.title).trim()) continue
        buckets[slug].push(slimFields ? slimFestivalFilm(film) : film)
    }

    // Apply per-festival limit + stable alphabetical sort, matching the
    // single-festival endpoints' default behavior.
    for (const [slug, list] of Object.entries(buckets)) {
        list.sort((a, b) => String(a.title).localeCompare(String(b.title)))
        if (list.length > limitPerFestival) {
            buckets[slug] = list.slice(0, limitPerFestival)
        }
    }

    return buckets
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
        const buckets = slimFields
            ? await cachedWithRefresh(
                `films-batch:${requestedSlugs.join(',')}:${limitPerFestival}:${year}`,
                CARD_BATCH_FRESH_MS,
                () => loadBuckets(requestedSlugs, festivalNames, year, limitPerFestival, slimFields),
            )
            : await loadBuckets(requestedSlugs, festivalNames, year, limitPerFestival, slimFields)

        return { results: buckets }
    } catch (error: any) {
        console.error('Festival films-batch Fetch Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to fetch festival films batch: ${error.message || error}`,
        })
    }
})
