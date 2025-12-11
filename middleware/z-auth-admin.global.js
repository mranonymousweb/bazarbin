import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // فقط برای صفحات admin اجرا کن
  if (!to.path.startsWith('/admin')) {
    return
  }
  
  const userStore = useUserStore()
  
  // اگر کاربر لود نشده، ابتدا لود کن (مثل load.user middleware)
  if (userStore.data === null) {
    const { $axios } = useNuxtApp()
    try {
      const response = await $axios.$get('user')
      userStore.setUser(response)
    } catch (e) {
      console.error('Error loading user in auth-admin middleware:', e)
      userStore.setUser(null)
    }
  }
  
  const user = userStore.data
  
  // بررسی دسترسی ادمین - دقیقاً مانند سورس قبلی
  if (
    !user ||
    !user?.roles ||
    user.roles.findIndex(x => x.name === 'super-admin') < 0
  ) {
    return navigateTo('/')
  }
})

