import { createClient } from '@libsql/client'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    const dbUrl = (config.rssDbUrl || config.imdbDbUrl || '').trim()
    const dbToken = (config.rssDbToken || config.imdbDbToken || '').trim()

    const db = createClient({ url: dbUrl, authToken: dbToken })

    const result = await db.execute({
        sql: `SELECT slug, title_en, title_es, description_en, description_es, image_url, published_at
              FROM cinemagoria_articles
              WHERE is_visible >= 0
              ORDER BY published_at DESC
              LIMIT 50`,
        args: []
    })

    const rows = result.rows as any[]

    const escapeXml = (s: string) => (s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')

    const items = rows.map(row => {
        const enUrl = `https://cinemagoria.com/news/${row.slug}`
        const esUrl = `https://es.cinemagoria.com/news/${row.slug}`
        let pubDate = '';
        try { pubDate = new Date(row.published_at).toUTCString() } catch { pubDate = new Date().toUTCString() }
        const img = row.image_url ? escapeXml(row.image_url) : ''

        return `    <item>
      <title>${escapeXml(row.title_en)}</title>
      <link>${escapeXml(enUrl)}</link>
      <guid isPermaLink="true">${escapeXml(enUrl)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(row.description_en)}</description>
      <dc:title xml:lang="es">${escapeXml(row.title_es)}</dc:title>
      <dc:description xml:lang="es">${escapeXml(row.description_es)}</dc:description>${img ? `
      <enclosure url="${img}" type="image/jpeg" length="0"/>
      <media:thumbnail url="${img}"/>` : ''}
      <atom:link rel="alternate" hreflang="es" href="${escapeXml(esUrl)}"/>
    </item>`
    }).join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Cinemagoria News</title>
    <link>https://cinemagoria.com</link>
    <description>Editorial Film &amp; TV news by Cinemagoria — bilingual EN/ES</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://cinemagoria.com/api/article/rss" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

    setHeader(event, 'Content-Type', 'application/rss+xml; charset=UTF-8')
    setHeader(event, 'Cache-Control', 'public, max-age=3600')
    return xml
})
