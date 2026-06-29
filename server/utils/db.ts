import { createClient, type Client } from '@libsql/client'

let _client: Client | null = null

export function useDb(): Client {
    const config = useRuntimeConfig()
    const dbUrl = (config.rssDbUrl as string | undefined) || (config.imdbDbUrl as string | undefined)
    const dbToken = (config.rssDbToken as string | undefined) || (config.imdbDbToken as string | undefined)

    if (!dbUrl || !dbToken) {
        throw createError({ statusCode: 500, statusMessage: 'Database configuration missing' })
    }

    if (!_client) {
        _client = createClient({ url: dbUrl.trim(), authToken: dbToken.trim() })
    }

    return _client
}

// Default hard ceiling for a single query. Turso is remote, and a slow scan
// (e.g. an unindexed `LIKE '%...%'` news search) used to hang until Cloud Run's
// 60s platform timeout, holding the instance open and surfacing as intermittent
// 504s on the homepage and /api/news. Failing fast frees the instance and the
// Turso connection so one slow query can't cascade into a dead page.
const DEFAULT_QUERY_TIMEOUT_MS = 8000

export async function dbExecute(
    stmt: Parameters<Client['execute']>[0],
    timeoutMs: number = DEFAULT_QUERY_TIMEOUT_MS,
): Promise<Awaited<ReturnType<Client['execute']>>> {
    const db = useDb()
    let timer: ReturnType<typeof setTimeout> | undefined
    const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(
            () => reject(createError({ statusCode: 504, statusMessage: 'Database query timeout' })),
            timeoutMs,
        )
    })
    try {
        return await Promise.race([db.execute(stmt as any), timeout]) as Awaited<ReturnType<Client['execute']>>
    } finally {
        if (timer) clearTimeout(timer)
    }
}
