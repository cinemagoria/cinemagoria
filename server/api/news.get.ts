import { dbExecute } from '~~/server/utils/db'
import { FIRST_PARTY_SOURCE, THIRD_PARTY_SOURCE } from '~/utils/newsSources'

const FIRST_PARTY_DATE_GUARD =
    `(datetime(a.published_at) IS NULL OR datetime(a.published_at) <= datetime('now'))`

const TITLE_NAME_COLUMNS = `rt.title AS rt_title, rt.original_title AS rt_original,
                            hs.title AS hs_title, hs.spanish_title AS hs_es,
                            nh.title AS nh_title, nh.spanish_title AS nh_es`

const titleNameJoins = (type: string, id: string) =>
    `LEFT JOIN release_titles rt ON rt.media_type = ${type} AND rt.tmdb_id = ${id}
     LEFT JOIN hero_selections hs ON hs.tmdb_id = ${id} AND hs.media_type = ${type}
     LEFT JOIN noir_historical nh ON nh.tmdb_id = ${id} AND nh.media_type = ${type}`

const LATIN_TITLE = /^[\p{Script=Latin}\p{N}\p{P}\p{S}\s]+$/u

const firstText = (...values: unknown[]): string | null => {
    for (const value of values) {
        const text = typeof value === 'string' ? value.trim() : ''
        if (text) return text
    }
    return null
}

const titleName = (row: any, lang: string): string | null => {
    if (lang !== 'es') return firstText(row.rt_title, row.hs_title, row.nh_title)
    const original = typeof row.rt_original === 'string' && LATIN_TITLE.test(row.rt_original.trim()) ? row.rt_original : null
    return firstText(row.hs_es, row.nh_es, original, row.rt_title, row.hs_title, row.nh_title)
}

const relatedTitle = (row: any, lang: string) => {
    const type = String(row.entity_type || '')
    const id = Number(row.entity_id)
    if ((type !== 'movie' && type !== 'tv') || !Number.isInteger(id) || id <= 0) return null
    return { type, id, name: titleName(row, lang) }
}

const publisherOrigin = (link: string): string | null => {
    try {
        return new URL(link).origin
    } catch {
        return null
    }
}

const parseJsonArray = (raw: unknown): string[] => {
    try {
        if (!raw) return []
        const parsed = JSON.parse(raw as string)
        return Array.isArray(parsed) ? parsed.map((entry: any) => String(entry)) : []
    } catch {
        return []
    }
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const limit = parseInt(String(query.limit)) || 100
    const rawLang = String(query.lang || config.public.apiLang || 'es')
    const lang = rawLang.substring(0, 2).toLowerCase()
    const source = query.source ? String(query.source) : null

    // Require >=2 chars: a single-char `LIKE '%a%'` matches almost everything and
    // forces a full-table scan with no usable index — the shape that hung for 60s
    // and 504'd. Short/empty terms fall back to the normal recent-news listing.
    const rawSearch = query.q ? String(query.q).trim() : null
    const searchQuery = rawSearch && rawSearch.length >= 2 ? rawSearch : null

    const wantsFirstParty = !source || source === FIRST_PARTY_SOURCE
    const wantsThirdParty = !source || source !== FIRST_PARTY_SOURCE
    const publisher = source && source !== THIRD_PARTY_SOURCE ? source : null

    try {
        const items: any[] = []

        if (wantsFirstParty) {
            const titleCol = lang === 'es' ? 'title_es' : 'title_en'
            const descCol = lang === 'es' ? 'description_es' : 'description_en'

            const entityType = `json_extract(a.related_tmdb_ids, '$[0].type')`
            const entityId = `json_extract(a.related_tmdb_ids, '$[0].id')`

            let sql = `SELECT a.id, a.slug, a.${titleCol} AS title, a.${descCol} AS description,
                              a.image_url, a.published_at, a.topics_json,
                              a.requires_auth, a.editorial_category, a.secondary_categories_json,
                              ${entityType} AS entity_type, ${entityId} AS entity_id,
                              ${TITLE_NAME_COLUMNS}
                       FROM cinemagoria_articles a
                       ${titleNameJoins(entityType, entityId)}
                       WHERE a.is_visible = 1 AND a.is_cinemagoria = 1
                         AND ${FIRST_PARTY_DATE_GUARD}`
            const args: any[] = []

            if (searchQuery) {
                sql += ` AND (a.${titleCol} LIKE ? OR a.${descCol} LIKE ?)`
                args.push(`%${searchQuery}%`, `%${searchQuery}%`)
            }

            sql += ` ORDER BY a.published_at DESC`

            const result = await dbExecute({ sql, args })

            items.push(...result.rows.map(row => ({
                id: row.id,
                title: row.title,
                href: `/news/${row.slug}`,
                image: row.image_url,
                published_at: row.published_at,
                description: row.description,
                source: { name: FIRST_PARTY_SOURCE },
                video_id: null,
                is_internal: true,
                slug: row.slug,
                topics: parseJsonArray(row.topics_json),
                requires_auth: Number(row.requires_auth ?? 0) === 1 ? 1 : 0,
                editorial_category: (row.editorial_category as string) || null,
                secondary_categories: parseJsonArray(row.secondary_categories_json),
                related_title: relatedTitle(row, lang),
            })))
        }

        if (wantsThirdParty) {
            let sql = `SELECT n.id, n.publisher, n.title, n.description, n.link, n.image, n.published_at,
                              n.editorial_category, n.secondary_categories_json,
                              n.tmdb_type AS entity_type, n.tmdb_id AS entity_id,
                              ${TITLE_NAME_COLUMNS}
                       FROM approved_news n
                       ${titleNameJoins('n.tmdb_type', 'n.tmdb_id')}
                       WHERE n.language = ? AND n.is_visible = 1`
            const args: any[] = [lang]

            if (publisher) {
                sql += ` AND n.publisher = ?`
                args.push(publisher)
            }

            if (searchQuery) {
                sql += ` AND (n.title LIKE ? OR n.description LIKE ?)`
                args.push(`%${searchQuery}%`, `%${searchQuery}%`)
            }

            sql += ` ORDER BY n.published_at DESC LIMIT ?`
            args.push(limit)

            const result = await dbExecute({ sql, args })

            items.push(...result.rows.map(row => ({
                id: `ext-${row.id}`,
                title: row.title,
                href: row.link,
                image: row.image,
                published_at: row.published_at,
                description: row.description,
                source: { name: row.publisher, url: publisherOrigin(String(row.link)) },
                video_id: null,
                is_internal: false,
                editorial_category: (row.editorial_category as string) || null,
                secondary_categories: parseJsonArray(row.secondary_categories_json),
                related_title: relatedTitle(row, lang),
            })))
        }

        items.sort((a: any, b: any) => {
            const dateA = new Date(a.published_at || 0).getTime()
            const dateB = new Date(b.published_at || 0).getTime()
            return dateB - dateA
        })

        return {
            status: 'ok',
            total_items: items.length,
            results: items
        }

    } catch (error: any) {
        console.error('DB News Fetch Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch news from database',
        })
    }
})
