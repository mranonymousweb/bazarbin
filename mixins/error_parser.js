export default {
  methods: {
    showError(error) {
      const { useNotificationStore } = require('~/stores/notification')
      const notificationStore = useNotificationStore()
      
      const message = this.parseErrorMessage(error.response || error)
      const code = error.response?.status || error.status || null
      
      notificationStore.showError(message, code)
    },
    parseErrorMessage(response) {
      if (!response) {
        return 'خطایی رخ داده است.'
      }
      
      if (response.status === 422) {
        return this.parseError422(response.data || response)
      }

      if (response.status === 401) {
        const url = response.request?.responseURL || response.config?.url || ''
        return url.split('/').pop() === 'login'
          ? 'شماره موبایل یا رمز عبور صحیح نمی باشد.'
          : 'برای استفاده از این بخش به حساب کاربری خود وارد شوید.'
      }

      return response.data?.message || response.message || 'خطایی رخ داده است.'
    },
    parseError422(data) {
      if (!data || !data.errors) {
        return 'اطلاعات وارد شده معتبر نمی باشد.'
      }
      
      let error = '<p>اطلاعات وارد شده معتبر نمی باشد.</p><ul>'

      Object.keys(data.errors).forEach(key => {
        if (Array.isArray(data.errors[key])) {
          data.errors[key].forEach(e => {
            error += `<li>${e}</li>`
          })
        }
      })

      error += '</ul>'

      return error
    }
  }
}
