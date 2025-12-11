<template>
  <div>
    <admin-list
      icon="flaticon-064-pin-1"
      icon-class=""
      title="لیست شهر ها"
      :cols="cols"
      :pagination="pagination"
      @select-page="loadNewPage"
    >
      <template #after-title>
        <nuxt-link to="/admin/cities/new" class="float-left text-sm text-blue-450">
          <i class="flaticon-043-plus w-7 font-bold text-xs"></i>
          افزودن شهر جدید
        </nuxt-link>
      </template>
      <template #tbody>
        <template v-if="!loading">
          <tr
            v-for="(item, index) in items.data"
            :key="item.id"
            :class="{
                'h-12 border-trueGray-200':true,
                'border-b-2': index + 1 < (items.data ? items.data.length : 0)
              }"
          >
            <td class="px-2" v-text="item.name"></td>
            <td class="px-2">
              <EnableDisableButton
                :status="item.status"
                @disable="disableItem(item)"
                @enable="enableItem(item)"
              />
            </td>
            <td class="px-2">
              <div class="flex items-center">
                <EditButton
                  label="ویرایش شهر"
                  @click="$router.push(`/admin/cities/${item.id}/edit`)"
                />
                <DeleteButton
                  label="حذف شهر" class="mr-4"
                  @click="removeRequest(index)"
                />
                <Tooltip>
                  <template #activator>
                  <span class="mx-4 cursor-pointer text-gray-600" @click="$emit('click-street-btn', item.id)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 480.369 480.369"
                    class="w-5 h-5 inline-block"
                    fill="currentColor"
                  >
                    <path d="M240.185,0.016c-7.543,0-13.66,6.117-13.66,13.66v13.66c0,7.543,6.116,13.659,13.66,13.659
                          c7.542,0,13.66-6.115,13.66-13.659v-13.66C253.845,6.133,247.728,0.016,240.185,0.016z"/>
                    <path d="M240.185,348.663c-7.543,0-13.66,6.117-13.66,13.66v27.912c0,7.543,6.116,13.66,13.66,13.66
                          c7.542,0,13.66-6.117,13.66-13.66v-27.912C253.845,354.78,247.728,348.663,240.185,348.663z"/>
                    <path d="M240.185,257.937c-7.543,0-13.66,6.117-13.66,13.66v27.912c0,7.543,6.116,13.658,13.66,13.658
                          c7.542,0,13.66-6.115,13.66-13.658v-27.912C253.845,264.054,247.728,257.937,240.185,257.937z"/>
                    <path d="M240.185,76.482c-7.543,0-13.66,6.116-13.66,13.66v27.919c0,7.543,6.116,13.659,13.66,13.659
                          c7.542,0,13.66-6.116,13.66-13.659V90.143C253.845,82.6,247.728,76.482,240.185,76.482z"/>
                    <path d="M240.185,167.209c-7.543,0-13.66,6.116-13.66,13.66v27.913c0,7.543,6.116,13.659,13.66,13.659
                          c7.542,0,13.66-6.116,13.66-13.659V180.87C253.845,173.326,247.728,167.209,240.185,167.209z"/>
                    <path d="M240.185,439.39c-7.543,0-13.66,6.117-13.66,13.66v13.66c0,7.543,6.116,13.658,13.66,13.658
                          c7.542,0,13.66-6.115,13.66-13.658v-13.66C253.845,445.507,247.728,439.39,240.185,439.39z"/>
                    <path d="M404.563,464.976L346.491,11.941c-0.96-7.484-7.75-12.806-15.287-11.812c-7.481,0.954-12.771,7.804-11.811,15.28
                          l58.071,453.035c0.888,6.896,6.763,11.925,13.532,11.925c0.58,0,1.168-0.033,1.755-0.113
                          C400.235,479.302,405.524,472.452,404.563,464.976z"/>
                    <path d="M149.165,0.129c-7.497-1.041-14.327,4.321-15.287,11.812L75.806,464.976c-0.961,7.477,4.328,14.326,11.812,15.279
                          c0.587,0.08,1.174,0.113,1.754,0.113c6.77,0,12.646-5.027,13.533-11.925l58.072-453.035
                          C161.937,7.934,156.648,1.083,149.165,0.129z"/>
                  </svg>
                  </span>
                  </template>
                  خیابان ها
                </Tooltip>
              </div>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr
            v-for="i in 15"
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
      @confirm="removeConfirm(items.data && items.data[removeIndex] ? items.data[removeIndex] : null)"
    />
  </div>
