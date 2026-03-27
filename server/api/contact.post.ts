import { createClient } from '@libsql/client'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required fields'
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
            args: [name, email, subject || null, message]
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
