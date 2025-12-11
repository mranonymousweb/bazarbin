<template>
  <div class="lg:px-12 xl:px-20">
    <div v-if="loaded" class="flex flex-wrap lg:-mt-14 relative">

      <div class="w-full sm:w-1/2 lg:w-1/3 sm:px-2 xl:px-6 mb-4">
        <NuxtLink to="/panel/my-orders" class="flex justify-between items-center bg-white rounded-lg py-4 px-8 lg:py-6 xl:px-12">
          <div>
            <div class="flex justify-center items-center w-16 h-16 lg:w-20 lg:h-20 mb-2 lg:mb-4 rounded-full bg-blue-450">
              <i class="flaticon-028-user-1 text-2xl lg:text-4xl text-white"></i>
            </div>
            <div class="lg:text-lg">سفارش من</div>
          </div>
          <div class="flex justify-center items-center bg-gray-50 w-20 h-20 lg:w-24 lg:h-24 text-2xl lg:text-4xl rounded-full font-semibold">
            {{ my_orders }}
          </div>
        </NuxtLink>
      </div>

      <NuxtLink :to="businesses && businesses.length === 1 ? `panel/businesses/${businesses[0].id}/orders` : '/panel/businesses'" class="w-full sm:w-1/2 lg:w-1/3 sm:px-2 xl:px-6 mb-4">
        <div class="flex justify-between items-center bg-white rounded-lg py-4 px-8 lg:py-6 xl:px-12">
          <div>
            <div class="flex justify-center items-center w-16 h-16 lg:w-20 lg:h-20 mb-2 lg:mb-4 rounded-full bg-red-450">
              <i class="text-white">
                <icons-shopping-list class="w-6 h-6 lg:w-9 lg:h-9"/>
              </i>
            </div>
            <div class="text-lg">سفارش مشتری</div>
          </div>
          <div class="flex justify-center items-center bg-gray-50 w-20 h-20 lg:w-24 lg:h-24 text-2xl lg:text-4xl rounded-full font-semibold">
            {{ customer_orders }}
          </div>
        </div>
      </NuxtLink>

      <div class="w-full sm:w-1/2 lg:w-1/3 sm:px-2 xl:px-6 mb-4">
        <NuxtLink to="/panel/businesses" class="flex justify-between items-center bg-white rounded-lg py-4 px-8 lg:py-6 xl:px-12">
          <div>
            <div class="flex justify-center items-center w-16 h-16 lg:w-20 lg:h-20 mb-2 lg:mb-4 rounded-full bg-blue-550">
              <i class="flaticon-032-briefcase text-2xl lg:text-4xl text-white"></i>
            </div>
            <div class="text-lg">کسب و کار</div>
          </div>
          <div class="flex justify-center items-center bg-gray-50 w-20 h-20 lg:w-24 lg:h-24 text-2xl lg:text-4xl rounded-full font-semibold">
            {{ businesses ? businesses.length : 0 }}
          </div>
        </NuxtLink>
      </div>
    </div>
    
    <div v-else class="text-center py-20">
      <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mx-auto mb-4" style="border-top-color: #737cff;"></div>
      <p class="text-gray-500">در حال بارگذاری...</p>
    </div>
  </div>
</template>

<script>
import IconsShoppingList from "~/components/icons/ShoppingList.vue";

definePageMeta({
  layout: 'panel'
})

export default {
  components: {IconsShoppingList},
  data() {
    return {
      my_orders: 0,
      customer_orders: 0,
      businesses: [],
      loaded: false,
    }
  },
  async mounted() {
    await this.loadDashboard()
  },
  methods: {
    async loadDashboard() {
      try {
        const { $axios } = useNuxtApp()
        const response = await $axios.$get('home/dashboard')
        this.my_orders = response.my_orders
        this.customer_orders = response.customer_orders
        this.businesses = response.businesses
        this.loaded = true
      } catch (e) {
        console.error('Error loading dashboard:', e)
        this.loaded = true
      }
    }
  }
}
</script>

<style scoped>
.loader {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
