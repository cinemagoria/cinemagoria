import type { Client } from '@libsql/client'

const TMDB_BASE = 'https://api.themoviedb.org/3'
const CACHE_TTL_SECONDS = 7 * 24 * 60 * 60
const TMDB_TIMEOUT_MS = 6000

export type TvSeasonSummary = {
    season_number: number
    episode_count: number
}

export type TvLastAired = {
    season_number: number
    episode_number: number
}

export type MinimalTv = {
    id: number
    name: string
    poster_path: string | null
    total_episodes: number | null
    number_of_seasons: number | null
    seasons: TvSeasonSummary[]
    last_episode_to_air: TvLastAired | null
}

export function pickTvDetails(raw: any): MinimalTv {
    const seasons: TvSeasonSummary[] = Array.isArray(raw?.seasons)
        ? raw.seasons
            .filter((s: any) => typeof s?.season_number === 'number' && typeof s?.episode_count === 'number')
            .map((s: any) => ({ season_number: s.season_number, episode_count: s.episode_count }))
        : []

    const nonSpecialSum = seasons.reduce(
        (acc, s) => (s.season_number > 0 ? acc + s.episode_count : acc),
        0,
    )

    const total = nonSpecialSum > 0
        ? nonSpecialSum
        : (typeof raw?.number_of_episodes === 'number' ? raw.number_of_episodes : null)

    const last = raw?.last_episode_to_air
    const lastAired: TvLastAired | null =
        last && typeof last.season_number === 'number' && typeof last.episode_number === 'number'
            ? { season_number: last.season_number, episode_number: last.episode_number }
            : null

    return {
        id: raw?.id,
        name: raw?.name || '',
        poster_path: raw?.poster_path || null,
        total_episodes: total,
        number_of_seasons: typeof raw?.number_of_seasons === 'number' ? raw.number_of_seasons : null,
        seasons,
        last_episode_to_air: lastAired,
    }
}

export function hasTvSeasonBreakdown(parsed: any): parsed is MinimalTv {
    return !!parsed
        && typeof parsed === 'object'
        && 'total_episodes' in parsed
        && Array.isArray(parsed.seasons)
}

export async function loadTvDetailsCached(
    db: Client,
    tvIds: Array<number | string>,
    apiKey: string,
    apiLang: string,
): Promise<Map<number, MinimalTv>> {
    const resolved = new Map<number, MinimalTv>()

    const ids = Array.from(new Set(
        tvIds.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0),
    ))
    if (!ids.length || !apiKey) return resolved

    const nowSec = Math.floor(Date.now() / 1000)
    const placeholders = ids.map(() => '?').join(',')

    try {
        const cached = await db.execute({
            sql: `SELECT item_id, data FROM tmdb_cache
                  WHERE item_type = 'tv' AND data_type = 'details'
                    AND cached_at >= ? AND item_id IN (${placeholders})`,
            args: [nowSec - CACHE_TTL_SECONDS, ...ids],
        })
        for (const row of cached.rows as any[]) {
            try {
                const parsed = JSON.parse(row.data as string)
                if (hasTvSeasonBreakdown(parsed)) resolved.set(Number(row.item_id), parsed)
            } catch { }
        }
    } catch (e: any) {
        console.error('[TV details] cache lookup failed:', e?.message || e)
    }

    const missing = ids.filter((id) => !resolved.has(id))
    if (!missing.length) return resolved

    const fetched = await Promise.all(missing.map(async (id) => {
        try {
            const url = `${TMDB_BASE}/tv/${id}?api_key=${apiKey}&language=${encodeURIComponent(apiLang)}`
            const data: any = await $fetch(url, { timeout: TMDB_TIMEOUT_MS })
            return { id, minimal: pickTvDetails(data) }
        } catch (e: any) {
            console.error(`[TV details] TMDB fetch failed for tv/${id}:`, e?.message || e)
            return null
        }
    }))

    const writeOps: { sql: string; args: any[] }[] = []
    for (const entry of fetched) {
        if (!entry) continue
        resolved.set(entry.id, entry.minimal)
        writeOps.push({
            sql: `INSERT INTO tmdb_cache (item_id, item_type, data_type, data, cached_at)
                  VALUES (?, 'tv', 'details', ?, ?)
                  ON CONFLICT(item_id, item_type, data_type)
                  DO UPDATE SET data = excluded.data, cached_at = excluded.cached_at`,
            args: [entry.id, JSON.stringify(entry.minimal), nowSec],
        })
    }

    if (writeOps.length) {
        try {
            await db.batch(writeOps, 'write')
        } catch (e: any) {
            console.error('[TV details] cache write failed:', e?.message || e)
        }
    }

    return resolved
}
