<template>
  <div dir="rtl">
    <div class="w-full min-h-screen flex font-sans persian-number">
      <panel-aside :open="asideOpen" @close="asideOpen = false"/>
      <div class="xl:border-r-4 border-blue-450 w-4/5 bg-gray-50 flex-grow p-4 pb-20 lg:p-0 lg:pb-0">
        <header class="lg:bg-blue-450 w-full relative flex flex-wrap lg:flex-nowrap justify-end no-print panel-header">
          <div class="w-full lg:hidden">
            <div class="flex items-center">
              <button class="flex items-center" @click="$router.back()">
                <i class="flaticon-065-right-arrow-1 ml-4 sm:hidden"></i>
              </button>
              <NuxtLink to="/" class="flex items-center">
                <img class="mx-auto w-24" src="~/assets/images/logo.png" alt="">
              </NuxtLink>
              <div class="flex-grow"></div>
              <front-notifications-icon/>
            </div>
          </div>

          <div class="lg:hidden w-full mt-4">
            <span :class="['inline-block bg-white rounded-l-3xl p-1.5 pr-1 border border-r-0 -mr-4 transition ease-out duration-300', asideOpen ? 'opacity-0' : 'opacity-100']" @click="asideOpen = true">
              <img :src="storagePath + (user?.avatar || 'avatars/default.png')" alt="" class="w-10 h-10 border border-cyan-250 rounded-full  object-cover">
            </span>
          </div>

          <span
            class="hidden lg:block absolute bottom-4 block bg-white rounded-l-3xl cursor-pointer"
            style="right: 2px"
            @click="asideOpen = true"
          >
            <i class="flaticon-077-menu-1 px-4 py-2 block" style="font-size: 24px;"></i>
          </span>
          <div class="hidden lg:flex ml-16 w-1/2 justify-end items-center">
            <div class="w-1/2 ml-4 hidden lg:block">
              <Input
                v-model="searchKey"
                placeholder="جستجو"
              />
            </div>
            <span class="mr-2 mx-12 text-white">
              <i class="flaticon-161-alarm cursor-pointer text-2xl"></i>
            </span>
            <Menu icon-color="#fff" :container-classes="['-ml-8']"/>
          </div>
        </header>
        <main class="pt-4 lg:py-8 lg:px-4 xl:px-8">
          <slot />
        </main>
      </div>
    </div>

    <div class="lg:hidden fixed bottom-0 right-0 w-full py-4 px-8 bg-white flex justify-between align-center z-50" style="box-shadow: #9b9b9b 0 0 13px 2px;">
      <NuxtLink to="/">
        <svg width="24" height="24" viewBox="2 2 20.31 20.31">
          <path fill="currentColor" d="m18.031 16.617l4.283 4.282l-1.415 1.415l-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9s9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617m-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.867-3.133-7-7-7s-7 3.133-7 7s3.133 7 7 7a6.977 6.977 0 0 0 4.875-1.975z"></path>
        </svg>
      </NuxtLink>
      <NuxtLink :to="productsLink">
        <svg width="24" height="24" viewBox="3.52 3.51 16.95 16.98">
          <path fill="currentColor" d="M7.007 12a.75.75 0 0 1 .75-.75h3.493V7.757a.75.75 0 0 1 1.5 0v3.493h3.493a.75.75 0 1 1 0 1.5H12.75v3.493a.75.75 0 0 1-1.5 0V12.75H7.757a.75.75 0 0 1-.75-.75"></path> 	<path fill="currentColor" fill-rule="evenodd" d="M7.317 3.769a42.502 42.502 0 0 1 9.366 0c1.827.204 3.302 1.643 3.516 3.48c.37 3.157.37 6.346 0 9.503c-.215 1.837-1.69 3.275-3.516 3.48a42.5 42.5 0 0 1-9.366 0c-1.827-.205-3.302-1.643-3.516-3.48a40.903 40.903 0 0 1 0-9.503c.214-1.837 1.69-3.276 3.516-3.48m9.2 1.49a41.001 41.001 0 0 0-9.034 0A2.486 2.486 0 0 0 5.29 7.424a39.402 39.402 0 0 0 0 9.154a2.486 2.486 0 0 0 2.193 2.164c2.977.332 6.057.332 9.034 0a2.486 2.486 0 0 0 2.192-2.164a39.401 39.401 0 0 0 0-9.154a2.486 2.486 0 0 0-2.192-2.163" clip-rule="evenodd"></path>
        </svg>
      </NuxtLink>
      <NuxtLink to="/panel">
        <img src="~assets/images/icon-192.png" alt="" class="rounded-full border-2 border-black w-6">
      </NuxtLink>
    </div>

    <SuccessNotification
      v-if="notificationStore.success.active"
      :show="notificationStore.success.active"
      :message="notificationStore.success.message"
      @close="notificationStore.closeSuccess()"
    />

    <ErrorNotification
      v-if="notificationStore.error.active"
      :show="notificationStore.error.active"
      :message="notificationStore.error.message"
      :code="notificationStore.error.code"
      @close="notificationStore.closeError()"
    />

  </div>
</template>

<script>
import PanelAside from "~/components/panel/aside";
import { useUserStore } from "~/stores/user";
import { useNotificationStore } from "~/stores/notification";

export default {
  components: {PanelAside},
  data() {
    return {
      searchKey: '',
      asideOpen: false,
      echo: null,
      storagePath: useRuntimeConfig().public.storagePath,
    }
  },
  computed: {
    userStore() {
      return useUserStore()
    },
    notificationStore() {
      return useNotificationStore()
    },
    productsLink() {
      if (this.userStore.user && this.userStore.user.business && this.userStore.user.business.length === 1) {
        return `/panel/businesses/${this.userStore.user.business[0].id}/products`
      }
      return '/panel/businesses'
    },
    user() {
      return this.userStore.user
    }
  }
}
</script>

<style lang="scss">
aside i {
  font-size: 22px;
}
.admin-nav .nuxt-link-active {
  color: #fff;
  background-color: #737dff;
}

.panel-header {
  height: 115px;

  @media (min-width: 768px) {
    height: 140px;
    border-bottom-left-radius: 4rem;
  }
}

</style>
