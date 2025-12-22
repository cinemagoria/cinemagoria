import { fileURLToPath } from 'url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  alias: {
    '~/api': fileURLToPath(new URL('./utils/api.js', import.meta.url))
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  debug: true,

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
    traktClientSecret: process.env.TRAKT_CLIENT_SECRET,

    public: {
      frontendUrl: process.env.FRONTEND_URL || "https://entercinema.com",
      apiUrl: process.env.API_URL || "https://entercinema-drf.vercel.app",
      apiKey: process.env.API_KEY || "",
      apiLang: process.env.API_LANG || "en",
      apiCountry: process.env.API_COUNTRY || "en",
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY,
      apiYoutubeKey: process.env.API_YOUTUBE_KEY,
      gaId: process.env.GA,
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      traktClientId: process.env.TRAKT_CLIENT_ID,
      tursoBackendUrl: process.env.TURSO_BACKEND_URL || "https://entercinema-favorites.vercel.app/api",
      followsBackendUrl: process.env.FOLLOWS_BACKEND_URL || "https://entercinema-follows-rust.vercel.app",
      assistantBackendUrl: process.env.ASSISTANT_BACKEND_URL || "https://entercinema-assistant-rust.vercel.app/api",
      mdblistApi: process.env.MDBLIST_API,
      rapidApiKey: process.env.RAPIDAPI_KEY,
    }
  },

  app: {
    head: {
      title: 'EnterCinema',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { key: 'description', name: 'description', content: 'EnterCinema - Your Movie & TV Show Guide' },
        { name: 'theme-color', content: '#03496B' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500' }
      ],
    }
  },

  vite: {
    define: {
      'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY)
    }
  }
})
