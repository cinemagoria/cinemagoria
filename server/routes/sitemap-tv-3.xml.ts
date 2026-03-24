import { fetchTmdbPages, buildSitemapXml } from '~/server/utils/sitemap-helpers'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.public.apiKey

  setResponseHeader(event, 'content-type', 'application/xml')
  setResponseHeader(event, 'cache-control', 'public, max-age=86400, s-maxage=86400')

  // Airing today + on the air (~400 shows)
  const [airing, onTheAir] = await Promise.all([
    fetchTmdbPages('/tv/airing_today', apiKey, 1, 10),
    fetchTmdbPages('/tv/on_the_air', apiKey, 1, 10),
  ])

  const ids = [...new Set([...airing, ...onTheAir])]
  return buildSitemapXml('https://cinemagoria.com', 'tv', ids, '0.8', 'daily')
})
