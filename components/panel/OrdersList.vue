<template>
  <div class="text-sm md:text-base">
    <div class="-mx-2 md:mx-0 p-2 pt-4 pb-5 md:px-4 lg:px-12 md:py-4 lg:py-8 bg-white rounded mt-4">
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="[items.length > index + 1 ? 'border-b pb-5 mb-4 md:pb-8 md:mb-8' : '', index]"
      >
        <div class="hidden md:flex items-center">

          <nuxt-link :to="item.comments_link" class="flex-shrink-0">
            <img :src="baseUrl+item.avatar" alt="" class="w-24 h-24 ml-2 lg:ml-9 rounded-full object-cover ">
          </nuxt-link>

          <div class="flex-grow ml-4">
            <div class="flex justify-between">
              <nuxt-link :to="item.comments_link" class="font-semibold flex-grow mb-4">
                {{ item.name }}
              </nuxt-link>
              <div class="block w-1/3 flex-shrink-0 font-medium">
                <span v-if="item.deleted_at" class="text-red-550">حذف شد</span>
                <span v-else-if="item.done" class="text-blue-500">بررسی شد</span>
                <span v-else class="text-yellow-500">درحال بررسی</span>
              </div>
            </div>
            <div class="text-gray-500 leading-none text-xs text-sm lg:text-base">
              <span class="inline-block border-l border-cyan-250 pl-2 ml-2 lg:pl-4 lg:ml-4">شماره فاکتور: {{ item.id }}</span>
              <span class="inline-block border-l border-cyan-250 pl-2 ml-2 lg:pl-4 lg:ml-4">تاریخ: {{ formatDate(item.created_at, 'jYYYY/jMM/jDD') }}</span>
              <span class="inline-block border-l border-cyan-250 pl-2 ml-2 lg:pl-4 lg:ml-4">تعداد سفارش: {{ item.items_count }} عدد</span>
              <span v-if="item.price">مبلغ: {{ item.price.toLocaleString() }} تومان</span>
            </div>
          </div>

          <div class="text-center">
            <div v-if="! item.done && (!item.deleted_at || isUser || isAdmin)" class="mb-4">
              <button @click="deleteItem(index)">
                <i class="flaticon-133-trash text-2xl text-red-550"></i>
              </button>
            </div>
            <div>
              <nuxt-link :to="`${pageLink}${item.id}`" class="text-cyan-250">
                مشاهده جزئیات
              </nuxt-link>
            </div>
          </div>
        </div>

        <nuxt-link :to="pageLink + item.id" class="flex md:hidden items-center">

          <div class="flex-shrink-0">
            <img :src="baseUrl+item.avatar" alt="" class="w-16 h-16 ml-2 rounded-full object-cover ">
          </div>

          <div class="flex-grow">

            <div class="flex justify-between">
              <span class="font-semibold flex-grow ml-4 mb-2">
                {{ item.name }}
              </span>
              <button class="-mt-2" @click.prevent="deleteItem(index)">
                <i class="flaticon-133-trash text-base text-red-550"></i>
              </button>
            </div>

            <div class="text-gray-500 leading-none text-xs">
              <span class="inline-block border-l border-cyan-250 pl-1">تعداد سفارش: {{ item.items_count }} عدد</span>
              <span v-if="item.price">مبلغ: {{ item.price.toLocaleString() }} تومان</span>
            </div>

            <div class="font-bold text-xs -mb-2 mt-3 flex">
              <span class="border-l text-gray-500 border-cyan-250 pl-1 ml-1">کد: {{ item.id }}</span>
              <span class="pl-2 ml-2 text-gray-500 flex-grow">{{ formatDate(item.created_at, 'jYYYY/jMM/jDD') }}</span>
              <span v-if="item.deleted_at" class="text-red-550">حذف شد</span>
              <span v-else-if="item.done" class="text-blue-500">بررسی شد</span>
              <span v-else class="text-yellow-500">درحال بررسی</span>
            </div>

          </div>

        </nuxt-link>
      </div>
    </div>

    <delete-confirmation-modal
      :show="deleteConfirmation"
      @close="deleteConfirmation = false"
      @confirm="$emit('delete', deleteItemIndex)"
    />
  </div>
</template>

<script>
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import moment from "../../mixins/moment";
export default {
  name: "PanelOrdersList",
  components: {DeleteConfirmationModal},
  mixins: [moment],
  props: {
    items: {
      type: Array,
      required: true
    },
    isAdminPage: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      loading: true,
      deleteItemIndex: null,
      deleteConfirmation: false,
      baseUrl: process.env.storagePath
    }
  },
  computed: {
    isUser() {
      return this.$route.path.startsWith('/panel/my-orders')
    },
    isAdmin() {
      return this.$store.getters["user/isAdmin"]
    },
    pageLink() {
      return `${this.$route.path}${this.$route.path.endsWith('/') ? '' : '/'}`
    }
  },
  methods: {
    deleteItem(index) {
      this.deleteItemIndex = index
      this.deleteConfirmation = true
    }
  }
}
</script>
