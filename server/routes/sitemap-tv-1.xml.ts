import { fetchTmdbPages, buildSitemapXml } from '~/server/utils/sitemap-helpers'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.public.apiKey

  setResponseHeader(event, 'content-type', 'application/xml')
  setResponseHeader(event, 'cache-control', 'public, max-age=86400, s-maxage=86400')

  // Popular TV shows pages 1-25 (~500 shows)
  const ids = await fetchTmdbPages('/tv/popular', apiKey, 1, 25)
  return buildSitemapXml('https://cinemagoria.com', 'tv', ids, '0.7', 'weekly')
})
