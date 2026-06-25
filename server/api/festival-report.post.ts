import { createClient } from '@libsql/client'

const VALID_ISSUE_TYPES = new Set(['missing', 'incorrect', 'section_date', 'other'])
const VALID_LOCALES = new Set(['en', 'es'])

function sanitize(str: string): string {
    let result = str
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/vbscript:/gi, '')
        .replace(/data:/gi, '')

    let prev = ''
    while (prev !== result) {
        prev = result
        result = result.replace(/on\w+\s*=/gi, '')
    }

    return result.trim()
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const {
        festival_slug,
        festival_name,
        locale,
        issue_type,
        description,
        reporter_name,
        reporter_email
    } = body || {}

    if (!festival_slug || !issue_type || !description) {
        throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
    }

    if (!VALID_ISSUE_TYPES.has(issue_type)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid issue type' })
    }

    const cleanLocale = VALID_LOCALES.has(locale) ? locale : 'en'
    const cleanSlug = sanitize(String(festival_slug)).slice(0, 120)
    const cleanName = festival_name ? sanitize(String(festival_name)).slice(0, 200) : null
    const cleanDescription = sanitize(String(description)).slice(0, 2000)
    const cleanReporterName = reporter_name ? sanitize(String(reporter_name)).slice(0, 100) : null
    const rawEmail = reporter_email ? String(reporter_email).trim().slice(0, 254) : null
    const cleanEmail = rawEmail && isValidEmail(rawEmail) ? rawEmail : null

    if (!cleanSlug) {
        throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
    }

    if (cleanDescription.length < 5) {
        throw createError({ statusCode: 400, statusMessage: 'Description is too short' })
    }

    const userAgent = (getRequestHeader(event, 'user-agent') || '').slice(0, 500)

    const config = useRuntimeConfig()
    const dbUrl = (config.rssDbUrl || '').trim()
    const dbToken = (config.rssDbToken || '').trim()

    if (!dbUrl || !dbToken) {
        throw createError({ statusCode: 500, statusMessage: 'Database configuration missing' })
    }

    const db = createClient({ url: dbUrl, authToken: dbToken })

    try {
        await db.execute({
            sql: `INSERT INTO festival_reports
                  (festival_slug, festival_name, locale, issue_type, description,
                   reporter_name, reporter_email, user_agent)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                cleanSlug,
                cleanName,
                cleanLocale,
                issue_type,
                cleanDescription,
                cleanReporterName,
                cleanEmail,
                userAgent
            ]
        })
        return { success: true, message: 'Report received' }
    } catch (error) {
        console.error('[Festival Report] DB error:', error)
        throw createError({ statusCode: 500, statusMessage: 'Could not save the report' })
    }
})
