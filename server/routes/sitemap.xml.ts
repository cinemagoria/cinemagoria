export default defineEventHandler(async (event) => {
  const baseUrl = 'https://cinemagoria.com'

  setResponseHeader(event, 'content-type', 'application/xml')
  setResponseHeader(event, 'cache-control', 'public, max-age=3600, s-maxage=3600')

  const today = new Date().toISOString().split('T')[0]

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-static.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-movies-1.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-movies-2.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-movies-3.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-tv-1.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-tv-2.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-tv-3.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-persons.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`
})
