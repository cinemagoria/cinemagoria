import { fetchTmdbPages, buildSitemapXml } from '~/server/utils/sitemap-helpers'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.public.apiKey

  setResponseHeader(event, 'content-type', 'application/xml')
  setResponseHeader(event, 'cache-control', 'public, max-age=86400, s-maxage=86400')

  // Now playing + upcoming movies (~400 movies)
  const [nowPlaying, upcoming] = await Promise.all([
    fetchTmdbPages('/movie/now_playing', apiKey, 1, 10),
    fetchTmdbPages('/movie/upcoming', apiKey, 1, 10),
  ])

  const ids = [...new Set([...nowPlaying, ...upcoming])]
  return buildSitemapXml('https://cinemagoria.com', 'movie', ids, '0.8', 'daily')
})