</template>

<script>
import { useNotificationStore } from '~/stores/notification'

export default {
  name: "AdminCitiesList",
  data() {
    return {
      loading: true,
      deleteModal: false,
      removeIndex: null,
      items: { data: [] },
      cols: [
        {label: 'نام', class: 'w-6/12 lg:w-5/12'},
        {label: 'وضعیت', class: 'w-3/12 lg:w-4/12'},
        {label: 'عملیات', class: 'w-3/12'},
      ],
      pagination: {
        currentPage: 1,
        lastPage: 2,
        fromItem: 1,
        toItem: 1,
        totalItems: 1,
        perPage: 15,
        path: null
      }
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
        : 'admin/cities'
      try {
        const response = await $axios.$get(url)
        this.items = response || { data: [] }
        this.pagination.currentPage = response.current_page || 1
        this.pagination.lastPage = response.last_page || 1
        this.pagination.fromItem = response.from || 0
        this.pagination.toItem = response.to || 0
        this.pagination.totalItems = response.total || 0
        this.pagination.perPage = response.per_page || 15
        this.pagination.path = response.path || null
        this.loading = false
      } catch (error) {
        console.error('Error loading cities:', error)
        this.loading = false
        const notificationStore = useNotificationStore()
        notificationStore.showError(error.response?.data?.message || 'خطا در بارگذاری شهرها', error.response?.status)
      }
    },
    loadNewPage(page) {
      this.pagination.currentPage = page
      this.loading = true
      this.fetchData()
    },
    enableItem(item) {
      const notificationStore = useNotificationStore()
      notificationStore.closeSuccess()
      notificationStore.closeError()
      
      const { $axios } = useNuxtApp()
      const data = {...item}
      data.status = 1
      $axios.$put(`admin/cities/${item.id}`, data)
        .then(() => {
          notificationStore.showSuccess('شهر ' + `<b>${item.name}</b>` + ' فعال شد.')
          this.fetchData()
        })
        .catch(error => {
          notificationStore.showError(error.response?.data?.message || 'خطا در فعال کردن شهر', error.response?.status)
        })
    },
    disableItem(item) {
      const notificationStore = useNotificationStore()
      notificationStore.closeSuccess()
      notificationStore.closeError()
      
      const { $axios } = useNuxtApp()
      const data = {...item}
      data.status = 0
      $axios.$put(`admin/cities/${item.id}`, data)
        .then(() => {
          notificationStore.showSuccess('شهر ' + `<b>${item.name}</b>` + ' غیر فعال شد.')
          this.fetchData()
        })
        .catch(error => {
          notificationStore.showError(error.response?.data?.message || 'خطا در غیرفعال کردن شهر', error.response?.status)
        })
    },
    removeRequest(index) {
      this.removeIndex = index
      this.deleteModal = true
    },
    removeConfirm(item) {
      if (!item) {
        this.deleteModal = false
        return
      }
      
      this.deleteModal = false
      const notificationStore = useNotificationStore()
      notificationStore.closeSuccess()
      notificationStore.closeError()
      
      const { $axios } = useNuxtApp()
      $axios.$delete(`admin/cities/${item.id}`)
        .then(() => {
          notificationStore.showSuccess('شهر ' + `<b>${item.name}</b>` + ' حذف شد.')
          this.fetchData()
        })
        .catch(error => {
          notificationStore.showError(error.response?.data?.message || 'خطا در حذف شهر', error.response?.status)
        })
    }
  }
}
</script>
