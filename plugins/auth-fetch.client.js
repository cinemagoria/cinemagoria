export default defineNuxtPlugin(() => {
  const favorites = useRuntimeConfig().public.tursoBackendUrl
  const nativeFetch = window.fetch.bind(window)

  window.fetch = (input, init = {}) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : ''
    const ours = url.startsWith('/api/progress/') || url.includes('cinemagoria-favorites') || (favorites && url.startsWith(favorites))
    const token = ours && localStorage.getItem('access_token')?.replace(/['"]+/g, '')
    if (token) {
      const headers = new Headers(init.headers)
      if (!headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`)
      init = { ...init, headers }
    }
    return nativeFetch(input, init).then((res) => {
      if (token && res.status === 401) {
        ['email', 'access_token', 'alias', 'user_avatar'].forEach(k => localStorage.removeItem(k))
        window.dispatchEvent(new Event('auth-changed'))
        window.dispatchEvent(new CustomEvent('open-auth-modal'))
      }
      return res
    })
  }
})
