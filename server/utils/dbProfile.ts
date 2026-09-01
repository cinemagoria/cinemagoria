import type { Client, InStatement } from '@libsql/client'

const MAX_SHAPES = 200
const DEFAULT_FLUSH_INTERVAL_MS = 60000
const FLUSH_EVERY_CALLS = 300
const TOP_N = 15
const FINGERPRINT_MAX_CHARS = 140

type ShapeStats = { calls: number; rows: number; ms: number; maxMs: number }

const shapes = new Map<string, ShapeStats>()
let windowStartedAt = Date.now()
let droppedShapes = 0
let callsSinceFlush = 0

const enabled = () => process.env.DB_PROFILE !== 'off'

function flushIntervalMs(): number {
    const raw = Number(process.env.DB_PROFILE_WINDOW_MS)
    return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_FLUSH_INTERVAL_MS
}

function fingerprint(stmt: InStatement | string): string {
    const sql = typeof stmt === 'string' ? stmt : String(stmt?.sql || '')
    return sql
        .replace(/\s+/g, ' ')
        .replace(/'[^']*'/g, '?')
        .replace(/\b\d+\b/g, '?')
        .trim()
        .slice(0, FINGERPRINT_MAX_CHARS)
}

function flushIfDue(): void {
    const now = Date.now()
    const elapsed = now - windowStartedAt
    if (shapes.size === 0) return
    if (elapsed < flushIntervalMs() && callsSinceFlush < FLUSH_EVERY_CALLS) return

    let calls = 0
    let rows = 0
    let ms = 0
    for (const stat of shapes.values()) {
        calls += stat.calls
        rows += stat.rows
        ms += stat.ms
    }

    const top = [...shapes.entries()]
        .sort((a, b) => b[1].ms - a[1].ms)
        .slice(0, TOP_N)
        .map(([sql, stat]) => ({
            sql,
            calls: stat.calls,
            rows: stat.rows,
            ms: Math.round(stat.ms),
            maxMs: Math.round(stat.maxMs),
            avgRows: Math.round(stat.rows / stat.calls),
        }))

    console.log(`[dbprofile] ${JSON.stringify({
        windowSec: Math.round(elapsed / 1000),
        distinctShapes: shapes.size,
        droppedShapes,
        calls,
        rows,
        ms: Math.round(ms),
        top,
    })}`)

    shapes.clear()
    droppedShapes = 0
    callsSinceFlush = 0
    windowStartedAt = now
}

function record(key: string, rows: number, ms: number): void {
    let stat = shapes.get(key)
    if (!stat) {
        if (shapes.size >= MAX_SHAPES) {
            droppedShapes++
            callsSinceFlush++
            flushIfDue()
            return
        }
        stat = { calls: 0, rows: 0, ms: 0, maxMs: 0 }
        shapes.set(key, stat)
    }
    stat.calls++
    stat.rows += rows
    stat.ms += ms
    if (ms > stat.maxMs) stat.maxMs = ms
    callsSinceFlush++
    flushIfDue()
}

export function profileClient(client: Client): Client {
    if (!enabled()) return client

    return new Proxy(client, {
        get(target, prop) {
            if (prop === 'execute') {
                return async (...args: any[]) => {
                    const startedAt = Date.now()
                    try {
                        const result = await (target as any).execute(...args)
                        record(fingerprint(args[0]), result?.rows?.length || 0, Date.now() - startedAt)
                        return result
                    } catch (error) {
                        record(`${fingerprint(args[0])} [error]`, 0, Date.now() - startedAt)
                        throw error
                    }
                }
            }

            if (prop === 'batch') {
                return async (...args: any[]) => {
                    const startedAt = Date.now()
                    const statements: any[] = Array.isArray(args[0]) ? args[0] : []
                    try {
                        const results = await (target as any).batch(...args)
                        const elapsed = Date.now() - startedAt
                        const share = statements.length ? elapsed / statements.length : elapsed
                        statements.forEach((stmt, index) => {
                            record(fingerprint(stmt), results?.[index]?.rows?.length || 0, share)
                        })
                        return results
                    } catch (error) {
                        record(`BATCH(${statements.length}) [error]`, 0, Date.now() - startedAt)
                        throw error
                    }
                }
            }

            const value = (target as any)[prop]
            return typeof value === 'function' ? value.bind(target) : value
        },
    })
}
