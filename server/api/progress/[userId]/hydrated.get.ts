import { useDb } from '~/server/utils/db'
import { pickTvDetails, hasTvSeasonBreakdown, type MinimalTv } from '~/server/utils/tvDetails'

const TMDB_BASE = 'https://api.themoviedb.org/3'
const CACHE_TTL_SECONDS = 7 * 24 * 60 * 60

type DetailKey = `${'movie' | 'tv'}:${number}`

type MinimalMovie = { id: number; title: string; poster_path: string | null; runtime: number | null }
type MinimalEpisode = { name: string; still_path: string | null; episode_number: number; season_number: number; runtime: number | null }

function pickMovie(raw: any): MinimalMovie {
    return {
        id: raw?.id,
        title: raw?.title || '',
        poster_path: raw?.poster_path || null,
        runtime: typeof raw?.runtime === 'number' ? raw.runtime : null,
    }
}

function pickEpisode(raw: any): MinimalEpisode {
    return {
        name: raw?.name || '',
        still_path: raw?.still_path || null,
        episode_number: raw?.episode_number,
        season_number: raw?.season_number,
        runtime: typeof raw?.runtime === 'number' ? raw.runtime : null,
    }
}

export default defineEventHandler(async (event) => {
    const userId = decodeURIComponent(event.context.params?.userId || '')
    if (!userId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing user ID' })
    }

    const config = useRuntimeConfig()
    const apiKey = (config.public as any)?.apiKey
    const apiLang = (config.public as any)?.apiLang || 'en-US'

    if (!apiKey) {
        throw createError({ statusCode: 500, statusMessage: 'TMDB API key not configured' })
    }

    const db = useDb()

    // 1. Progress rows
    let rows: any[] = []
    try {
        const result = await db.execute({
            sql: `SELECT media_id, media_type, progress_percentage, elapsed_minutes, total_duration_minutes, tv_id, season_number, episode_number, updated_at, manually_active
                  FROM user_progress_tracking
                  WHERE user_id = ?
                  ORDER BY updated_at DESC`,
            args: [userId]
        })
        rows = result.rows as any[]
    } catch (error: any) {
        console.error('[Progress Hydrated GET] DB error:', error?.message || error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch user progress list' })
    }

    if (!rows.length) {
        return { items: [], shows: {} }
    }

    // 2. Partition
    const movieIds = new Set<number>()
    const tvIds = new Set<number>()
    const seasonKeys = new Map<string, { tv_id: number; season_number: number }>()

    for (const r of rows) {
        if (r.media_type === 'movie') {
            movieIds.add(Number(r.media_id))
        } else if (r.media_type === 'episode' && r.tv_id != null) {
            tvIds.add(Number(r.tv_id))
            if (r.season_number != null) {
                const key = `${r.tv_id}:${r.season_number}`
                if (!seasonKeys.has(key)) {
                    seasonKeys.set(key, { tv_id: Number(r.tv_id), season_number: Number(r.season_number) })
                }
            }
        }
    }

    // 3. Cache lookup
    const detailsMap = new Map<DetailKey, MinimalMovie | MinimalTv>()
    const nowSec = Math.floor(Date.now() / 1000)
    const minCachedAt = nowSec - CACHE_TTL_SECONDS

    const cacheLookups: Promise<void>[] = []

    if (movieIds.size > 0) {
        const ids = Array.from(movieIds)
        const placeholders = ids.map(() => '?').join(',')
        cacheLookups.push(
            db.execute({
                sql: `SELECT item_id, data FROM tmdb_cache
                      WHERE item_type = 'movie' AND data_type = 'details'
                        AND cached_at >= ? AND item_id IN (${placeholders})`,
                args: [minCachedAt, ...ids]
            }).then((res) => {
                for (const row of res.rows as any[]) {
                    try {
                        const data = JSON.parse(row.data as string)
                        detailsMap.set(`movie:${Number(row.item_id)}` as DetailKey, data)
                    } catch { /* ignore corrupt cache row */ }
                }
            }).catch((e) => {
                console.error('[Progress Hydrated GET] cache lookup (movie) failed:', e?.message || e)
            })
        )
    }

    if (tvIds.size > 0) {
        const ids = Array.from(tvIds)
        const placeholders = ids.map(() => '?').join(',')
        cacheLookups.push(
            db.execute({
                sql: `SELECT item_id, data FROM tmdb_cache
                      WHERE item_type = 'tv' AND data_type = 'details'
                        AND cached_at >= ? AND item_id IN (${placeholders})`,
                args: [minCachedAt, ...ids]
            }).then((res) => {
                for (const row of res.rows as any[]) {
                    try {
                        const data = JSON.parse(row.data as string)
                        if (!hasTvSeasonBreakdown(data)) continue
                        detailsMap.set(`tv:${Number(row.item_id)}` as DetailKey, data)
                    } catch { /* ignore corrupt cache row */ }
                }
            }).catch((e) => {
                console.error('[Progress Hydrated GET] cache lookup (tv) failed:', e?.message || e)
            })
        )
    }

    if (cacheLookups.length) await Promise.all(cacheLookups)

    // 4. Fetch missing from TMDB in parallel (no append_to_response — only need minimal fields)
    const toFetch: Array<{ id: number; type: 'movie' | 'tv' }> = []
    for (const id of movieIds) {
        if (!detailsMap.has(`movie:${id}` as DetailKey)) toFetch.push({ id, type: 'movie' })
    }
    for (const id of tvIds) {
        if (!detailsMap.has(`tv:${id}` as DetailKey)) toFetch.push({ id, type: 'tv' })
    }

    const fetched = await Promise.all(
        toFetch.map(async ({ id, type }) => {
            try {
                const url = `${TMDB_BASE}/${type}/${id}?api_key=${apiKey}&language=${encodeURIComponent(apiLang)}`
                const data: any = await $fetch(url, { timeout: 8000 })
                const minimal = type === 'movie' ? pickMovie(data) : pickTvDetails(data)
                return { id, type, minimal }
            } catch (e: any) {
                console.error(`[Progress Hydrated GET] TMDB fetch failed for ${type}/${id}:`, e?.message || e)
                return null
            }
        })
    )

    // 5. Persist new fetches in tmdb_cache
    const writeOps: { sql: string; args: any[] }[] = []
    for (const f of fetched) {
        if (!f) continue
        detailsMap.set(`${f.type}:${f.id}` as DetailKey, f.minimal)
        writeOps.push({
            sql: `INSERT INTO tmdb_cache (item_id, item_type, data_type, data, cached_at)
                  VALUES (?, ?, 'details', ?, ?)
                  ON CONFLICT(item_id, item_type, data_type)
                  DO UPDATE SET data = excluded.data, cached_at = excluded.cached_at`,
            args: [f.id, f.type, JSON.stringify(f.minimal), nowSec]
        })
    }
    if (writeOps.length) {
        try {
            await db.batch(writeOps, 'write')
        } catch (e: any) {
            console.error('[Progress Hydrated GET] cache write failed:', e?.message || e)
        }
    }

    // 6. Fetch seasons in parallel — 1 request per (tv_id, season) covers all episodes of that season
    const episodeMap = new Map<string, MinimalEpisode>() // key: `${tv_id}:${season}:${episode}`
    if (seasonKeys.size > 0) {
        await Promise.all(Array.from(seasonKeys.values()).map(async ({ tv_id, season_number }) => {
            try {
                const url = `${TMDB_BASE}/tv/${tv_id}/season/${season_number}?api_key=${apiKey}&language=${encodeURIComponent(apiLang)}`
                const data: any = await $fetch(url, { timeout: 8000 })
                if (Array.isArray(data?.episodes)) {
                    for (const ep of data.episodes) {
                        episodeMap.set(`${tv_id}:${season_number}:${ep.episode_number}`, pickEpisode(ep))
                    }
                }
            } catch (e: any) {
                console.error(`[Progress Hydrated GET] TMDB season fetch failed for tv/${tv_id}/season/${season_number}:`, e?.message || e)
            }
        }))
    }

    // 7. Build response
    const items = rows.map((r) => {
        const base: any = {
            media_id: Number(r.media_id),
            media_type: r.media_type,
            progress_percentage: Number(r.progress_percentage) || 0,
            elapsed_minutes: Number(r.elapsed_minutes) || 0,
            total_duration_minutes: Number(r.total_duration_minutes) || 0,
            tv_id: r.tv_id != null ? Number(r.tv_id) : null,
            season_number: r.season_number != null ? Number(r.season_number) : null,
            episode_number: r.episode_number != null ? Number(r.episode_number) : null,
            updated_at: r.updated_at,
            manually_active: Number(r.manually_active) === 1 ? 1 : 0,
            details: null,
        }

        if (r.media_type === 'movie') {
            base.details = detailsMap.get(`movie:${base.media_id}` as DetailKey) || null
        } else if (r.media_type === 'episode' && base.tv_id != null && base.season_number != null && base.episode_number != null) {
            base.details = episodeMap.get(`${base.tv_id}:${base.season_number}:${base.episode_number}`) || null
        }

        return base
    })

    const shows: Record<number, MinimalTv> = {}
    for (const tvId of tvIds) {
        const d = detailsMap.get(`tv:${tvId}` as DetailKey) as MinimalTv | undefined
        if (d) shows[tvId] = d
    }

    return { items, shows }
})
