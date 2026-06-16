import { createClient } from '@libsql/client'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
        throw createError({ statusCode: 400, statusMessage: 'Slug requerido' })
    }

    const dbUrl = (config.rssDbUrl || config.imdbDbUrl || '').trim()
    const dbToken = (config.rssDbToken || config.imdbDbToken || '').trim()

    if (!dbUrl || !dbToken) {
        throw createError({ statusCode: 500, statusMessage: 'Configuración de base de datos faltante' })
    }

    const db = createClient({ url: dbUrl, authToken: dbToken })

    setResponseHeader(event, 'Cache-Control', 'no-store')

    try {
        const result = await db.execute({
            sql: `SELECT id, slug, title_en, body_en, description_en, title_es, body_es, description_es,
                         image_url, sources_json, topics_json, published_at, created_at, is_visible,
                         trailer_youtube_id, trailer_provider, carousel_assets, related_tmdb_ids,
                         requires_auth, editorial_category, secondary_categories_json
                  FROM cinemagoria_articles
                  WHERE slug = ? AND is_visible = 1
                  LIMIT 1`,
            args: [slug]
        })

        if (result.rows.length === 0) {
            throw createError({ statusCode: 404, statusMessage: 'Artículo no encontrado' })
        }

        const row = result.rows[0]

        return {
            status: 'ok',
            article: {
                id: row.id,
                slug: row.slug,
                title_en: row.title_en,
                body_en: row.body_en,
                description_en: row.description_en,
                title_es: row.title_es,
                body_es: row.body_es,
                description_es: row.description_es,
                image_url: row.image_url,
                sources: row.sources_json ? JSON.parse(row.sources_json as string) : [],
                topics: row.topics_json ? JSON.parse(row.topics_json as string) : [],
                published_at: row.published_at,
                created_at: row.created_at,
                trailer_youtube_id: row.trailer_youtube_id || null,
                // trailer_provider: 'youtube' (default) or 'vimeo'. Legacy rows
                // pre-migration have NULL → frontend treats null as 'youtube'.
                trailer_provider: (row.trailer_provider as string) || 'youtube',
                carousel_assets: row.carousel_assets ? (row.carousel_assets as string).split(',').map(u => u.trim()).filter(Boolean) : [],
                related_tmdb_ids: row.related_tmdb_ids ? JSON.parse(row.related_tmdb_ids as string) : [],
                // requires_auth: 0 = public (body always rendered), 1 = community-gated
                // (anonymous reader sees teaser + AuthModal; signed-in reader sees full body).
                requires_auth: Number(row.requires_auth ?? 0) === 1 ? 1 : 0,
                // Editorial taxonomy. Primary is NOT NULL DEFAULT 'feature' at the DB layer.
                // Secondaries arrive as a JSON array (≤ 2) or NULL; expose as a plain array.
                editorial_category: (row.editorial_category as string) || 'feature',
                secondary_categories: (() => {
                    try {
                        const raw = row.secondary_categories_json
                        if (!raw) return [] as string[]
                        const parsed = JSON.parse(raw as string)
                        return Array.isArray(parsed) ? parsed.map((s: any) => String(s)) : []
                    } catch { return [] as string[] }
                })(),
            }
        }
    } catch (error: any) {
        if (error.statusCode) throw error
        console.error('[Article ES API] Error:', error)
        throw createError({ statusCode: 500, statusMessage: 'Error al obtener el artículo' })
    }
})
