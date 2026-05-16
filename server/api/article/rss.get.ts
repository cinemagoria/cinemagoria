// Legacy endpoint. The canonical feed now lives at /feed (like every other
// publication). Permanent redirect so existing subscribers — and feed readers
// such as NetNewsWire — transparently follow and update to the new URL.
export default defineEventHandler((event) => {
    return sendRedirect(event, 'https://es.cinemagoria.com/feed', 301)
})
