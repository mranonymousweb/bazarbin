<template>
  <div>
    <div class="flex flex-wrap">
      <div class="w-full md:w-1/3 md:pl-4 mb-8 md:mb-0">
        <div class="rounded p-4 bg-white">

          <h3 class="mb-4 flex items-center justify-between">
            <span>
              <i class="flaticon-041-folder pl-2 font-bold"></i>
              <span class="font-semibold text-sm">
                لیست صفحات
              </span>
            </span>
          </h3>

          <table class="w-full text-sm">

            <thead>
            <tr class="bg-gray-50 h-12">
              <th class="text-right px-2">عنوان</th>
              <th class="text-right px-2 w-3/12">ویرایش</th>
            </tr>
            </thead>

            <tbody>

            <tr
              v-for="(item, index) in pages"
              :key="item.id"
              :class="{
            'h-12 border-trueGray-200':true,
            'border-b-2': index + 1 < pages.length
          }"
            >
              <td class="px-2" v-text="item.title"></td>
              <td class="px-2">
                <Tooltip>
                  <template #activator>
                    <i class="flaticon-162-edit text-base text-gray-500 inline-block cursor-pointer"
                       @click="selected = item"></i>
                  </template>
                  ویرایش صفحه
                </Tooltip>
              </td>
            </tr>

            </tbody>

          </table>

        </div>
      </div>

      <div class="w-full md:w-2/3 md:pr-4">
        <div class="rounded p-4 bg-white">
          <h3 v-if="selected" class="mb-4 flex items-center">
            <i class="flaticon-162-edit w-7 font-bold"></i>
            <span class="font-semibold text-sm">
              ویرایش صفحه
              "<b>{{ selected.title }}</b>"
            </span>
          </h3>

          <form v-if="selected" class="text-sm px-7" @submit.prevent="submit">

            <div class="mb-8">
              <Editor
                v-model="body"
                :init="{
                        inline: false,
                        promotion: false,
                        language: 'fa',
                        content_style: `body {font-family: iransansxv, Tahoma, Arial, serif; font-size: 14px}`,
                        plugins: 'lists code link media image fullscreen',
                        menubar: 'file edit insert view format table tools help',
                        toolbar: [
                          'undo redo | styles | bold italic underline | bullist numlist | link image media',
                          'alignright aligncenter alignleft | forecolor backcolor | code fullscreen'
                        ],
                    }"
              />
            </div>

            <div class="flex justify-center">
              <button class="flex items-center bg-blue-450 text-white rounded py-2" type="submit">
                <i v-if="!loading" class="flaticon-151-check font-bold px-4"></i>
                <span v-if="!loading" class="pl-8">ذخیره تغییرات</span>
                <span v-else class="loader mx-8 w-5 h-5 border-2 rounded-full border-blue-300"></span>
              </button>

              <button type="button" class="flex items-center border border-blue-450 text-blue-450 rounded py-2 px-8 mr-4" @click="selected = null">
                <span>انصراف</span>
              </button>
            </div>

          </form>

          <div v-else class="flex justify-center items-center h-60">
            یک صفحه را برای ویرایش انتخاب نمایید
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import { useNotificationStore } from '~/stores/notification'

definePageMeta({
  layout: 'admin'
})

export default {
  name: "AdminFormsPage",
  components: {Editor},
  data() {
    return {
      pages: [
        {
          id: 1,
          link: 'help',
          title: 'راهنمای سایت',
        },
        {
          id: 2,
          link: 'contact-us',
          title: 'تماس با ما',
        },
        {
          id: 3,
          link: 'privacy',
          title: 'سیاست حفظ حریم خصوصی',
        }
      ],
      selected: null,
      loading: false,
      body: '',
    }
  },
  watch: {
    selected(value) {
      value && this.loadPage()
    }
  },
  methods: {
    loadPage() {
      this.loading = true
      const { $axios } = useNuxtApp()
      $axios.$get(`admin/pages/${this.selected.link}`)
        .then((response) => {
          if (response) {
            this.body = response.body
          }
        })
        .catch((error) => {
          const notificationStore = useNotificationStore()
          notificationStore.showError(error.response?.data?.message || 'خطا در بارگذاری صفحه', error.response?.status)
        })
        .finally(() => {
          this.loading = false
        })
    },
    submit() {
      this.loading = true
      const { $axios } = useNuxtApp()
      const notificationStore = useNotificationStore()
      
      $axios.$post(`admin/pages/${this.selected.link}`, {body: this.body})
        .then(() => {
          notificationStore.showSuccess('صفحه با موفقیت به‌روزرسانی شد.')
        })
        .catch((error) => {
          notificationStore.showError(error.response?.data?.message || 'خطا در ذخیره صفحه', error.response?.status)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
