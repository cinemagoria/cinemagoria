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

// One client for the lifetime of the instance. Rebuilding it per request adds
// a connection setup to a path the reader is waiting on.
let client: Client | null = null

export function getDb(config: any): Client {
    if (!client) {
        client = createClient({
            url: String(config.rssDbUrl).trim(),
            authToken: String(config.rssDbToken).trim(),
        })
    }
    return client
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


/**
 * Is this text already Spanish?
 *
 * TMDB serves some reviews already translated. Sending those to a model spends
 * a call to produce what was already on the page, so the same check that
 * guards the output is applied to the input first — but conservatively: a
 * false positive would leave English text on a Spanish page, which is worse
 * than a wasted call.
 */
export function isSpanish(text: string): boolean {
    const t = String(text ?? '').trim()
    if (t.length < 24) return false

    const padded = ` ${t.toLowerCase()} `
    const spanish = [' el ', ' la ', ' los ', ' las ', ' un ', ' una ', ' de ', ' del ', ' que ', ' se ', ' con ', ' por ', ' para ', ' su ', ' sus ', ' en ', ' pero ', ' como ', ' más ', ' está ', ' son ']
        .filter((m) => padded.includes(m)).length
    const english = [' the ', ' and ', ' with ', ' that ', ' his ', ' her ', ' from ', ' after ', ' when ', ' this ', ' but ', ' for ', ' are ', ' is ', ' of ', ' to ']
        .filter((m) => padded.includes(m)).length

    // Spanish-only orthography is strong evidence on its own.
    const orthography = /[ñáéíóúü¿¡]/i.test(t)

    if (english >= 2) return false
    return spanish >= 4 || (orthography && spanish >= 2)
}

/**
 * The usable models, held in memory between requests.
 *
 * Reading the snapshot from the database on every request puts a round-trip in
 * front of every translation. The list changes once a day, so a short memory
 * window costs nothing and removes that hop.
 */
let modelCache: { ids: string[]; at: number } = { ids: [], at: 0 }
const MODEL_TTL_MS = 10 * 60 * 1000

export async function rankedModels(db: Client): Promise<string[]> {
    if (modelCache.ids.length && Date.now() - modelCache.at < MODEL_TTL_MS) {
        return modelCache.ids
    }
    try {
        const res = await db.execute(
            `SELECT id FROM translation_models WHERE usable = 1 ORDER BY latency_ms ASC`,
        )
        const ids = res.rows.map((r) => String(r.id))
        if (ids.length) {
            modelCache = { ids, at: Date.now() }
            return ids
        }
    } catch (e: any) {
        console.error('translation: could not read the model snapshot:', e?.message)
    }
    return []
}

/** Drops the memoised list, so the next request re-reads the snapshot. */
export function forgetModels() {
    modelCache = { ids: [], at: 0 }
}


/**
 * Records what a real request just learned about a model.
 *
 * The scheduled probe used to be the only source of this, at the cost of one
 * request per model per day — a third of the free tier's daily allowance spent
 * translating a sample sentence nobody reads, to discover what live traffic
 * discovers anyway. Every translation a reader triggers already proves whether
 * a model answers, how fast, and whether what came back was a translation.
 *
 * Never awaited: this is bookkeeping, and the reader is not waiting for it.
 */
export function recordOutcome(
    db: Client,
    model: string,
    usable: boolean,
    latencyMs: number,
    reason: string | null,
) {
    db.execute({
        sql: `INSERT INTO translation_models (id, label, usable, latency_ms, reason, checked_at)
              VALUES (?, ?, ?, ?, ?, ?)
              ON CONFLICT(id) DO UPDATE SET
                usable = excluded.usable,
                latency_ms = excluded.latency_ms,
                reason = excluded.reason,
                checked_at = excluded.checked_at`,
        args: [model, model.split('/').pop() ?? model, usable ? 1 : 0, latencyMs, reason, new Date().toISOString()],
    })
        .then(() => forgetModels())
        .catch((e: any) => console.error('translation: could not record an outcome:', e?.message))
}
