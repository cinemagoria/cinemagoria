import {
    TRANSLATE_SYSTEM_PROMPT,
    ensureModelTable,
    getDb,
    getUsableModels,
    hashText,
    looksLikeSpanish,
} from '../utils/translation'

/**
 * Translates one piece of text to Spanish, cache first.
 *
 * This runs on the server so that a synopsis is translated once for every
 * reader rather than once per reader: the first visitor to open a title pays
 * for the call, writes it to the shared cache, and everyone after that reads
 * the row. It also keeps the provider key out of the browser bundle.
 */

const SEED_MODELS = ['cohere/north-mini-code:free', 'minimax/minimax-m3:free']

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)

    // Batch mode: several reviews in one call, answered as a numbered object.
    // One request for N texts instead of N requests is the difference between
    // a page of reviews costing one model call and costing eight.
    if (Array.isArray(body?.texts)) {
        return await translateBatch(config, body.texts.map((t: any) => String(t ?? '')))
    }

    const text: string = String(body?.text ?? '').trim()
    if (!text) throw createError({ statusCode: 400, statusMessage: 'text is required' })

    const tmdbId = body?.tmdbId ? Number(body.tmdbId) : null
    const mediaType: string | null = body?.mediaType ? String(body.mediaType) : null
    const cacheable = Boolean(tmdbId && mediaType)

    const db = getDb(config)

    // --- cache ---------------------------------------------------------------
    if (cacheable) {
        try {
            const hit = await db.execute({
                sql: `SELECT content_es FROM overviews_cache WHERE tmdb_id = ? AND media_type = ?`,
                args: [tmdbId, mediaType],
            })
            const cached = hit.rows[0]?.content_es
            if (cached) return { translated: String(cached), source: 'cache' }
        } catch (e: any) {
            console.error('translate: cache read failed:', e?.message)
        }
    }

    // --- model pool ----------------------------------------------------------
    const apiKey = config.orApiKey
    if (!apiKey) return { translated: null, source: 'unconfigured' }

    let models: string[] = []
    try {
        await ensureModelTable(db)
        models = await getUsableModels(db)
    } catch (e: any) {
        console.error('translate: could not read the model snapshot:', e?.message)
    }
    // The seeds only matter before the first refresh has ever run.
    for (const seed of SEED_MODELS) if (!models.includes(seed)) models.push(seed)

    // --- translate -----------------------------------------------------------
    for (const model of models) {
        try {
            const res = await $fetch<any>('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://es.cinemagoria.com',
                    'X-Title': 'Cinemagoria ES',
                },
                body: {
                    model,
                    temperature: 0.3,
                    max_tokens: Math.min(2048, Math.ceil(text.length / 2) + 400),
                    messages: [
                        { role: 'system', content: TRANSLATE_SYSTEM_PROMPT },
                        { role: 'user', content: text },
                    ],
                },
                timeout: 25000,
            })

            const out = String(res?.choices?.[0]?.message?.content ?? '').trim()

            // A model that answers is not the same as a model that translated.
            if (!looksLikeSpanish(out, text)) {
                console.warn(`translate: ${model} returned something that is not a translation`)
                continue
            }

            if (cacheable) {
                try {
                    await db.execute({
                        sql: `INSERT INTO overviews_cache (tmdb_id, media_type, content_en, content_es, content_hash)
                              VALUES (?, ?, ?, ?, ?)
                              ON CONFLICT(tmdb_id, media_type) DO UPDATE SET
                                content_en = excluded.content_en,
                                content_es = excluded.content_es,
                                content_hash = excluded.content_hash,
                                updated_at = unixepoch()`,
                        args: [tmdbId, mediaType, text, out, hashText(text)],
                    })
                } catch (e: any) {
                    console.error('translate: cache write failed:', e?.message)
                }
            }

            return { translated: out, source: model }
        } catch (e: any) {
            console.warn(`translate: ${model} failed — ${e?.message}`)
        }
    }

    // Nothing worked. The caller renders the English text; this is not an error
    // the reader should ever see.
    return { translated: null, source: 'exhausted' }
})


/**
 * Translates a list of texts in a single call. Returns an array aligned with
 * the input, with `null` wherever the model did not produce a usable
 * translation, so the caller can leave those in English individually rather
 * than discarding the whole batch.
 */
async function translateBatch(config: any, texts: string[]) {
    const apiKey = config.orApiKey
    const pending = texts.map((t, i) => ({ i, t: t.trim() })).filter((x) => x.t)
    if (!apiKey || !pending.length) return { translations: texts.map(() => null), source: 'skipped' }

    const db = getDb(config)
    let models: string[] = []
    try {
        await ensureModelTable(db)
        models = await getUsableModels(db)
    } catch { /* fall through to the seeds */ }
    for (const seed of SEED_MODELS) if (!models.includes(seed)) models.push(seed)

    const numbered: Record<number, string> = {}
    for (const { i, t } of pending) numbered[i] = t

    const prompt = `Traduce TODAS las siguientes reseñas cinematográficas al español latinoamericano. Preserva la voz de cada crítico.

Responde EXCLUSIVAMENTE con un JSON válido, con las mismas claves numéricas y los valores traducidos. Sin explicaciones, sin markdown, sin backticks.

${JSON.stringify(numbered, null, 2)}`

    for (const model of models) {
        try {
            const res = await $fetch<any>('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://es.cinemagoria.com',
                    'X-Title': 'Cinemagoria ES',
                },
                body: {
                    model,
                    temperature: 0.3,
                    messages: [
                        { role: 'system', content: TRANSLATE_SYSTEM_PROMPT },
                        { role: 'user', content: prompt },
                    ],
                },
                timeout: 45000,
            })

            const raw = String(res?.choices?.[0]?.message?.content ?? '').trim()
            if (!raw) continue
            const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
            const parsed = JSON.parse(cleaned)

            const out = texts.map((source, i) => {
                const value = parsed[i] ?? parsed[String(i)]
                if (typeof value !== 'string') return null
                return looksLikeSpanish(value, source) ? value : null
            })
            if (out.some(Boolean)) return { translations: out, source: model }
        } catch (e: any) {
            console.warn(`translate batch: ${model} failed — ${e?.message}`)
        }
    }

    return { translations: texts.map(() => null), source: 'exhausted' }
}
