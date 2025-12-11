<template>
<div>
  <admin-list
    icon="flaticon-044-file"
    icon-class="text-lg"
    title="لیست فرم ها"
    :cols="cols"
    :pagination="pagination"
    @select-page="loadNewPage"
  >
    <template #after-title>
      <nuxt-link to="/admin/forms/new" class="float-left text-sm text-blue-450">
        <i class="flaticon-043-plus w-7 font-bold text-xs"></i>
        افزودن فرم جدید
      </nuxt-link>
    </template>
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
          <td class="px-2" v-text="item.name"></td>
          <td class="px-2">
            <span v-if="item.show_in_index">کسب و کار</span>
            <span v-else>محصولات</span>
          </td>
          <td class="px-2">
            <Tooltip v-if="item.status == 1">
              <template #activator>
                <i

                  class="flaticon-151-check text-blue-450 font-bold text-base cursor-pointer"
                  @click="disableItem(item)"
                ></i>
              </template>
              غیر فعال کردن
            </Tooltip>
            <Tooltip v-else>
              <template #activator>
                <i
                  class="flaticon-034-cancel text-red-550 font-bold text-base cursor-pointer"
                  @click="activeItem(item)"
                ></i>
              </template>
              فعال کردن
            </Tooltip>
          </td>
          <td>
            <IconsStar v-if="item.default" class="w-5 h-5 text-gold" :solid="true"/>
            <button v-else @click="setDefault(item)">
              <Tooltip>
                <template #activator>
                  <IconsStar class="w-5 h-5 text-gray-400"/>
                </template>
                تعیین به عنوان پیش فرض
              </Tooltip>
            </button>
          </td>
          <td class="px-2">
            <Tooltip>
              <template #activator>
                <nuxt-link :to="`/admin/forms/${item.id}`">
                  <i class="flaticon-162-edit text-base text-gray-500 inline-block cursor-pointer"></i>
                </nuxt-link>
              </template>
              ویرایش فرم
            </Tooltip>
            <Tooltip>
              <template #activator>
                <i class="flaticon-133-trash text-base text-red-550 inline-block cursor-pointer mr-2"
                   @click="removeRequest(index)"></i>
              </template>
              حذف فرم
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
            <span class="screens-skeleton-el w-1/2 h-4 bg-gray-200 inline-block"></span>
          </td>
          <td>
            <span class="screens-skeleton-el w-1/2 h-4 bg-gray-200 inline-block"></span>
          </td>
          <td>
            <span class="screens-skeleton-el w-4 h-4 bg-gray-200 inline-block"></span>
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
import { useNotificationStore } from '~/stores/notification'

definePageMeta({
  layout: 'admin'
})

export default {
  name: "AdminFormsPage",
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
        {label: 'نام', class: 'w-4/12 lg:w-5/12'},
        {label: 'موقعیت', class: 'w-2/12 lg:w-2/12'},
        {label: 'وضعیت', class: 'w-3/12 lg:w-2/12'},
        {label: 'پیش فرض', class: 'w-3/12 lg:w-2/12'},
        {label: 'عملیات', class: 'w-3/12'},
      ]
    }
  },
  computed: {
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
        : 'admin/forms'
      try {
        console.log('Fetching forms from:', url)
        const response = await $axios.$get(url)
        console.log('Forms response:', response)
        this.items = response.data || []
        this.pagination.currentPage = response.current_page || 1
        this.pagination.lastPage = response.last_page || 1
        this.pagination.fromItem = response.from || 0
        this.pagination.toItem = response.to || 0
        this.pagination.totalItems = response.total || 0
        this.pagination.perPage = response.per_page || 15
        this.pagination.path = response.path || null
        this.loading = false
        console.log('Items loaded:', this.items.length)
      } catch (error) {
        console.error('Error loading forms:', error)
        this.loading = false
        const notificationStore = useNotificationStore()
        notificationStore.showError(error.response?.data?.message || 'خطا در بارگذاری اطلاعات', error.response?.status)
      }
    },
    loadNewPage(page) {
      this.pagination.currentPage = page
      this.loading = true
      this.fetchData()
    },
    activeItem(item) {
      const notificationStore = useNotificationStore()
      notificationStore.closeSuccess()
      notificationStore.closeError()
      
      const { $axios } = useNuxtApp()
      $axios.$put(`admin/forms/${item.id}/update`, {status: 1})
        .then(() => {
          this.showSuccessMessage('فرم با عنوان ' + `<b>${item.name}</b>` + ' فعال شد.')
        })
        .catch(error => {
          notificationStore.showError(error.response?.data?.message || 'خطا در فعال کردن فرم', error.response?.status)
        })
    },
    disableItem(item) {
      const notificationStore = useNotificationStore()
      notificationStore.closeSuccess()
      notificationStore.closeError()
      
      const { $axios } = useNuxtApp()
      $axios.$put(`admin/forms/${item.id}/update`, {status: 0})
        .then(() => {
          this.showSuccessMessage('فرم با عنوان ' + `<b>${item.name}</b>` + ' غیر فعال شد.')
        })
        .catch(error => {
          notificationStore.showError(error.response?.data?.message || 'خطا در غیرفعال کردن فرم', error.response?.status)
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
      $axios.$delete(`admin/forms/${item.id}/delete`)
        .then(() => {
          this.showSuccessMessage('فرم با عنوان ' + `<b>${item.name}</b>` + ' حذف شد.')
        })
        .catch(error => {
          notificationStore.showError(error.response?.data?.message || 'خطا در حذف فرم', error.response?.status)
        })
    },
    setDefault(item) {
      const { $axios } = useNuxtApp()
      const notificationStore = useNotificationStore()
      
      $axios.$get(`admin/forms/${item.id}/default`)
        .then(() => {
          const old = this.items.find(x => x.default === true)
          old && (old.default = false)
          item.default = true
          this.showSuccessMessage('فرم با عنوان ' + `<b>${item.name}</b>` + ' به عنوان پیش فرض تعیین شد.')
        })
        .catch(error => {
          notificationStore.showError(error.response?.data?.message || 'خطا در تعیین پیش فرض', error.response?.status)
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
</script>
