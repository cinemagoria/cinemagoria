import {
    TRANSLATE_SYSTEM_PROMPT,
    fetchFreeCatalogue,
    getDb,
    hashText,
    isSpanish,
    looksLikeSpanish,
    rankedModels,
} from '../utils/translation'

/**
 * Translates to Spanish, cache first.
 *
 * Everything that is not the provider call is kept off this path. The reader is
 * waiting on it, and the measurements that prompted this had the endpoint
 * taking five to eleven seconds for a model that answers in well under one:
 * the difference was a schema statement, a catalogue fetch and two database
 * round-trips performed on every request.
 *
 * The curated tables take part in both directions. `spanish_desc` is read as a
 * source, so a description already written by hand or by the backfill costs
 * nothing; and it is written as a destination, so translating a title on its
 * own page also fills the homepage hero, which used to stay in English.
 */

// A model that has not answered by now is not going to rescue the request; the
// next one in the list is a better bet than waiting.
const MODEL_TIMEOUT_MS = 12000

type Source = { content_en: unknown; content_es: unknown }

/**
 * One query for every place a translation might already exist.
 *
 * Each row carries the text it was made from, because these tables are keyed by
 * title: TMDB rewrites overviews, and a translation of a synopsis that is no
 * longer on the page is worse than no translation at all.
 */
async function findExisting(db: any, tmdbId: number, mediaType: string, text: string) {
    const res = await db.execute({
        sql: `SELECT content_en, content_es FROM overviews_cache WHERE tmdb_id = ? AND media_type = ?
              UNION ALL
              SELECT overview, spanish_desc FROM hero_selections WHERE tmdb_id = ? AND media_type = ?
              UNION ALL
              SELECT overview, spanish_desc FROM noir_historical WHERE tmdb_id = ? AND media_type = ?`,
        args: [tmdbId, mediaType, tmdbId, mediaType, tmdbId, mediaType],
    })
    for (const row of res.rows as unknown as Source[]) {
        const es = String(row.content_es ?? '').trim()
        const en = String(row.content_en ?? '').trim()
        if (es && en === text) return es
    }
    return null
}

/**
 * Stores the result everywhere it belongs, in one round-trip. The curated
 * columns are only filled when they are empty: a description written by hand
 * outranks anything a model produces.
 */
function persist(db: any, tmdbId: number, mediaType: string, en: string, es: string) {
    return db.batch(
        [
            {
                sql: `INSERT INTO overviews_cache (tmdb_id, media_type, content_en, content_es, content_hash)
                      VALUES (?, ?, ?, ?, ?)
                      ON CONFLICT(tmdb_id, media_type) DO UPDATE SET
                        content_en = excluded.content_en,
                        content_es = excluded.content_es,
                        content_hash = excluded.content_hash,
                        updated_at = unixepoch()`,
                args: [tmdbId, mediaType, en, es, hashText(en)],
            },
            {
                sql: `UPDATE hero_selections SET spanish_desc = ?
                      WHERE tmdb_id = ? AND media_type = ?
                        AND (spanish_desc IS NULL OR TRIM(spanish_desc) = '')`,
                args: [es, tmdbId, mediaType],
            },
            {
                sql: `UPDATE noir_historical SET spanish_desc = ?
                      WHERE tmdb_id = ? AND media_type = ?
                        AND (spanish_desc IS NULL OR TRIM(spanish_desc) = '')`,
                args: [es, tmdbId, mediaType],
            },
        ],
        'write',
    )
}

async function callModel(apiKey: string, model: string, messages: any[], maxTokens?: number) {
    const res = await $fetch<any>('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://es.cinemagoria.com',
            'X-Title': 'Cinemagoria ES',
        },
        body: { model, temperature: 0.3, ...(maxTokens ? { max_tokens: maxTokens } : {}), messages },
        timeout: MODEL_TIMEOUT_MS,
    })
    return String(res?.choices?.[0]?.message?.content ?? '').trim()
}

