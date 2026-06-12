import { createClient } from '@libsql/client'

const VALID_ISSUE_TYPES = new Set(['date', 'title', 'information', 'other'])
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
        article_id,
        article_slug,
        article_title,
        locale,
        issue_type,
        description,
        reporter_name,
        reporter_email
    } = body || {}

    if (!article_slug || !issue_type || !description) {
        throw createError({ statusCode: 400, statusMessage: 'Faltan campos requeridos' })
    }

    if (!VALID_ISSUE_TYPES.has(issue_type)) {
        throw createError({ statusCode: 400, statusMessage: 'Tipo de error inválido' })
    }

    const cleanLocale = VALID_LOCALES.has(locale) ? locale : 'es'
    const cleanSlug = String(article_slug).trim().slice(0, 300)
    const cleanArticleId = article_id != null ? Number(article_id) : null
    const cleanTitle = article_title ? sanitize(String(article_title)).slice(0, 500) : null
    const cleanDescription = sanitize(String(description)).slice(0, 2000)
    const cleanName = reporter_name ? sanitize(String(reporter_name)).slice(0, 100) : null
    const rawEmail = reporter_email ? String(reporter_email).trim().slice(0, 254) : null
    const cleanEmail = rawEmail && isValidEmail(rawEmail) ? rawEmail : null

    if (cleanDescription.length < 5) {
        throw createError({ statusCode: 400, statusMessage: 'La descripción es demasiado corta' })
    }

    const userAgent = (getRequestHeader(event, 'user-agent') || '').slice(0, 500)

    const config = useRuntimeConfig()
    const dbUrl = (config.rssDbUrl || '').trim()
    const dbToken = (config.rssDbToken || '').trim()

    if (!dbUrl || !dbToken) {
        throw createError({ statusCode: 500, statusMessage: 'Configuración de base de datos faltante' })
    }

    const db = createClient({ url: dbUrl, authToken: dbToken })

    try {
        await db.execute({
            sql: `INSERT INTO article_reports
                  (article_id, article_slug, article_title, locale, issue_type, description,
                   reporter_name, reporter_email, user_agent)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                cleanArticleId,
                cleanSlug,
                cleanTitle,
                cleanLocale,
                issue_type,
                cleanDescription,
                cleanName,
                cleanEmail,
                userAgent
            ]
        })
        return { success: true, message: 'Reporte recibido' }
    } catch (error) {
        console.error('[Article Report] DB error:', error)
        throw createError({ statusCode: 500, statusMessage: 'No se pudo guardar el reporte' })
    }
})
