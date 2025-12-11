<template>
  <div>
    <div class="flex flex-wrap">

      <div class="w-full md:w-1/2 md:pl-4 mb-8 md:mb-0">

        <admin-contacts-form
          :item="editing_item"
          @submit="notificationStore.closeSuccess(); notificationStore.closeError()"
          @add-item="itemAdded"
          @cancel-edit="editing_item = null"
          @edit-item="itemUpdated"
          @error="showError"
        />

      </div>

      <div class="w-full md:w-1/2 md:pr-4">

        <admin-contacts-list
          ref="list"
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
  name: "AdminContactsPage",
  data() {
    return {
      editing_item: null
    }
  },
  computed: {
    notificationStore() {
      return useNotificationStore()
    }
  },
  methods: {
    itemAdded(data) {
      this.showSuccessMessage('اطلاعات تماس جدید با عنوان ' + `<b>${data.name}</b>` + ' ایجاد شد.')
    },
    itemUpdated() {
      this.showSuccessMessage('اطلاعات تماس با عنوان ' + `<b>${this.editing_item.name}</b>` + ' ویرایش شد.')
    },
    editItem(item) {
      this.editing_item = item
    },
    removeItem(item) {
      this.notificationStore.closeSuccess()
      this.notificationStore.closeError()
      
      const { $axios } = useNuxtApp()
      $axios.$delete(`admin/contacts/${item.id}/delete`)
        .then(() => {
          this.showSuccessMessage('اطلاعات تماس با عنوان ' + `<b>${item.name}</b>` + ' حذف شد.')
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
    }
  }
}
</script>
