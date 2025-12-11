<template>
  <div class="text-sm md:text-base">
    <front-header class="mb-8"/>
    <div>
      <div class="relative flex items-center bg-white rounded px-4 lg:px-12 py-4 mt-14 md:mt-0">
        <div class="absolute -top-10 right-2 md:static w-20 h-20 md:w-24 md:h-24 bg-white flex justify-center items-center rounded-full object-cover ml-9 border border-cyan-250">
          <i class="flaticon-091-shopping-cart cursor-pointer text-3xl md:text-4xl text-gray-800"></i>
        </div>
        <div class="flex-grow">
          <div class="font-semibold mb-3 -mt-3 md:mt-0 pr-20 md:pr-0 text-base md:text-lg">سبد خرید</div>
          <div v-if="businesses.length" class="mt-8">
            مجموع سفارش :
            <span class="text-cyan-250">{{ count }} عدد</span>
          </div>
        </div>
        <div v-if="businesses.length" class="self-end md:self-center">
          <button class="font-medium text-red-550" @click="deleteItem('all')">حذف سبد خرید</button>
        </div>
      </div>
    </div>

    <div v-if="businesses.length" class="px-3 lg:px-12 py-3 md:py-8 bg-white rounded mt-4">
      <div
        v-for="(item, index) in businesses"
        :key="index"
        :class="['flex items-center relative', businesses.length > index + 1 ? 'border-b pb-8 mb-8' : '', index]"
      >
        <nuxt-link :to="`/${item.link}`" class="flex-shrink-0 hidden md:block">
          <img :src="baseUrl+item.avatar" alt="" class="w-24 h-24 rounded-full object-cover ml-9">
        </nuxt-link>
        <nuxt-link :to="`/cart/${item.id}`" class="flex-shrink-0 md:hidden">
          <img :src="baseUrl+item.avatar" alt="" class="w-16 h-16 rounded-full object-cover ml-3">
        </nuxt-link>
        <nuxt-link :to="`/cart/${item.id}`" class="flex-grow">
          <div class="font-semibold mb-4">
            {{ item.name }}
          </div>
          <div class="text-gray-500 leading-none">
            <span class="inline-block border-l border-cyan-250 md:pl-4 md:ml-4 pl-1">تعداد <span class="hidden md:inline">سفارش</span> : {{ item.orders.length }} عدد</span>
            <span>مبلغ : {{ item.sum.toLocaleString() }} تومان</span>
          </div>
        </nuxt-link>
        <div class="hidden md:block text-center">
          <div class="mb-4">
            <button @click="deleteItem(index)">
              <i class="flaticon-133-trash text-2xl text-red-550"></i>
            </button>
          </div>
          <div>
            <nuxt-link :to="`/cart/${item.id}`" class="text-cyan-250">
              مشاهده جزئیات
            </nuxt-link>
          </div>
        </div>
        <button class="md:hidden absolute left-0 top-0" @click="deleteItem(index)">
          <i class="flaticon-133-trash text-xl text-red-550"></i>
        </button>
      </div>
    </div>
    <div v-else class="px-12 py-20 bg-white rounded mt-4 text-center text-lg text-gray-500">
      سبد خرید شما خالی می باشد.
    </div>
    <div v-if="businesses.length" class="justify-center mt-20 hidden md:flex">
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
    <div v-if="businesses.length" class="md:hidden bg-white mt-2 p-4">
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
import moment from "../../mixins/moment";
import errorParser from "../../mixins/error_parser";
export default {
  name: "CartPage",
  components: {DeleteConfirmationModal},
  mixins: [moment, errorParser],
  layout: 'default',
  middleware: 'load.cities',
  data() {
    return {
      businesses: [],
      deleteItemIndex: null,
      deleteConfirmation: false,
      baseUrl: process.env.storagePath
    }
  },
  async fetch() {
    await this.$axios.$post('cart', {items: this.$store.state.cart.items})
      .then(response => {
        console.log(response)
        this.businesses = response
      })
      .catch(error => this.showError(error))
  },
  computed: {
    count() {
      return this.$store.state.cart.items.length
    },
    sum() {
      if (!this.businesses?.length) return '';
      return this.businesses.reduce((a, b) => a + b.orders.reduce((x,y) => y.sum+x, 0), 0)
    }
  },
  methods: {
    deleteItem(index) {
      this.deleteItemIndex = index
      this.deleteConfirmation = true
    },
    removeConfirm() {
      if (this.deleteItemIndex === 'all') {
        this.$store.commit('cart/removeAll')
        this.businesses = []
      } else if (this.businesses[this.deleteItemIndex].type === 'product') {
        this.$store.commit('cart/removeItems', this.businesses[this.deleteItemIndex].orders.map(x => x.price.id))
        this.businesses.splice(this.deleteItemIndex, 1)
      } else if (this.businesses[this.deleteItemIndex].type === 'appointment') {
        this.$store.commit('cart/removeAppointment', {
          appointment_id: this.businesses[this.deleteItemIndex].appointment_id,
          date: this.businesses[this.deleteItemIndex].appointment_date,
        })
        this.businesses.splice(this.deleteItemIndex, 1)
      }
      this.deleteConfirmation = false
      this.deleteItemIndex = null
    }
  }
}
</script>
