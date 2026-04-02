import { createClient } from '@libsql/client'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const dbUrl = config.rssDbUrl
    const dbToken = config.rssDbToken

    if (!dbUrl || !dbToken) {
        throw createError({ statusCode: 500, statusMessage: 'Database configuration missing' })
    }

    const userId = decodeURIComponent(event.context.params?.userId || '')
    const mediaType = event.context.params?.mediaType || ''
    const mediaId = event.context.params?.mediaId || ''

    if (!userId || !mediaType || !mediaId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing required parameters' })
    }

    if (!['movie', 'episode'].includes(mediaType)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid media_type' })
    }

    const db = createClient({ url: dbUrl.trim(), authToken: dbToken.trim() })

    try {
        await db.execute({
            sql: `DELETE FROM user_progress_tracking WHERE user_id = ? AND media_id = ? AND media_type = ?`,
            args: [userId, parseInt(mediaId), mediaType]
        })

        return { success: true }
    } catch (error: any) {
        console.error('[Progress DELETE] Error:', error.message || error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to delete progress' })
    }
})
