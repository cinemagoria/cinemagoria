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

// Safety ceiling for a single query, set just under Cloud Run's 60s platform
// timeout. Turso is remote and occasionally has slow spells (cold connection /
// rate limiting) where even tiny queries take several seconds; the ceiling only
// exists to free the instance before the platform kills it at 60s, NOT to fail
// fast on normal slowness. Keep it generous so a transient Turso lag can't turn
// a working-but-slow page into a hard 500.
const DEFAULT_QUERY_TIMEOUT_MS = 45000

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
