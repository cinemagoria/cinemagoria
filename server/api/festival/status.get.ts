import { createError, defineEventHandler, getQuery } from 'h3'
import { getFestivalStatusByTmdbId } from '~~/server/utils/festivals'

// Resolves every festival badge for one title with a single indexed query —
// used as the client-side fallback when the Hero doesn't already have the
// membership embedded in its item (/api/hero) or passed down by the page.
export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const tmdbId = query.tmdb_id ? parseInt(String(query.tmdb_id), 10) : null
    const year = query.year ? parseInt(String(query.year), 10) : 2026

    if (!tmdbId || Number.isNaN(tmdbId)) {
        throw createError({ statusCode: 400, statusMessage: 'tmdb_id query param required' })
    }

    try {
        const byId = await getFestivalStatusByTmdbId([tmdbId], year)
        return { festivals: byId[String(tmdbId)] || {} }
    } catch (error: any) {
        console.error('Festival status Fetch Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to fetch festival status: ${error.message || error}`,
        })
    }
})
