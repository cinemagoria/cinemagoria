import { buildNewsFeed } from '../utils/rss-feed'

// Canonical public news feed (Spanish): https://es.cinemagoria.com/feed
export default defineEventHandler(async (event) => {
    const xml = await buildNewsFeed('es')
    setHeader(event, 'Content-Type', 'application/rss+xml; charset=UTF-8')
    setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=3600')
    return xml
})