/** Snapshot first; the live catalogue only when the snapshot cannot carry it. */
async function models(db: any): Promise<string[]> {
    const ranked = await rankedModels(db)
    if (ranked.length) return ranked
    return await fetchFreeCatalogue()
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)
    const db = getDb(config)

    if (Array.isArray(body?.texts)) {
        return await translateBatch(config, db, body.texts.map((t: any) => String(t ?? '')))
    }

    const text: string = String(body?.text ?? '').trim()
    if (!text) throw createError({ statusCode: 400, statusMessage: 'text is required' })

    // TMDB serves some text already translated. Spending a call to reproduce it
    // is the cheapest waste there is to remove.
    if (isSpanish(text)) return { translated: text, source: 'already-spanish' }

    const tmdbId = body?.tmdbId ? Number(body.tmdbId) : null
    const mediaType: string | null = body?.mediaType ? String(body.mediaType) : null
    const cacheable = Boolean(tmdbId && mediaType)

    if (cacheable) {
        try {
            const existing = await findExisting(db, tmdbId as number, mediaType as string, text)
            if (existing) return { translated: existing, source: 'stored' }
        } catch (e: any) {
            console.error('translate: lookup failed:', e?.message)
        }
    }

    const apiKey = config.orApiKey
    if (!apiKey) return { translated: null, source: 'unconfigured' }

    const maxTokens = Math.min(2048, Math.ceil(text.length / 2) + 400)
    for (const model of await models(db)) {
        try {
            const out = await callModel(apiKey, model, [
                { role: 'system', content: TRANSLATE_SYSTEM_PROMPT },
                { role: 'user', content: text },
            ], maxTokens)

            // Answering is not the same as translating: some models reply with
            // a safety verdict or with their own reasoning.
            if (!looksLikeSpanish(out, text)) {
                console.warn(`translate: ${model} did not return a translation`)
                continue
            }

            if (cacheable) {
                try {
                    await persist(db, tmdbId as number, mediaType as string, text, out)
                } catch (e: any) {
                    console.error('translate: write failed:', e?.message)
                }
            }
            return { translated: out, source: model }
        } catch (e: any) {
            console.warn(`translate: ${model} failed — ${e?.message}`)
        }
    }

    // The caller renders the English text. This is not an error the reader sees.
    return { translated: null, source: 'exhausted' }
})

/**
 * Several texts in one call, answered as a numbered object. One request for N
 * reviews rather than N requests is the difference between a page of them
 * costing one model call and costing eight.
 */
async function translateBatch(config: any, db: any, texts: string[]) {
    const apiKey = config.orApiKey

    // Anything already in Spanish is returned untouched and never reaches a
    // model; only the rest is sent.
    const result: (string | null)[] = texts.map((t) => (isSpanish(t) ? t : null))
    const pending = texts
        .map((t, i) => ({ i, t: t.trim() }))
        .filter((x) => x.t && result[x.i] === null)

    if (!apiKey || !pending.length) {
        return { translations: result, source: pending.length ? 'unconfigured' : 'already-spanish' }
    }

    const numbered: Record<number, string> = {}
    for (const { i, t } of pending) numbered[i] = t

    const prompt = `Traduce TODAS las siguientes reseñas cinematográficas al español latinoamericano. Preserva la voz de cada crítico.

Responde EXCLUSIVAMENTE con un JSON válido, con las mismas claves numéricas y los valores traducidos. Sin explicaciones, sin markdown, sin backticks.

${JSON.stringify(numbered, null, 2)}`

    for (const model of await models(db)) {
        try {
            const raw = await callModel(apiKey, model, [
                { role: 'system', content: TRANSLATE_SYSTEM_PROMPT },
                { role: 'user', content: prompt },
            ])
            if (!raw) continue
            const parsed = JSON.parse(
                raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim(),
            )

            let filled = false
            for (const { i, t } of pending) {
                const value = parsed[i] ?? parsed[String(i)]
                if (typeof value === 'string' && looksLikeSpanish(value, t)) {
                    result[i] = value
                    filled = true
                }
            }
            if (filled) return { translations: result, source: model }
        } catch (e: any) {
            console.warn(`translate batch: ${model} failed — ${e?.message}`)
        }
    }

    return { translations: result, source: 'exhausted' }
}
