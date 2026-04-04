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
    const percentage = Math.min(100, Math.max(0, Math.round(body.progress_percentage || 0)))
    const elapsed = Math.max(0, Math.round(body.elapsed_minutes || 0))
    const total = Math.max(0, Math.round(body.total_duration_minutes || 0))

    // Extensions for TV Series tracking
    const tvId = body.tv_id || null;
    const seasonNumber = body.season_number || null;
    const episodeNumber = body.episode_number || null;

    const db = useDb()

    try {
        await db.execute({
            sql: `INSERT INTO user_progress_tracking (user_id, media_id, media_type, progress_percentage, elapsed_minutes, total_duration_minutes, tv_id, season_number, episode_number, updated_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
                  ON CONFLICT(user_id, media_id, media_type)
                  DO UPDATE SET progress_percentage = excluded.progress_percentage,
                                elapsed_minutes = excluded.elapsed_minutes,
                                total_duration_minutes = excluded.total_duration_minutes,
                                tv_id = excluded.tv_id,
                                season_number = excluded.season_number,
                                episode_number = excluded.episode_number,
                                updated_at = datetime('now')`,
            args: [userId, parseInt(mediaId), mediaType, percentage, elapsed, total, tvId ? parseInt(tvId) : null, seasonNumber ? parseInt(seasonNumber) : null, episodeNumber ? parseInt(episodeNumber) : null]
        })

        return { success: true, progress_percentage: percentage, elapsed_minutes: elapsed, total_duration_minutes: total, tv_id: tvId, season_number: seasonNumber, episode_number: episodeNumber }
    } catch (error: any) {
        console.error('[Progress PUT] Error:', error.message || error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to save progress' })
    }
})
