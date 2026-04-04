import { useDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const userId = decodeURIComponent(event.context.params?.userId || '')

    if (!userId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing user ID' })
    }

    const body = await readBody(event)
    const episodes = body.episodes
    const percentage = Math.min(100, Math.max(0, Math.round(body.percentage ?? 100)))

    if (!Array.isArray(episodes) || episodes.length === 0) {
        throw createError({ statusCode: 400, statusMessage: 'episodes array is required' })
    }

    if (episodes.length > 500) {
        throw createError({ statusCode: 400, statusMessage: 'Too many episodes (max 500)' })
    }

    const db = useDb()

    try {
        const batch = episodes.map((ep: any) => {
            const dur = Math.max(0, Math.round(ep.runtime || 0))
            const elapsed = dur ? Math.round(dur * percentage / 100) : 0
            return {
                sql: `INSERT INTO user_progress_tracking
                      (user_id, media_id, media_type, progress_percentage, elapsed_minutes, total_duration_minutes, tv_id, season_number, episode_number, updated_at)
                      VALUES (?, ?, 'episode', ?, ?, ?, ?, ?, ?, datetime('now'))
                      ON CONFLICT(user_id, media_id, media_type)
                      DO UPDATE SET progress_percentage = excluded.progress_percentage,
                                    elapsed_minutes = excluded.elapsed_minutes,
                                    total_duration_minutes = excluded.total_duration_minutes,
                                    updated_at = datetime('now')`,
                args: [
                    userId,
                    parseInt(ep.media_id),
                    percentage,
                    elapsed,
                    dur,
                    parseInt(ep.tv_id),
                    parseInt(ep.season_number),
                    parseInt(ep.episode_number)
                ]
            }
        })

        await db.batch(batch, 'write')

        return { success: true, updated: episodes.length, percentage }
    } catch (error: any) {
        console.error('[Progress Batch PUT] Error:', error.message || error)
        throw createError({ statusCode: 500, statusMessage: 'Batch update failed' })
    }
})
