import { fetchTmdbPages, buildSitemapXml } from '~/server/utils/sitemap-helpers'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.public.apiKey

  setResponseHeader(event, 'content-type', 'application/xml')
  setResponseHeader(event, 'cache-control', 'public, max-age=86400, s-maxage=86400')

  // Popular movies pages 1-25 (~500 movies)
  const ids = await fetchTmdbPages('/movie/popular', apiKey, 1, 25)
  return buildSitemapXml('https://cinemagoria.com', 'movie', ids, '0.7', 'weekly')
})
