<template>
  <div>
    <AdminList
      title=""
      :cols="cols"
    >
      <template #tbody>
        <template v-if="!loading">
          <tr
            v-for="(item, index) in items"
            :key="item.id"
            :class="['h-12 border-trueGray-200', index + 1 < items.length ? 'border-b-2' : '']"
          >
            <td class="px-2">{{ item.description }}</td>
            <td class="px-2">
              <div v-if="item.user">
                {{ item.user.firstname }}
                {{ item.user.lastname }}
              </div>
              <div v-else>کاربر غیر عضو</div>
            </td>
            <td class="px-2 py-2">
              <div
                v-if="item.reportable_type.endsWith('Review')"
              >
                <div class="text-gray-400">
                  نظر بر روی
                  <span v-if="item.reportable_type.endsWith('GeneralProductReview')">
                    محصول
                  </span>
                  <span v-else-if="item.reportable_type.endsWith('ProductReview')">
                    محصول کسب و کار
                  </span>
                  <span v-else-if="item.reportable_type.endsWith('BusinessReview')">
                    کسب و کار
                  </span>
                </div>

                <div class="">
                  {{ item.reportable.comment }}
                </div>

              </div>
              <div v-if="item.reportable_type.endsWith('Business')">
                <div class="text-gray-400">
                  کسب و کار
                </div>
                <NuxtLink
                  :to="`/${item.link}`"
                  class="text-blue-600"
                >{{ item.reportable.name }}</NuxtLink>
              </div>
              <div v-if="item.reportable_type.endsWith('Product')">
                <div class="text-gray-400">
                  محصول
                </div>
                <NuxtLink
                  :to="item.link"
                  class="text-blue-600"
                >{{ item.reportable.name }}</NuxtLink>
              </div>
            </td>

            <td class="px-2">

              <div class="flex">
                <Tooltip
                  v-if="item.accepted !== true"
                >
                  <template #activator>
                    <i
                      class="flaticon-151-check text-blue-450 font-bold text-base cursor-pointer"
                      @click="submit('accept', item)"
                    ></i>
                  </template>
                  قبول گزارش
                </Tooltip>

                <Tooltip
                  v-if="item.read === false || item.accepted !== false"
                >
                  <template #activator>
                    <i
                      class="flaticon-034-cancel text-red-550 font-bold text-base cursor-pointer mr-4"
                      @click="submit('reject', item)"
                    ></i>
                  </template>
                  رد گزارش
                </Tooltip>

                <Tooltip>
                  <template #activator>
                    <i class="flaticon-133-trash text-base text-red-550 inline-block cursor-pointer mr-4"
                       @click="submit('remove', item)"></i>
                  </template>
                  حذف گزارش
                </Tooltip>
              </div>

            </td>
          </tr>
        </template>
      </template>
    </AdminList>
  </div>
</template>

<script>

import AdminList from "../list.vue";
import List from "~/mixins/list"
import { useNotificationStore } from '~/stores/notification'

export default {
  name: "AdminReportsList",
  components: {AdminList},
  mixins: [List],
  props: {
    list: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      saving: null,
      savingItem: null,
      url: 'admin/reports',
      itemType: 'گزارش تخلف',
      listQuery: `${this.list}=1`,
      cols: [
        {label: 'شرح', class: ''},
        {label: 'گزارش دهده', class: 'w-36'},
        {label: 'موضوع گزارش', class: ''},
        {label: 'عملیات', class: 'w-36'},
      ]
    }
  },
  mounted() {
    if (this.url) {
      this.fetchData()
    }
  },
  methods: {
    submit(action, report) {
      this.saving = action
      this.savingItem = report.id
      const { $axios } = useNuxtApp()
      const notificationStore = useNotificationStore()
      const method = action === 'remove' ? '$delete' : '$post'
      const url =  action === 'remove' ? `admin/reports/${report.id}` : `admin/reports/${report.id}/${action}`
      
      $axios[method](url,{})
        .then(response => {
          this.fetchData()
          notificationStore.showSuccess(response.message || 'عملیات با موفقیت انجام شد.')
        })
        .catch(error => {
          this.showError(error.response?.data?.message || error.request?.statusText, error.response?.status)
        })
        .finally(() => {
          this.saving = null
          this.savingItem = null
        })
    }
  }
}

</script>
