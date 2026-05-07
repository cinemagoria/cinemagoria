/**
 * Strips Set-Cookie headers from responses on public cacheable routes so Cloudflare
 * (Free plan, no custom cache key) treats them as cacheable.
 *
 * Why: @nuxtjs/supabase server middleware injects Supabase auth cookies on every
 * SSR response. Cloudflare's default cache key includes Set-Cookie presence,
 * causing the cache to fragment per-user (or skip caching entirely). For public
 * pages where the SSR HTML is identical for all users, removing Set-Cookie at
 * the edge of our origin makes the response cacheable.
 *
 * Public pages don't read or write cookies on the server (auth runs client-side).
 */

const CACHEABLE_PREFIXES = [
  '/movie',
  '/tv',
  '/person',
  '/news',
  '/festival',
  '/awards',
  '/genre',
  '/noir',
  '/changelog',
  '/usage-policies',
  '/contact',
]

const CACHEABLE_EXACT = new Set(['/'])

const NEVER_CACHEABLE_EXACT = new Set(['/movie/followed', '/tv/followed'])

function isCacheablePath(path: string): boolean {
  if (NEVER_CACHEABLE_EXACT.has(path)) return false
  if (CACHEABLE_EXACT.has(path)) return true
  return CACHEABLE_PREFIXES.some(p => path === p || path.startsWith(p + '/') || path.startsWith(p + '?'))
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('beforeResponse', (event) => {
    const method = event.node.req.method || 'GET'
    if (method !== 'GET' && method !== 'HEAD') return

    const rawPath: string = event.path ?? event.node.req.url ?? ''
    const path: string = rawPath.split('?')[0] ?? ''

    if (!isCacheablePath(path)) return

    event.node.res.removeHeader('Set-Cookie')
    event.node.res.removeHeader('set-cookie')

    const vary = event.node.res.getHeader('Vary')
    if (vary) {
      const cleaned = String(vary)
        .split(',')
        .map(s => s.trim())
        .filter(s => s.toLowerCase() !== 'cookie' && s.toLowerCase() !== 'authorization')
        .join(', ')
      if (cleaned) {
        event.node.res.setHeader('Vary', cleaned)
      } else {
        event.node.res.removeHeader('Vary')
      }
    }
  })
})
