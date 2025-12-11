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
      @select-page="pagination.currentPage = $event"
    />

  </div>
</template>

<script>
import moment from "../../../mixins/moment";
import Pagination from "../../../components/Pagination";
import PanelOrdersList from "../../../components/panel/OrdersList";
import errorParser from "../../../mixins/error_parser";

export default {
  name: "MyOrdersPage",
  components: {PanelOrdersList, Pagination},
  mixins: [moment, errorParser],
  layout: 'panel',
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
      baseUrl: process.env.storagePath
    }
  },
  async fetch() {
    await this.$axios.$get(`/home/invoices?page=${this.pagination.currentPage}`)
      .then(response => {
        this.items = response.data
        this.pagination.currentPage = response.current_page
        this.pagination.lastPage = response.last_page
        this.pagination.fromItem = response.from
        this.pagination.toItem = response.to
        this.pagination.totalItems = response.total
        this.pagination.perPage = response.per_page
        this.pagination.path = response.path
        this.loading = false
      })
      .catch(error => this.showError(error))
  },
  watch: {
    'pagination.currentPage'() {
      this.$fetch()
    }
  },
  methods: {
    removeConfirm(index) {
      this.$axios.$delete(`/home/invoices/${this.items[index].id}`)
        .then(() => {
          this.$store.commit('notification/success', 'سفارش شما با موفقیت حذف شد.')
          this.$fetch()
          this.$refs.list.deleteItemIndex = null
          this.$refs.list.deleteConfirmation = false
        })
        .catch(error => this.showError(error))
    },
    selectPage() {

    }
  }
}
</script>
