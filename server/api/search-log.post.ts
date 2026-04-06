import { createClient } from '@libsql/client'

export default defineEventHandler(async (event) => {
    const body = await readBody<{ query?: string; analytics?: boolean; email?: string }>(event) || {}
    const { query, analytics } = body

    if (!query || typeof query !== 'string') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing search query'
        })
    }

    const cleanQuery = query.replace(/[<>]/g, '').trim().slice(0, 300)

    if (!cleanQuery) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid query'
        })
    }

    const config = useRuntimeConfig()
    const dbUrl = config.rssDbUrl as string | undefined
    const dbToken = config.rssDbToken as string | undefined

    if (!dbUrl || !dbToken) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Database configuration missing'
        })
    }

    const db = createClient({
        url: dbUrl.trim(),
        authToken: dbToken.trim()
    })

    try {
        let origin: string | null = null
        let email: string | null = null

        if (analytics) {
            const forwarded = getHeader(event, 'x-forwarded-for')
            const cfOrigin = getHeader(event, 'cf-connecting-ip')
            origin = cfOrigin ?? (forwarded?.split(',')[0]?.trim() ?? null)
            email = typeof body.email === 'string' && body.email ? body.email.trim().slice(0, 254) : 'anonymous'
        }

        await db.execute({
            sql: 'INSERT INTO search_queries (query, origin, email) VALUES (?, ?, ?)',
            args: [cleanQuery, origin, email]
        })

        return { success: true }
    } catch (error) {
        console.error('Search log error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error logging search'
        })
    }
})
