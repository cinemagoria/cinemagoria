import { createError, defineEventHandler, getQuery } from 'h3'
import { dbExecute } from '~~/server/utils/db'

/**
 * Backing endpoint for the awards page, served from `awards_archive`.
 *
 * Two indexed queries replace a full pass over the archive: one for the year
 * list of the selected body, one for that year's rows (idx_aa_body_year covers
 * both). The response shape is unchanged.
 */

const BODY_SLUG_BY_AWARD: Record<string, string> = {
    oscars: 'oscars',
    goldenGlobes: 'golden-globes',
    palme: 'palme-dor',
    goldenLion: 'golden-lion',
    goldenBear: 'golden-bear',
}

/** Rebuild the per-body row shape the page has always consumed. */
function toLegacyShape(row: any, award: string) {
    const year = row.year_label ?? row.ceremony_year
    const base = {
        id: row.id,
        year,
        category: row.category,
        won: Boolean(row.won),
        tmdb_id: row.tmdb_id ?? undefined,
        imdb_id: row.imdb_id ?? '',
    }

    if (award === 'oscars') {
        return { ...base, film_title: row.title ?? '', nominee_name: row.recipient_name ?? '' }
    }
    if (award === 'goldenGlobes') {
        return { ...base, year_award: year, film: row.title ?? '', nominee: row.recipient_name ?? '' }
    }
    return {
        ...base,
        film_title: row.title ?? '',
        original_title: row.original_title ?? '',
        director: row.director ?? '',
        country: row.country ?? '',
    }
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const award = BODY_SLUG_BY_AWARD[String(query.award || '')] ? String(query.award) : 'oscars'
    const bodySlug = BODY_SLUG_BY_AWARD[award]
    const requestedYear = query.year ? String(query.year) : undefined

    try {
        // Year list. year_label preserves the original span rendering
        // ("1927/28"); ceremony_year is what actually orders it.
        const yearRows = await dbExecute({
            sql: `SELECT DISTINCT ceremony_year, year_label
                  FROM awards_archive
                  WHERE body_slug = ?
                  ORDER BY ceremony_year DESC`,
            args: [bodySlug],
        })

        const years = (yearRows.rows as any[]).map((r) => String(r.year_label ?? r.ceremony_year))
        if (years.length === 0) {
            return { award, selectedYear: undefined, years: [], categories: [], items: [] }
        }

        const selectedYear = requestedYear && years.includes(requestedYear) ? requestedYear : years[0]

        // Map the display label back to the integer the index is built on.
        const match = (yearRows.rows as any[]).find(
            (r) => String(r.year_label ?? r.ceremony_year) === selectedYear,
        )
        const ceremonyYear = match?.ceremony_year

        const itemRows = await dbExecute({
            sql: `SELECT id, ceremony_year, year_label, category, won,
                         title, original_title, director, country,
                         recipient_name, tmdb_id, imdb_id
                  FROM awards_archive
                  WHERE body_slug = ? AND ceremony_year = ?
                  ORDER BY won DESC, category ASC, id ASC`,
            args: [bodySlug, ceremonyYear],
        })

        const items = (itemRows.rows as any[]).map((r) => toLegacyShape(r, award))
        const categories = Array.from(
            new Set(items.map((i: any) => i.category).filter(Boolean)),
        )

        return { award, selectedYear, years, categories, items }
    } catch (error: any) {
        console.error('Awards page fetch failed:', error)
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to fetch awards: ${error?.message || error}`,
        })
    }
})
