import { createClient, type Client } from '@libsql/client'

let _client: Client | null = null

export function useDb(): Client {
    const config = useRuntimeConfig()
    const dbUrl = config.rssDbUrl
    const dbToken = config.rssDbToken

    if (!dbUrl || !dbToken) {
        throw createError({ statusCode: 500, statusMessage: 'Database configuration missing' })
    }

    if (!_client) {
        _client = createClient({ url: dbUrl.trim(), authToken: dbToken.trim() })
    }

    return _client
}
