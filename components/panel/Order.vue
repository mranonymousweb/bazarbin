<template>
  <div>
    <div v-if="invoice">
      <div class="hidden md:block bg-white rounded">
        <div class="flex items-center px-12 py-4">
          <div class="w-24 flex justify-center items-center h-24 rounded-full object-cover ml-9 border border-cyan-250">
            <nuxt-link :to="invoice.comments_link">
              <img :src="baseUrl+invoice.avatar" alt="" class="w-24 h-24 rounded-full object-cover ml-9">
            </nuxt-link>
          </div>
          <div class="flex-grow">
            <nuxt-link :to="invoice.comments_link" class="block font-semibold mb-3 text-lg">
              {{ invoice.name }}
            </nuxt-link>
            <div>
              مجموع سفارش :
              <span class="text-cyan-250">{{ invoice.items.length }} عدد</span>
            </div>
          </div>
          <div class="">
            <div class="mb-4 flex">
              <span class="text-gray-500 inline-block ml-12 flex-grow">
                <span v-if="invoice.deleted_at" class="text-red-550">حذف شد</span>
              <span v-else-if="invoice.done" class="text-blue-500">بررسی شد</span>
              <span v-else class="text-yellow-500">درحال بررسی</span>
              </span>
              <button v-if="!invoice.done && (!invoice.deleted_at || isUser || isAdmin)" class="font-medium text-red-550" @click="deleteItem('all')">
                حذف سبد خرید
              </button>
            </div>
            <div>
              <span class="text-gray-500 inline-block ml-12">مبلغ کل قابل پرداخت</span>
              <span class="text-xl font-semibold">{{ invoice.price.toLocaleString() }} تومان</span>
            </div>
          </div>
        </div>
      </div>

      <div class="md:hidden bg-white relative rounded p-4 mt-20">

        <div class="absolute w-full -top-8 right-4">
          <div class="flex">
            <img :src="baseUrl+invoice.avatar" alt="" class="w-16 h-16 rounded-full object-cover ml-9">
            <nuxt-link :to="invoice.comments_link" class="flex flex-col justify-center items-center">
              <icons-solid-star class="text-gold w-6 h-6"/>
              <span>5</span>
            </nuxt-link>
          </div>
        </div>

        <div class="">
          <div class="flex items-center mb-4">
            <div class="flex-grow">
              <div class="font-semibold pt-5">
                {{ invoice.name }}
              </div>
            </div>
            <div class="text-gray-500 ml-4 text-xs">
              <span class="border-l border-cyan-250 pl-2 ml-2 hidden">کد : {{ invoice.id }}</span>
              <span class="border-l border-cyan-250 pl-2 ml-2">{{ formatDate(invoice.created_at, 'jYYYY/jMM/jDD') }}</span>
              {{ formatDate(invoice.created_at, 'HH:mm') }}
            </div>
            <div>
              <button v-if="!invoice.done && (!invoice.deleted_at || isUser || isAdmin)" class="font-medium text-red-550" @click="deleteItem('all')">
                <i class="flaticon-133-trash text-lg"></i>
              </button>
            </div>
          </div>
          <div class="flex items-center">
            <div class="flex-grow font-medium">
              تعداد سفارش :
              {{ invoice.items.length }}
            </div>
            <div class="text-base font-semibold">
              قیمت کل :
              {{ invoice.price.toLocaleString() }} تومان
            </div>
          </div>
        </div>
      </div>

      <div class="p-3 md:px-12 md:py-8 bg-white rounded mt-4">
        <div
          v-for="(item, index) in invoice.items"
          :key="item.id"
          :class="['flex items-center relative', invoice.items.length > index + 1 ? 'border-b pb-8 mb-8' : '']"
        >
          <nuxt-link :to="item.link" class="flex-shrink-0">
            <img :src="baseUrl+item.picture" alt="" class="w-24 h-16 md:w-36 md:h-24 rounded-lg object-contain md:ml-9 ml-3">
            <div v-if="item.item_id" class="text-center md:hidden mt-2">کد محصول: {{ item.item_id }}</div>
          </nuxt-link>
          <div class="flex-grow">
            <div class="font-semibold mb-4 md:truncate">
              <nuxt-link :to="item.link">
                {{ item.name }}
              </nuxt-link>
            </div>
            <div class="text-gray-500 leading-none">
              <span v-if="item.item_id" class="hidden md:inline-block border-l border-cyan-250 pl-4 ml-4">
                شناسه محصول : {{ item.item_id }}
              </span>
              <span v-if="item.type === 'price'" class="inline-block border-l border-cyan-250 pl-1 md:pl-4 md:ml-4">
                <span class="hidden md">مقدار سفارش :</span>
                {{ item.count }} {{ item.price_title }}
              </span>
              <span v-if="item.type === 'appointment'" class="inline-block border-l border-cyan-250 md:pl-4 md:ml-4 pl-1">
                  تاریخ:
                  {{ formatDate(item.appointment_date, 'jYYYY/jM/jD') }}
                </span>
              <span v-if="item.type === 'appointment'" class="inline-block border-l border-cyan-250 md:pl-4 md:ml-4 pl-1">
                  نوبت:
                  {{ item.appointment_name }}
                </span>
              <span v-if="item.type === 'appointment'" class="inline-block border-l border-cyan-250 md:pl-4 md:ml-4 pl-1">
                  {{ item.appointment_description }}
              </span>
              <span>مبلغ: {{ item.price.toLocaleString() }} تومان</span>
            </div>
          </div>
          <div v-if="!invoice.done && !invoice.deleted_at" class="hidden md:block">
            <button @click="deleteItem(index)">
              <i class="flaticon-133-trash text-2xl text-red-550"></i>
            </button>
          </div>
          <button class="md:hidden absolute left-0 top-0" @click="deleteItem(index)">
            <i class="flaticon-133-trash text-xl text-red-550"></i>
          </button>
        </div>
      </div>

      <div class="mt-4 bg-white py-3 md:py-4 px-3 md:px-8 rounded">
        <div class="bg-gray-50 text-gray-600 px-4 py-2 flex font-medium md:mb-4">
          <div class="flex-grow">مشخصات کاربر</div>
          <div class="hidden md:block ml-12">{{ formatDate(invoice.created_at, 'HH:mm') }}</div>
          <div class="hidden md:block">{{ formatDate(invoice.created_at, 'jYYYY/jMM/jDD') }}</div>
        </div>
        <div
          v-for="field in invoice.fields"
          :key="field.id"
          class="py-2 px-4 border-b flex"
        >
          <div class="w-5/12 md:w-1/4 font-semibold">{{ field.field.title }}</div>
          <div>{{ field.value }}</div>
        </div>
      </div>
      <div class="mt-4 bg-white p-4 rounded">
        <div ref="map" class="w-full h-96"></div>
      </div>
      <div class="flex justify-center items-center mt-4 md:mt-12 no-print">
        <button
          :class="[
            'flex items-center justify-center w-52 rounded py-2 md:py-3 px-4 md:px-12 mr-4',
            isUser || invoice.done || invoice.deleted_at ? 'bg-blue-450 text-white' : 'border border-blue-450 text-blue-450',
          ]"
          @click="$router.back()"
        >
          بازگشت
        </button>
        <button
          v-if="!isUser && !invoice.done && !invoice.deleted_at"
          class="flex items-center justify-center bg-blue-450 text-white w-52 rounded py-2 md:py-3 px-4 md:px-12 mr-4"
          @click="$emit('done')"
        >
          تکمیل سفارش
        </button>
        <button class="hidden md:block p-1 mr-12" @click="print">
          <i class="flaticon-119-printer text-3xl text-gray-500"></i>
        </button>
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
  name: "PanelOrder",
  components: {DeleteConfirmationModal},
  mixins: [moment],
  props: {
    invoice: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      interval: null,
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
    }
  },
  mounted() {
    if (this.invoice) {
      this.mapInit()
    } else {
      this.interval = setInterval(() => {
        if (this.invoice) {
          this.mapInit()
          clearInterval(this.interval)
          this.interval = null
        }
      }, 1000)
    }
  },
  destroyed() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    mapInit() {
      const position = {lat: this.invoice.lat, lng: this.invoice.lng}

      this.map = new window.L.Map(this.$refs.map, {
        key: process.env.NESHAN_WEB_APP_KEY,
        maptype: 'dreamy-gold',
        poi: true,
        traffic: false,
        center: position,
        zoom: 16
      });

      this.marker = window.L.marker(position, {
        icon: window.L.icon({
          iconUrl: require('~/assets/images/marker2.png'),
          iconSize: [64, 77],
          iconAnchor: [32, 77],
        })
      }).addTo(this.map);
    },
    deleteItem(index) {
      this.deleteItemIndex = index
      this.deleteConfirmation = true
    },
    print() {
      window.print()
    }
  }
}
</script>
