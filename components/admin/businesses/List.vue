<template>
  <div>
    <admin-list
      :cols="cols"
      title=""
      :pagination="pagination"
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
              <img v-if="item.avatar" :src="storagePath+item.avatar" alt="" class="w-12 h-12 rounded-full object-cover">
              <span v-else class="flex items-center text-center w-12 h-12 pb-1 rounded bg-gray-100 text-xs">بدون تصویر</span>
            </td>
            <td class="px-2">
              <NuxtLink v-if="item.link && item.active && item.status && item.approved" :to="`/${item.link}`">{{ item.name }}</NuxtLink>
              <span v-else>{{ item.name }}</span>
            </td>
            <td class="px-2">{{ item.id }}</td>
            <td class="px-2">
              {{ item.owner.firstname }} {{ item.owner.lastname }}<br>
              <span class="text-gray-400">{{ item.owner.phone }}</span>
            </td>
            <td class="px-2">
              <EnableDisableButton
                :status="item.status"
                @disable="changeItemStatus(item, 0)"
                @enable="changeItemStatus(item, 1)"
              />
            </td>
            <td class="px-2">
              <Tooltip>
                <template #activator>
                  <nuxt-link :to="`/admin/businesses/${item.id}/edit`">
                    <i class="flaticon-162-edit text-base text-gray-500 inline-block cursor-pointer"></i>
                  </nuxt-link>
                </template>
                ویرایش کسب و کار
              </Tooltip>
              <Tooltip>
                <template #activator>
                  <nuxt-link :to="`/admin/businesses/${item.id}/comments`">
                    <i class="flaticon-160-chat text-base text-gray-500 inline-block cursor-pointer mr-2"></i>
                  </nuxt-link>
                </template>
                نظرات کسب و کار
              </Tooltip>
              <Tooltip>
                <template #activator>
                  <i class="flaticon-133-trash text-base text-red-550 inline-block cursor-pointer mr-2"
                     @click="removeRequest(index)"></i>
                </template>
                حذف کسب و کار
              </Tooltip>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr
            v-for="i in pageItems"
            :key="i"
            :class="['h-12 border-trueGray-200', i < 15 ? 'border-b-2' : '']"
          >
            <td class="px-2 py-4">
              <span class="screens-skeleton-el h-12 w-12 bg-gray-200 rounded-full inline-block"></span>
            </td>
            <td class="px-2">
              <span class="screens-skeleton-el w-2/5 h-4 bg-gray-200 inline-block"></span>
            </td>
            <td class="px-2">
              <span class="screens-skeleton-el w-1/2 h-4 bg-gray-200 inline-block"></span>
            </td>
            <td class="px-2">
              <span class="screens-skeleton-el w-1/2 h-4 bg-gray-200 inline-block"></span>
            </td>
            <td class="px-2">
              <span class="screens-skeleton-el w-1/2 h-4 bg-gray-200 inline-block"></span>
            </td>
            <td class="px-2">
              <span class="screens-skeleton-el h-4 w-4 bg-gray-200 inline-block"></span>
              <span class="screens-skeleton-el h-4 w-4 bg-gray-200 inline-block mr-2"></span>
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
  name: "AdminBusinessesList",
  mixins: [List],
  props: {
    list: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      url: 'admin/businesses',
      itemType: 'کسب و کار',
      listQuery: this.list === 'disabled'
        ? 'filter=deactivated_by_user'
        : this.list === 'suspended'
          ? 'filter=deactivated_by_admin'
          : this.list === 'edited'
            ? 'filter=has_edit_request'
            : this.list === 'new'
              ? 'filter=not_confirmed'
              : '',
      cols: [
        {label: 'تصویر', class: 'w-24'},
        {label: 'نام', class: ''},
        {label: 'کد اصلی', class: 'w-36'},
        {label: 'صاحب', class: 'w-48'},
        {label: 'وضعیت', class: 'w-36'},
        {label: 'عملیات', class: 'w-36'},
      ]
    }
  },
  mounted() {
    if (this.url) {
      this.fetchData()
    }
  },
  watch: {
    pagination: {
      handler(value) {
        this.$emit('load-pagination', value)
      },
      deep: true
    }
  }
}
</script>
