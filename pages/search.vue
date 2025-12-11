<template>
  <div class="search-result-page text-sm sm:text-base">
    <div class="flex items-center flex-wrap text-sm lg:text-base">
      <div class="navs w-full flex items-center py-4">
        <div class="flex-shrink-0 mr-4">
          <NuxtLink to="/">
            <img src="~/assets/images/logo.png" alt="بازاربین" class="h-10 w-auto" />
          </NuxtLink>
        </div>
        
        <div class="flex items-center flex-grow justify-end">
          <button class="ml-4 text-gray-700" @click="doSearch">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <cart-btn v-if="loggedIn" class="ml-4" />
          <front-notifications-icon v-if="loggedIn" class="ml-4" />
          <Menu class="ml-4" />
        </div>
      </div>

      <div class="w-full flex flex-wrap py-4">
        <div class="w-full md:w-1/3 px-2 pb-3 md:pb-0">
          <searchable-select
            v-model="city"
            :items="cityStore.list"
            results-class="w-full-2r md:w-auto"
            result-list-width="auto"
            right="1rem"
            placeholder="شهر را انتخاب کنید"
          />
        </div>
        <div class="w-full md:w-1/3 px-2 pb-3 md:pb-0">
          <searchable-select
            v-model="street"
            placeholder="خیابان، محله را انتخاب کنید"
            :items="streets"
            tags-key="tags"
            input-class="w-full bg-white border border-gray-200 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-450"
          />
        </div>
        <div class="w-full md:w-1/3 px-2">
          <input
            v-model="searchKey"
            placeholder="نام کالا، نام پزشک، نام مجموعه"
            class="w-full bg-white border border-gray-200 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-450"
            @keyup.enter="doSearch"
          />
        </div>
      </div>
    </div>

    <!-- بخش تب‌ها و فیلتر -->
    <div class="w-full mt-6 flex flex-wrap items-center justify-between gap-4 px-2 md:px-0">
      <div class="flex items-center gap-2 text-sm sm:text-base">
        <button
          type="button"
          @click="setActiveTab('businesses')"
          :class="[
            'flex items-center gap-1 px-3 py-1.5 rounded border',
            activeTab === 'businesses'
              ? 'bg-cyan-400 text-white border-cyan-400'
              : 'bg-white text-cyan-600 border-cyan-300'
          ]"
        >
          <i class="flaticon-004-bar-chart text-base"></i>
          <span>کسب و کارها</span>
        </button>
        <button
          type="button"
          @click="setActiveTab('stories')"
          :class="[
            'flex items-center gap-1 px-3 py-1.5 rounded border',
            activeTab === 'stories'
              ? 'bg-cyan-400 text-white border-cyan-400'
              : 'bg-white text-cyan-600 border-cyan-300'
          ]"
        >
          <i class="flaticon-076-play text-base"></i>
          <span>استوری</span>
        </button>
        <button
          type="button"
          @click="setActiveTab('images')"
          :class="[
            'flex items-center gap-1 px-3 py-1.5 rounded border',
            activeTab === 'images'
              ? 'bg-cyan-400 text-white border-cyan-400'
              : 'bg-white text-cyan-600 border-cyan-300'
          ]"
        >
          <i class="flaticon-024-video text-base"></i>
          <span>تصاویر</span>
        </button>
        <button
          type="button"
          @click="openFilters = true"
          class="flex items-center gap-1 px-3 py-1.5 rounded border border-cyan-300 text-cyan-600 bg-white"
        >
          <i class="flaticon-067-filter text-base"></i>
          <span>فیلتر</span>
        </button>
      </div>

      <div class="flex items-center gap-3 text-gray-700">
        <span class="h-px w-12 bg-gray-400 inline-block align-middle"></span>
        <span class="text-sm sm:text-base">جستجوی شما {{ searchResultsCount }} نتیجه در برداشت</span>
      </div>
    </div>

    <!-- بخش فیلترها -->
    <slide-down :open="openFilters" class="hidden lg:block w-full">
      <div class="flex items-center justify-center pt-8 w-full">
        <button type="button" tabindex="-1" @click="closeFilters">
          <icons-outline-x class="w-6 h-6 text-red-550"/>
        </button>
        <div class="w-1/4 px-8 py-1">
          <price-input v-model="minPrice" tabindex="-1" placeholder="حداقل قیمت"/>
        </div>
        <span>تا</span>
        <div class="w-1/4 px-8 py-1">
          <price-input v-model="maxPrice" tabindex="-1" placeholder="حداکثر قیمت"/>
        </div>
        <checkbox v-model="iranian" tabindex="-1" label-class="text-gray-900" label="جستجو در کالای ایرانی"/>
      </div>
    </slide-down>

    <!-- بخش استوری‌ها -->
    <div class="w-full mt-6">
      <BusinessStories />
    </div>

    <!-- نتایج جستجو -->
    <div class="mt-8">
      <div v-if="loading" class="text-center py-20">
        <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mx-auto mb-4"></div>
        <p class="text-gray-600">در حال جستجو...</p>
      </div>

      <!-- نمایش استوری‌ها -->
      <div v-if="activeTab === 'stories'" class="w-full mt-6 px-2 md:px-0">
        <div class="flex items-center justify-between mb-4 text-gray-700 text-sm sm:text-base">
          <span class="font-medium">استوری‌ها</span>
          <span class="text-xs sm:text-sm text-gray-500">نمایش {{ storyMocks.length }} استوری</span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          <div
            v-for="story in storyMocks"
            :key="story.id"
            class="relative overflow-hidden rounded-lg shadow-sm bg-white border border-gray-100"
          >
            <div class="aspect-[3/4] w-full bg-gray-100">
              <img :src="story.image" :alt="story.name" class="w-full h-full object-cover">
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"></div>
            <div class="absolute top-1 right-1">
              <span class="inline-block w-3 h-3 rounded-full bg-white border border-pink-500"></span>
            </div>
            <div class="absolute bottom-2 right-2 left-2 flex items-center justify-between text-white text-xs">
              <span class="font-semibold truncate">{{ story.name }}</span>
              <div class="flex items-center gap-2 text-[11px]">
                <span class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 1.5m6-1.5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                  </svg>
                  <span>{{ story.time }}</span>
                </span>
                <span class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 8a3 3 0 0 0-6 0c0 4-3 5-3 5h12s-3-1-3-5Z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 18a2 2 0 0 0 4 0"/>
                  </svg>
                  <span>{{ story.views }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="businesses && businesses.length > 0">
        <h2 class="text-lg font-bold mb-4">کسب و کارها ({{ businesses.length }} نتیجه)</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="business in businesses" 
            :key="business.id"
            class="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
          >
            <NuxtLink :to="`/${business.slug}`">
              <img 
                :src="storagePath + (business.icon || 'avatars/default.png')" 
                :alt="business.name"
                class="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
              >
              <h3 class="text-center font-bold">{{ business.name }}</h3>
              <p class="text-center text-gray-500 text-sm mt-2">{{ business.address }}</p>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-else-if="products && products.length > 0">
        <h2 class="text-lg font-bold mb-4">محصولات ({{ products.length }} نتیجه)</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div 
            v-for="product in products" 
            :key="product.id"
            class="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
          >
            <NuxtLink :to="`/${product.business?.slug}/${product.category_id}/${product.id}`">
              <img 
                :src="storagePath + (product.image || 'products/default.png')" 
                :alt="product.name"
                class="w-full h-32 object-cover rounded mb-4"
              >
              <h3 class="font-bold text-sm">{{ product.name }}</h3>
              <p class="text-blue-450 mt-2">{{ formatPrice(product.price) }} تومان</p>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-else-if="!loading && (searchKey || city)" class="text-center py-20">
        <p class="text-gray-600">نتیجه‌ای یافت نشد</p>
      </div>

      <div v-else class="text-center py-20">
        <img src="~/assets/images/bazarbin_150.gif" alt="" class="mx-auto w-24 mb-4">
        <p class="text-gray-600">برای جستجو کلمه‌ای وارد کنید</p>
      </div>
    </div>

    <!-- فیلتر موبایل -->
    <slide-over :show="openMobileFilters" side="bottom" @close="openMobileFilters = false">
      <div class="p-2 rounded-t bg-white ">
        <div class="flex justify-end px-2 mt-4 mb-4">
          <button @click="clearFilters">حذف فیلترها</button>
        </div>
        <div class="flex items-start border-b py-2">
          <div class="w-1/2 pl-2 py-1">
            <price-input v-model="minPrice" placeholder="حداقل قیمت" suffix-class="left-2 top-4 text-xs text-gray-400"/>
          </div>
          <div class="w-1/2 pr-2 py-1">
            <price-input v-model="maxPrice" placeholder="حداکثر قیمت" suffix-class="left-2 top-4 text-xs text-gray-400"/>
          </div>
        </div>
        <div class="border-b py-3 pr-1">
          <div class="flex items-center select-none">
            <label class="ml-2 cursor-pointer text-gray-900 flex w-full items-center justify-between">
              جستجو در کالای ایرانی
              <input v-model="iranian" type="checkbox" class="h-4 w-4 ml-2 rounded">
            </label>
          </div>
        </div>

        <div class="flex justify-center mt-8 mb-8">
          <button
            class="bg-blue-450 text-white rounded py-2 px-4"
            @click="applyFilters"
          >
            تایید
          </button>
        </div>

      </div>
    </slide-over>
  </div>
</template>

<script>
import SearchableSelect from '~/components/SearchableSelect.vue';
import CartBtn from '~/components/CartBtn.vue';
import FrontNotificationsIcon from '~/components/front/NotificationsIcon.vue';
import Menu from '~/components/Menu.vue';
import SlideDown from '~/components/SlideDown.vue';
import Checkbox from '~/components/Checkbox.vue';
import PriceInput from '~/components/PriceInput.vue';
import SlideOver from '~/components/SlideOver.vue';
import BusinessStories from '~/components/BusinessStories.vue';
import { useCityStore } from '~/stores/city';
import { useUserStore } from '~/stores/user';
import { useAppStore } from '~/stores/app';

export default {
  name: 'SearchPage',
  components: { 
    SearchableSelect,
    CartBtn,
    FrontNotificationsIcon,
    Menu,
    SlideDown,
    Checkbox,
    PriceInput,
    SlideOver,
    BusinessStories
  },
  data() {
    const route = useRoute()
    return {
      city: +route.query?.c || null,
      street: +route.query?.s || '',
      searchKey: route.query?.q || '',
      minPrice: route.query?.min ? +route.query.min : 0,
      maxPrice: route.query?.max ? +route.query.max : 0,
      iranian: !!route.query?.iranian,
      streets: [],
      businesses: null,
      products: null,
      loading: false,
      storagePath: useRuntimeConfig().public.storagePath,
      // متغیرهای جدید برای بخش فیلتر و استوری
      activeTab: 'businesses',
      openFilters: false,
      openMobileFilters: false,
      storyMocks: [
        {id: 1, name: 'فروشگاه لباس زنانه', image: 'https://picsum.photos/seed/s1/600/800', time: '۲ ساعت', views: '۱.۲ک'},
        {id: 2, name: 'کافه کتاب', image: 'https://picsum.photos/seed/s2/600/800', time: '۳ ساعت', views: '۹۸۰'},
        {id: 3, name: 'آتلیه عکاسی', image: 'https://picsum.photos/seed/s3/600/800', time: '۱ ساعت', views: '۷۲۰'},
        {id: 4, name: 'موبایل شاپ', image: 'https://picsum.photos/seed/s4/600/800', time: '۴ ساعت', views: '۱.۷ک'},
        {id: 5, name: 'بوتیک لباس', image: 'https://picsum.photos/seed/s5/600/800', time: '۵ ساعت', views: '۱.۱ک'},
        {id: 6, name: 'رستوران ایتالیایی', image: 'https://picsum.photos/seed/s6/600/800', time: '۳۰ دقیقه', views: '۲.۳ک'},
        {id: 7, name: 'سالن زیبایی', image: 'https://picsum.photos/seed/s7/600/800', time: '۲ ساعت', views: '۸۵۰'},
        {id: 8, name: 'فروشگاه پوشاک', image: 'https://picsum.photos/seed/s8/600/800', time: '۱.۵ ساعت', views: '۱.۴ک'},
        {id: 9, name: 'کلینیک دندانپزشکی', image: 'https://picsum.photos/seed/s9/600/800', time: '۳ ساعت', views: '۵۶۰'},
        {id: 10, name: 'فروشگاه موبایل', image: 'https://picsum.photos/seed/s10/600/800', time: '۴۵ دقیقه', views: '۹۱۰'},
        {id: 11, name: 'سالن ورزشی', image: 'https://picsum.photos/seed/s11/600/800', time: '۲.۵ ساعت', views: '۱.۰ک'},
        {id: 12, name: 'کافی شاپ مدرن', image: 'https://picsum.photos/seed/s12/600/800', time: '۱ ساعت', views: '۶۸۰'}
      ]
    }
  },
  computed: {
    cityStore() {
      return useCityStore()
    },
    userStore() {
      return useUserStore()
    },
    appStore() {
      return useAppStore()
    },
    loggedIn() {
      return this.userStore.loggedIn
    },
    // کامپوتد جدید برای بخش فیلتر
    hasFilters() {
      return !!(this.searchKey || this.street || this.minPrice || this.maxPrice || this.iranian)
    },
    searchResultsCount() {
      return this.businesses?.length || this.products?.length || 0
    }
  },
  watch: {
    city(value) {
      this.appStore.setCityId(value)
      this.loadStreets()
    }
  },
  mounted() {
    // لود city از localStorage اگر در query نبود
    if (!this.city) {
      const savedCity = this.appStore.city_id
      if (savedCity) {
        this.city = +savedCity
      }
    }
    
    if (this.city) {
      this.loadStreets()
    }
    
    // اگر پارامتر جستجو داریم، جستجو کن
    if (this.searchKey || this.city) {
      this.doSearch()
    }
  },
  methods: {
    async loadStreets() {
      if (!this.city) return
      try {
        const { $axios } = useNuxtApp()
        const response = await $axios.$get(`search/cities/${this.city}/streets?all=1`)
        this.streets = response
      } catch (e) {
        this.streets = []
      }
    },
    async doSearch() {
      this.loading = true
      try {
        const { $axios } = useNuxtApp()
        const params = new URLSearchParams()
        if (this.city) params.append('c', this.city)
        if (this.street) params.append('s', this.street)
        if (this.searchKey) params.append('q', this.searchKey)
        if (this.minPrice) params.append('min', this.minPrice)
        if (this.maxPrice) params.append('max', this.maxPrice)
        if (this.iranian) params.append('iranian', '1')
        
        // جستجوی کسب و کارها
        const businessResponse = await $axios.$get(`search/businesses?${params.toString()}`)
        this.businesses = businessResponse.data || businessResponse
        
        // جستجوی محصولات
        if (this.searchKey) {
          const productResponse = await $axios.$get(`search/products?${params.toString()}`)
          this.products = productResponse.data || productResponse
        }
      } catch (e) {
        console.error('Search error:', e)
        this.businesses = []
        this.products = []
      } finally {
        this.loading = false
      }
    },
    formatPrice(price) {
      return new Intl.NumberFormat('fa-IR').format(price)
    },
    // متدهای جدید برای بخش فیلتر و استوری
    setActiveTab(tab) {
      this.activeTab = tab
    },
    closeFilters() {
      this.minPrice = ''
      this.maxPrice = ''
      this.iranian = false
      this.openFilters = false
    },
    clearFilters() {
      this.iranian = false
      this.minPrice = 0
      this.maxPrice = 0
      this.openMobileFilters = false
      this.doSearch()
    },
    applyFilters() {
      this.openMobileFilters = false
      this.doSearch()
    }
  }
}
</script>

<style lang="scss">
.search-result-page {
  .loader {
    border-top-color: #737cff;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>