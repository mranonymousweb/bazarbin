<template>
  <div class="text-sm md:text-base">
    <div v-if="!loading">
      <panel-business-navigation :id="+$route.params.id" :has-category="has_category"/>
      <panel-orders-list
        v-if="!loading"
        ref="list"
        :items="items"
        :is-admin-page="true"
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
  </div>
</template>

<script>
import errorParser from "../../../../../mixins/error_parser";

export default {
  mixins: [errorParser],
  layout: 'panel',
  data() {
    return {
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
    await this.$axios.$get(`/home/business/${this.$route.params.id}/invoices?page=${this.pagination.currentPage}`)
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
  computed: {
    has_category() {
      const business = this.$store.state.user.businesses.find(x => x.id === +this.$route.params.id)
      return ! business?.has_category
    },
  },
  methods: {
    removeConfirm(index) {
      this.$axios.$delete(`/home/invoices/${this.items[index].id}`)
        .then(() => {
          this.$store.commit('notification/success', 'سفارش با موفقیت حذف شد.')
          this.$fetch()
          this.$refs.list.deleteItemIndex = null
          this.$refs.list.deleteConfirmation = false
        })
        .catch(error => this.showError(error))
    }
  }
}
</script>
