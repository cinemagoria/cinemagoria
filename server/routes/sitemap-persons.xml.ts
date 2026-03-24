import { fetchTmdbPages, buildSitemapXml } from '~/server/utils/sitemap-helpers'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.public.apiKey

  setResponseHeader(event, 'content-type', 'application/xml')
  setResponseHeader(event, 'cache-control', 'public, max-age=86400, s-maxage=86400')

  const ids = await fetchTmdbPages('/person/popular', apiKey, 1, 25, 'es-ES')
  return buildSitemapXml('https://es.cinemagoria.com', 'person', ids, '0.6', 'weekly')
})
