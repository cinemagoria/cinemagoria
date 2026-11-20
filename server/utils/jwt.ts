import { createHmac, timingSafeEqual } from 'node:crypto'

export function verifiedUserId(authHeader: string | undefined, key: string): number | null {
    const m = /^Bearer\s+([\w-]+)\.([\w-]+)\.([\w-]+)$/.exec(authHeader || '')
    if (!m || !key) return null
    const expected = createHmac('sha256', key).update(`${m[1]}.${m[2]}`).digest()
    const given = Buffer.from(m[3], 'base64url')
    if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null
    try {
        const header = JSON.parse(Buffer.from(m[1], 'base64url').toString())
        const payload = JSON.parse(Buffer.from(m[2], 'base64url').toString())
        if (header.alg !== 'HS256' || payload.token_type !== 'access' || payload.user_id == null) return null
        const id = Number(payload.user_id)
        return Number.isInteger(id) ? id : null
    } catch {
        return null
    }
}
