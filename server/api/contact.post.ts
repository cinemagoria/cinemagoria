import { createClient } from '@libsql/client'

function sanitize(str: string): string {
    return str
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/data:/gi, '')
        .trim()
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required fields'
        })
    }

    const cleanName = sanitize(String(name)).slice(0, 100)
    const cleanEmail = String(email).trim().slice(0, 254)
    const cleanSubject = subject ? sanitize(String(subject)).slice(0, 200) : null
    const cleanMessage = sanitize(String(message)).slice(0, 5000)

    if (!cleanName || !cleanMessage) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid input'
        })
    }

    if (!isValidEmail(cleanEmail)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid email address'
        })
    }

    const config = useRuntimeConfig()
    const dbUrl = config.rssDbUrl
    const dbToken = config.rssDbToken

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
        await db.execute({
            sql: 'INSERT INTO contact_form (name, email, subject, message) VALUES (?, ?, ?, ?)',
            args: [cleanName, cleanEmail, cleanSubject, cleanMessage]
        })
        return { success: true, message: 'Message sent successfully' }
    } catch (error) {
        console.error('Contact form error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error saving message'
        })
    }
})
