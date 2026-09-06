import { createClient, type Client } from '@libsql/client'

/**
 * Shared pieces of the translation path.
 *
 * The model list is read from a snapshot the scheduled probe writes, never from
 * a constant: OpenRouter rotates its free catalogue, and the three models this
 * project used to name were all retired at once, which is what took translation
 * down. A stored snapshot goes stale on its own schedule instead.
 */

export const TRANSLATE_SYSTEM_PROMPT = `Eres un traductor experto de contenido audiovisual (cine y televisión). Traduces del inglés al español latinoamericano neutro con la fluidez de los subtítulos profesionales.

- Español latinoamericano neutro, sin modismos regionales.
- Prioriza la naturalidad sobre la literalidad.
- No traduzcas: títulos de obras, nombres propios, lugares, marcas, ni tecnicismos ya adoptados (streaming, spoiler, showrunner).
- Terminología: "guion", "director de fotografía", "montaje", "banda sonora", "tráiler", "estreno", "reparto", "trama".
- Mantén los saltos de línea del original.
- Responde EXCLUSIVAMENTE con el texto traducido. Sin encabezados, sin notas, sin explicar tu razonamiento.`

export function getDb(config: any): Client {
    return createClient({
        url: String(config.rssDbUrl).trim(),
        authToken: String(config.rssDbToken).trim(),
    })
}

export async function ensureModelTable(db: Client) {
    await db.execute(`CREATE TABLE IF NOT EXISTS translation_models (
        id TEXT PRIMARY KEY,
        label TEXT,
        usable INTEGER NOT NULL DEFAULT 0,
        latency_ms INTEGER,
        reason TEXT,
        checked_at TEXT NOT NULL
    )`)
}

/** Usable models, fastest first — latency is the only axis that matters once
 *  the probe has already established that the output is Spanish. */
export async function getUsableModels(db: Client): Promise<string[]> {
    try {
        const res = await db.execute(
            `SELECT id FROM translation_models WHERE usable = 1 ORDER BY latency_ms ASC`,
        )
        return res.rows.map((r) => String(r.id))
    } catch {
        return []
    }
}

/**
 * Guards the cache against models that answer without translating.
 *
 * The probe found two that do exactly that: one returns a content-safety
 * verdict, another leaks its chain of thought. Both look like a successful
 * response, and without this check either would be written into the cache as
 * the Spanish synopsis and served to every visitor from then on.
 */
export function looksLikeSpanish(text: string, source: string): boolean {
    if (!text) return false
    const t = text.trim()
    if (t.length < 8) return false
    if (t === source.trim()) return false

    // Preambles and reasoning leakage.
    if (/^(here'?s|okay|sure|thinking|analysis|user safety|i (will|'ll)|traducción:|translation:)/i.test(t)) {
        return false
    }
    if (/\bthinking process\b|\*\*analyze\b/i.test(t)) return false

    const padded = ` ${t.toLowerCase()} `
    const markers = [' el ', ' la ', ' los ', ' las ', ' un ', ' una ', ' de ', ' que ', ' se ', ' con ', ' por ', ' para ', ' su ', ' en ']
    const hits = markers.filter((m) => padded.includes(m)).length
    if (hits < 2) return false

    // Still visibly English.
    const english = [' the ', ' and ', ' with ', ' that ', ' his ', ' her ', ' from ', ' after ']
    const englishHits = english.filter((m) => padded.includes(m)).length
    return englishHits < 2
}

export function hashText(text: string): string {
    let h = 5381
    for (let i = 0; i < text.length; i += 1) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0
    return h.toString(16)
}

/**
 * The live free catalogue, used when the stored snapshot cannot carry the
 * request on its own.
 *
 * This is what keeps the pool from ever depending on a name written into the
 * source: with no snapshot yet, or with every model in it failing between two
 * scheduled refreshes, the catalogue is asked again rather than falling back to
 * a constant that expires like the last one did.
 */
let catalogueCache: { ids: string[]; at: number } = { ids: [], at: 0 }
const CATALOGUE_TTL_MS = 30 * 60 * 1000

export async function fetchFreeCatalogue(): Promise<string[]> {
    if (catalogueCache.ids.length && Date.now() - catalogueCache.at < CATALOGUE_TTL_MS) {
        return catalogueCache.ids
    }
    try {
        const res: any = await $fetch('https://openrouter.ai/api/v1/models', { timeout: 10000 })
        const ids = (res?.data ?? [])
            .map((m: any) => String(m?.id ?? ''))
            .filter((id: string) => id.endsWith(':free'))
        if (ids.length) catalogueCache = { ids, at: Date.now() }
        return ids
    } catch (e: any) {
        console.error('translation: could not read the free catalogue:', e?.message)
        return catalogueCache.ids
    }
}
