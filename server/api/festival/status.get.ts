import { createError, defineEventHandler, getQuery } from 'h3'
import { dbExecute } from '~~/server/utils/db'

// Reverse of FESTIVAL_NAME_BY_SLUG in films-batch.get.ts — one row per festival
// a title belongs to. This endpoint exists so Hero.vue can resolve every
// festival badge for a title with ONE request + ONE indexed query instead of
// the previous 13 sequential /api/festival/{slug}/films?tmdb_id=X calls.
const NAME_TO_SLUG: Record<string, string> = {
    'Sundance Film Festival': 'sundance',
    'Berlinale Film Festival': 'berlinale',
    'Rotterdam Film Festival': 'rotterdam',
    'Slamdance Film Festival': 'slamdance',
    'SXSW Film & TV Festival': 'sxsw',
    'Romford Horror Festival': 'romford',
    'BIFFF': 'bifff',
    'BAFICI': 'bafici',
    'Cannes Film Festival': 'cannes',
    'Tribeca Festival': 'tribeca',
    'Calgary Underground Film Festival': 'cuff',
    'Karlovy Vary International Film Festival': 'kviff',
    'Fantasia International Film Festival': 'fantasia',
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const tmdbId = query.tmdb_id ? parseInt(String(query.tmdb_id), 10) : null
    const year = query.year ? parseInt(String(query.year), 10) : 2026

    if (!tmdbId || Number.isNaN(tmdbId)) {
        throw createError({ statusCode: 400, statusMessage: 'tmdb_id query param required' })
    }

    try {
        const result = await dbExecute({
            sql: `SELECT festival_name, section, category, title, tmdb_id
                  FROM festival_films
                  WHERE tmdb_id = ? AND festival_year = ?`,
            args: [tmdbId, year],
        })

        const festivals: Record<string, { title: string; section: string | null }> = {}
        for (const row of result.rows as any[]) {
            const slug = NAME_TO_SLUG[row.festival_name as string]
            if (!slug) continue
            festivals[slug] = {
                title: row.title,
                section: (row.section || row.category || null) as string | null,
            }
        }

        return { festivals }
    } catch (error: any) {
        console.error('Festival status Fetch Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to fetch festival status: ${error.message || error}`,
        })
    }
})
