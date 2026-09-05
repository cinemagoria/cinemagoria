import { dbExecute } from './db'

// Canonical festival slug ↔ festival_films.festival_name mapping, shared by
// /api/hero (embedded badges), /api/festival/status and films-batch so the
// three can never drift apart.
export const FESTIVAL_NAME_BY_SLUG: Record<string, string> = {
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
    frightfest: 'FrightFest',
    venice: 'Venice Film Festival',
    tiff: 'Toronto International Film Festival',
    locarno: 'Locarno Film Festival',
    bifan: 'BIFAN',
    biff: 'Busan International Film Festival',
    bfi: 'BFI London Film Festival',
    sitges: 'Sitges Film Festival',
}

export const NAME_TO_SLUG: Record<string, string> = Object.fromEntries(
    Object.entries(FESTIVAL_NAME_BY_SLUG).map(([slug, name]) => [name, slug]),
)

// { cannes: { title, section }, kviff: { … }, … } for one title.
// NOTE: festival_films has no `section` column — `category` carries the
// section value (e.g. "QUINZAINE"); we expose it as `section` because that's
// what the Cannes badge-routing in Hero.vue reads.
export type FestivalStatus = Record<string, { title: string; section: string | null }>

// One indexed query (idx_festival_films_tmdb_id) resolving festival
// membership for a batch of titles. Returns a map keyed by tmdb_id as string.
export async function getFestivalStatusByTmdbId(
    tmdbIds: Array<number | string>,
    year = 2026,
): Promise<Record<string, FestivalStatus>> {
    const ids = [...new Set(tmdbIds.map(Number).filter((n) => Number.isFinite(n) && n > 0))]
    if (ids.length === 0) return {}

    const placeholders = ids.map(() => '?').join(', ')
    const result = await dbExecute({
        sql: `SELECT festival_name, category, title, tmdb_id
              FROM festival_films
              WHERE festival_year = ? AND tmdb_id IN (${placeholders})`,
        args: [year, ...ids],
    })

    const out: Record<string, FestivalStatus> = {}
    for (const row of result.rows as any[]) {
        const slug = NAME_TO_SLUG[row.festival_name as string]
        if (!slug) continue
        const key = String(row.tmdb_id)
        if (!out[key]) out[key] = {}
        out[key][slug] = {
            title: row.title as string,
            section: (row.category || null) as string | null,
        }
    }
    return out
}
