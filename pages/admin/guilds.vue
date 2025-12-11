<template>

  <div>

    <div class="flex flex-wrap">

      <div class="w-full md:w-1/2 md:pl-4 mb-8 md:mb-0">

        <admin-guilds-form
          :item="editing_item"
          @submit="closeNotifications"
          @add-item="itemAdded"
          @cancel-edit="editing_item = null"
          @edit-item="itemUpdated"
          @error="showError"
        />

      </div>

      <div class="w-full md:w-1/2 md:pr-4">

        <admin-guilds-list
          ref="list"
          @disable="disableItem"
          @active="activeItem"
          @edit="editItem"
          @remove="removeItem"
        />

      </div>

    </div>

  </div>

</template>

<script>
import { useNotificationStore } from '~/stores/notification'

definePageMeta({
  layout: 'admin'
})

export default {
  data() {
    return {
      error: false,
      success: false,
      error_code: null,
      error_message: '',
      success_message: '',
      editing_item: null
    }
  },
  methods: {
    itemAdded(data) {
      this.showSuccessMessage('صنف جدید با عنوان ' + `<b>${data.name}</b>` + ' ایجاد شد.')
    },
    itemUpdated() {
      this.showSuccessMessage('صنف با عنوان ' + `<b>${this.editing_item.name}</b>` + ' ویرایش شد.')
      this.editing_item = null
    },
    editItem(item) {
      this.editing_item = item
    },
    removeItem(item) {
      const notificationStore = useNotificationStore()
      notificationStore.closeSuccess()
      notificationStore.closeError()
      
      const { $axios } = useNuxtApp()
      $axios.$delete(`admin/guilds/${item.id}/remove`)
        .then(() => {
          this.showSuccessMessage('صنف با عنوان ' + `<b>${item.name}</b>` + ' حذف شد.')
        })
        .catch(error => {
          notificationStore.showError(error.response?.data?.message || 'خطا در حذف صنف', error.response?.status)
        })
    },
    activeItem(item) {
      const notificationStore = useNotificationStore()
      notificationStore.closeSuccess()
      notificationStore.closeError()
      
      const { $axios } = useNuxtApp()
      const data = {...item}
      data.status = 1
      $axios.$put(`admin/guilds/${item.id}/update`, data)
        .then(() => {
          this.showSuccessMessage('صنف با عنوان ' + `<b>${item.name}</b>` + ' فعال شد.')
        })
        .catch(error => {
          notificationStore.showError(error.response?.data?.message || 'خطا در فعال کردن صنف', error.response?.status)
        })
    },
    disableItem(item) {
      const notificationStore = useNotificationStore()
      notificationStore.closeSuccess()
      notificationStore.closeError()
      
      const { $axios } = useNuxtApp()
      const data = {...item}
      data.status = 0
      $axios.$put(`admin/guilds/${item.id}/update`, data)
        .then(() => {
          this.showSuccessMessage('صنف با عنوان ' + `<b>${item.name}</b>` + ' غیر فعال شد.')
        })
        .catch(error => {
          notificationStore.showError(error.response?.data?.message || 'خطا در غیرفعال کردن صنف', error.response?.status)
        })
    },
    showSuccessMessage(message) {
      const notificationStore = useNotificationStore()
      notificationStore.showSuccess(message)
      if (this.$refs.list && this.$refs.list.fetchData) {
        this.$refs.list.fetchData()
      }
    },
    showError(message, code = null) {
      const notificationStore = useNotificationStore()
      notificationStore.showError(message, code)
    },
    closeNotifications() {
      const notificationStore = useNotificationStore()
      notificationStore.closeSuccess()
      notificationStore.closeError()
    }
  }
}
</script>
