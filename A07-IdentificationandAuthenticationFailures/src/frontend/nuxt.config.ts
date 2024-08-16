// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura';

require('dotenv').config()

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: false,
  devtools: { enabled: true },
  modules: ["@primevue/nuxt-module", "@nuxtjs/tailwindcss", "@pinia/nuxt"],
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  },
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL
    }
  },
  app: {
    head: {
      title: 'A07-Identification and Authentication Failures'
    }
  }
})