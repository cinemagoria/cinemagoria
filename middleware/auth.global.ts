export default defineNuxtRouteMiddleware((to, from) => {
    if (import.meta.server) return

    const protectedPaths = [
        '/festival',
        '/lists',
        '/watchlist',
        '/awards',
        '/settings',
        '/notifications',
        '/production-companies'
    ]

    const isProtected = protectedPaths.some(path => to.path.startsWith(path))
    const accessToken = localStorage.getItem('access_token')

    if (isProtected && !accessToken) {
        sessionStorage.setItem('open_auth_modal', 'true')

        if (to.path !== '/') {
            return navigateTo('/')
        }
    }
})
