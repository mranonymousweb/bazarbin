export default {
  data() {
    return {
      url: null,
      updateUrlSuffix: '',
      removeUrlSuffix: '',
      storagePath: process.env.storagePath,
      nameKey: 'name',
      statusKey: 'status',
      listQuery: null,
      itemType: null,
      removeIndex: null,
      deleteModal: false,
      loading: true,
      items: [],
      pagination: {
        currentPage: 1,
        lastPage: 2,
        fromItem: 1,
        toItem: 1,
        totalItems: 1,
        perPage: 15,
        path: null
      },
    }
  },
  async fetch() {
    await this.$axios.$get(`${this.url}?page=${this.pagination.currentPage}${this.searchKey ? '&key='+this.searchKey : ''}${this.listQuery ? '&'+this.listQuery : ''}`)
      .then(response => {
        this.items = response.data
        this.pagination.currentPage = response?.current_page || response?.meta?.current_page
        this.pagination.lastPage = response?.last_page || response?.meta?.last_page
        this.pagination.fromItem = response?.from || response?.meta?.from
        this.pagination.toItem = response?.to || response?.meta?.to
        this.pagination.totalItems = response?.total || response?.meta?.total
        this.pagination.perPage = response?.per_page || response?.meta?.per_page
        this.pagination.path = response?.path || response?.meta?.path
        this.loading = false
      })
  },
  computed: {
    pageItems() {
      return this.pagination.currentPage < this.pagination.lastPage
        ? this.pagination.perPage
        : this.pagination.totalItems % this.pagination.perPage
    },
    searchKey() {
      return this.$store.state.adminSearchKey
    }
  },
  watch: {
    searchKey() {
      this.pagination.currentPage = 1
      this.$fetch()
    }
  },
  methods: {
    loadNewPage(page) {
      this.pagination.currentPage = page
      this.loading = true
      this.$fetch()
    },
    changeItemStatus(item, status) {
      this.$store.commit('notification/closeAll')
      const data = {}
      data[this.statusKey] = status
      this.$axios.$put(`${this.url}/${item.id}${this.updateUrlSuffix}`, data)
        .then(() => {
          if (this.itemType && item[this.nameKey]) {
            this.showSuccessMessage(`${this.itemType} <b>${item[this.nameKey]}</b> ${status ? 'فعال شد.' : 'غیر فعال شد.'}`)
          } else {
            this.$fetch()
          }
          if (Object.prototype.hasOwnProperty.call(this, 'changeStatusSuccess')) {
            this.changeStatusSuccess(item, status)
          }
        })
    },
    removeRequest(index) {
      this.removeIndex = index
      this.deleteModal = true
    },
    removeConfirm(item) {
      this.deleteModal = false
      this.$store.commit('notification/closeAll')
      this.$axios.$delete(`${this.url}/${item.id}${this.removeUrlSuffix}`)
        .then(() => {
          if (this.itemType && item[this.nameKey]) {
            this.showSuccessMessage(`${this.itemType} <b>${item[this.nameKey]}</b> حذف شد.`)
          } else {
            this.$fetch()
          }
        })
        .catch(error => {
          this.showError(error.response.data.message || error.request.statusText, error.response.status)
        })
    },
    showSuccessMessage(message) {
      this.$store.commit('notification/success', message)
      this.$fetch()
    },
    showError(message, code = null) {
      this.$store.commit('notification/error', {message, code})
    }
  }
}
