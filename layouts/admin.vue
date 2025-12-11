<template>
  <div dir="rtl">
    <div :class="['w-full min-h-screen flex font-sans persian-number', $route?.name || '']">
      <admin-aside :open="asideOpen" @close="asideOpen = false"/>
      <div class="xl:border-r-4 border-blue-450 w-4/5 bg-gray-50 flex-grow">
        <header class="bg-blue-450 w-full relative flex justify-end" style="height: 140px; border-bottom-left-radius: 4rem;">
          <span
            class="absolute bottom-4 block bg-white rounded-l-3xl cursor-pointer"
            style="right: 2px"
            @click="asideOpen = true"
          >
            <i class="flaticon-077-menu-1 px-4 py-2 block" style="font-size: 24px;"></i>
          </span>
          <div class="ml-16 flex w-1/2 justify-end items-center">
            <div class="w-1/2 ml-4 hidden lg:block relative">
              <Input
                v-model="searchKey"
                placeholder="جستجو"
                @keyup.enter="setSearchKey"
                @focus="searchIsActive = true"
                @blur="blurSearch"
              />
              <i
                v-show="searchIsActive"
                class="flaticon-034-cancel absolute left-3 top-3 font-bold text-sm text-gray-600 cursor-pointer"
                @click="clearSearch"
              ></i>
            </div>
            <span class="mr-2 mx-12 text-white">
              <i class="flaticon-161-alarm cursor-pointer text-2xl"></i>
            </span>
            <Menu icon-color="#fff" :container-classes="['-ml-8']"/>
          </div>
        </header>
        <main class="py-8 px-4 xl:px-8">
          <slot />
        </main>
      </div>
    </div>

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

  </div>
</template>

<script>
import Menu from "../components/Menu";
import AdminAside from "~/components/admin/aside";
import { useNotificationStore } from "~/stores/notification";
import { useAppStore } from "~/stores/app";

export default {
  components: {Menu, AdminAside},
  data() {
    return {
      asideOpen: false,
      searchIsActive: false,
      searchKey: '',
    }
  },
  computed: {
    notificationStore() {
      return useNotificationStore()
    },
    appStore() {
      return useAppStore()
    }
  },
  methods: {
    setSearchKey() {
      this.appStore.setAdminSearchKey(this.searchKey)
    },
    blurSearch() {
      setTimeout(() => {this.searchIsActive = false},100)
    },
    clearSearch() {
      this.searchKey = ''
      this.appStore.setAdminSearchKey('')
    }
  }
}
</script>

<style>
aside i {
  font-size: 22px;
}
.admin-nav .nuxt-link-active {
  color: #fff;
  background-color: #737dff;
}
</style>
