<template>
  <div class="text-sm md:text-base">
    <front-header class="mb-8"/>

    <div>
      <div class="relative flex items-center bg-white rounded px-4 lg:px-12 py-4 mt-14 md:mt-0">
        <nuxt-link :to="`/${link}`">
          <img :src="baseUrl+avatar" alt="" class="absolute -top-10 right-2 md:static w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ml-9">
        </nuxt-link>
        <div class="flex-grow">
          <div class="font-semibold mb-3 -mt-3 md:mt-0 pr-20 md:pr-0 text-base md:text-lg">
            <nuxt-link :to="`/${link}`">{{ name }}</nuxt-link>
          </div>
          <div v-if="orders.length" class="mt-8">
            مجموع سفارش :
            <span class="text-cyan-250">{{ orders.length }} عدد</span>
          </div>
        </div>
        <div class="self-end md:self-center text-left">
          <button class="font-medium text-red-550 md:mb-4" @click="deleteItem('all')">حذف سبد خرید</button>
          <div class="hidden md:block">
            <span class="text-gray-500 inline-block ml-12">مبلغ کل قابل پرداخت</span>
            <span class="text-xl font-semibold">{{ sum.toLocaleString() }} تومان</span>
          </div>
        </div>
      </div>
    </div>

    <div class="p-3 lg:px-12 md:py-8 bg-white rounded mt-4">
      <div
        v-for="(item, index) in orders"
        :key="item.price.id"
        :class="['flex items-center relative', orders.length > index + 1 ? 'border-b pb-8 mb-8' : '']"
      >
        <nuxt-link :to="`/${link}/${item.price.item.category_id}/${item.price.item.id}`" class="flex-shrink-0">
          <img :src="baseUrl+item.price.item.picture" alt="" class="w-24 h-16 md:w-36 md:h-24 rounded-lg object-contain md:ml-9 ml-3">
          <div class="text-center md:hidden mt-2">کد: {{ item.price.item.id }}</div>
        </nuxt-link>
        <div class="flex-grow">
          <div class="font-semibold mb-4">
            <nuxt-link :to="`/${link}/${item.price.item.category_id}/${item.price.item.id}`">{{ item.price.item.name }}</nuxt-link>
          </div>
          <div class="text-gray-500 leading-none">
            <span class="inline-block border-l border-cyan-250 pl-4 ml-4 hidden md:inline">
              شناسه محصول : {{ item.price.item.id }}
            </span>
            <span v-if="items_type === 'product'" class="inline-block border-l border-cyan-250 md:pl-4 md:ml-4 pl-1">
              مقدار <span class="hidden md:inline">سفارش</span>:
              {{ item.count }} {{ item.price.title }}
            </span>
            <span v-if="items_type === 'appointment'" class="inline-block border-l border-cyan-250 md:pl-4 md:ml-4 pl-1">
              تاریخ:
              {{ formatDate(item.appointment_date, 'jYYYY/jM/jD') }}
            </span>
            <span v-if="items_type === 'appointment'" class="inline-block border-l border-cyan-250 md:pl-4 md:ml-4 pl-1">
              نوبت:
              {{ item.appointment_name }}
            </span>
            <span v-if="items_type === 'appointment'" class="inline-block border-l border-cyan-250 md:pl-4 md:ml-4 pl-1">
              {{ item.appointment_description }}
            </span>
            <span v-if="items_type === 'product'">مبلغ: {{ item.sum.toLocaleString() }} تومان</span>
            <span v-if="items_type === 'appointment'">مبلغ:
              {{ item.price.discount
                ? item.price.price_after_discount.toLocaleString()
                : item.price.price.toLocaleString()
              }}
              تومان</span>
          </div>
        </div>
        <div class="hidden md:block">
            <button @click="deleteItem(index)">
              <i class="flaticon-133-trash text-2xl text-red-550"></i>
            </button>
        </div>
        <button class="md:hidden absolute left-0 top-0" @click="deleteItem(index)">
          <i class="flaticon-133-trash text-xl text-red-550"></i>
        </button>
      </div>
    </div>

    <div v-if="orders.length" class="hidden md:flex justify-center mt-20">
      <button
        class="flex items-center justify-center border border-blue-450 text-blue-450 w-52 rounded py-3 px-12 ml-4"
        @click="$router.back()"
      >
        بازگشت
      </button>
      <nuxt-link
        to="/cart/form"
        class="flex items-center justify-center bg-blue-450 text-white w-52 rounded py-3 px-12 mr-4"
      >
        تکمیل سفارش
      </nuxt-link>
    </div>
    <div v-if="orders.length" class="md:hidden bg-white mt-2 p-4">
      <div class="text-gray-500">مبلغ کل قابل پرداخت:</div>
      <div class="text-left text-lg my-2 font-bold">{{ sum.toLocaleString() }} تومان</div>
      <div class="flex">
        <button
          class="flex items-center justify-center border border-blue-450 text-blue-450 w-52 rounded py-2 px-4 ml-2"
          @click="$router.back()"
        >
          بازگشت
        </button>
        <nuxt-link
          to="/cart/form"
          class="flex items-center justify-center bg-blue-450 text-white w-52 rounded py-2 px-4 mr-2"
        >
          تکمیل سفارش
        </nuxt-link>
      </div>
    </div>

    <delete-confirmation-modal
      :show="deleteConfirmation"
      @close="deleteConfirmation = false"
      @confirm="removeConfirm"
    />
  </div>
</template>

<script>
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import errorParser from "../../mixins/error_parser";
import moment from "../../mixins/moment";

export default {
  name: "CartBusinessPage",
  components: {DeleteConfirmationModal},
  mixins: [errorParser,moment],
  layout: 'default',
  middleware: 'load.cities',
  data() {
    return {
      id: '',
      name: '',
      avatar: '',
      link: '',
      sum: '',
      orders: [],
      items_type: null,
      deleteItemIndex: null,
      deleteConfirmation: false,
      baseUrl: process.env.storagePath
    }
  },
  async fetch() {
    await this.$axios.$post('cart', {items: this.$store.state.cart.items, business: this.$route.params.business})
      .then(response => {
        this.id = response.id
        this.name = response.name
        this.avatar = response.avatar
        this.link = response.link
        this.sum = response.sum
        this.orders = response.orders
        this.items_type = response.type
      })
      .catch(error => this.showError(error))
  },
  methods: {
    deleteItem(index) {
      this.deleteItemIndex = index
      this.deleteConfirmation = true
    },
    removeConfirm() {
      if (this.deleteItemIndex === 'all') {
        this.$store.commit('cart/removeItems', this.orders.map(x => x.price.id))
        this.deleteConfirmation = false
        this.$router.push('/cart')
      } else {
        this.$store.commit('cart/removeItems', [this.orders[this.deleteItemIndex].price.id])
        this.sum -= this.orders[this.deleteItemIndex].sum
        this.orders.splice(this.deleteItemIndex, 1)
        this.deleteConfirmation = false
        this.deleteItemIndex = null
      }
    }
  }
}
</script>
