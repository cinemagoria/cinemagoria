#!/usr/bin/env node
/**
 * Probes OpenRouter's free catalogue and records which models can actually
 * translate into Spanish.
 *
 * WHAT IT DOES *NOT* DO ANY MORE
 * It used to probe every free model on every run — nineteen requests, better
 * than a third of the free tier's daily allowance, spent translating a sample
 * sentence nobody reads in order to learn what live traffic already teaches.
 * The endpoint now records the outcome of every real translation, so a model
 * that readers are exercising needs no probing at all.
 *
 * What is left for this job is the gap that traffic cannot cover: models that
 * have just appeared in the catalogue and have never been tried, and models
 * nobody has exercised in days. Both are rare, so most runs send nothing.
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
        if (!res.ok) {
            // The free-tier ceiling is reported as a 429 on every model, so it
            // says nothing about this one.
            return { usable: false, ms, reason: `HTTP ${res.status}`, quota: res.status === 429 }
        }
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
    const all = catalogue.data.filter((m) => m.id.endsWith(':free')).map((m) => m.id).sort()

    // Only what traffic cannot have told us. A cap on top of that, so this job
    // can never be the reason a reader finds the allowance gone.
    const STALE_AFTER_DAYS = 4
    const MAX_PROBES = 5
    const known = new Map(
        (await db.execute('SELECT id, checked_at FROM translation_models')).rows
            .map((r) => [String(r.id), String(r.checked_at ?? '')]),
    )
    const cutoff = Date.now() - STALE_AFTER_DAYS * 24 * 60 * 60 * 1000
    const models = all
        .filter((id) => {
            const seen = known.get(id)
            if (!seen) return true // never tried
            return new Date(seen).getTime() < cutoff // nobody has exercised it in days
        })
        .slice(0, MAX_PROBES)

    console.log(`→ ${all.length} free models listed · ${known.size} already known · probing ${models.length}`)
    if (!models.length) {
        console.log('✓ Nothing to probe: live traffic is keeping the snapshot current.')
        return
    }
    if (!all.length) {
        // A bad day at OpenRouter must not wipe a good snapshot.
        console.error('✗ The catalogue returned no free models. Leaving the snapshot untouched.')
        process.exit(1)
    }

    const rows = []
    let quotaStrike = 0
    for (const model of models) {
        const r = await probe(model, key)
        rows.push({ model, ...r })
        console.log(`  ${r.usable ? '✓' : '✗'} ${model.padEnd(50)} ${String(r.ms).padStart(5)}ms  ${r.reason ?? ''}`)

        // The allowance is shared across every free model, so once a few in a
        // row refuse there is nothing left to learn — and each further probe
        // spends a request from an allowance that is already empty.
        quotaStrike = r.quota ? quotaStrike + 1 : 0
        if (quotaStrike >= 3) {
            console.log('\n  the free allowance is spent; stopping rather than probing the rest')
            break
        }
        await new Promise((r) => setTimeout(r, 900))
    }

    // Nothing answered at all: this is a day without allowance, not a broken
    // catalogue. The snapshot stays as it was and the run is not a failure —
    // a red mark every such morning would only teach us to ignore it.
    if (rows.every((r) => r.quota)) {
        console.log('✓ No allowance today. The previous snapshot is untouched.')
        return
    }

    const usable = rows.filter((r) => r.usable)

    await db.execute(`CREATE TABLE IF NOT EXISTS translation_models (
        id TEXT PRIMARY KEY, label TEXT, usable INTEGER NOT NULL DEFAULT 0,
        latency_ms INTEGER, reason TEXT, checked_at TEXT NOT NULL)`)

    const checkedAt = new Date().toISOString()
    // Upsert rather than replace: live traffic writes to this table too, and a
    // wholesale delete would throw away everything readers have proven since.
    await db.batch(
        [
            ...rows.map((r) => ({
                sql: `INSERT INTO translation_models (id, label, usable, latency_ms, reason, checked_at)
                      VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                  usable = excluded.usable, latency_ms = excluded.latency_ms,
                  reason = excluded.reason, checked_at = excluded.checked_at`,
                args: [r.model, r.model.split('/').pop(), r.usable ? 1 : 0, r.ms, r.reason, checkedAt],
            })),
        ],
        'write',
    )

    console.log(`\n✓ probed ${rows.length}, ${usable.length} usable`)
}

main().catch((e) => {
    console.error('✗ Refresh failed:', e?.message || e)
    process.exit(1)
})
