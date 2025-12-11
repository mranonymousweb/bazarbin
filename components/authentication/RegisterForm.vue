<template>
  <form @submit.prevent="submit">

    <img
      v-if="avatar_src"
      :src="avatar_src"
      alt=""
      class="w-24 h-24 object-cover rounded-full border border-blue-450 mx-auto mb-16 mt-8 sm:mt-0 cursor-pointer"
      @click="$refs.file.click()"
    >
    <label v-else ref="label" for="avatar-input" class="relative w-28 h-32 mx-auto block text-center mb-12 mt-8 sm:mt-0 cursor-pointer">
      <i class="flaticon-037-photo-camera border-2 border-blue-450 rounded-full mx-auto text-4xl w-24 h-24 flex items-center justify-center"></i>
      <i class="flaticon-043-plus border-2 border-blue-450 rounded-full w-6 h-6 text-xs font-bold flex items-center justify-center left-3 bottom-8 absolute bg-white"></i>
      <span class="font-medium">افزودن عکس</span>
    </label>

    <ul v-if="errors && errors.hasOwnProperty('avatar')" class="mt-2 text-red-550 text-sm text-sm font-medium mb-8 -mt-8">
      <li v-for="(e,index) in errors.avatar" :key="index" v-text="e"></li>
    </ul>

    <input id="avatar-input" ref="file" type="file" class="hidden" @input="checkFile"/>

    <Input
      v-model="firstname"
      label-class="text-sm font-medium"
      input-class="h-60-px"
      error-list-class="text-sm font-medium"
      label="نام"
      class="mb-4"
      :errors="errors && errors.hasOwnProperty('firstname') ? errors.firstname : []"
    />

    <Input
      v-model="lastname"
      label-class="text-sm font-medium"
      input-class="h-60-px"
      error-list-class="text-sm font-medium"
      label="نام خانوادگی"
      class="mb-4"
      :errors="errors && errors.hasOwnProperty('lastname') ? errors.lastname : []"
    />

    <Input
      v-model="password"
      label-class="text-sm font-medium"
      input-class="h-60-px pr-16 dir-ltr"
      error-list-class="text-sm font-medium"
      label="رمز ورود"
      type="password"
      class="mb-4"
      :errors="errors && errors.hasOwnProperty('password') ? errors.password : []"
    >
      <template #icon>
        <i class="flaticon-006-key absolute right-6 top-4 text-2xl text-blueGray-550"></i>
      </template>
    </Input>

    <Input
      v-model="password_confirmation"
      label-class="text-sm font-medium"
      input-class="h-60-px pr-16 dir-ltr"
      error-list-class="text-sm font-medium"
      label="تکرار رمز ورود"
      type="password"
      class="mb-12"
      :errors="errors && errors.hasOwnProperty('password_confirmation') ? errors.password_confirmation : []"
    >
      <template #icon>
        <i class="flaticon-006-key absolute right-6 top-4 text-2xl text-blueGray-550"></i>
      </template>
    </Input>

    <div v-if="errorMessage" class="mb-2 text-red-550 text-sm">
      {{ errorMessage }}
    </div>

    <div class="w-full">
      <button
        type="submit"
        class="w-full ml-1 flex items-center bg-blue-450 text-white rounded py-3 justify-center"
      >
        ثبت نام
      </button>
    </div>

  </form>
</template>

<script>
import { useUserStore } from '~/stores/user'

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
      firstname: '',
      lastname: '',
      password: '',
      password_confirmation: '',
      avatar: null,
      avatar_src: null,
      errors: null,
      errorMessage: null,
    }
  },
  mounted() {
    this.$refs.label.ondragover = this.$refs.label.ondragenter = function(evt) {
      evt.preventDefault();
    }
    this.$refs.label.ondrop = (evt) => {
      this.$refs.file.files = evt.dataTransfer.files;
      evt.preventDefault();
      this.checkFile()
    }
  },
  methods: {
    submit() {
      const { $axios } = useNuxtApp()
      const userStore = useUserStore()
      
      // Reset errors
      this.errors = null
      this.errorMessage = null
      
      const formData = new FormData();
      formData.append('phone', this.phone);
      formData.append('firstname', this.firstname);
      formData.append('lastname', this.lastname);
      formData.append('password', this.password);
      formData.append('password_confirmation', this.password_confirmation);
      formData.append('verification_token', this.token);

      if (this.avatar) {
        formData.append('avatar', this.avatar);
      }

      // Debug: Log form data
      console.log('Register Form Data:', {
        phone: this.phone,
        firstname: this.firstname,
        lastname: this.lastname,
        password: this.password ? '***' : '',
        password_confirmation: this.password_confirmation ? '***' : '',
        verification_token: this.token,
        hasAvatar: !!this.avatar
      })

      $axios.$post('register', formData)
        .then(response => {
          console.log('Register Success:', response)
          userStore.setUser(response.user)
          if (response.access_token) {
            userStore.setToken(response.access_token)
          }
          this.$emit('done')
        })
        .catch(error => {
          console.error('Register Error:', error)
          console.error('Error Response:', error.response)
          
          if (error.response?.data?.errors) {
            this.errors = error.response.data.errors
            // Show first error message
            const firstErrorKey = Object.keys(error.response.data.errors)[0]
            const firstError = error.response.data.errors[firstErrorKey]
            if (firstError && firstError.length > 0) {
              this.errorMessage = firstError[0]
            }
          } else {
            this.errorMessage = error.response?.status === 422 
              ? 'اطلاعات ارسالی معتبر نمی باشد.'
              : (error.response?.data?.message || 'خطایی رخ داده است.')
          }
        })
    },
    checkFile() {
      const [file] = this.$refs.file.files
      if (file) {
        this.avatar_src = URL.createObjectURL(file)
        this.avatar = file
      }
    },
  }
}
</script>
