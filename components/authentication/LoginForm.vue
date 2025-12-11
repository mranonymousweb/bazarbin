<template>
  <form @submit.prevent="submit">

    <div class="w-full mb-8 sm:mb-4">
      <img src="~/assets/images/logo.png" alt="" class="block mx-auto w-28 sm:w-auto mb-4 sm:mb-0 mt-8 sm:mt-0">
      <p class="text-blue-450 font-bold text-center mt-2 mb-6">ورود به حساب کاربری</p>
    </div>

    <Input
      v-model="form.phone"
      placeholder="09*********"
      label-class="text-sm font-medium"
      input-class="h-60-px pl-16 dir-ltr"
      label="شماره همراه خود را وارد کنید"
      class="mb-4"
    >
      <template #icon>
        <i class="flaticon-109-smartphone absolute left-6 top-4 text-2xl text-blueGray-550"></i>
      </template>
    </Input>
    <Input
      v-model="form.password"
      placeholder="********"
      label-class="text-sm font-medium"
      input-class="h-60-px pl-16 dir-ltr"
      label="رمز عبور خود را وارد کنید"
      type="password"
      class="mb-4"
    >
      <template #icon>
        <i class="flaticon-168-padlock absolute left-6 top-4 text-2xl text-blueGray-550"></i>
      </template>
    </Input>
    <div class="flex flex-wrap sm:flex-nowrap justify-between text-sm mt-8 mb-8 sm:mt-2">
      <Checkbox
        v-model="form.remember"
        class="text-sm font-medium mb-4 w-full sm:w-auto"
        label="مرا به خاطر داشته باش"
      />
      <span
        class="text-red-550 cursor-pointer font-medium text-sm w-full sm:w-auto mt-4 sm:mt-0"
        @click="$emit('forget-password')"
      >رمز عبور خود را فراموش کرده اید؟</span>
    </div>
    <div class="flex">
      <button
        type="submit"
        class="w-full sm:w-1/2 sm:ml-1 flex items-center bg-blue-450 text-white rounded py-3 justify-center"
      >
        ورود
      </button>
      <button
        type="button"
        class="hidden sm:flex w-1/2 mr-1 items-center border-2 border-blue-450 text-blue-450 rounded py-3 justify-center"
        @click="$emit('register')"
      >
        ثبت نام
      </button>
    </div>

    <div class="w-full text-center mt-8 text-sm font-medium">
      کاربر جدید بازاربین هستید؟
      <span class="text-blue-450 cursor-pointer" @click="$emit('register')">ثبت نام</span>
      کنید.
    </div>

  </form>
</template>

<script>
import { useUserStore } from '~/stores/user'
import { useNotificationStore } from '~/stores/notification'
import errorParser from "~/mixins/error_parser";

export default {
  name: "LoginForm",
  mixins: [errorParser],
  data() {
    return {
      form: {
        phone: '',
        password: '',
        remember: false,
      }
    }
  },
  methods: {
    submit() {
      const { $axios } = useNuxtApp()
      const userStore = useUserStore()
      const notificationStore = useNotificationStore()
      
      $axios.$post('login', this.form)
        .then(response => {
          userStore.setUser(response.user)
          userStore.setToken(response.access_token)
          this.$emit('login')
        })
        .catch(error => {
          this.showError(error, notificationStore)
        })
    },

  }
}
</script>
