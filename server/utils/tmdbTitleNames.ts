const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_TIMEOUT_MS = 2500
const NAME_TTL_MS = 24 * 60 * 60 * 1000
const MISS_TTL_MS = 10 * 60 * 1000
const LATIN_TITLE = /^[\p{Script=Latin}\p{N}\p{P}\p{S}\s]+$/u

type RelatedTitle = { type: string; id: number; name: string | null }
type CachedName = { name: string | null; ts: number }

const cache = new Map<string, CachedName>()

async function fetchName(type: string, id: number, language: string, apiKey: string): Promise<string | null> {
    const data: any = await $fetch(`${TMDB_BASE}/${type}/${id}?api_key=${apiKey}&language=${language}`, { timeout: TMDB_TIMEOUT_MS })
    const name = String((type === 'tv' ? data?.name : data?.title) || '').trim()
    return name || null
}

async function resolveName(type: string, id: number, lang: string, apiKey: string): Promise<string | null> {
    if (lang !== 'es') return fetchName(type, id, 'en-US', apiKey)
    const [spanish, english] = await Promise.all([
        fetchName(type, id, 'es-ES', apiKey).catch(() => null),
        fetchName(type, id, 'en-US', apiKey).catch(() => null),
    ])
    return spanish && LATIN_TITLE.test(spanish) ? spanish : english || spanish
}

export async function fillMissingTitleNames(items: { related_title?: RelatedTitle | null }[], lang: string, apiKey: string): Promise<void> {
    if (!apiKey) return
    const unnamed = items.map(item => item.related_title).filter((r): r is RelatedTitle => Boolean(r && !r.name))
    const keyOf = (r: RelatedTitle) => `${lang}:${r.type}/${r.id}`
    const pending = new Map(unnamed.map(r => [keyOf(r), r]))
    const now = Date.now()

    await Promise.all([...pending].map(async ([key, r]) => {
        const cached = cache.get(key)
        if (cached && now - cached.ts < (cached.name ? NAME_TTL_MS : MISS_TTL_MS)) return
        const name = await resolveName(r.type, r.id, lang, apiKey).catch(() => null)
        cache.set(key, { name, ts: Date.now() })
    }))

    for (const r of unnamed) r.name = cache.get(keyOf(r))?.name ?? null
}
