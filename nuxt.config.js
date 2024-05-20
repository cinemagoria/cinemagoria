export default {
  // https://nuxtjs.org/deployments/netlify/
  target: "static",

  ssr: false,

  generate: {
    fallback: true,
  },

  // Headers of the page
  head: {
    title: "Cinemathe - Fast-track your entertainment picks.",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Fast-track your entertainment picks.",
      },
      { hid: "author", name: "author", content: "ivanluna.dev" },
      { hid: "og:locale", property: "og:locale", content: "en_GB" },
      { hid: "og:title", property: "og:title", content: "Cinemathe" },
      {
        hid: "og:description",
        property: "og:description",
        content: "Fast-track your entertainment picks.",
      },
      { hid: "og:type", property: "og:type", content: "website" },
      {
        hid: "og:url",
        property: "og:url",
        content: "https://ivanluna.dev/",
      },

    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "//fonts.googleapis.com/css?family=Roboto:300,400,500",
      },
    ],
  },

  // Global CSS
  css: ["@/assets/css/global.scss"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~/plugins/lazyload.js",
    "~/plugins/filters.js",
    { src: "~/plugins/ga.js", ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    "@nuxtjs/eslint-module",
  ],

  modules: ["@nuxtjs/dotenv", "@nuxtjs/axios", "@nuxtjs/pwa"],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: "/",
  },



  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: "en",
      name: "Cinemathe",
      short_name: "Cinemathe",
      description: "Fast-track your entertainment picks.",
      theme_color: "#03496B",

    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
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
    FRONTEND_URL: process.env.FRONTEND_URL || "https://en.Cinemathe.netlify.app",
    API_KEY: process.env.API_KEY || "",
    API_LANG: process.env.API_LANG || "en",
    API_COUNTRY: process.env.API_COUNTRY || "en",
    SUPABASE_URL: process.env.SUPABASE_URL || "https://lamskoiorahedpvfkvav.supabase.co",
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
    API_YOUTUBE_KEY: process.env.API_YOUTUBE_KEY || "",
    GA: process.env.GA || "",
  },


  // Customize the progress bar color
  loading: {
    color: "#2196f3",
  },
};
