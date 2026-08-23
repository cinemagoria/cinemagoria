import { buildNewsFeed } from '../utils/rss-feed'

// Canonical public news feed: https://cinemagoria.com/feed
// (The Spanish counterpart is served at the same path.)
export default defineEventHandler(async (event) => {
    const xml = await buildNewsFeed('en')
    setHeader(event, 'Content-Type', 'application/rss+xml; charset=UTF-8')
    setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=3600')
    return xml
})
