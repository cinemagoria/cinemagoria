export default defineEventHandler(async (event) => {
  const baseUrl = 'https://cinemagoria.com'

  setResponseHeader(event, 'content-type', 'application/xml')
  setResponseHeader(event, 'cache-control', 'public, max-age=3600, s-maxage=3600')

  const today = new Date().toISOString().split('T')[0]

  // NOTE: sitemap-movies-*, sitemap-tv-*, sitemap-persons are TMDB-derived
  // dynamic pages (millions). Excluded from sitemap to focus Google's crawl
  // budget on unique cinemagoria content (news, festivals, awards, static).
  // They remain crawlable at /movie/X, /tv/X if linked, but won't be promoted
  // to the indexer. robots.txt also disallows /movie/, /tv/, /person/ paths.
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-static.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-news.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`
})
