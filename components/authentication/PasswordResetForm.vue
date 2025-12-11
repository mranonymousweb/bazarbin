<template>
  <form @submit.prevent="submit">
    <div class="w-full mb-4">
      <img src="~/assets/images/logo.png" alt="" class="block mx-auto">
      <p class="text-blue-450 font-bold text-center my-2">بازیابی رمز عبور</p>
    </div>


    <Input
      v-model="password"
      label-class="text-sm font-medium"
      input-class="h-60-px pl-16 dir-ltr"
      label="رمز عبور جدید"
      type="password"
      class="mb-4"
      error-list-class="text-sm font-medium"
      :errors="errors && errors.hasOwnProperty('password') && errors.password"
    >
      <template #icon>
        <i class="flaticon-006-key absolute left-6 top-4 text-2xl text-blueGray-550"></i>
      </template>
    </Input>

    <Input
      v-model="password_confirmation"
      label-class="text-sm font-medium"
      input-class="h-60-px pl-16 dir-ltr"
      label="تکرار رمز عبور"
      type="password"
      class="mb-12"
    >
      <template #icon>
        <i class="flaticon-006-key absolute left-6 top-4 text-2xl text-blueGray-550"></i>
      </template>
    </Input>

    <div class="w-full">
      <p v-if="error_message" class="text-sm font-medium text-red-550 mb-2">{{ error_message }}</p>
      <button
        type="submit"
        class="w-full ml-1 flex items-center bg-blue-450 text-white rounded py-2 justify-center"
      >
        تغییر رمز عبور
      </button>
    </div>

  </form>
</template>

<script>
export default {
  props: {
    phone: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      errors: null,
      error_message: null,
      password: '',
      password_confirmation: ''
    }
  },
  methods: {
    async submit() {
      const { $axios } = useNuxtApp()
      
      // Reset errors
      this.errors = null
      this.error_message = null
      
      const form = {
        phone: this.phone,
        password: this.password,
        password_confirmation: this.password_confirmation,
        verification_token: this.token
      }
      
      console.log('Sending recovery request:', { phone: this.phone, hasToken: !!this.token })
      
      $axios.$post('recover_password', form)
        .then(() => {
          this.$emit('done')
        })
        .catch(error => {
          console.error('Password recovery error:', error)
          console.error('Error response:', error.response)
          
          this.errors = error.response?.data?.errors || null
          if (error.response?.status !== 422) {
            this.error_message = error.response?.data?.message || 'خطایی رخ داده است.'
          } else {
            // For 422, show validation errors
            const firstErrorKey = Object.keys(this.errors || {})[0]
            if (firstErrorKey && this.errors[firstErrorKey] && this.errors[firstErrorKey].length > 0) {
              this.error_message = this.errors[firstErrorKey][0]
            }
          }
        })
    }
  }
}
</script>
