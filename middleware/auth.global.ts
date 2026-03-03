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
        // Set a flag for the AuthModal to open on the next mount (handles direct URL entries)
        sessionStorage.setItem('open_auth_modal', 'true')

        // Trigger the AuthModal via global event
        window.dispatchEvent(new CustomEvent('open-auth-modal'))

        // Redirect to home if they were trying to access a protected page directly
        if (to.path !== '/') {
            return navigateTo('/')
        }
    }
})
