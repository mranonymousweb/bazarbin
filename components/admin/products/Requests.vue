<template>
  <div>
    <admin-list
      :cols="cols"
      title=""
    >
      <template #tbody>
        <template v-if="!loading">
          <tr
            v-for="(item, index) in items"
            :key="item.id"
            :class="['h-12 border-trueGray-200', index + 1 < items.length ? 'border-b-2' : '']"
          >
            <td class="px-2 py-4">
              <img v-if="item.picture" :src="storagePath+item.picture" alt="" class="w-12 h-12 rounded-full object-cover">
              <div v-else class="w-12 h-12 rounded-full bg-yellow-250 flex items-center text-center text-xs">بدون تصویر</div>
            </td>
            <td class="px-2">{{ item.name }}</td>
<!--            <td class="px-2">{{ item.description }}</td>
            <td class="px-2">{{ item.tags ? item.tags.replaceAll(',', '، ') : '' }}</td>
            <td class="px-2">
              <i
                v-if="item.made_in_iran"
                class="flaticon-151-check text-blue-450 font-bold text-base"
              ></i>
              <i
                v-else
                class="flaticon-034-cancel text-red-550 font-bold text-base"
              ></i>
            </td>
-->
            <td class="px-2">
              <Tooltip>
                <template #activator>
                  <button
                    @click="confirm(item.id)"
                    :disabled="confirmingId === item.id"
                  >
                    <span v-if="confirmingId === item.id" class="loader mx-8 w-5 h-5 border-2 rounded-full border-blue-300"></span>
                    <i v-else class="flaticon-043-plus text-base text-gray-500 inline-block cursor-pointer"></i>
                  </button>
                </template>
                تأیید درخواست و ایجاد محصول
              </Tooltip>
              <Tooltip>
                <template #activator>
                  <i class="flaticon-133-trash text-base text-red-550 inline-block cursor-pointer mr-2"
                     @click="removeRequest(index)"></i>
                </template>
                رد درخواست و حذف محصول
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
      @confirm="removeConfirm(items[removeIndex])"
    />
  </div>
</template>

<script>

import List from "~/mixins/list"
import { useNotificationStore } from '~/stores/notification'

export default {
  name: "AdminProductsRequests",
  mixins: [List],
  data() {
    return {
      url: 'admin/general_product_requests',
      itemType: 'درخواست محصول جدید',
      statusKey: 'active',
      confirmingId: null,
      cols: [
        {label: 'تصویر', class: 'w-24'},
        {label: 'نام', class: ''},
        // {label: 'توضیحات', class: ''},
        // {label: 'تگ‌ها', class: ''},
        // {label: 'ساخت ایران', class: 'w-36'},
        {label: 'عملیات', class: ''},
      ]
    }
  },
  mounted() {
    if (this.url) {
      this.fetchData()
    }
  },
  methods: {
    confirm(id) {
      this.confirmingId = id
      const { $axios } = useNuxtApp()
      const router = useRouter()
      const notificationStore = useNotificationStore()
      
      $axios.$post(`admin/general_product_requests/${id}/confirm`)
        .then(response => {
          router.push(`/admin/products/${response.id}`)
        })
        .catch(error => {
          this.showError(error.response?.data?.message || error.request?.statusText, error.response?.status)
        })
        .finally(() => {
          this.confirmingId = null
        })
    }
  }
}
</script>
