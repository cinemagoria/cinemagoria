export default defineEventHandler((event) => {
    const url = event.node.req.url || ''
    const match = url.match(/^\/@([a-zA-Z0-9_-]+)/)
    if (match) {
        return sendRedirect(event, `/u/${match[1]}`, 301)
    }
})
