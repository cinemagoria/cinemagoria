import { createClient } from '@libsql/client'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = 'https://cinemagoria.com'

  setResponseHeader(event, 'content-type', 'application/xml')
  setResponseHeader(event, 'cache-control', 'public, max-age=3600, s-maxage=3600')

  const dbUrl = (config.rssDbUrl || config.imdbDbUrl || '').trim()
  const dbToken = (config.rssDbToken || config.imdbDbToken || '').trim()

  if (!dbUrl || !dbToken) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`
  }

  const db = createClient({ url: dbUrl, authToken: dbToken })

  try {
    const result = await db.execute({
      sql: `SELECT slug, published_at FROM cinemagoria_articles WHERE is_visible = 1 ORDER BY published_at DESC`,
      args: []
    })

    const urls = result.rows.map(row => {
      const lastmod = row.published_at
        ? new Date(row.published_at as string).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
      return `  <url>
    <loc>${baseUrl}/news/${row.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.8</priority>
  </url>`
    }).join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
  } catch (error) {
    console.error('[sitemap-news] Error fetching articles:', error)
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`
  }
})
