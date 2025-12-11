<template>
  <div class="flex flex-wrap min-h-full text-sm sm:text-base">
    <header class="w-full flex h-14 items-center" style="color: #27293C">

      <div class="flex-grow"></div>

      <div class="flex flex-grow-0 items-center">
        <span v-if="!loggedIn" class="mr-6 sm:mr-8 ml-2 cursor-pointer" @click="openRegisterModal">ثبت نام</span>
        <span v-if="!loggedIn">/</span>
        <span v-if="!loggedIn" class="mr-2 ml-6 sm:ml-8 cursor-pointer" style="color: #FF928F" @click="loginModal = true">ورود</span>
        <cart-btn v-if="loggedIn" class="mr-2 ml-4 sm:ml-8"/>
        <front-notifications-icon v-if="loggedIn"/>
        <Menu/>
      </div>
    </header>

    <div class="flex-grow site-container min-h-0 md:min-h-[calc(100vh-14rem)]">
      <div class="w-full sm:h-full h-auto flex items-start sm:items-center">
        <form class="flex flex-col w-full justify-center" @submit.prevent="search">

          <div class="w-full hidden md:block">
            <img src="~/assets/images/bazarbin_150.gif" alt="" class="mx-auto w-20 sm:w-auto block">
          </div>

          <div class="w-full hidden md:block">
            <img src="~/assets/images/logoType.png" alt="" class="mx-auto w-40 sm:w-auto block">
          </div>

          <!-- ردیف تک‌ستونه: شهر، خیابان، جستجو و دکمه (تک خط در دسکتاپ) -->
          <div class="w-full mt-4 md:mt-8 grid grid-cols-2 lg:grid-cols-[auto_auto_auto_auto] gap-1 items-center">
            <div class="col-span-2 sm:col-span-1">
              <searchable-select
                v-model="city"
                :items="cityStore.list"
                results-class="select-city-result"
                result-list-width="auto"
                placeholder="شهر را انتخاب کنید"
                input-class="w-full bg-white border border-gray-200 rounded p-3 sm:p-4 focus:outline-none focus:ring-2 focus:ring-blue-450 street-select"
              />
            </div>
            <div class="col-span-2 sm:col-span-1">
              <searchable-select
                v-model="street"
                placeholder="خیابان، محله را انتخاب کنید"
                :items="streets"
                tags-key="tags"
                input-class="w-full bg-white border border-gray-200 rounded p-3 sm:p-4 focus:outline-none focus:ring-2 focus:ring-blue-450 street-select"
              />
            </div>
            <div class="col-span-3 sm:col-span-3 lg:col-auto w-full lg:w-60 xl:w-64">
              <div class="flex min-w-0 w-full items-center bg-white border rounded-lg px-2 py-2 sm:px-3 sm:py-2.5 shadow-sm">
                <button type="button" class="text-gray-700 px-2" tabindex="-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 7a2 2 0 0 1 2-2h2.2a1 1 0 0 0 .9-.6l.4-1a1 1 0 0 1 .92-.63h3.16a1 1 0 0 1 .92.63l.4 1a1 1 0 0 0 .9.6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/>
                    <circle cx="11.5" cy="11.5" r="3.25"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.7 14.7 2.3 2.3"/>
                  </svg>
                </button>
                <input
                  v-model="searchKey"
                  placeholder="نام کالا، نام پزشک، نام مجموعه"
                  class="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-800 text-sm sm:text-base"
                  @keyup.enter.prevent="search"
                />
              </div>
            </div>
            <div class="col-span-1 sm:col-span-1 lg:w-auto">
              <button
                class="w-full lg:w-auto justify-center flex items-center bg-blue-450 text-white rounded-lg py-2 px-2 md:mb-0 text-base h-10"
                type="submit"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>

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

    <div class="w-full mt-6">
      <BusinessStories />
    </div>

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

    <div v-if="!hasFilters && (activeTab === 'businesses' || activeTab === 'images')" class="w-full mt-10 px-2 md:px-0">
      <div class="flex items-center justify-between mb-4 text-gray-700 text-sm sm:text-base">
        <span class="font-medium">{{ activeTab === 'images' ? 'تصاویر' : 'کالاها و خدمات' }}</span>
        <span v-if="productsTotal" class="text-xs sm:text-sm text-gray-500">نمایش {{ products.length }} از {{ productsTotal }}</span>
      </div>

      <div v-if="activeTab === 'businesses'" class="space-y-3">
        <div
          v-for="item in products"
          :key="item.id"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-start justify-between gap-4"
        >
          <div class="flex items-start gap-3">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
              <img
                v-if="item.image || item.picture"
                :src="storagePath + (item.image || item.picture)"
                :alt="item.name"
                class="w-full h-full object-cover"
              >
              <img
                v-else-if="item.business?.icon"
                :src="storagePath + item.business.icon"
                :alt="item.name"
                class="w-full h-full object-cover"
              >
              <i v-else class="flaticon-024-video text-2xl text-gray-500"></i>
            </div>
            <div>
              <div class="text-sm text-cyan-600 font-medium" v-if="item.business?.name">{{ item.business.name }}</div>
              <div class="text-base sm:text-lg font-semibold text-gray-800">{{ item.name }}</div>
              <div class="text-sm text-gray-600 mt-1 line-clamp-1" v-if="item.description">{{ item.description }}</div>
              <div class="text-sm text-gray-500 mt-1" v-if="item.business?.address">{{ item.business.address }}</div>
              <div class="flex items-center gap-4 text-gray-600 mt-2">
                <span class="flex items-center gap-1">
                  <i class="flaticon-057-eye text-lg"></i>
                  <span>{{ item.views || item.business?.views || 0 }}</span>
                </span>
                <span class="flex items-center gap-1">
                  <i class="flaticon-161-alarm text-lg"></i>
                  <span>{{ item.score || item.business?.score || 0 }}</span>
                </span>
              </div>
            </div>
          </div>
          <div class="text-left whitespace-nowrap text-sm sm:text-base font-medium text-gray-800" v-if="displayPrice(item)">
            {{ formatPrice(displayPrice(item)) }} تومان
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div
          v-for="item in products"
          :key="item.id"
          class="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
        >
          <div class="aspect-square bg-gray-100">
            <img
              v-if="item.image || item.picture"
              :src="storagePath + (item.image || item.picture)"
              :alt="item.name"
              class="w-full h-full object-cover"
            >
            <img
              v-else-if="item.business?.icon"
              :src="storagePath + item.business.icon"
              :alt="item.name"
              class="w-full h-full object-cover"
            >
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <i class="flaticon-024-video text-2xl"></i>
            </div>
          </div>
          <div class="p-3 text-sm text-gray-800 line-clamp-2">{{ item.name }}</div>
        </div>
      </div>

      <div v-if="loadingProducts" class="text-center py-4 text-gray-500 text-sm">در حال بارگذاری...</div>
      <div ref="productsSentinel" class="h-1"></div>
    </div>

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

    <authentication-LoginModal
      ref="loginModal"
      :open="loginModal"
      @close="loginModal = false"
    />
  </div>
