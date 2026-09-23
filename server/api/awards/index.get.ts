import { createError, defineEventHandler, getQuery } from 'h3'
import { dbExecute } from '~~/server/utils/db'

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
        media_type: row.media_type === 'tv' ? 'tv' : 'movie',
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

const AWARD_COLUMNS = `id, body_slug, ceremony_year, year_label, category, won,
                       title, original_title, director, country,
                       recipient_name, tmdb_id, imdb_id, media_type`

function lookupStatement(type: string, tmdbId: number | undefined, name: string | undefined) {
    if ((type === 'movie' || type === 'tv') && tmdbId) {
        return {
            sql: `SELECT ${AWARD_COLUMNS}
                  FROM awards_archive
                  WHERE tmdb_id = ? AND COALESCE(media_type, 'movie') = ?`,
            args: [tmdbId, type],
        }
    }
    if (type === 'person' && name) {
        return {
            sql: `SELECT ${AWARD_COLUMNS}
                  FROM awards_archive
                  WHERE id IN (SELECT award_id FROM awards_archive_recipients WHERE recipient_norm = ?)`,
            args: [norm(name)],
        }
    }
    return null
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const tmdbIdRaw = query.tmdbId ? parseInt(String(query.tmdbId), 10) : undefined
    const tmdbId = Number.isFinite(tmdbIdRaw) && (tmdbIdRaw as number) > 0 ? tmdbIdRaw : undefined
    const name = query.name ? String(query.name) : undefined
    const type = String(query.type || (name ? 'person' : 'movie'))

    const statement = lookupStatement(type, tmdbId, name)
    if (!statement) return emptyResult()

    try {
        const result = await dbExecute(statement)

        const out = emptyResult()
        for (const row of result.rows as any[]) {
            const key = BODY_KEYS[row.body_slug]
            if (key) out[key].push(toLegacyShape(row))
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
