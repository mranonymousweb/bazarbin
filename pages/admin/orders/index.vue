<template>
  <div>
    <panel-orders-list
      v-if="!loading"
      ref="list"
      :items="items"
      @delete="removeConfirm"
    />

    <pagination
      v-if="!loading && pagination && pagination.lastPage > 1"
      :current-page="pagination.currentPage"
      :last-page="pagination.lastPage"
      :from-item="pagination.fromItem"
      :to-item="pagination.toItem"
      :total-items="pagination.totalItems"
      @select-page="loadNewPage"
    />

  </div>
</template>

<script>
import moment from "../../../mixins/moment";
import Pagination from "../../../components/Pagination";
import PanelOrdersList from "../../../components/panel/OrdersList";
import { useNotificationStore } from '~/stores/notification'

definePageMeta({
  layout: 'admin'
})

export default {
  name: "OrdersPage",
  components: {PanelOrdersList, Pagination},
  mixins: [moment],
  data() {
    return {
      loading: true,
      deleteItemIndex: null,
      deleteConfirmation: false,
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
      baseUrl: useRuntimeConfig().public.storagePath
    }
  },
  mounted() {
    this.fetchData()
  },
  watch: {
    'pagination.currentPage'() {
      this.fetchData()
    }
  },
  methods: {
    async fetchData() {
      this.loading = true
      const { $axios } = useNuxtApp()
      try {
        const response = await $axios.$get(`/admin/invoices?page=${this.pagination.currentPage}`)
        this.items = response.data || []
        this.pagination.currentPage = response.current_page || 1
        this.pagination.lastPage = response.last_page || 1
        this.pagination.fromItem = response.from || 0
        this.pagination.toItem = response.to || 0
        this.pagination.totalItems = response.total || 0
        this.pagination.perPage = response.per_page || 15
        this.pagination.path = response.path || null
        this.loading = false
      } catch (error) {
        console.error('Error loading orders:', error)
        this.loading = false
        const notificationStore = useNotificationStore()
        notificationStore.showError(error.response?.data?.message || 'خطا در بارگذاری سفارشات', error.response?.status)
      }
    },
    loadNewPage(page) {
      this.pagination.currentPage = page
      this.fetchData()
    },
    removeConfirm(index) {
      const notificationStore = useNotificationStore()
      notificationStore.closeSuccess()
      notificationStore.closeError()
      
      const { $axios } = useNuxtApp()
      $axios.$delete(`/admin/invoices/${this.items[index].id}`)
        .then(() => {
          notificationStore.showSuccess('سفارش با موفقیت حذف شد.')
          this.fetchData()
          if (this.$refs.list) {
            this.$refs.list.deleteItemIndex = null
            this.$refs.list.deleteConfirmation = false
          }
        })
        .catch(error => {
          notificationStore.showError(error.response?.data?.message || 'خطا در حذف سفارش', error.response?.status)
        })
    }
  }
}
</script>
