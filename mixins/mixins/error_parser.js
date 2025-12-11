export default {
  methods: {
    showError(error) {
      this.$store.commit('notification/error',{
        code: error.response.status,
        message: this.parseErrorMessage(error.response)
      })
    },
    parseErrorMessage(response) {
      if (response.status === 422) {
        return this.parseError422(response.data)
      }

      if (response.status === 401) {
        return response.request.responseURL.split('/').pop() === 'login'
          ? 'شماره موبایل یا رمز عبور صحیح نمی باشد.'
          : 'برای استفاده از این بخش به حساب کاربری خود وارد شوید.'
      }

      return response.data.message
    },
    parseError422(data) {
      let error = '<p>اطلاعات وارد شده معتبر نمی باشد.</p><ul>'

      Object.keys(data.errors).forEach(key => {
        data.errors[key].forEach(e => {
          error += `<li>${e}</li>`
        })
      })

      error += '</ul>'

      return error
    }
  }
}
