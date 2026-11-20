import { useDb } from '~/server/utils/db'
import { verifiedUserId } from '~/server/utils/jwt'

const JWT_SIGNING_KEY = process.env.JWT_SIGNING_KEY || ''

export default defineEventHandler(async (event) => {
    const m = event.path.match(/^\/api\/progress\/([^/?]+)/)
    if (!m || !JWT_SIGNING_KEY) return

    const id = verifiedUserId(getHeader(event, 'authorization'), JWT_SIGNING_KEY)
    const row = id == null
        ? null
        : (await useDb().execute({ sql: 'SELECT email FROM users_drf WHERE id = ?', args: [id] })).rows[0]

    if (!row || String(row.email).toLowerCase() !== decodeURIComponent(m[1]).toLowerCase()) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
})
