import { createError, defineEventHandler, getQuery } from 'h3'
import { dbExecute } from '~~/server/utils/db'

/**
 * Per-title / per-person award lookup, backed by `awards_archive`.
 *
 * The response keeps the historical per-body shape the UI reads
 * (`oscars`, `goldenGlobes`, `palme`, `goldenLion`, `goldenBear`), so this is a
 * data-source change only — no component had to move.
 *
 * Lookups resolve through indexes rather than scanning:
 *   tmdb_id  -> idx_aa_tmdb
 *   person   -> idx_aar_norm on the recipients child table
 *   title    -> idx_aa_title (COLLATE NOCASE)
 *
 * Person lookups go through `awards_archive_recipients` because the archive
 * packs several credited names into one field ("Chloe Zhao & Maggie O'Farrell").
 * Matching the parent column directly would miss roughly a fifth of the Oscars.
 */

const BODY_KEYS: Record<string, 'oscars' | 'goldenGlobes' | 'palme' | 'goldenLion' | 'goldenBear'> = {
    oscars: 'oscars',
    'golden-globes': 'goldenGlobes',
    'palme-dor': 'palme',
    'golden-lion': 'goldenLion',
    'golden-bear': 'goldenBear',
}

const emptyResult = () => ({
    oscars: [] as any[],
    goldenGlobes: [] as any[],
    palme: [] as any[],
    goldenLion: [] as any[],
    goldenBear: [] as any[],
})

// Diacritic-stripped lowercase, matching how recipient_norm was written.
const norm = (s: string) =>
    s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

/** Rebuild the per-body row shape the UI has always consumed. */
function toLegacyShape(row: any) {
    const year = row.year_label ?? row.ceremony_year
    const base = {
        id: row.id,
        year,
        category: row.category,
        won: row.won,
        tmdb_id: row.tmdb_id ?? undefined,
        imdb_id: row.imdb_id ?? '',
    }

    switch (row.body_slug) {
        case 'oscars':
            return { ...base, film_title: row.title ?? '', nominee_name: row.recipient_name ?? '' }
        case 'golden-globes':
            // The Globes table renders `year_award`; `year` is emitted too so a
            // shared sort helper never sees undefined.
            return { ...base, year_award: year, film: row.title ?? '', nominee: row.recipient_name ?? '' }
        default:
            return {
                ...base,
                film_title: row.title ?? '',
                original_title: row.original_title ?? '',
                director: row.director ?? '',
                country: row.country ?? '',
            }
    }
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const tmdbIdRaw = query.tmdbId ? parseInt(String(query.tmdbId), 10) : undefined
    const tmdbId = Number.isFinite(tmdbIdRaw) && (tmdbIdRaw as number) > 0 ? tmdbIdRaw : undefined
    const name = query.name ? String(query.name) : undefined
    const title = query.title ? String(query.title) : undefined
    const type = query.type ? String(query.type) : undefined

    if (!tmdbId && !name && !title) return emptyResult()

    // One indexed OR-query instead of five in-memory scans.
    const clauses: string[] = []
    const args: any[] = []

    if (tmdbId) {
        clauses.push('tmdb_id = ?')
        args.push(tmdbId)
    }
    // A person lookup matches the credited recipient; a title lookup matches the film.
    if (name && (type === 'person' || !type)) {
        clauses.push('id IN (SELECT award_id FROM awards_archive_recipients WHERE recipient_norm = ?)')
        args.push(norm(name))
    }
    if (title && type !== 'person') {
        clauses.push('title = ? COLLATE NOCASE')
        args.push(title)
    }

    if (clauses.length === 0) return emptyResult()

    try {
        const result = await dbExecute({
            sql: `SELECT id, body_slug, ceremony_year, year_label, category, won,
                         title, original_title, director, country,
                         recipient_name, tmdb_id, imdb_id, media_type
                  FROM awards_archive
                  WHERE ${clauses.join(' OR ')}`,
            args,
        })

        const out = emptyResult()
        for (const row of result.rows as any[]) {
            const key = BODY_KEYS[row.body_slug]
            if (!key) continue

            // Movie and TV pages share the Globes archive; keep them apart.
            if (type === 'movie' && row.media_type === 'tv') continue
            if (type === 'tv' && row.media_type !== 'tv') continue

            out[key].push(toLegacyShape(row))
        }
        return out
    } catch (error: any) {
        console.error('Awards lookup failed:', error)
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to fetch awards: ${error?.message || error}`,
        })
    }
})
