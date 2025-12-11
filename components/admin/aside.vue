<template>
  <div class="flex-grow-0 xl:w-80 2xl:w-1/5">
    <aside :class="[
    'px-8 flex-grow-0 bg-white h-screen w-80 xl:w-full',
    'fixed right-0 top-0 z-50 border-l overflow-y-scroll transition-all duration-300',
    'xl:block xl:static xl:h-auto xl:overflow-y-hidden',
    open ? 'right-0' : '-right-80'
  ]">
      <div>
        <div>
          <NuxtLink to="/">
            <img class="my-8 mx-auto" src="~/assets/images/logo.png" alt="">
          </NuxtLink>
        </div>
        <nav class="admin-nav">
          <nuxt-link
            v-for="(item, index) in menu"
            :key="index"
            :exact="item.hasOwnProperty('exact') ? item.exact : false"
            :to='item.link'
            class="rounded-lg flex w-full mb-2.5 bg-gray-50 px-2.5 py-1.5 text-gray-700 items-center"
            @click="closeOnMobile"
          >
            <i v-if="item.icon" :class="'flex-grow-0 pl-2 '+item.icon"></i>
            <span class="text-sm font-medium">{{ item.label }}</span>
          </nuxt-link>

          <nuxt-link
            to='/admin/reports'
            class="rounded-lg flex w-full mb-2.5 bg-gray-50 px-2.5 py-1.5 text-gray-700 items-center"
            @click="closeOnMobile"
          >
            <svg class="flex-grow-0 ml-2" width="20" height="22" viewBox="0 0 20 22" fill="none" stroke="currentColor">
              <path d="M10 6.75V12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M0.919922 7.58003C0.919922 6.46003 1.51993 5.41999 2.48993 4.84999L8.42993 1.42C9.39993 0.86 10.6 0.86 11.58 1.42L17.52 4.84999C18.49 5.40999 19.09 6.45003 19.09 7.58003V14.42C19.09 15.54 18.49 16.58 17.52 17.15L11.58 20.58C10.61 21.14 9.40993 21.14 8.42993 20.58L2.48993 17.15C1.51993 16.59 0.919922 15.55 0.919922 14.42V11.66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 15.2V15.2999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-sm font-medium">گزارشات تخلف</span>
          </nuxt-link>

          <button
            class="rounded-lg flex w-full mb-2.5 bg-gray-50 px-2.5 py-1.5 text-gray-700 items-center"
            @click="logoutModalOpen = true"
          >
            <i class="flex-grow-0 pl-2 flaticon-059-log-out"></i>
            <span class="text-sm font-medium">خروج از حساب</span>
          </button>
        </nav>
      </div>
    </aside>

    <transition enter-active-class="ease-out duration-300"
                enter-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="ease-in duration-200"
                leave-class="opacity-100"
                leave-to-class="opacity-0">
      <div v-show="open" class="fixed inset-0 transform transition-all xl:hidden z-40" @click="$emit('close')">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
    </transition>

    <modal
      :show="logoutModalOpen"
      :center="true"
      max-width="4xl"
      @close="logoutModalOpen = false"
    >
      <div class="text-center pt-16 pb-20">
        <img src="~/assets/images/logo-2.png" alt="" class="mx-auto">
        <p class="mt-20 text-lg font-semibold">
          آیا می خواهید از حساب کاربری خارج شوید ؟
        </p>
        <div class="mt-20 flex justify-center">
          <button
            class="w-72 h-14 rounded bg-blue-450 text-white flex items-center justify-center mx-12"
            @click="logout"
          >
            <span v-if="loggingOut" class="loader mx-8 w-5 h-5 border-2 rounded-full border-blue-300"></span>
            <span v-else>بله</span>
          </button>
          <button
            class="w-72 h-14 rounded border border-blue-450 text-blue-450 flex items-center justify-center mx-12"
            @click="logoutModalOpen = false"
          >
            خیر
          </button>
        </div>
      </div>
    </modal>

  </div>
</template>

<script>
import { useUserStore } from '~/stores/user'

export default {
  name: "AdminAside",
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      logoutModalOpen: false,
      loggingOut: false,
      menu: [
        {label: 'داشبورد', link: '/admin', icon: 'flaticon-096-dashboard', exact: true},
        {label: 'صنف ها', link: '/admin/guilds', icon: 'flaticon-041-folder'},
        {label: 'شهر ها', link: '/admin/cities', icon: 'flaticon-097-pin'},
        {label: 'کسب و کارها', link: '/admin/businesses', icon: 'flaticon-032-briefcase'},
        {label: 'محصولات', link: '/admin/products', icon: 'flaticon-063-picture'},
        {label: 'سفارشات', link: '/admin/orders', icon: 'flaticon-091-shopping-cart'},
        {label: 'فرم ها', link: '/admin/forms', icon: 'flaticon-044-file'},
        {label: 'اطلاعات تماس', link: '/admin/contacts', icon: 'flaticon-136-phone-call'},
        {label: 'کاربران', link: '/admin/users', icon: 'flaticon-028-user-1'},
        {label: 'پیام ها', link: '/admin/messages', icon: 'flaticon-160-chat'},
        {label: 'مدیران', link: '/admin/admins', icon: 'flaticon-153-user'},
        {label: 'صفحات ثابت', link: '/admin/pages', icon: 'flaticon-044-file'}
      ]
    }
  },

  watch: {
    open(show) {
      if (show) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = null
      }
    }
  },

  mounted() {
    document.addEventListener('keydown', this.closeOnEscape)
  },

  beforeUnmount() {
    document.removeEventListener('keydown', this.closeOnEscape)
    document.body.style.overflow = null
  },

  methods: {
    closeOnMobile() {
      // فقط در موبایل sidebar را ببند
      if (typeof window !== 'undefined' && window.innerWidth < 1280) {
        this.$emit('close')
      }
    },
    closeOnEscape(e) {
      if (e.key === 'Escape' && this.open) {
        this.$emit('close')
      }
    },
    logout() {
      const { $axios } = useNuxtApp()
      const userStore = useUserStore()
      const router = useRouter()
      
      this.loggingOut = true
      $axios.$post('logout')
        .then(() => {
          userStore.logout()
          router.push('/')
        })
        .catch(() => {
          userStore.logout()
          router.push('/')
        })
        .finally(() => {
          this.loggingOut = false
          this.logoutModalOpen = false
        })
    }
  }
}
</script>

<style lang="scss">

aside {

  i {
    font-size: 22px;
  }
}

.admin-nav {

  .nuxt-link-active {
    color: #fff;
    background-color: #737dff;
  }
}
</style>
