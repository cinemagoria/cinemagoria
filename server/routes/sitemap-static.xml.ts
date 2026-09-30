import { STREAMING_PROVIDERS, SUPPORTED_FESTIVALS } from '~/utils/constants'

export default defineEventHandler(async (event) => {
  const baseUrl = 'https://es.cinemagoria.com'
  const today = new Date().toISOString().split('T')[0]

  setResponseHeader(event, 'content-type', 'application/xml')
  setResponseHeader(event, 'cache-control', 'public, max-age=86400, s-maxage=86400')

  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/movie', priority: '0.9', changefreq: 'daily' },
    { loc: '/tv', priority: '0.9', changefreq: 'daily' },
    { loc: '/awards', priority: '0.7', changefreq: 'weekly' },
    { loc: '/news', priority: '0.8', changefreq: 'daily' },
    { loc: '/noir', priority: '0.8', changefreq: 'weekly' },
    { loc: '/festival', priority: '0.8', changefreq: 'weekly' },
    { loc: '/streaming-services', priority: '0.7', changefreq: 'weekly' },
    { loc: '/contact', priority: '0.3', changefreq: 'monthly' },
    { loc: '/usage-policies', priority: '0.2', changefreq: 'monthly' },
    { loc: '/changelog', priority: '0.3', changefreq: 'monthly' },
  ]

  const streamingPages = STREAMING_PROVIDERS.map(p => ({
    loc: `/streaming/${p.slug}`,
    priority: '0.6',
    changefreq: 'weekly',
  }))

  const festivalPages = SUPPORTED_FESTIVALS.map(f => ({
    loc: `/festival/${f.slug}`,
    priority: '0.7',
    changefreq: 'weekly',
  }))

  const allPages = [...staticPages, ...streamingPages, ...festivalPages]

  const urls = allPages.map(p => `  <url>
    <loc>${baseUrl}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
})
