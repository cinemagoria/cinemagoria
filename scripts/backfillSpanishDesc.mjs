#!/usr/bin/env node
/**
 * Fills the empty `spanish_desc` columns in the curated tables.
 *
 * These rows are what the homepage and the noir archive read directly, with no
 * translation at request time. Every one filled here is a synopsis that will
 * never cost a model call again, for any visitor.
 *
 * Order matters for cost: whatever a visitor has already had translated lives
 * in `overviews_cache`, so that is copied first and for free. Only what is left
 * reaches a model, and the result is written back to both tables so the runtime
 * path benefits too.
 *
 * Resumable: it only ever selects rows that are still empty, so it can be
 * stopped and re-run. `BACKFILL_LIMIT` bounds how many translations one run
 * performs — the free tier has a daily ceiling, and a scheduled run that stops
 * short of it finishes the remainder tomorrow instead of burning through the
 * quota and failing the rest.
 *
 * Env: OR_API_KEY, RSS_DB_URL, RSS_DB_TOKEN, BACKFILL_LIMIT (optional)
 */
import { createClient } from '@libsql/client'

const TABLES = ['hero_selections', 'noir_historical']
const SYSTEM = `Eres un traductor experto de cine y televisión. Traduces del inglés al español latinoamericano neutro.
- No traduzcas títulos de obras, nombres propios, lugares ni marcas.
- Prioriza la naturalidad sobre la literalidad.
- Responde EXCLUSIVAMENTE con la traducción. Sin encabezados, sin notas, sin razonamiento.`

function required(n) {
    const v = process.env[n]
    if (!v) { console.error(`✗ ${n} is not set.`); process.exit(1) }
    return v.trim()
}

function looksLikeSpanish(text, source) {
    if (!text) return false
    const t = text.trim()
    if (t.length < 8 || t === source.trim()) return false
    if (/^(here'?s|okay|sure|thinking|analysis|user safety|i (will|'ll)|traducción:|translation:)/i.test(t)) return false
    if (/\bthinking process\b|\*\*analyze\b/i.test(t)) return false
    const p = ` ${t.toLowerCase()} `
    const es = [' el ', ' la ', ' los ', ' las ', ' un ', ' una ', ' de ', ' que ', ' se ', ' con ', ' por ', ' para ', ' su ', ' en '].filter(m => p.includes(m)).length
    const en = [' the ', ' and ', ' with ', ' that ', ' his ', ' her ', ' from ', ' after '].filter(m => p.includes(m)).length
    return es >= 2 && en < 2
}

async function translate(text, models, key) {
    for (const model of models) {
        try {
            const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model, temperature: 0.3,
                    max_tokens: Math.min(2048, Math.ceil(text.length / 2) + 400),
                    messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: text }],
                }),
            })
            if (!res.ok) continue
            const out = String((await res.json())?.choices?.[0]?.message?.content ?? '').trim()
            if (looksLikeSpanish(out, text)) return { out, model }
        } catch { /* next model */ }
    }
    return null
}

async function main() {
    const key = required('OR_API_KEY')
    const db = createClient({ url: required('RSS_DB_URL'), authToken: required('RSS_DB_TOKEN') })

    const models = (await db.execute('SELECT id FROM translation_models WHERE usable=1 ORDER BY latency_ms'))
        .rows.map((r) => String(r.id))
    if (!models.length) { console.error('✗ The snapshot has no usable model. Run the refresh first.'); process.exit(1) }
    console.log(`→ ${models.length} models available\n`)

    const limit = Number(process.env.BACKFILL_LIMIT || 0) || Infinity
    let copied = 0, translated = 0, failed = 0, skipped = 0

    for (const table of TABLES) {
        const rows = (await db.execute(
            `SELECT t.tmdb_id, t.media_type, t.title, t.overview, c.content_es
             FROM ${table} t
             LEFT JOIN overviews_cache c ON c.tmdb_id = t.tmdb_id AND c.media_type = t.media_type
             WHERE t.spanish_desc IS NULL OR TRIM(t.spanish_desc) = ''`,
        )).rows

        console.log(`── ${table}: ${rows.length} rows to fill`)

        for (const row of rows) {
            const title = String(row.title ?? row.tmdb_id).slice(0, 42)
            const english = String(row.overview ?? '').trim()

            // Free: someone already had this translated at request time — but
            // only if it is a translation of the synopsis that is there now.
            // TMDB rewrites overviews, and a cache row keyed only by id would
            // otherwise hand over faithful Spanish for a text that no longer
            // exists.
            const cacheMatchesSource =
                row.content_es &&
                String(row.cached_en ?? '').trim() === english
            if (cacheMatchesSource) {
                await db.execute({
                    sql: `UPDATE ${table} SET spanish_desc = ?, desc_audited_at = ? WHERE tmdb_id = ? AND media_type = ?`,
                    args: [String(row.content_es), new Date().toISOString(), row.tmdb_id, row.media_type],
                })
                copied += 1
                console.log(`  ↺ ${title.padEnd(44)} from cache`)
                continue
            }

            if (!english) { skipped += 1; console.log(`  · ${title.padEnd(44)} no English source`); continue }

            if (translated >= limit) { console.log(`\n  reached BACKFILL_LIMIT (${limit}); the rest waits for the next run`); break }

            const result = await translate(english, models, key)
            if (!result) {
                failed += 1
                console.log(`  ✗ ${title.padEnd(44)} every model declined`)
                // Once the daily ceiling is hit every remaining row fails the
                // same way; stopping keeps the log readable and the run short.
                if (failed >= 12 && translated === 0) { console.log('\n  giving up: the tier looks exhausted'); break }
                continue
            }

            await db.batch([
                {
                    sql: `UPDATE ${table} SET spanish_desc = ?, desc_audited_at = ? WHERE tmdb_id = ? AND media_type = ?`,
                    args: [result.out, new Date().toISOString(), row.tmdb_id, row.media_type],
                },
                {
                    sql: `INSERT INTO overviews_cache (tmdb_id, media_type, content_en, content_es, content_hash)
                          VALUES (?, ?, ?, ?, 'backfill')
                          ON CONFLICT(tmdb_id, media_type) DO UPDATE SET
                            content_en = excluded.content_en,
                            content_es = excluded.content_es,
                            content_hash = excluded.content_hash,
                            updated_at = unixepoch()`,
                    args: [row.tmdb_id, row.media_type, english, result.out],
                },
            ], 'write')

            translated += 1
            console.log(`  ✓ ${title.padEnd(44)} ${result.model.split('/').pop()}`)
            await new Promise((r) => setTimeout(r, 700))
        }
    }

    console.log(`\n✓ copied ${copied} · translated ${translated} · no source ${skipped} · failed ${failed}`)
}

main().catch((e) => { console.error('✗ Backfill failed:', e?.message || e); process.exit(1) })
