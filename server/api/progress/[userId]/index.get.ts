import { createClient } from '@libsql/client'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const dbUrl = config.rssDbUrl
    const dbToken = config.rssDbToken

    if (!dbUrl || !dbToken) {
        throw createError({ statusCode: 500, statusMessage: 'Database configuration missing' })
    }

    const userId = decodeURIComponent(event.context.params?.userId || '')

    if (!userId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing user ID' })
    }

    const db = createClient({ url: dbUrl.trim(), authToken: dbToken.trim() })

    try {
        const result = await db.execute({
            sql: `SELECT media_id, media_type, progress_percentage, elapsed_minutes, total_duration_minutes, tv_id, season_number, episode_number, updated_at
                  FROM user_progress_tracking
                  WHERE user_id = ?
                  ORDER BY updated_at DESC`,
            args: [userId]
        })

        return result.rows
    } catch (error: any) {
        console.error('[Progress List GET] Error:', error.message || error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch user progress list' })
    }
})
