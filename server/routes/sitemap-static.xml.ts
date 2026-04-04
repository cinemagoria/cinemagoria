import { STREAMING_PROVIDERS, SUPPORTED_PRODUCTION_COMPANIES, SUPPORTED_FESTIVALS } from '~/utils/constants'

export default defineEventHandler(async (event) => {
  const baseUrl = 'https://es.cinemagoria.com'
  const today = new Date().toISOString().split('T')[0]

  setResponseHeader(event, 'content-type', 'application/xml')
  setResponseHeader(event, 'cache-control', 'public, max-age=86400, s-maxage=86400')

  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/movie', priority: '0.9', changefreq: 'daily' },
    { loc: '/tv', priority: '0.9', changefreq: 'daily' },
    { loc: '/search', priority: '0.7', changefreq: 'weekly' },
    { loc: '/advancedsearch', priority: '0.7', changefreq: 'weekly' },
    { loc: '/awards', priority: '0.7', changefreq: 'weekly' },
    { loc: '/news', priority: '0.8', changefreq: 'daily' },
    { loc: '/noir', priority: '0.8', changefreq: 'weekly' },
    { loc: '/festival', priority: '0.8', changefreq: 'weekly' },
    { loc: '/streaming-services', priority: '0.7', changefreq: 'weekly' },
    { loc: '/production-companies', priority: '0.6', changefreq: 'monthly' },
    { loc: '/contact', priority: '0.3', changefreq: 'monthly' },
    { loc: '/usage-policies', priority: '0.2', changefreq: 'monthly' },
    { loc: '/changelog', priority: '0.3', changefreq: 'monthly' },
  ]

  const movieGenres = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37]
  const tvGenres = [10759, 16, 35, 80, 99, 18, 10751, 10762, 9648, 10763, 10764, 10765, 10766, 10767, 10768, 37]

  const genrePages = [
    ...movieGenres.map(id => ({ loc: `/genre/${id}/movie`, priority: '0.6', changefreq: 'daily' })),
    ...tvGenres.map(id => ({ loc: `/genre/${id}/tv`, priority: '0.6', changefreq: 'daily' })),
  ]

  const streamingPages = STREAMING_PROVIDERS.map(p => ({
    loc: `/streaming/${p.slug}`,
    priority: '0.6',
    changefreq: 'weekly',
  }))

  const productionPages = Object.values(SUPPORTED_PRODUCTION_COMPANIES).map((c: any) => ({
    loc: `/production/${c.slug}`,
    priority: '0.5',
    changefreq: 'weekly',
  }))

  const festivalPages = SUPPORTED_FESTIVALS.map(f => ({
    loc: `/festival/${f.slug}`,
    priority: '0.7',
    changefreq: 'weekly',
  }))

  const allPages = [...staticPages, ...genrePages, ...streamingPages, ...productionPages, ...festivalPages]

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
