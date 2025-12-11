<template>
  <div>
    <admin-list
      :cols="cols"
      :pagination="pagination"
      title=""
      @select-page="loadNewPage"
    >
      <template #tbody>
        <template v-if="!loading">
          <tr
            v-for="(item, index) in items"
            :key="item.id"
            :class="['h-12 border-trueGray-200', index + 1 < items.length ? 'border-b-2' : '']"
          >
            <td class="px-2 py-4">
              <img :src="storagePath+item.picture" alt="" class="w-12 h-12 rounded-full object-cover">
            </td>
            <td class="px-2">{{ item.name }}</td>
            <td class="px-2">
              <EnableDisableButton
                :status="item.active"
                @disable="changeItemStatus(item, 0)"
                @enable="changeItemStatus(item, 1)"
              />
            </td>
            <td class="px-2">
              <Tooltip>
                <template #activator>
                  <nuxt-link :to="`/admin/products/${item.id}`">
                    <i class="flaticon-162-edit text-base text-gray-500 inline-block cursor-pointer"></i>
                  </nuxt-link>
                </template>
                ویرایش محصول
              </Tooltip>
              <Tooltip>
                <template #activator>
                  <nuxt-link :to="`/admin/products/${item.id}/comments`">
                    <i class="flaticon-160-chat text-base text-gray-500 inline-block cursor-pointer mr-2"></i>
                  </nuxt-link>
                </template>
                نظرات محصول
              </Tooltip>
              <Tooltip>
                <template #activator>
                  <i class="flaticon-133-trash text-base text-red-550 inline-block cursor-pointer mr-2"
                     @click="removeRequest(index)"></i>
                </template>
                حذف محصول
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

export default {
  name: "AdminProductsList",
  mixins: [List],
  data() {
    return {
      url: 'admin/general_products',
      removeUrlSuffix: '/delete',
      itemType: 'محصول',
      statusKey: 'active',
      cols: [
        {label: 'تصویر', class: 'w-24'},
        {label: 'نام', class: ''},
        {label: 'وضعیت', class: 'w-36'},
        {label: 'عملیات', class: 'w-36'},
      ]
    }
  },
  mounted() {
    if (this.url) {
      this.fetchData()
    }
  }
}
</script>
