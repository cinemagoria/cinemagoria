import { useDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const userId = decodeURIComponent(event.context.params?.userId || '')

    if (!userId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing user ID' })
    }

    const query = getQuery(event)
    const tvId = query.tv_id != null && query.tv_id !== '' ? Number(query.tv_id) : null
    const countOnly = query.count === '1' || query.count === 'true'

    if (tvId != null && !Number.isFinite(tvId)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid tv_id' })
    }

    const db = useDb()

    try {
        if (countOnly) {
            const result = await db.execute({
                sql: `SELECT COUNT(DISTINCT CASE
                            WHEN media_type = 'episode' THEN 'tv_' || tv_id
                            ELSE 'movie_' || media_id
                        END) AS tracked_titles
                      FROM user_progress_tracking
                      WHERE user_id = ?`,
                args: [userId]
            })
            return { count: Number((result.rows[0] as any)?.tracked_titles) || 0 }
        }

        const columns = `media_id, media_type, progress_percentage, elapsed_minutes, total_duration_minutes, tv_id, season_number, episode_number, updated_at`

        const result = tvId != null
            ? await db.execute({
                sql: `SELECT ${columns}
                      FROM user_progress_tracking
                      WHERE user_id = ? AND media_type = 'episode' AND tv_id = ?
                      ORDER BY updated_at DESC`,
                args: [userId, tvId]
            })
            : await db.execute({
                sql: `SELECT ${columns}
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
