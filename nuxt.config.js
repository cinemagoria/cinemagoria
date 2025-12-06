export default {
  target: "static",
  ssr: false,
  srcDir: __dirname,
  generate: {
    fallback: true,
  },
  head: {
    title: "EnterCinema: El instante en que descubrís qué ver",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Your Portal to Entertainment Discovery.",
      },
      { hid: "author", name: "author", content: "ivanluna.dev" },
      { hid: "og:locale", property: "og:locale", content: "es_ES" },
      { hid: "og:title", property: "og:title", content: "EnterCinema" },
      {
        hid: "og:description",
        property: "og:description",
        content: "Your Portal to Entertainment Discovery.",
      },
      { hid: "og:type", property: "og:type", content: "website" },
      {
        hid: "og:url",
        property: "og:url",
        content: "https://es.entercinema.com/",
      },
      {
        hid: "og:image",
        property: "og:image",
        content: "https://es.entercinema.com/icon-512x512.webp",
      },
      { name: "theme-color", content: "#03496B" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "EnterCinema" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icon-192x192.png" },
      { rel: "apple-touch-icon", href: "/favicon-180-precomposed.png" },
      { rel: "apple-touch-icon", sizes: "57x57", href: "/favicon-57.png" },
      { rel: "apple-touch-icon", sizes: "60x60", href: "/favicon-60.png" },
      { rel: "apple-touch-icon", sizes: "72x72", href: "/favicon-72.png" },
      { rel: "apple-touch-icon", sizes: "76x76", href: "/favicon-76.png" },
      { rel: "apple-touch-icon", sizes: "114x114", href: "/favicon-114-precomposed.png" },
      { rel: "apple-touch-icon", sizes: "120x120", href: "/favicon-120-precomposed.png" },
      { rel: "apple-touch-icon", sizes: "144x144", href: "/favicon-144-precomposed.png" },
      { rel: "apple-touch-icon", sizes: "152x152", href: "/favicon-152-precomposed.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon-180-precomposed.png" },
      { rel: "manifest", href: "/manifest.json" },
      {
        rel: "stylesheet",
        href: "//fonts.googleapis.com/css?family=Roboto:300,400,500",
      },
    ],
    script: [
      {
        src: "https://script.peekvisor.com/hello.js",
      }
    ],
  },
  css: ["@/assets/css/global.scss"],
  plugins: [
    "~/plugins/lazyload.js",
    "~/plugins/filters.js",
    { src: "~/plugins/ga.js", ssr: false },
  ],
  components: true,
  buildModules: [],
  modules: ["@nuxtjs/dotenv", "@nuxtjs/axios", "@nuxtjs/pwa"],
  axios: {
    baseURL: "/",
  },
  serverMiddleware: [
    { path: '/api/imdb-rating', handler: '~/api/imdb-rating.js' }
  ],
  pwa: {
    manifest: {
      lang: "es",
      name: "EnterCinema",
      short_name: "EnterCinema",
      description: "El instante en el que descubres qué ver.",
      theme_color: "#03496B",
      background_color: "#ffffff",
      display: "standalone",
      start_url: "/",
      icons: [
        {
          src: "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable"
        },
        {
          src: "/icon-512x512.webp",
          sizes: "512x512",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "/icon-512x512.webp",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable"
        }
      ]
    },
    icon: false,
    workbox: {
      enabled: false
    }
  },
  loaders: {
    cssModules: {
      camelCase: true,
      localIdentName: "[local]_[hash:base64:5]",
    },
  },
  vue: {
    config: {
      productionTip: false,
      devtools: false,
    },
  },
  env: {
    IMDB_DB_URL: process.env.IMDB_DB_URL,
    IMDB_DB_TOKEN: process.env.IMDB_DB_TOKEN,
    MDBLIST_API: process.env.MDBLIST_API,
    FRONTEND_URL: process.env.FRONTEND_URL || "https://es.entercinema.com",
    API_URL: process.env.API_URL || "https://entercinema-drf.vercel.app",
    API_KEY: process.env.API_KEY || "",
    API_LANG: "es-ES",
    API_COUNTRY: "es-ES",
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
    API_YOUTUBE_KEY: process.env.API_YOUTUBE_KEY || "",
    GA: process.env.GA || "",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  },
  loading: {
    color: "#2196f3",
  },
};