<template>
  <div class="w-full min-h-screen flex flex-wrap font-sans persian-number bg-gray-50 px-4 md:px-10 xl:px-20 pt-4 pb-20 md:pt-7 md:pb-7 xl:pt-8 xl:pb-8" dir="rtl" style="min-height: 100dvh">

    <!-- منوی کناری دسکتاپ (ثابت در راست) -->
    <aside class="hidden lg:block fixed top-6 right-6 xl:right-10 bottom-6 z-40 w-60 xl:w-72">
      <div class="h-full bg-white border border-gray-100 rounded-2xl shadow-sm w-full p-5 overflow-y-auto">
        <div class="flex items-center mb-6">
          <NuxtLink to="/" class="flex items-center">
            <img class="h-12" src="~/assets/images/logo.png" alt="بازاربین">
          </NuxtLink>
        </div>
        <nav class="flex flex-col space-y-2">
          <NuxtLink
            v-for="item in desktopMenu"
            :key="item.label"
            :to="item.to"
            :class="[
              'flex items-center gap-3 rounded-xl px-4 py-3 transition-colors',
              isActive(item.to) ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            <span
              :class="[
                'flex items-center justify-center w-10 h-10 rounded-full',
                isActive(item.to) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              ]"
            >
              <component v-if="item.iconComponent" :is="item.iconComponent" class="w-5 h-5"/>
              <svg v-else-if="item.icon === 'search'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6 6a7.5 7.5 0 0 0 10.65 10.65Z" />
              </svg>
              <svg v-else-if="item.icon === 'add'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m7-7H5" />
              </svg>
              <svg v-else-if="item.icon === 'orders'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 4h6a2 2 0 0 1 2 2v14l-5-2-5 2V6a2 2 0 0 1 2-2Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 9h6M9 13h4" />
              </svg>
              <svg v-else-if="item.icon === 'myorders'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5h2l1.2 12.2A2 2 0 0 0 8.2 19h7.6a2 2 0 0 0 2-1.8L19 8H6" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 11v6M14 11v6M9 8c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2" />
              </svg>
              <svg v-else-if="item.icon === 'notifications'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 10a7 7 0 0 1 14 0v4.5l1.2 1.6a1 1 0 0 1-.8 1.6H4.6a1 1 0 0 1-.8-1.6L5 14.5Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 20a2 2 0 0 0 4 0" />
              </svg>
              <svg v-else-if="item.icon === 'bookmark'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16l-5-3-5 3Z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-6 8a6 6 0 0 1 12 0" />
              </svg>
            </span>
            <span class="text-sm font-medium">{{ item.label }}</span>
          </NuxtLink>
        </nav>
      </div>
    </aside>

    <main class="w-full flex-grow lg:pr-80 xl:pr-96" style="min-height: calc(100vh - 7rem)">
      <slot/>
    </main>
    
    <SuccessNotification
      v-if="notificationStore.success.active"
      :show="notificationStore.success.active"
      :message="notificationStore.success.message"
      :duration="notificationStore.success.duration"
      @close="notificationStore.closeSuccess()"
    />
    <ErrorNotification
      v-if="notificationStore.error.active"
      :show="notificationStore.error.active"
      :message="notificationStore.error.message"
      :code="notificationStore.error.code"
      :duration="notificationStore.error.duration"
      @close="notificationStore.closeError()"
    />

<div class="lg:hidden fixed bottom-0 right-0 w-full py-4 px-8 bg-white flex justify-between items-center z-50">
  <NuxtLink to="/panel/businesses/new" class="flex flex-col items-center text-center text-gray-600 hover:text-blue-600">
    <i class="flaticon-032-briefcase text-2xl leading-none"></i>
    <span class="text-xs mt-1">افزودن کسب و کار</span>
  </NuxtLink>

  <NuxtLink to="/qrcode" class="flex flex-col items-center text-center text-gray-600 hover:text-blue-600">
    <i class="flaticon-086-qr-code text-2xl leading-none"></i>
    <span class="text-xs mt-1">کیو از کد خوان</span>
  </NuxtLink>

  <NuxtLink to="/save" class="flex flex-col items-center text-center text-gray-600 hover:text-blue-600">
    <i class="flaticon-154-bookmark text-2xl leading-none"></i>
    <span class="text-xs mt-1">ذخیره ها</span>
  </NuxtLink>

  <NuxtLink to="/profile" class="flex flex-col items-center text-center text-gray-600 hover:text-blue-600">
    <i class="flaticon-028-user-1 text-2xl leading-none"></i>
    <span class="text-xs mt-1">حساب کاربری</span>
  </NuxtLink>
</div>
  </div>
</template>

<script>
import { useNotificationStore } from "~/stores/notification";
import { useUserStore } from "~/stores/user";

export default {
  data() {
    return {
      loginModal: false,
      storagePath: useRuntimeConfig().public.storagePath
    }
  },
  computed: {
    productsLink() {
      const userStore = useUserStore()
      if (userStore.user && userStore.user.business && userStore.user.business.length === 1) {
        return `/panel/businesses/${userStore.user.business[0].id}/products`
      }
      return '/panel/businesses'
    },
    desktopMenu() {
      const userStore = useUserStore()
      const businesses = userStore.user?.business || userStore.businesses
      const businessOrdersLink = businesses && businesses.length === 1
        ? `/panel/businesses/${businesses[0].id}/orders`
        : '/panel/businesses'

      return [
        {label: 'جستجو', to: '/search', icon: 'search'},
        {label: 'افزودن کالا و خدمات', to: '/panel/businesses/new', icon: 'add'},
        {label: 'سفارش مشتری', to: businessOrdersLink, icon: 'orders'},
        {label: 'سفارش من', to: '/panel/my-orders', icon: 'myorders'},
        {label: 'پیام ها', to: '/notifications', icon: 'notifications'},
        {label: 'ذخیره ها', to: '/panel/bookmarks', icon: 'bookmark'},
        {label: 'پروفایل', to: '/panel', icon: 'profile'}
      ]
    },
    notificationStore() {
      return useNotificationStore()
    }
  },
  methods: {
    isActive(path) {
      const current = this.$route.path
      if (path === '/') {
        return current === '/'
      }
      return current.startsWith(path)
    }
  }
}
</script>
