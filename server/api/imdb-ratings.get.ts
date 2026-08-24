import { createClient, type Client } from '@libsql/client'

let client: Client | null = null

const MAX_IDS = 60

export default defineEventHandler(async (event) => {
    setResponseHeaders(event, {
        "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Expose-Headers": "*",
        "Cache-Control": "public, max-age=86400, s-maxage=86400"
    })

    if (getMethod(event) === 'OPTIONS') {
        event.node.res.statusCode = 204
        return
    }

    const raw = String(getQuery(event).ids || '').trim()
    if (!raw) return { ratings: {} }

    const ids = [...new Set(
        raw.split(',').map((value) => value.trim()).filter((value) => /^tt\d+$/.test(value))
    )].slice(0, MAX_IDS)

    if (!ids.length) return { ratings: {} }

    const config = useRuntimeConfig()
    if (!config.imdbDbUrl || !config.imdbDbToken) return { ratings: {} }

    if (!client) {
        client = createClient({
            url: String(config.imdbDbUrl).trim(),
            authToken: String(config.imdbDbToken).trim(),
        })
    }

    try {
        const result = await client.execute({
            sql: `SELECT tconst, average_rating, num_votes FROM imdb_ratings WHERE tconst IN (${ids.map(() => '?').join(',')})`,
            args: ids,
        })

        const ratings: Record<string, { found: boolean; score: number; votes: number; source: string }> = {}

        for (const row of result.rows || []) {
            if (!row || !row.tconst) continue
            ratings[String(row.tconst)] = {
                found: true,
                score: row.average_rating ? parseFloat(String(row.average_rating)) : 0,
                votes: row.num_votes ? parseInt(String(row.num_votes)) : 0,
                source: 'imdb',
            }
        }

        return { ratings }
    } catch (error: any) {
        return { ratings: {}, error: error.message || 'Unknown error' }
    }
})
