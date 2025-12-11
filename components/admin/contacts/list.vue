<template>
  <div>
    <admin-list
      icon="flaticon-041-folder"
      icon-class="font-bold"
      title="لیست اطلاعات تماس"
      :cols="cols"
      :pagination="pagination"
      @select-page="loadNewPage"
    >
      <template #tbody>
        <template v-if="!loading">
          <tr
            v-for="(item, index) in items"
            :key="item.id"
            :class="{
              'h-12 border-trueGray-200':true,
              'border-b-2': index + 1 < items.length
            }"
          >
            <td class="px-2">
              <div class="w-8 h-8">
                <img :src="baseUrl+item.picture" alt="" class="min-w-full min-h-full object-contain">
              </div>
            </td>
            <td class="px-2">
              {{ item.name }}
            </td>
            <td class="px-2">
              <Tooltip>
                <template #activator>
                  <i class="flaticon-162-edit text-base text-gray-500 inline-block cursor-pointer"
                     @click="$emit('edit', item)"></i>
                </template>
                ویرایش اطلاعات تماس
              </Tooltip>
              <Tooltip>
                <template #activator>
                  <i class="flaticon-133-trash text-base text-red-550 inline-block cursor-pointer mr-2"
                     @click="removeRequest(index)"></i>
                </template>
                حذف اطلاعات تماس
              </Tooltip>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr
            v-for="i in pageItems"
            :key="i"
            :class="{
            'h-12 border-trueGray-200':true,
            'border-b-2': i < 15
          }"
          >
            <td>
              <span class="screens-skeleton-el w-4 h-4 bg-gray-200 inline-block"></span>
            </td>
            <td>
              <span class="screens-skeleton-el w-1/2 h-4 bg-gray-200 inline-block"></span>
            </td>
            <td>
              <span class="screens-skeleton-el h-4 w-4 bg-gray-200 inline-block"></span>
              <span class="screens-skeleton-el h-4 w-4 bg-gray-200 inline-block mr-2"></span>
            </td>
          </tr>
        </template>
      </template>
    </admin-list>
    <delete-confirmation-modal
      :show="deleteModal"
      @close="deleteModal = false"
      @confirm="removeConfirm(items[removeIndex])"
    />
  </div>
</template>

<script>
export default {
  name: "AdminContactsList",
  data() {
    return {
      loading: true,
      deleteModal: false,
      removeIndex: null,
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
      cols: [
        {label: 'تصویر', class: 'w-3/12 lg:w-4/12'},
        {label: 'نام', class: 'w-6/12 lg:w-5/12'},
        {label: 'عملیات', class: 'w-3/12'},
      ]
    }
  },
  computed: {
    baseUrl() {
      return useRuntimeConfig().public.storagePath
    },
    pageItems() {
      return this.pagination.currentPage < this.pagination.lastPage
        ? this.pagination.perPage
        : this.pagination.totalItems % this.pagination.perPage
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      const { $axios } = useNuxtApp()
      const url = this.pagination.path
        ? this.pagination.path + '?page=' + this.pagination.currentPage
        : 'admin/contacts'
      
      try {
        const response = await $axios.$get(url)
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
        console.error('Error loading contacts:', error)
        this.loading = false
      }
    },
    loadNewPage(page) {
      this.pagination.currentPage = page
      this.loading = true
      this.fetchData()
    },
    removeRequest(index) {
      this.removeIndex = index
      this.deleteModal = true
    },
    removeConfirm(item) {
      this.deleteModal = false
      this.$emit('remove', item)
    }
  }
}
</script>
