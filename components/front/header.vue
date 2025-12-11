<template>
  <div class="flex items-center">
    <div class="flex items-center">
      <button class="flex items-center" @click="$router.back()">
        <i class="flaticon-065-right-arrow-1 ml-4 sm:hidden"></i>
      </button>
      <NuxtLink to="/" class="flex items-center">
        <img class="mx-auto w-24" src="~/assets/images/logo.png" alt="">
      </NuxtLink>
    </div>
    <div class="flex-grow"></div>
    <div class="w-1/3 mx-8 relative hidden sm:block">
      <input
        v-model="searchKey"
        placeholder="جستجو در بازاربین"
        class="w-full bg-white border rounded p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-450"
        @keyup.enter="doSearch"
      >
      <i class="absolute top-4 left-4">
        <icons-outline-search class="w-6 h-6 text-gray-500"/>
      </i>
    </div>
    <button v-if="!loggedIn" class="mr-8 ml-2 cursor-pointer">ثبت نام</button>
    <span v-if="!loggedIn">/</span>
    <button v-if="!loggedIn" class="mr-2 ml-8 cursor-pointer" style="color: #FF928F" @click="loginModal = true">ورود</button>

    <cart-btn v-if="loggedIn" class="mr-2 ml-4 sm:ml-8"/>
    <button v-if="loggedIn" class="mr-2 ml-6 sm:ml-10">
      <i class="flaticon-161-alarm cursor-pointer text-xl sm:text-2xl"></i>
    </button>
    <Menu/>

    <authentication-LoginModal
      :open="loginModal"
      @close="loginModal = false"
    />
  </div>
</template>

<script>
import IconsOutlineSearch from "~/components/icons/outline/search.vue";
import { useUserStore } from '~/stores/user';

export default {
  name: "FrontHeader",
  components: {IconsOutlineSearch},
  data() {
    return {
      searchKey: '',
      loginModal: false,
    }
  },
  computed: {
    userStore() {
      return useUserStore()
    },
    loggedIn() {
      return this.userStore.loggedIn
    }
  },
  methods: {
    doSearch() {
      if (this.searchKey) {
        this.$router.push(`/search?q=${this.searchKey}`)
      }
    }
  }
}
</script>
