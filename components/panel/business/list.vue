<template>
  <div class="rounded lg:p-4 lg:bg-white my-business-list -mt-12 text-sm md:text-base">
    <h3 class="mb-4 flex items-center justify-end z-10 relative">
      <i class="hidden lg:block pl-2 flaticon-032-briefcase text-xl"></i>
      <span class="hidden lg:block font-semibold flex-grow">لیست کسب و کارها</span>
      <nuxt-link to="/panel/businesses/new" class="float-left text-sm text-blue-450">
        <i class="flaticon-043-plus w-7 font-bold text-xs"></i>
        افزودن کسب و کار
      </nuxt-link>
    </h3>

    <div class="hidden lg:block">
      <table class="w-full text-sm">
        <thead>
        <tr class="bg-gray-50 h-12">
          <th class="text-right px-2">تصویر</th>
          <th class="text-right px-2">نام</th>
          <th class="text-right px-2">لینک</th>
          <th class="text-right px-2">وضعیت</th>
          <th class="text-right px-2">عملیات</th>
        </tr>
        </thead>

        <tbody>
        <tr
          v-for="item in items"
          :key="item.id"
          :class="['border-b border-gray-200 py-px', !item.status ? 's' : '']"
        >
          <td class="py-2px px-0 w-28">
            <div :class="['h-24 px-4 flex items-center', !item.status || !item.active? 'bg-yellow-250' : '']">
              <div v-if="item.avatar" class="w-16 ml-4">
                <nuxt-link :to="`/${item.link}`" class="image-wrapper block relative ">
                  <img :src="`${baseUrl}${item.avatar}`" alt="" class="absolute top-0 right-0 h-full w-full object-cover overflow-hidden rounded-full">
                </nuxt-link>
              </div>
              <span v-else>بدون تصویر</span>
            </div>
          </td>
          <td class="py-2px px-0">
          <span :class="['h-24 flex items-center', !item.status || !item.active? 'bg-yellow-250' : '']">
            {{ item.name }}
          </span>
          </td>
          <td class="py-2px px-0">
          <span :class="['h-24 flex items-center', !item.status || !item.active? 'bg-yellow-250' : '']">
            <span v-if="!item.link">بدون لینک</span>
            <nuxt-link :to="`/${item.link}`" v-else>{{ item.link }}</nuxt-link>
          </span>
          </td>
          <td class="py-2px px-0">
          <span :class="['h-24 flex items-center', !item.status || !item.active? 'bg-yellow-250' : '']">
          <Tooltip v-if="item.active && item.status">
            <template #activator>
              <i class="flaticon-151-check text-blue-450 font-bold"></i>
            </template>
            فعال
          </Tooltip>

          <Tooltip v-else>
            <template #activator>
              <i class="flaticon-034-cancel text-red-550 font-bold"></i>
            </template>
            غیرفعال
          </Tooltip>
          </span>
          </td>
          <td class="py-2px px-0">
          <span :class="['h-24 flex items-center', !item.status || !item.active? 'bg-yellow-250' : '']">
          <EditButton
            v-if="item.status"
            label="ویرایش"
            @click="$router.push(`/panel/businesses/${item.id}/edit`)"
          />
          <DeleteButton
            v-if="item.status"
            label="حذف" class="mr-4"
            @click="$emit('click-remove-btn', item)"
          />
          <span v-else>درحال بررسی</span>
          </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="lg:hidden bg-white px-3">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        :class="[index + 1 < items.length ? 'border-b' : '','border-gray-200 flex items-center py-4']"
      >
        <div class="ml-4">
          <nuxt-link v-if="item.avatar" :to="`/${item.link}`" class="image-wrapper block relative h-20 w-20 rounded-full">
            <img :src="`${baseUrl}${item.avatar}`" alt="" class="absolute top-0 right-0 h-full w-full object-cover overflow-hidden rounded-full">
          </nuxt-link>
          <span v-else class="h-20 w-20 bg-gray-100 rounded-full items-center justify-center flex">بدون تصویر</span>
        </div>

        <div class="ml-3 flex-grow">
          <div class="font-medium text-left">
            <span v-if="item.status && item.active" class="text-blue-450">فعال</span>
            <span v-else-if="item.approved" class="text-red-550">غیرفعال</span>
            <span v-else class="text-yellow-400">درحال بررسی</span>
          </div>
          <div class="font-bold mb-2 truncate">{{ item.name }}</div>
          <div class="flex items-center">
            <div class="flex-grow text-gray-500 text-xs">
              لینک:
              <span v-if="!item.link">بدون لینک</span>
              <nuxt-link v-else :to="`/${item.link}`">{{ item.link }}</nuxt-link>
            </div>
            <EditButton
              v-if="item.status"
              label="ویرایش"
              class="mx-4"
              @click="$router.push(`/panel/businesses/${item.id}/edit`)"
            />
            <DeleteButton
              label="حذف" class="mr-4"
              @click="$emit('click-remove-btn', item)"
            />
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "PanelBusinessList",
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  computed: {
    baseUrl() {
      return useRuntimeConfig().public.storagePath
    }
  }
}
</script>

<style>
.py-2px {
  padding-top: 2px;
  padding-bottom: 2px;
}
.my-business-list .image-wrapper {
  padding-top: 100%;
}
</style>
