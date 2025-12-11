<template>
<div class="flex flex-wrap bg-white p-4 pb-16 rounded justify-evenly md:w-11/12">
  <div class="w-full md:w-1/3">
    <authentication-avatar-field
      border-color="cyan-250"
      class="mb-14"
      :value="oldAvatar"
      @input="avatar = $event"
    />
    <Input v-model="form.firstname" label="نام" class="w-full mb-8" input-class="h-14" label-class="text-gray-400"/>
    <Input v-model="form.lastname" label="نام خانوادگی" class="w-full mb-8" input-class="h-14" label-class="text-gray-400"/>
    <Input v-model="form.email" label="ایمیل" class="w-full mb-8" input-class="h-14" label-class="text-gray-400"/>
    <Input v-model="form.phone"
           disabled label="شماره همراه" class="w-full mb-8" input-class="h-14 text-gray-400" label-class="text-gray-400"/>
  </div>
  <div class="w-full md:w-1/3 pt-8 md:pt-28">
    <p class="text-cyan-250 mb-12 font-semibold">تغییر رمز عبور</p>
    <Input v-model="form.password" label="رمز عبور جدید" class="w-full mb-8" input-class="h-14" label-class="text-gray-400"/>
    <Input v-model="form.password_confirmation" label="تکرار رمز عبور" class="w-full mb-8" input-class="h-14" label-class="text-gray-400"/>
    <div class="pt-2">
      <button
        class="bg-blue-450 rounded px-3 py-4 text-white w-full shadow-lg md:mt-36"
        @click="submit"
      >
        ذخیره اطلاعات
      </button>
    </div>
  </div>
</div>
</template>

<script>
import AuthenticationAvatarField from "~/components/authentication/AvatarField";
export default {
  components: {AuthenticationAvatarField},
  layout: 'panel',
  data() {
    return {
      form: {
        firstname: this.$store.state.user.data.firstname || '',
        lastname: this.$store.state.user.data.lastname || '',
        email: this.$store.state.user.data.email || '',
        phone: this.$store.state.user.data.phone,
        password: '',
        password_confirmation: '',
      },
      oldAvatar: this.$store.state.user.data.avatar || '',
      avatar: null,
    }
  },
  methods: {
    submit() {
      const formData = new FormData()
      formData.append('firstname', this.form.firstname)
      formData.append('lastname', this.form.lastname)
      formData.append('email', this.form.email)
      formData.append('password', this.form.password)
      formData.append('password_confirmation', this.form.password_confirmation)
      formData.append('_method', 'PUT')

      if (this.avatar) {
        formData.append('avatar', this.avatar)
      }

      const headers = {'Content-Type': 'multipart/form-data'}
      this.$axios.$post('user', formData, {headers})
        .then(response => {
          this.form.firstname = response.firstname
          this.form.lastname = response.lastname
          this.form.email = response.email
          this.form.firstname = response.firstname
          this.form.phone = response.phone
          this.form.password = ''
          this.form.password_confirmation = ''
          this.form.avatar = response.avatar
          this.$store.commit('user/setUser', response)
          this.$store.commit('notification/success', 'اطلاعات پروفایل بروزرسانی شد.')
        })
    }
  }
}
</script>
