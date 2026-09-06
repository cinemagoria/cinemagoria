#!/usr/bin/env node
/**
 * Probes OpenRouter's free catalogue and records which models can actually
 * translate into Spanish.
 *
 * WHY A PROBE AND NOT A LIST
 * The three models this project used to name were all retired from the
 * catalogue at the same time, and nothing noticed until translation had been
 * silently broken for a while. A list written by hand expires on its own; a
 * list discovered every day does not.
 *
 * WHY IT CHECKS THE OUTPUT AND NOT JUST THE STATUS
 * Two models in the current catalogue answer without translating: one replies
 * with a content-safety verdict, another with its own reasoning. Both return
 * 200 with a non-empty body. Accepting them would put that text into the
 * shared cache as the Spanish synopsis, where every visitor would then read it.
 *
 * Env: OR_API_KEY, RSS_DB_URL, RSS_DB_TOKEN
 */
import { createClient } from '@libsql/client'

const SAMPLE =
    'A washed-up detective returns to his hometown to investigate a series of disappearances that mirror a case he failed to solve twenty years ago.'
const SYSTEM =
    'Traduce al español latinoamericano neutro. Responde ÚNICAMENTE con la traducción, sin encabezados ni explicaciones.'

function required(name) {
    const v = process.env[name]
    if (!v) {
        console.error(`✗ ${name} is not set.`)
        process.exit(1)
    }
    return v.trim()
}

// Mirrors server/utils/translation.ts. Kept in step by the shared sample: if
// one accepts a model the other would reject, the probe result is wrong.
function looksLikeSpanish(text, source) {
    if (!text) return false
    const t = text.trim()
    if (t.length < 8 || t === source.trim()) return false
    if (/^(here'?s|okay|sure|thinking|analysis|user safety|i (will|'ll)|traducción:|translation:)/i.test(t)) return false
    if (/\bthinking process\b|\*\*analyze\b/i.test(t)) return false
    const padded = ` ${t.toLowerCase()} `
    const hits = [' el ', ' la ', ' los ', ' las ', ' un ', ' una ', ' de ', ' que ', ' se ', ' con ', ' por ', ' para ', ' su ', ' en ']
        .filter((m) => padded.includes(m)).length
    if (hits < 2) return false
    const english = [' the ', ' and ', ' with ', ' that ', ' his ', ' her ', ' from ', ' after ']
        .filter((m) => padded.includes(m)).length
    return english < 2
}

async function probe(model, key) {
    const started = Date.now()
    try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model,
                temperature: 0.3,
                max_tokens: 300,
                messages: [
                    { role: 'system', content: SYSTEM },
                    { role: 'user', content: SAMPLE },
                ],
            }),
        })
        const ms = Date.now() - started
        if (!res.ok) return { usable: false, ms, reason: `HTTP ${res.status}` }
        const body = await res.json()
        const out = String(body?.choices?.[0]?.message?.content ?? '').trim()
        if (!out) return { usable: false, ms, reason: 'empty response' }
        if (!looksLikeSpanish(out, SAMPLE)) {
            return { usable: false, ms, reason: `not a translation: ${out.slice(0, 60)}` }
        }
        return { usable: true, ms, reason: null }
    } catch (e) {
        return { usable: false, ms: Date.now() - started, reason: e.message.slice(0, 120) }
    }
}

async function main() {
    const key = required('OR_API_KEY')
    const db = createClient({ url: required('RSS_DB_URL'), authToken: required('RSS_DB_TOKEN') })

    const catalogue = await (await fetch('https://openrouter.ai/api/v1/models')).json()
    const models = catalogue.data.filter((m) => m.id.endsWith(':free')).map((m) => m.id).sort()
    if (!models.length) {
        // A bad day at OpenRouter must not wipe a good snapshot.
        console.error('✗ The catalogue returned no free models. Leaving the snapshot untouched.')
        process.exit(1)
    }

    console.log(`→ probing ${models.length} free models`)
    const rows = []
    for (const model of models) {
        const r = await probe(model, key)
        rows.push({ model, ...r })
        console.log(`  ${r.usable ? '✓' : '✗'} ${model.padEnd(50)} ${String(r.ms).padStart(5)}ms  ${r.reason ?? ''}`)
        await new Promise((r) => setTimeout(r, 900))
    }

    const usable = rows.filter((r) => r.usable)
    if (!usable.length) {
        console.error('✗ No model translated correctly. Leaving the previous snapshot in place.')
        process.exit(1)
    }

    await db.execute(`CREATE TABLE IF NOT EXISTS translation_models (
        id TEXT PRIMARY KEY, label TEXT, usable INTEGER NOT NULL DEFAULT 0,
        latency_ms INTEGER, reason TEXT, checked_at TEXT NOT NULL)`)

    const checkedAt = new Date().toISOString()
    await db.batch(
        [
            { sql: 'DELETE FROM translation_models', args: [] },
            ...rows.map((r) => ({
                sql: `INSERT INTO translation_models (id, label, usable, latency_ms, reason, checked_at)
                      VALUES (?, ?, ?, ?, ?, ?)`,
                args: [r.model, r.model.split('/').pop(), r.usable ? 1 : 0, r.ms, r.reason, checkedAt],
            })),
        ],
        'write',
    )

    console.log(`\n✓ ${usable.length}/${models.length} usable. Fastest: ${usable.sort((a, b) => a.ms - b.ms)[0].model}`)
}

main().catch((e) => {
    console.error('✗ Refresh failed:', e?.message || e)
    process.exit(1)
})
