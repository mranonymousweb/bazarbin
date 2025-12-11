export default defineNuxtConfig({
  ssr: false,

  app: {
    head: {
      title: 'بازاربین',
      htmlAttrs: {
        dir: 'rtl',
        lang: 'fa'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'در بازاربین کسب و کارها همیشه باز هستن'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/assets/images/icon-192.png' }
      ]
    }
  },

  css: [
    '~/assets/scss/main.scss',
    '~/assets/scss/iransans.scss',
    '~/assets/scss/icons.scss',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.BASE_URL || 'https://api.bazarbin.ir/api',
      storagePath: process.env.STORAGE_PATH || 'https://api.bazarbin.ir/storage/',
      neshanApiKey: process.env.NESHAN_API_KEY || '',
      pusherKey: process.env.PUSHER_KEY || '',
      pusherCluster: process.env.PUSHER_CLUSTER || 'ap2'
    }
  },

  build: {
    transpile: ['jalali-moment', 'sanitize-html']
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    }
  }
})
