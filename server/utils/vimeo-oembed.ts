// Vimeo oEmbed helper with server-side cache (24h TTL).
//
// Vimeo, unlike YouTube, does NOT expose a deterministic thumbnail URL —
// the thumb path includes a per-frame hash, e.g.:
//   https://i.vimeocdn.com/video/2165475296-20e5d90e708f...-d_1280?region=us
// We can't construct it from the video ID; we must ask oEmbed.
//
// Used by /news/[slug].vue (only when the trailer is Vimeo) and by
// server/utils/rss-feed.ts (RSS items with Vimeo trailers).
//
// Keep this file byte-identical across deployments (same as rss-feed.ts) so
// the repo-sync tooling can mirror it.

export interface VimeoOembed {
    thumbnail_url: string
    thumbnail_url_with_play_button?: string
    title: string
    author_name: string
    duration: number
    width: number
    height: number
}

interface CacheEntry {
    data: VimeoOembed | null  // null = the lookup itself failed; cached to avoid hammering
    ts: number
}

const TTL_MS = 24 * 60 * 60 * 1000  // 24h — Vimeo thumbs rarely change
const cache = new Map<string, CacheEntry>()

// Fetches oEmbed metadata for a Vimeo video. Returns null on any failure
// (timeout, 4xx, 5xx, JSON parse error). Failures are cached too so a broken
// video doesn't generate a Vimeo request per RSS render.
export async function getVimeoOembed(videoId: string): Promise<VimeoOembed | null> {
    if (!videoId) return null
    const cached = cache.get(videoId)
    if (cached && Date.now() - cached.ts < TTL_MS) return cached.data

    try {
        const url = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(`https://vimeo.com/${videoId}`)}&width=1280&dnt=1`
        const res = await fetch(url, {
            signal: AbortSignal.timeout(5000),
            headers: { 'User-Agent': 'Cinemagoria/1.0 (+https://cinemagoria.com)' },
        })
        if (!res.ok) {
            cache.set(videoId, { data: null, ts: Date.now() })
            return null
        }
        const data = await res.json() as VimeoOembed
        cache.set(videoId, { data, ts: Date.now() })
        return data
    } catch {
        cache.set(videoId, { data: null, ts: Date.now() })
        return null
    }
}

// Convenience: get the high-res thumb URL (1280px). Returns '' if unavailable.
export async function getVimeoThumb(videoId: string): Promise<string> {
    const o = await getVimeoOembed(videoId)
    return o?.thumbnail_url || ''
}
