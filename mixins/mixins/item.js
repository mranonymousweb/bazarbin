export default {
  data() {
    return {
      url: null,
      listPage: null,
      loading: false,
      storagePath: process.env.storagePath,
      item: {},
      form: {},
      errors: {},
    }
  },
  async fetch() {
    if (this.isItemPage) {
      await this.$axios.$get(`${this.url}/${this.$route.params.id}`)
        .then(response => {
          Object.keys(response).forEach(key => {
            if (key !== 'id') {
              this.form[key] = response[key]
            }
          })
        })
    }
  },
  computed: {
    isItemPage() {
      return !! this.$route.params?.id
    }
  },
  methods: {
    enterKey(event) {
      if (event.keyCode === 13) {
        this.submit()
      }
    },
    submit() {
      const url = `${this.url}${this.isItemPage ? `/${this.$route.params.id}` : ''}`

      let data;
      if (Object.prototype.hasOwnProperty.call(this, 'getFormData')) {
        data = this.getFormData()
      } else {
        data = this.form
        /* data = new FormData();
        Object.keys(this.form).forEach(key => {
          const value = key === 'active' ? this.form[key] ? '1' : '0' : this.form[key]
          data.append(key, value)
        }) */
      }

      const methods = this.isItemPage ? '$put' :'$post'

      this.loading = true
      this.$axios[methods](url, data)
        .then(() => {
          this.$router.push(this.listPage)
        })
        .catch(error => {
          this.$store.commit('notification/error', {message: error.response.data.message, code: error.response.status})
          this.errors = error?.response?.data?.errors
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
