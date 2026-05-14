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
