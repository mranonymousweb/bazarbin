<template>
    <div>
      <admin-list
        icon="flaticon-153-user"
        icon-class="font-bold"
        title="لیست مدیران"
        :cols="cols"
        :pagination="pagination"
        @select-page="loadNewPage"
      >
        <template #after-title>
          <nuxt-link to="/admin/admins/new" class="float-left text-sm text-blue-450">
            <i class="flaticon-043-plus w-7 font-bold text-xs"></i>
            افزودن مدیر جدید
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
              <td class="px-2">
                {{ item.firstname }}
                {{ item.lastname }}
              </td>
              <td class="px-2">
                {{ item.phone }}
              </td>
              <td class="px-2">
                {{ item.email }}
              </td>
              <td class="px-2">
                <Tooltip>
                  <template #activator>
                    <nuxt-link :to="`/admin/admins/${item.id}`">
                      <i class="flaticon-162-edit text-base text-gray-500 inline-block cursor-pointer"></i>
                    </nuxt-link>
                  </template>
                  ویرایش مدیر
                </Tooltip>
                <Tooltip>
                  <template #activator>
                    <i class="flaticon-133-trash text-base text-red-550 inline-block cursor-pointer mr-2"
                       @click="removeRequest(index)"></i>
                  </template>
                  حذف مدیر
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
                <span class="screens-skeleton-el w-2/5 h-4 bg-gray-200 inline-block"></span>
                <span class="screens-skeleton-el w-2/5 h-4 bg-gray-200 inline-block mr-2"></span>
              </td>
              <td>
                <span class="screens-skeleton-el w-1/2 h-4 bg-gray-200 inline-block"></span>
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
        @confirm="removeConfirm"
      />
    </div>
</template>

<script>
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import { useAppStore } from '~/stores/app'
import { useNotificationStore } from '~/stores/notification'
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: 'admin'
})

export default {
  name: 'AdminAdminPage',
  components: {DeleteConfirmationModal},
  data() {
    return {
      timeout: null,
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
      cols: [
        {label: 'نام', class: 'w-1/4 lg:w-1/4'},
        {label: 'موبایل', class: 'w-1/4 lg:w-1/4'},
        {label: 'ایمیل', class: 'w-1/3 lg:w-1/3'},
        {label: 'عملیات', class: 'w-2/12'},
      ]
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
    }
  },
  mounted() {
    this.fetchData()
  },
  watch: {
    searchKey() {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        this.fetchData()
        this.timeout = null
      }, 1000)
    }
  },
  methods: {
    async fetchData() {
      this.loading = true
      const { $axios } = useNuxtApp()
      const url = `admin/admins?page=${this.pagination.currentPage}${this.searchKey ? '&key='+this.searchKey : ''}`
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
        console.error('Error loading admins:', error)
        this.loading = false
        const notificationStore = useNotificationStore()
        notificationStore.showError(error.response?.data?.message || 'خطا در بارگذاری مدیران', error.response?.status)
      }
    },
    loadNewPage(page) {
      this.pagination.currentPage = page
      this.loading = true
      this.fetchData()
    },
    removeRequest(index) {
      const userStore = useUserStore()
      if (this.items[index].id === userStore.user?.id) {
        const notificationStore = useNotificationStore()
        notificationStore.showError('شما نمی توانید اکانت خود را حذف کنید.', 403)
      } else {
        this.removeIndex = index
        this.deleteModal = true
      }
    },
    removeConfirm() {
      const user = this.items[this.removeIndex]
      const name = user.firstname || user.lastname
          ? `با نام ${user.firstname} ${user.lastname}`
          : `با شماره ${user.phone}`

      this.deleteModal = false
      const notificationStore = useNotificationStore()
      notificationStore.closeSuccess()
      notificationStore.closeError()
      
      const { $axios } = useNuxtApp()
      $axios.$delete(`admin/admins/${this.items[this.removeIndex].id}`)
        .then(() => {
          this.showSuccessMessage('اکانت مدیر ' + `<b>${name}</b>` + ' حذف شد.')
        })
        .catch(error => {
          notificationStore.showError(error.response?.data?.message || error.request?.statusText, error.response?.status)
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
