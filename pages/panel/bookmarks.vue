<template>
  <div class="text-sm md:text-base">
    <div class="md:border-b md:h-5 md:mb-20 mb-3">
      <div class="inline-flex items-center bg-gray-50">
        <button
          :class="[
                'px-4 py-1 ml-4 rounded',
                listType === 'business' ? 'bg-cyan-250 text-white' : 'border border-cyan-250 text-cyan-250'
              ]"
          @click="load('business')"
        >
          <i class="flaticon-045-align-right ml-1"></i>
          کسب و کارها
        </button>
        <button
          :class="[
                'px-4 py-1 ml-12 rounded',
                listType === 'products' ? 'bg-cyan-250 text-white' : 'border border-cyan-250 text-cyan-250'
              ]"
          @click="load('products')"
        >
          <i class="flaticon-063-picture"></i>
          محصولات
        </button>
      </div>
    </div>

    <div>
      <div v-if="items.length && listType === 'business'" class="single-col-list">
        <div v-for="item in items" :key="item.id" class="mb-6">
          <business-list-item-large
            :item="item"
          />
        </div>
      </div>
      <front-products-list
        v-if="items.length && listType === 'products'"
        :items="items"
      />
    </div>

    <Pagination
      v-if="pagination && pagination.lastPage > 1"
      :current-page="pagination.currentPage"
      :last-page="pagination.lastPage"
      :from-item="pagination.fromItem"
      :to-item="pagination.toItem"
      :total-items="pagination.totalItems"
      @select-page="$emit('select-page', $event)"
    />
  </div>
</template>

<script>
export default {
  name: "BookmarksPage",
  layout: 'panel',
  data() {
    return {
      listType: 'business',
      pagination: null,
      items: []
    }
  },
  async fetch () {
    await this.$axios.$get(`/home/bookmarks/${this.listType}`)
      .then(response => {
        this.items = response.data
        this.pagination.currentPage = response.current_page
        this.pagination.lastPage = response.last_page
        this.pagination.fromItem = response.from
        this.pagination.toItem = response.to
        this.pagination.totalItems = response.total
        this.pagination.perPage = response.per_page
        this.pagination.path = response.path
      })
  },
  watch: {
    listType() {
      this.$fetch()
    }
  },
  methods: {
    load(list) {
      this.items = []
      this.listType = list
    }
  }
}
</script>
