<template>
  <div>
    <div class="hidden lg:flex justify-between">
      <div class="text-gray-400 font-medium">
        تاریخ عضویت:
        {{ formatDate(item.created_at, 'jYYYY/jMM/jDD') }}
      </div>
      <div class="flex">
        <div class="w-auto flex-grow flex flex-col items-center justify-center">
          <div class="">{{ item.products_count }}</div>
          <div class="text-gray-400 text-xs">
            <span v-if="item.custom_titles.products_count">
              {{ item.custom_titles.products_count}}
            </span>
            <span v-else>کالا و خدمات</span>
          </div>
        </div>
        <span class="mx-4 text-gray-300">|</span>
        <div class="w-auto flex-grow flex flex-col items-center justify-center">
          <div class="">{{ item.likes }}</div>
          <div class="text-gray-400 text-xs">
            <span v-if="item.custom_titles.likes">
              {{ item.custom_titles.likes}}
            </span>
            <span v-else>مشتری</span>
          </div>
        </div>
        <span class="mx-4 text-gray-300">|</span>
        <div class="w-auto flex-grow flex flex-col items-center justify-center">
          <div class="">{{ item.done_invoices_count }}</div>
          <div class="text-gray-400 text-xs">
            <span v-if="item.custom_titles.done_invoices_count">
              {{ item.custom_titles.done_invoices_count}}
            </span>
            <span v-else>ارسالی</span>
          </div>
        </div>
        <span class="mx-4 text-gray-300">|</span>
        <div class="w-auto flex-grow flex flex-col items-center justify-center">
          <div class="">{{ item.invoices_count }}</div>
          <div class="text-gray-400 text-xs">
            <span v-if="item.custom_titles.invoices_count">
              {{ item.custom_titles.invoices_count }}
            </span>
            <span v-else>دریافتی</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex lg:items-center">
      <button @click="$emit('click-avatar')">
        <img :src="baseUrl+(item.avatar || item.picture)" alt="" class="w-16 h-16 lg:w-24 lg:h-24 rounded-full object-cover ml-2 lg:ml-4">
      </button>
      <div class="hidden lg:block">
        <div class="font-bold text-cyan-600 mr-2">
          {{ item.name }}
        </div>
        <div class="mt-1">
          <IconsSolidMapPin
            class="inline w-5 text-gray-500"
          />
          {{ item.address }}
        </div>
      </div>
      <div class="flex flex-grow lg:hidden">
        <div class="w-auto flex-grow flex flex-col items-center justify-center">
          <div class="">{{ item.products_count }}</div>
          <div class="text-gray-400 text-xs">
            <span v-if="item.custom_titles.products_count">
              {{ item.custom_titles.products_count}}
            </span>
            <span v-else>کالا و خدمات</span>
          </div>
        </div>
        <div class="w-auto flex-grow flex flex-col items-center justify-center">
          <div class="">{{ item.likes }}</div>
          <div class="text-gray-400 text-xs">
            <span v-if="item.custom_titles.likes">
              {{ item.custom_titles.likes}}
            </span>
            <span v-else>مشتری</span>
          </div>
        </div>
        <div class="w-auto flex-grow flex flex-col items-center justify-center">
          <div class="">{{ item.done_invoices_count }}</div>
          <div class="text-gray-400 text-xs">
            <span v-if="item.custom_titles.done_invoices_count">
              {{ item.custom_titles.done_invoices_count}}
            </span>
            <span v-else>ارسالی</span>
          </div>
        </div>
        <div class="w-auto flex-grow flex flex-col items-center justify-center">
          <div class="">{{ item.invoices_count }}</div>
          <div class="text-gray-400 text-xs">
            <span v-if="item.custom_titles.invoices_count">
              {{ item.custom_titles.invoices_count }}
            </span>
            <span v-else>دریافتی</span>
          </div>
        </div>
      </div>
    </div>
    <div class="lg:hidden mt-3 font-bold text-cyan-600 mr-2">
      {{ item.name }}
    </div>
    <div class="lg:hidden mt-4">
      <IconsSolidMapPin
        class="inline w-5 text-gray-500"
      />
      {{ item.address }}
    </div>
    <front-item-page-header
      v-if="false"
      :item="item"
      type="business"
      @change-liked="$emit('change-liked')"
      @change-bookmarked="$emit('change-bookmarked')"
    />
  </div>
</template>

<script>
import moment from "~/mixins/moment";

export default {
  name: "FrontBusinessHeader",
  mixins: [moment],
  props: {
    item: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      baseUrl: process.env.storagePath
    }
  }
}
</script>
