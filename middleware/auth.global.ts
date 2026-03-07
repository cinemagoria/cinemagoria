/**
 * Global auth middleware — synchronous, fast, bypasseable check using localStorage.
 *
 * IMPORTANT: This is a UX guard only. Real data protection is enforced
 * by the backend (DRF /auth/verify/ is still called by the token validation
 * composable on individual pages when needed).
 *
 * Flow:
 *  - No token → block navigation + show AuthModal
 *  - Token present → allow (API calls will 401 naturally if token is fake/expired)
 *
 * Why synchronous: an async DRF call in the middleware added 200–500ms of
 * latency on every protected-route click. The UX gate just needs to be fast.
 */

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

    const isProtected = protectedPaths.some(p => to.path.startsWith(p))
    if (!isProtected) return

    const token = localStorage.getItem('access_token')
    if (token) return // authenticated — let through

    // ── Not authenticated: block + show modal ────────────────────────────────
    sessionStorage.setItem('open_auth_modal', 'true')

    // Always dispatch the event so the already-mounted AuthModal opens instantly.
    // dispatchEvent is synchronous — the modal opens before we return.
    if (import.meta.client) {
        window.dispatchEvent(new CustomEvent('open-auth-modal'))
    }

    // If the user was NOT already on the homepage (e.g. direct URL or navigating
    // from another page), redirect them to '/' so the auth modal has a clean
    // backdrop. For users already on '/', just abort — the modal is already open.
    const currentPath = from?.path ?? '/'
    if (currentPath !== '/') {
        return navigateTo('/')
    }

    return abortNavigation()
})
