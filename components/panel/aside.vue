<template>
  <div class="flex-grow-0 xl:w-80 2xl:w-1/5 no-print text-sm md:text-base">
    <aside :class="[
    ' lg:bg-white h-screen w-72 xl:w-full panel-sidebar',
    'fixed right-0 top-0 z-50 lg:border-l overflow-y-auto transition-all duration-300',
    'xl:block xl:static xl:h-auto xl:overflow-y-hidden',
    open ? 'right-0' : '-right-72 xl:-right-80'
  ]">
      <div class="bg-white px-4 lg:px-6 border lg:border-0 border-r-0 mt-24 lg:mt-0">
        <div class="hidden lg:block">
          <NuxtLink to="/">
            <img class="mt-8 mx-auto h-12" src="~/assets/images/logo-2.png" alt="">
          </NuxtLink>
        </div>
        <div class="flex flex-col lg:items-center mt-0 lg:mt-16 -mr-2 relative">
          <div class="-mt-10 lg:mt-0">
            <img :src="storagePath + (user.avatar || 'avatars/default.png')" alt="" class="w-20 h-20 lg:w-24 lg:h-24 rounded-full border border-cyan-250 object-cover">
          </div>

          <div class="mt-2 lg:mt-6 mb-4">
            <div class="font-semibold" v-text="user.firstname || user.lastname ? `${user.firstname} ${user.lastname}` : 'کاربر بدون نام'"></div>
          </div>

          <nuxt-link :to="`/panel/users/${user.id}/comments`" class="flex items-center flex-col lg:flex-row absolute lg:static -top-5 right-20 mr-2 lg:mr-0">
            <icons-solid-star class="w-6 h-6 text-gold"/>
            <span class="lg:mr-2">{{ user.score }}</span>
          </nuxt-link>

        </div>
        <div class="overflow-y-auto overflow-x-hidden -mx-4 px-4 lg:mx-0 lg:px-0 panel-nav-wrapper ">
          <nav class="panel-nav mt-4 lg:mt-16">

            <hr class="lg:hidden border-cyan-250 mb-5 lg:mb-8 -mx-4">

            <nuxt-link
              to="/panel"
              :exact="true"
              class="hidden lg:block rounded-lg flex w-full mb-2.5 px-4 lg:px-8 py-1.5 items-center"
            >
              <i class="flex-grow-0 pl-4 flaticon-028-user-1 text-blueGray-350"></i>
              <span class="text-sm font-medium text-blueGray-550">پروفایل</span>
            </nuxt-link>

            <nuxt-link
              v-if="$store.state.user.has_business"
              to="/panel/businesses"
              class="rounded-lg flex w-full mb-2.5 px-4 lg:px-8 py-1.5 items-center"
            >
              <i class="flex-grow-0 pl-4 flaticon-032-briefcase text-blueGray-350"></i>
              <span class="text-sm font-medium text-blueGray-550">کسب و کار</span>
            </nuxt-link>

            <button
              v-else
              class="rounded-lg flex w-full mb-2.5 px-4 lg:px-8 py-1.5 items-center"
              @click="businessModalOpen = true"
            >
              <i class="flex-grow-0 pl-4 flaticon-032-briefcase text-blueGray-350"></i>
              <span class="text-sm font-medium text-blueGray-550">کسب و کار</span>
            </button>

            <hr class="border-cyan-250 mb-5 lg:mb-12 mt-5 lg:mt-8 -mx-4 lg:mx-0">

            <nuxt-link
              v-for="(item, index) in menu"
              :key="index"
              :exact="item.hasOwnProperty('exact') ? item.exact : false"
              :to='item.link'
              class="rounded-lg flex w-full mb-2.5 px-4 lg:px-8 py-1.5 items-center"
              @click.native="$emit('close')"
            >
              <i v-if="item.icon" :class="'flex-grow-0 pl-4 text-blueGray-350 '+item.icon"></i>
              <component
                :is="item.icon_component"
                v-if="item.icon_component"
                class="flex-grow-0 pl-4 text-blueGray-350 w-10"
              />
              <span class="text-sm font-medium text-blueGray-550">{{ item.label }}</span>
            </nuxt-link>

            <button
              class="rounded-lg flex w-full mb-2.5 px-4 lg:px-8 py-1.5 items-center"
              @click="logoutModalOpen = true"
            >
              <i class="flex-grow-0 pl-4 flaticon-059-log-out text-blueGray-350"></i>
              <span class="text-sm font-medium text-blueGray-550">خروج از حساب کاربری</span>
            </button>
          </nav>
        </div>
      </div>
    </aside>

    <transition enter-active-class="ease-out duration-300"
                enter-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="ease-in duration-200"
                leave-class="opacity-100"
                leave-to-class="opacity-0">
      <div v-show="open" class="fixed inset-0 transform transition-all xl:hidden z-40" @click="$emit('close')">
        <div class="absolute inset-0 bg-gray-500 lg:opacity-75 opacity-0"></div>
      </div>
    </transition>

    <modal
      v-if="!$store.state.user.has_business"
      :show="businessModalOpen"
      :center="true"
      max-width="3xl"
      @close="businessModalOpen = false"
    >
      <div class="text-center p-6 lg:p-12">
        <img src="~/assets/images/logo.png" alt="" class="mx-auto w-32 lg:w-auto">
        <p class="my-6 lg:my-16 text-sm lg:text-lg font-semibold">
          کاربر گرامی توجه
          <br>
          اگر صاحب کسب و کار نیستید از صفحه کسب و کار خارج شوید
        </p>
        <div class="flex justify-center">
          <button
            class="w-60 h-10 lg:h-14 rounded bg-blue-450 text-white flex items-center justify-center mx-2 lg:mx-4"
            @click="businessModalOpen = false"
          >
            بازگشت
          </button>
          <button
            class="w-60 h-10 lg:h-14 rounded border border-blue-450 text-blue-450 flex items-center justify-center mx-2 lg:mx-4"
            @click="confirm"
          >
            ثبت کسب و کار
          </button>
        </div>
      </div>
    </modal>

    <modal
      :show="logoutModalOpen"
      :center="true"
      max-width="3xl"
      @close="logoutModalOpen = false"
    >
      <div class="text-center p-6 lg:p-12">
        <img src="~/assets/images/logo.png" alt="" class="mx-auto w-32 lg:w-auto">
        <p class="my-6 lg:my-16 text-sm lg:text-lg font-semibold">
          آیا می خواهید از حساب کاربری خارج شوید ؟
        </p>
        <div class="flex justify-center">
          <button
            class="w-60 h-10 lg:h-14 rounded bg-blue-450 text-white flex items-center justify-center mx-2 lg:mx-4"
            @click="logout"
          >
            <span v-if="loggingOut" class="loader mx-8 w-5 h-5 border-2 rounded-full border-blue-300"></span>
            <span v-else>بله</span>
          </button>
          <button
            class="w-60 h-10 lg:h-14 rounded border border-blue-450 text-blue-450 flex items-center justify-center mx-2 lg:mx-4"
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
import IconsSolidStar from "~/components/icons/solid/star";
export default {
  name: "PanelAside",
  components: {IconsSolidStar},
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      storagePath: process.env.storagePath,
      menu: [
        {label: 'سفارش من', link: '/panel/my-orders', icon_component: 'icons-orders'},
        {label: 'چت', link: '/panel/chat', icon: 'flaticon-160-chat'},
        {label: 'ذخیره شده ها', link: '/panel/bookmarks', icon: 'flaticon-154-bookmark'},
        {label: 'ویرایش حساب', link: '/panel/edit-profile', icon: 'flaticon-068-pencil'},
        {label: 'بازگشت به بازاربین', link: '/', icon: 'flaticon-071-reply', exact: true}
      ],
      businessModalOpen: false,
      logoutModalOpen: false,
      has_business: false,
      loggingOut: false,
    }
  },
  async fetch() {
    await this.$axios.$get('home/businesses')
      .then(response => {
        response?.length && this.$store.commit('user/setBusinesses', response)
        this.$store.commit('user/hasBusiness', !! response?.length)
      })
  },
  computed: {
    user() {
      return this.$store.state.user.data
    }
  },

  watch: {
    businessModalOpen(value) {
      value && this.$emit('close')
    },
    logoutModalOpen(value) {
      value && this.$emit('close')
    },
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

  beforeDestroy() {
    document.removeEventListener('keydown', this.closeOnEscape)
    document.body.style.overflow = null
  },

  methods: {
    closeOnEscape(e) {
      if (e.key === 'Escape' && this.show) {
        this.$emit('close')
      }
    },
    confirm() {
      this.businessModalOpen = false
      this.$router.push('/panel/businesses')
    },
    logout() {
      this.loggingOut = true
      this.$axios.$post('logout')
        .then(() => {
          this.$store.commit('user/setUser', null)
          this.$store.commit('user/setToken', null)
          this.loggingOut = false
          this.logoutModalOpen = false
          this.$router.push('/')
        })
    }
  }
}
</script>

<style lang="scss">

.panel-sidebar {

  i {
    font-size: 22px;
  }
}

.panel-nav {

  .nuxt-link-active {
    background-color: #737dff;

    span, i, svg {
      color: #fff;
    }
  }
}

.panel-nav-wrapper {
  height: calc(100vh - 12rem);

  @media (min-width: 1024px) {
    height: auto;
  }
}

</style>
