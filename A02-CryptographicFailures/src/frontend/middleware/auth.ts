import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useUserStore } from '@/stores/user'

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) { // ตรวจสอบว่าอยู่ใน client
    const userStore = useUserStore()

    if (!userStore.authenticated) {
      return navigateTo('/login')
    }
  }
})