</template>

<script>
import SearchableSelect from "~/components/SearchableSelect.vue";
import Popover from "~/components/popover.vue";
import SlideDown from "~/components/SlideDown.vue";
import Checkbox from "~/components/Checkbox.vue";
import PriceInput from "~/components/PriceInput.vue";
import Dropdown from "~/components/Dropdown.vue";
import CartBtn from "~/components/CartBtn.vue";
import FrontNotificationsIcon from "~/components/front/NotificationsIcon.vue";
import SlideOver from "~/components/SlideOver.vue";
import BusinessStories from "~/components/BusinessStories.vue";
import { useCityStore } from "~/stores/city";
import { useUserStore } from "~/stores/user";
import { useAppStore } from "~/stores/app";

export default {
  components: {
    FrontNotificationsIcon,
    CartBtn, Dropdown, PriceInput, Checkbox, SlideDown, Popover, SearchableSelect, SlideOver, BusinessStories
  },
  data() {
    return {
      city: null,
      street: '',
      streets: [],
      searchKey: '',
      minPrice: 0,
      maxPrice: 0,
      iranian: false,
      loginModal: false,
      loading: false,
      openFilters: false,
      openMobileFilters: false,
      autoClose: true,
      storagePath: useRuntimeConfig().public.storagePath,
      activeTab: 'businesses',
      products: [],
      productsPage: 1,
      productsTotal: 0,
      loadingProducts: false,
      productsFinished: false,
      productsObserver: null,
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
    left() {
      return {
        xs: '-3rem',
        sm: '-2rem',
        md: '-2rem',
        lg: '-6rem',
        xl: '-8rem',
        "2xl": '-12rem'
      }[this.appStore.screenSize] || '-3rem'
    },
    loggedIn() {
      return this.userStore.loggedIn
    },
    hasFilters() {
      // در حالت عادی (بدون فیلتر/سرچ) باید همه شهرها را نمایش دهیم
      return !!(this.searchKey || this.street || this.minPrice || this.maxPrice || this.iranian)
    },
    searchResultsCount() {
      return this.productsTotal || this.products.length || 0
    }
  },
  watch: {
    city(value) {
      this.appStore.setCityId(value)
      this.loadStreets()
    },
    openFilters() {
      if (this.$refs.popover1) {
        this.$refs.popover1.active = false
      }
    },
    openMobileFilters() {
      if (this.$refs.popover1) {
        this.$refs.popover1.active = false
      }
    }
  },
  mounted() {
    // --- redirect once logic: فقط یک بار برای هر کاربر ---
    if (process.client) {
      try {
        const alreadyRedirected = localStorage.getItem('redirect_done')
        if (!alreadyRedirected) {
          // ثبت در localStorage تا دفعه بعد ریدایرکت نشود
          localStorage.setItem('redirect_done', 'yes')
          // ریدایرکت به آدرس مورد نظر
          window.location.href = "http://localhost:3000/search?c=0"
          // پس از ریدایرکت نیازی به ادامه‌ی اجرا نیست
          return
        }
      } catch (e) {
        // اگر دسترسی به localStorage مسدود بود (private mode یا خطا)،
        // برای جلوگیری از شکست، می‌توانیم به‌صورت ایمن ادامه دهیم (یا انتخاب کنی که باز هم ریدایرکت انجام شود).
        // اینجا تصمیم گرفته‌ایم ادامه دهیم و ریدایرکت را انجام ندهیم.
        console.warn('localStorage access error, skip redirect-once check.', e)
      }
    }

    // --- کد اصلی موجود در mounted (لود city_id و init observer و load products) ---
    // لود city_id از localStorage (اگر وجود داشته باشد)
    const savedCity = this.appStore.city_id
    if (savedCity) {
      this.city = +savedCity
    }
    if (this.city) {
      this.loadStreets()
    }

    this.$nextTick(() => {
      this.initProductsObserver()
      this.loadProducts()
    })
  },
  beforeUnmount() {
    if (this.productsObserver && this.$refs.productsSentinel) {
      this.productsObserver.unobserve(this.$refs.productsSentinel)
    }
    if (this.productsObserver) {
      this.productsObserver.disconnect()
      this.productsObserver = null
    }
  },
  methods: {
    openRegisterModal() {
      this.loginModal = true
      if (this.$refs.loginModal) {
        this.$refs.loginModal.type = 'verification-request'
      }
    },
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
    search() {
      this.$router.push(`/search?c=${this.city}${this.street ? '&s=' + this.street : ''}${this.searchKey ? '&q=' + this.searchKey : ''}${this.minPrice ? '&min=' + this.minPrice : ''}${this.maxPrice ? '&max=' + this.maxPrice : ''}${this.iranian ? '&iranian=1' : ''}`)
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
      this.search()
    },
    applyFilters() {
      this.openMobileFilters = false
      this.search()
    },
    setActiveTab(tab) {
      this.activeTab = tab
      if (tab === 'businesses' || tab === 'images') {
        this.$nextTick(() => {
          this.initProductsObserver()
          this.loadProducts()
        })
      }
    },
    displayPrice(item) {
      const priceObj = this.getBestPrice(item)
      if (!priceObj) return null
      return priceObj.price_after_discount || priceObj.price || null
    },
    getBestPrice(item) {
      if (!item) return null
      if (item.price && typeof item.price === 'object') return item.price
      if (typeof item.price === 'number') return { price: item.price }

      const prices = item.prices || []
      if (!prices.length) return null

      const now = new Date()
      return prices.reduce((best, curr) => {
        const currValidDisc = curr.discount && new Date(curr.discount_expire) > now
        const bestValidDisc = best && best.discount && new Date(best.discount_expire) > now

        if (currValidDisc && !bestValidDisc) return curr
        if (!currValidDisc && bestValidDisc) return best
        if (currValidDisc && bestValidDisc) return curr.discount > best.discount ? curr : best

        return best && best.price < curr.price ? best : curr
      }, prices[0])
    },
    formatPrice(price) {
      return new Intl.NumberFormat('fa-IR').format(price)
    },
    async loadProducts() {
      if (this.loadingProducts || this.productsFinished || this.hasFilters) return
      this.loadingProducts = true
      try {
        const { $axios } = useNuxtApp()
        const payload = {
          list: 'products',
          page: this.productsPage
        }
        if (this.city) payload.city_id = this.city
        if (this.street) payload.street_id = this.street
        if (this.searchKey) payload.key = this.searchKey
        if (this.minPrice) payload.minprice = this.minPrice
        if (this.maxPrice) payload.maxprice = this.maxPrice

        const response = await $axios.$post('search', payload)

        // ساختارهای رایج لاراول پیجینیشن
        const data =
          response?.data ||
          response?.data?.data ||
          response?.items ||
          response?.products ||
          response ||
          []

        const total =
          response?.total ||
          response?.data?.total ||
          response?.meta?.total ||
          response?.meta?.totalItems ||
          this.productsTotal

        const currentPage = response?.current_page || response?.data?.current_page || this.productsPage
        const lastPage = response?.last_page || response?.data?.last_page || response?.meta?.last_page

        if (Array.isArray(data) && data.length) {
          this.products.push(...data)
          this.productsPage = (currentPage || this.productsPage) + 1
          this.productsTotal = total || this.productsTotal
          if (lastPage && this.productsPage > lastPage) {
            this.productsFinished = true
          }
        } else {
          this.productsFinished = true
        }
      } catch (e) {
        console.error('Load products error:', e)
        this.productsFinished = true
      } finally {
        this.loadingProducts = false
      }
    },
    initProductsObserver() {
      if (this.productsObserver || !this.$refs.productsSentinel) return
      this.productsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.loadProducts()
        }
      }, { rootMargin: '200px' })
      this.productsObserver.observe(this.$refs.productsSentinel)
    }
  }
}
</script>

<style lang="scss">
.site-container {
  max-width: 1440px;
  margin-right: auto;
  margin-left: auto;

  .street-select {

    &:invalid {
      color: #71717a;
    }
  }
}

.w-full-2r {
  width: calc(100% - 2rem);
}

.select-city-result {
  width: calc(100% - 2rem);

  @media (min-width: 640px) {
    width: auto;
  }
}
</style>
