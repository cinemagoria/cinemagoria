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

    // Sitemaps
    '/sitemap.xml': { headers: { 'cache-control': 'public, max-age=3600, s-maxage=3600' } },
    '/sitemap-static.xml': { headers: { 'cache-control': 'public, max-age=86400, s-maxage=86400' } },
    '/sitemap-news.xml': { headers: { 'cache-control': 'public, max-age=3600, s-maxage=3600' } },

    // RSS feed (canonical at /feed; /api/article/rss 301-redirects here)
    '/feed': { headers: { 'cache-control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=3600' } },
    '/sitemap-movies-*.xml': { headers: { 'cache-control': 'public, max-age=86400, s-maxage=86400' } },
    '/sitemap-tv-*.xml': { headers: { 'cache-control': 'public, max-age=86400, s-maxage=86400' } },
    '/sitemap-persons.xml': { headers: { 'cache-control': 'public, max-age=86400, s-maxage=86400' } },

    // API routes
    '/api/hero': { headers: { 'cache-control': 'public, max-age=1800, s-maxage=1800' } },
    '/api/spotlight/**': { headers: { 'cache-control': 'public, max-age=1800, s-maxage=1800' } },
    '/api/news': { headers: { 'cache-control': 'public, max-age=300, s-maxage=300' } },
    '/api/imdb-rating/**': { headers: { 'cache-control': 'public, max-age=86400, s-maxage=86400' } },
    // Award archives move a couple of times a year — cache them as long as ratings.
    '/api/awards/**': { headers: { 'cache-control': 'public, max-age=86400, s-maxage=86400' } },
    '/api/article/**': { headers: { 'cache-control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=3600' } },
    '/api/festival/**': { headers: { 'cache-control': 'public, max-age=3600, s-maxage=3600' } },
    '/api/festival/featured': { headers: { 'cache-control': 'public, max-age=60, s-maxage=300' } },
    '/api/search/**': { headers: { 'cache-control': 'public, max-age=60, s-maxage=60' } },

    // Public SSR pages — emit Cache-Control: public, s-maxage=X so Cloudflare caches the HTML
    '/': { headers: { 'cache-control': 'public, max-age=600, s-maxage=600' } },
    // The Ledger modal fetches this on click; cached like the homepage it belongs to.
    '/data/hero-history.json': { headers: { 'cache-control': 'public, max-age=600, s-maxage=600' } },
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
    '/streaming/followed': { ssr: false },
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

    public: {
      frontendUrl: process.env.FRONTEND_URL || "https://cinemagoria.com",
      apiUrl: process.env.API_URL || "https://auth.cinemagoria.com",
      apiKey: process.env.API_KEY || "",
      apiLang: process.env.API_LANG || "en",
      apiCountry: process.env.API_COUNTRY || "en",
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
      newsAggregatorUrl: process.env.NEWS_AGGREGATOR_URL || "https://cinemagoria-rss-aggregator-746175915741.us-east1.run.app/news",
    }
  },

  app: {
    head: {
      title: 'Cinemagoria — Film & TV Discovery Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { key: 'description', name: 'description', content: 'Cinemagoria is a film and TV discovery platform. Browse movies, series, festival coverage, awards, and streaming availability in one place.' },
        { name: 'theme-color', content: '#03496B' },
        { property: 'og:title', content: 'Cinemagoria — Film & TV Discovery Platform' },
        { property: 'og:description', content: 'Browse movies, series, festival coverage, awards, and streaming availability in one place.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://cinemagoria.com' },
        { property: 'og:image', content: 'https://cinemagoria.com/og-image.jpg?v=2' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/icons/favicon-circle-48.png?v=2' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/icons/favicon-circle-96.png?v=2' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/icons/favicon-circle-192.png?v=2' },
        { rel: 'shortcut icon', href: '/favicon.ico?v=2' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/icons/favicon-180-precomposed.png?v=2' },
        { rel: 'manifest', href: '/manifest.json' },
        // Preconnect so the render-blocking font CSS + woff2 handshakes start
        // immediately instead of after HTML parse reaches the stylesheet links.
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@100..800&family=Outfit:wght@300;400;600;800&display=swap' }
      ],
      script: [
        // Light mode for weak devices: the TV app (user agent "CinemagoriaTV") and devices with ≤2 GB RAM.
        // Runs before first paint so the heavy look never renders there. TVs (the app, or a weak device with no touch
        // and a narrow screen, like the TV Bro browser) also get a desktop-width layout, re-applied if the head re-renders. localStorage.cgLite = '1' / '0' forces it on or off.
        { key: 'lite-mode', innerHTML: "(function(){var d=document.documentElement,tv=/CinemagoriaTV/.test(navigator.userAgent),f=null;try{f=localStorage.getItem('cgLite')}catch(e){}var m=navigator.deviceMemory,lite=f?f==='1':tv||(m>0&&m<=2);if(lite)d.setAttribute('data-lite','');if(tv||(lite&&navigator.maxTouchPoints===0&&screen.width<1280)){d.setAttribute('data-tv','');var w='width=1280',fix=function(){var v=document.querySelector('meta[name=viewport]');if(v&&v.content!==w)v.content=w};fix();new MutationObserver(fix).observe(document.head,{subtree:true,childList:true,attributes:true,attributeFilter:['content']})}})()" },
        { src: 'https://script.tracevisor.com/hello.js', defer: true }
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
