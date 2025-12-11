<template>

  <form @submit.prevent="submit">

    <div class="w-full mb-8 sm:mb-4">
      <img src="~/assets/images/logo.png" alt="" class="block mx-auto w-28 sm:w-auto mb-4 sm:mb-0 mt-8 sm:mt-0">
      <p class="text-blue-450 font-bold text-center mt-2 mb-6">ثبت نام حساب کاربری</p>
    </div>

    <Input
      v-model="form.phone"
      placeholder="09*********"
      label-class="text-sm font-medium"
      input-class="h-60-px pl-16 dir-ltr"
      error-list-class="text-center text-sm font-medium"
      label="شماره همراه خود را وارد کنید"
      class="mb-4"
      :errors="errors"
    >
      <template #icon>
        <i class="flaticon-109-smartphone absolute left-6 top-4 text-2xl text-blueGray-550"></i>
      </template>
    </Input>

    <div class="w-full mt-12 sm:mt-0">
      <button
        type="submit"
        class="w-full ml-1 flex items-center bg-blue-450 text-white rounded py-3 justify-center"
      >
        دریافت کد فعالسازی
      </button>
    </div>

  </form>

</template>

<script>
export default {
  data() {
    return {
      errors: null,
      form: {
        phone: ''
      }
    }
  },
  methods: {
    submit() {
      const { $axios } = useNuxtApp()
      
      $axios.$post('send_verification', this.form)
        .then(() => {
          this.$emit('done', this.form.phone)
        })
        .catch(error => {
          this.errors = error.response?.data?.errors?.phone || null
        })
    }
  }
}
</script>
