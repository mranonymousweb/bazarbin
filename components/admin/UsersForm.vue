<template>
  <div class="flex flex-wrap">

    <div class="w-full md:w-2/3 lg:w-3/5 xl:w-2/3 2xl:w-3/4 md:pl-4">
      <div class="rounded-t md:rounded-b p-8 bg-white">
        <div class="flex justify-between">
          <h3 class="mb-4">
            <i class="pl-2 flaticon-043-plus"></i>
            <span v-if="user" class="font-semibold">ویرایش اطلاعات کاربر</span>
            <span v-else class="font-semibold">افزودن کاربر جدید</span>
          </h3>
          <span v-if="user" class="text-gray-400 text-sm">
            تاریخ عضویت:
            {{  formatDate(user.created_at, 'jYYYY/jMM/jDD') }}
          </span>
        </div>

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

      <div class="rounded-b md:rounded-t p-4 bg-white mb-4">
        <h3 class="mb-4 hidden md:block">
          <i class="pl-2 flaticon-063-picture"></i>
          <span class="font-semibold">آواتار</span>
        </h3>
        <div>
          <authentication-avatar-field ref="avatar" :value="oldAvatar" @input="newAvatar = $event"/>
          <ul v-if="errors && errors.hasOwnProperty('avatar')" :class="'mt-2 text-red-550 text-sm'">
            <li v-for="(e, index) in errors.avatar" :key="index" v-text="e"></li>
          </ul>
        </div>
      </div>

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
            to="/admin/users"
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
import AuthenticationAvatarField from "../authentication/AvatarField";
import moment from "~/mixins/moment";

export default {
  name: "AdminUsersForm",
  components: {AuthenticationAvatarField},
  mixins: [moment],
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      errors: null,
      oldAvatar: this?.user?.avatar || '',
      newAvatar: null,
      form: {
        firstname: this?.user?.firstname || '',
        lastname: this?.user?.lastname || '',
        phone: this?.user?.phone || '',
        email: this?.user?.email || '',
        password: '',
        active: this?.user?.active || false,
      }
    }
  },
  methods: {
    submit() {
      const url = this?.user?.id ? `admin/users/${this.user.id}` : 'admin/users'

      const data = new FormData()
      data.append('firstname', this.form.firstname)
      data.append('lastname', this.form.lastname)
      data.append('phone', this.form.phone)
      data.append('email', this.form.email)
      data.append('password', this.form.password)
      data.append('active', this.form.active ? '1' : '0')

      if (this.user) {
        data.append('_method', 'PUT')
      }

      if (this.newAvatar) {
        data.append('avatar', this.newAvatar)
      }

      const headers = {'Content-Type': 'multipart/form-data'}

      this.$axios.$post(url, data, {headers})
        .then(() => {
          const name = this.user
            ? this.user.firstname || this.user.lastname
              ? `با نام ${this.user.firstname} ${this.user.lastname}`
              : `با شماره ${this.user.phone}`
            : this.form.firstname || this.form.lastname
              ? `با نام ${this.form.firstname} ${this.form.lastname}`
              : `با شماره ${this.form.phone}`

          const message = this.user
            ? `اکانت کاربر <b>${name}</b> ویرایش شد.`
            : `اکانت کاربر جدید <b>${name}</b> ایجاد شد.`

          this.$store.commit('notification/success', message)
          this.$router.push('/admin/users')
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
