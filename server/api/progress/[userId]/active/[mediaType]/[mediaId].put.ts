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

    const body = await readBody(event)
    const flag = body?.manually_active ? 1 : 0

    const db = useDb()
    try {
        const res = await db.execute({
            sql: `UPDATE user_progress_tracking
                  SET manually_active = ?, updated_at = datetime('now')
                  WHERE user_id = ? AND media_id = ? AND media_type = ?`,
            args: [flag, userId, parseInt(mediaId), mediaType]
        })

        if (!res.rowsAffected) {
            throw createError({ statusCode: 404, statusMessage: 'Progress entry not found' })
        }
        return { success: true, manually_active: flag }
    } catch (error: any) {
        if (error?.statusCode) throw error
        console.error('[Progress Active PUT] Error:', error?.message || error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to update flag' })
    }
})
