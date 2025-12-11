import { useCityStore } from '~/stores/city'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const cityStore = useCityStore()
  
  // اگر قبلاً لود شده، دوباره لود نکن
  if (cityStore.list.length > 0) return
  
  await cityStore.load()
})



