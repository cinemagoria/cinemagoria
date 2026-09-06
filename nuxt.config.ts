import { fileURLToPath } from 'url'

export default defineNuxtConfig({
  alias: {
    '~/api': fileURLToPath(new URL('./utils/api.js', import.meta.url))
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  debug: false,

  routeRules: {
    // NOTE: never use `cache: { maxAge }` or `swr:` here. Those activate Nitro's
    // server-side cache, whose default driver is in-memory (unbounded Map). With
    // wildcard routes this leaks heap until OOM. Cloudflare is the cache layer —
    // we only emit Cache-Control headers; CF stores the response, Nitro does not.

    '/sitemap.xml': { headers: { 'cache-control': 'public, max-age=3600, s-maxage=3600' } },
    '/sitemap-static.xml': { headers: { 'cache-control': 'public, max-age=86400, s-maxage=86400' } },
    '/sitemap-news.xml': { headers: { 'cache-control': 'public, max-age=3600, s-maxage=3600' } },

    // RSS feed (canonical at /feed; /api/article/rss 301-redirects here)
    '/feed': { headers: { 'cache-control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=3600' } },
    '/sitemap-movies-*.xml': { headers: { 'cache-control': 'public, max-age=86400, s-maxage=86400' } },
    '/sitemap-tv-*.xml': { headers: { 'cache-control': 'public, max-age=86400, s-maxage=86400' } },
    '/sitemap-persons.xml': { headers: { 'cache-control': 'public, max-age=86400, s-maxage=86400' } },
    '/api/hero': { headers: { 'cache-control': 'public, max-age=1800, s-maxage=1800' } },
    '/api/spotlight/**': { headers: { 'cache-control': 'public, max-age=1800, s-maxage=1800' } },
    '/api/news': { headers: { 'cache-control': 'public, max-age=300, s-maxage=300' } },
    '/api/imdb-rating/**': { headers: { 'cache-control': 'public, max-age=86400, s-maxage=86400' } },
    // Award archives move a couple of times a year — cache them as long as ratings.
    '/api/awards': { headers: { 'cache-control': 'public, max-age=86400, s-maxage=86400' } },
    '/api/awards/**': { headers: { 'cache-control': 'public, max-age=86400, s-maxage=86400' } },
    '/api/article/**': { headers: { 'cache-control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=3600' } },
    '/api/festival/**': { headers: { 'cache-control': 'public, max-age=3600, s-maxage=3600' } },
    '/api/search/**': { headers: { 'cache-control': 'public, max-age=60, s-maxage=60' } },

    // Public SSR pages — emit Cache-Control: public, s-maxage=X so Cloudflare caches the HTML
    // Auth is enforced client-side only; server-rendered HTML is identical for all users.
    '/': { headers: { 'cache-control': 'public, max-age=600, s-maxage=600' } },
    '/movie': { headers: { 'cache-control': 'public, max-age=1800, s-maxage=1800' } },
    '/movie/followed': { ssr: false },
    '/movie/**': { headers: { 'cache-control': 'public, max-age=1800, s-maxage=1800' } },
    '/tv': { headers: { 'cache-control': 'public, max-age=1800, s-maxage=1800' } },
    '/tv/followed': { ssr: false },
    '/tv/**': { headers: { 'cache-control': 'public, max-age=1800, s-maxage=1800' } },
    '/person/**': { headers: { 'cache-control': 'public, max-age=3600, s-maxage=3600' } },
    '/news': { headers: { 'cache-control': 'public, max-age=600, s-maxage=600' } },
    '/news/**': { headers: { 'cache-control': 'public, max-age=3600, s-maxage=3600' } },
    '/festival': { headers: { 'cache-control': 'public, max-age=3600, s-maxage=3600' } },
    '/festival/**': { headers: { 'cache-control': 'public, max-age=7200, s-maxage=7200' } },
    '/awards': { headers: { 'cache-control': 'public, max-age=3600, s-maxage=3600' } },
    '/awards/**': { headers: { 'cache-control': 'public, max-age=3600, s-maxage=3600' } },
    '/genre/**': { headers: { 'cache-control': 'public, max-age=3600, s-maxage=3600' } },
    '/noir': { headers: { 'cache-control': 'public, max-age=3600, s-maxage=3600' } },
    '/changelog': { headers: { 'cache-control': 'public, max-age=86400, s-maxage=86400' } },
    '/usage-policies': { headers: { 'cache-control': 'public, max-age=86400, s-maxage=86400' } },
    '/contact': { headers: { 'cache-control': 'public, max-age=86400, s-maxage=86400' } },

    // Static image assets in /public — versioned-by-content, effectively immutable.
    // Festival badges (public/festivals/**) and UI/placeholder art were re-downloaded
    // every navigation because they shipped without a Cache-Control header; pin them
    // for a year so the browser reuses them across pages.
    '/festivals/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/ui/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/placeholders/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/logos/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/icons/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/thumbnails/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/onboarding/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/avatars/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },

    // Client-side only (user-specific or auth pages)
    '/search': { ssr: false },
    '/watchlist': { ssr: false },
    '/watchlist/**': { ssr: false },
    '/notifications': { ssr: false },
    '/settings': { ssr: false },
    '/lists': { ssr: false },
    '/lists/**': { ssr: false },
    '/u/**': { ssr: false },
    '/login': { ssr: false },
    '/register': { ssr: false },
    '/recovery': { ssr: false },
    '/auth-success': { ssr: false },
    '/wip': { ssr: false },
    '/production/**': { ssr: false },
    '/production-companies': { ssr: false },
    '/streaming': { ssr: false },
    '/streaming-services': { ssr: false },
    '/streaming/**': { ssr: false },
  },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/supabase'
  ],

  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY
  },

  css: [
    '~/assets/css/global.scss',
    'swiper/css',
    'swiper/css/navigation',
    'swiper/css/pagination'
  ],

  runtimeConfig: {
    imdbDbUrl: process.env.IMDB_DB_URL,
    imdbDbToken: process.env.IMDB_DB_TOKEN,
    rssDbUrl: process.env.RSS_DB_URL || process.env.TURSO_DATABASE_URL,
    rssDbToken: process.env.RSS_DB_TOKEN || process.env.TURSO_AUTH_TOKEN,
    traktClientSecret: process.env.TRAKT_CLIENT_SECRET,
    // Server-only: the translation endpoint calls OpenRouter from Nitro, so
    // the key never reaches the browser bundle.
    orApiKey: process.env.OR_API_KEY,

    public: {
      frontendUrl: process.env.FRONTEND_URL || "https://es.cinemagoria.com",
      apiUrl: process.env.API_URL || "https://auth.cinemagoria.com",
      apiKey: process.env.API_KEY || "",
      apiLang: process.env.API_LANG || "es-ES",
      apiCountry: process.env.API_COUNTRY || "ES",
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY,
      apiYoutubeKey: process.env.API_YOUTUBE_KEY,
      gaId: process.env.GA,
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      traktClientId: process.env.TRAKT_CLIENT_ID,
      tursoBackendUrl: process.env.TURSO_BACKEND_URL || "https://cinemagoria-favorites-746175915741.us-east1.run.app/api",
      followsBackendUrl: process.env.FOLLOWS_BACKEND_URL || "https://cinemagoria-follows-746175915741.us-east1.run.app",
      assistantBackendUrl: process.env.ASSISTANT_BACKEND_URL || "https://cinemagoria-assistant-746175915741.us-east1.run.app/api",
      mdblistApi: process.env.MDBLIST_API,
      rapidApiKey: process.env.RAPIDAPI_KEY,
      orApiKey: process.env.OR_API_KEY,
      geminiApiKey: process.env.GEMINI_API_KEY,
      geminiApiKey2: process.env.GEMINI_API_KEY2,
      geminiApiKey3: process.env.GEMINI_API_KEY3,
      geminiApiKey4: process.env.GEMINI_API_KEY4,
      geminiApiKey5: process.env.GEMINI_API_KEY5,
      geminiApiKey6: process.env.GEMINI_API_KEY6,
      newsAggregatorUrl: process.env.NEWS_AGGREGATOR_URL || "https://cinemagoria-rss-aggregator-746175915741.us-east1.run.app/news",
    }
  },

  app: {
    head: {
      title: 'Cinemagoria — Descubre Películas y Series',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { key: 'description', name: 'description', content: 'Cinemagoria - El momento en el que descubres qué ver. Explora películas, series, festivales, premios y disponibilidad en streaming.' },
        { name: 'theme-color', content: '#03496B' },
        { property: 'og:title', content: 'Cinemagoria — Descubre Películas y Series' },
        { property: 'og:description', content: 'Explora películas, series, festivales, premios y disponibilidad en streaming en un solo lugar.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://es.cinemagoria.com' },
        { property: 'og:image', content: 'https://es.cinemagoria.com/og-image.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'canonical', href: 'https://es.cinemagoria.com' },
        { rel: 'alternate', hreflang: 'en', href: 'https://cinemagoria.com' },
        { rel: 'alternate', hreflang: 'es', href: 'https://es.cinemagoria.com' },
        { rel: 'alternate', hreflang: 'x-default', href: 'https://cinemagoria.com' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/icons/favicon-192.png' },
        { rel: 'shortcut icon', href: '/icons/favicon.ico' },
        // Preconnect so the render-blocking font CSS + woff2 handshakes start
        // immediately instead of after HTML parse reaches the stylesheet links.
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@100..800&family=Outfit:wght@300;400;600;800&display=swap' }
      ],
    }
  },

  vite: {
    define: {
      'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY)
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    }
  }
})
