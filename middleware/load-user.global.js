import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore()
  const { $axios } = useNuxtApp()
  
  // فقط یک بار لود کن
  if (userStore.data !== null) return
  
  try {
    const response = await $axios.$get('user')
    userStore.setUser(response)
  } catch (e) {
    userStore.setUser(null)
  }
})



