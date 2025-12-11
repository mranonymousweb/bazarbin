<template>
  <div class="flex flex-wrap">

    <div class="w-full md:w-2/3 lg:w-3/5 xl:w-2/3 2xl:w-3/4 md:pl-4">
      <div class="rounded-t md:rounded-b p-8 bg-white">
        <h3 class="mb-4">
          <i class="pl-2 flaticon-043-plus"></i>
          <span v-if="user" class="font-semibold">ویرایش اطلاعات مدیر</span>
          <span v-else class="font-semibold">افزودن مدیر جدید</span>
        </h3>

        <Input
          v-model="form.firstname"
          class="mb-4"
          label="نام"
          :errors="errors && errors.hasOwnProperty('firstname') ? errors.firstname : []"
          @keyup="enterKey"
        />

        <Input
          v-model="form.lastname"
          class="mb-4"
          label="نام خانوادگی"
          :errors="errors && errors.hasOwnProperty('lastname') ? errors.lastname : []"
          @keyup="enterKey"
        />

        <Input
          v-model="form.phone"
          class="mb-4"
          label="شماره موبایل"
          :errors="errors && errors.hasOwnProperty('phone') ? errors.phone : []"
          @keyup="enterKey"
        />

        <Input
          v-model="form.email"
          class="mb-4"
          label="ایمیل"
          :errors="errors && errors.hasOwnProperty('email') ? errors.email : []"
          @keyup="enterKey"
        />

        <Input
          v-model="form.password"
          class="mb-4"
          label="رمز عبور"
          type="password"
          :errors="errors && errors.hasOwnProperty('password') ? errors.password : []"
          @keyup="enterKey"
        />

      </div>
    </div>

    <div class="w-full md:w-1/3 lg:w-2/5 xl:w-1/3 2xl:w-1/4 md:pr-4">
      <div class="rounded-b md:rounded-t p-4 bg-white">
        <h3 class="mb-4 hidden md:block">
          <i class="pl-2 flaticon-151-check"></i>
          <span v-if="user" class="font-semibold">ویرایش</span>
          <span v-else class="font-semibold">ثبت</span>
        </h3>

        <div class="flex items-center mb-4">
          <input id="enable-input" v-model="form.active" type="checkbox"
                 class="h-4 w-4 ml-2 text-blue-450 focus:ring-blue-450 border-gray-300 rounded">
          <label for="enable-input" class="ml-2 block text-sm text-gray-900">
            وضعیت (فعال یا غیرفعال)
          </label>
        </div>

        <div class="flex md:flex-wrap justify-center">
          <button
            :class="[
              'flex items-center bg-blue-450 text-white rounded py-2',
              'md:w-full md:mb-4 md:justify-center',
              'lg:w-auto lg:mb-0 lg:justify-start',
            ]"
            @click="submit"
          >
            <i v-if="!loading" class="flaticon-151-check font-bold px-4 xl:px-3 2xl:px-4"></i>
            <span v-if="!loading && user" class="pl-8 xl:pl-6 2xl:pl-8">بروزرسانی</span>
            <span v-else-if="!loading" class="pl-8">ثبت</span>
            <span v-else class="loader mx-8 w-5 h-5 border-2 rounded-full border-blue-300"></span>
          </button>
          <nuxt-link
            to="/admin/admins"
            :class="[
              'flex items-center border border-blue-450 text-blue-450 rounded py-2 ',
              'px-8 xl:px-6 2xl:px-8 mr-4 md:w-full lg:w-auto md:justify-center lg:justify-start md:mr-0 lg:mr-4'
            ]"
          >
            <span>انصراف</span>
          </nuxt-link>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "AdminAdminsForm",
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      errors: null,
      form: {
        firstname: this.user?.firstname || '',
        lastname: this.user?.lastname || '',
        phone: this.user?.phone || '',
        email: this.user?.email || '',
        password: '',
        active: this.user?.active || false,
      }
    }
  },
  methods: {
    submit() {
      const method = this.user?.id ? '$put' : '$post'
      const url = this.user?.id ? `admin/admins/${this.user.id}` : 'admin/admins'
      this.$axios[method](url, this.form)
        .then(() => {
          const name = this.user?.id
            ? this.user.firstname || this.user.lastname
              ? `با نام ${this.user.firstname} ${this.user.lastname}`
              : `با شماره ${this.user.phone}`
            : this.form.firstname || this.form.lastname
              ? `با نام ${this.form.firstname} ${this.form.lastname}`
              : `با شماره ${this.form.phone}`

          const message = this.user?.id
            ? `حساب کاربری مدیر <b>${name}</b> ویرایش شد.`
            : `حساب کاربری مدیر جدید <b>${name}</b> ایجاد شد.`

          this.$store.commit('notification/success', message)
          this.$router.push('/admin/admins')
        })
        .catch(error => {
          this.$store.commit('notification/error', {message: error.response.data.message, code: error.response.status})
          this.errors = error?.response?.data?.errors
        })
    },
    enterKey(event) {
      if (event.keyCode === 13) {
        this.submit()
      }
    }
  }
}
</script>
