import { useDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const userId = decodeURIComponent(event.context.params?.userId || '')
    const mediaType = event.context.params?.mediaType || ''
    const mediaId = event.context.params?.mediaId || ''

    if (!userId || !mediaType || !mediaId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing required parameters' })
    }

    if (!['movie', 'episode'].includes(mediaType)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid media_type' })
    }

    const db = useDb()

    try {
        const result = await db.execute({
            sql: `SELECT progress_percentage, elapsed_minutes, total_duration_minutes, updated_at
                  FROM user_progress_tracking
                  WHERE user_id = ? AND media_id = ? AND media_type = ?`,
            args: [userId, parseInt(mediaId), mediaType]
        })

        if (result.rows.length === 0) {
            return { found: false, progress_percentage: 0, elapsed_minutes: 0, total_duration_minutes: 0 }
        }

        const row = result.rows[0]
        return {
            found: true,
            progress_percentage: row.progress_percentage,
            elapsed_minutes: row.elapsed_minutes,
            total_duration_minutes: row.total_duration_minutes,
            updated_at: row.updated_at
        }
    } catch (error: any) {
        console.error('[Progress GET] Error:', error.message || error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch progress' })
    }
})
