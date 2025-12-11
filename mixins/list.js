import { useAppStore } from '~/stores/app'
import { useNotificationStore } from '~/stores/notification'

export default {
  data() {
    return {
      url: null,
      updateUrlSuffix: '',
      removeUrlSuffix: '',
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
  computed: {
    pageItems() {
      return this.pagination.currentPage < this.pagination.lastPage
        ? this.pagination.perPage
        : this.pagination.totalItems % this.pagination.perPage
    },
    searchKey() {
      return useAppStore().adminSearchKey
    },
    storagePath() {
      return useRuntimeConfig().public.storagePath
    }
  },
  watch: {
    searchKey() {
      this.pagination.currentPage = 1
      this.fetchData()
    }
  },
  methods: {
    async fetchData() {
      if (!this.url) return
      
      this.loading = true
      const { $axios } = useNuxtApp()
      try {
        const url = `${this.url}?page=${this.pagination.currentPage}${this.searchKey ? '&key='+this.searchKey : ''}${this.listQuery ? '&'+this.listQuery : ''}`
        const response = await $axios.$get(url)
        this.items = response.data || []
        this.pagination.currentPage = response?.current_page || response?.meta?.current_page || 1
        this.pagination.lastPage = response?.last_page || response?.meta?.last_page || 1
        this.pagination.fromItem = response?.from || response?.meta?.from || 0
        this.pagination.toItem = response?.to || response?.meta?.to || 0
        this.pagination.totalItems = response?.total || response?.meta?.total || 0
        this.pagination.perPage = response?.per_page || response?.meta?.per_page || 15
        this.pagination.path = response?.path || response?.meta?.path || null
        this.loading = false
      } catch (error) {
        console.error('Error loading list:', error)
        this.loading = false
        this.showError(error.response?.data?.message || error.request?.statusText || 'خطا در بارگذاری اطلاعات', error.response?.status)
      }
    },
    loadNewPage(page) {
      this.pagination.currentPage = page
      this.loading = true
      this.fetchData()
    },
    changeItemStatus(item, status) {
      const notificationStore = useNotificationStore()
      notificationStore.closeSuccess()
      notificationStore.closeError()
      
      const { $axios } = useNuxtApp()
      const data = {}
      data[this.statusKey] = status
      $axios.$put(`${this.url}/${item.id}${this.updateUrlSuffix}`, data)
        .then(() => {
          if (this.itemType && item[this.nameKey]) {
            this.showSuccessMessage(`${this.itemType} <b>${item[this.nameKey]}</b> ${status ? 'فعال شد.' : 'غیر فعال شد.'}`)
          } else {
            this.fetchData()
          }
          if (Object.prototype.hasOwnProperty.call(this, 'changeStatusSuccess')) {
            this.changeStatusSuccess(item, status)
          }
        })
        .catch(error => {
          this.showError(error.response?.data?.message || error.request?.statusText, error.response?.status)
        })
    },
    removeRequest(index) {
      this.removeIndex = index
      this.deleteModal = true
    },
    removeConfirm(item) {
      this.deleteModal = false
      const notificationStore = useNotificationStore()
      notificationStore.closeSuccess()
      notificationStore.closeError()
      
      const { $axios } = useNuxtApp()
      $axios.$delete(`${this.url}/${item.id}${this.removeUrlSuffix}`)
        .then(() => {
          if (this.itemType && item[this.nameKey]) {
            this.showSuccessMessage(`${this.itemType} <b>${item[this.nameKey]}</b> حذف شد.`)
          } else {
            this.fetchData()
          }
        })
        .catch(error => {
          this.showError(error.response?.data?.message || error.request?.statusText, error.response?.status)
        })
    },
    showSuccessMessage(message) {
      const notificationStore = useNotificationStore()
      notificationStore.showSuccess(message)
      this.fetchData()
    },
    showError(message, code = null) {
      const notificationStore = useNotificationStore()
      notificationStore.showError(message, code)
    }
  }
}
