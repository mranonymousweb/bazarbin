<template>
  <div class="search-result-page text-sm sm:text-base">

    <div class="flex items-center flex-wrap text-sm lg:text-base">
      <div class="flex items-center w-full md:w-auto mb-2 sm:mb-4 md:mb-0">

        <div class="flex-grow md:hidden">
          <button @click="$router.back()">
            <i class="flaticon-065-right-arrow-1"></i>
          </button>
        </div>

        <searchable-select
          v-model="city"
          :items="$store.state.city.list"
          results-class="w-full-2r md:w-auto"
          result-list-width="auto"
          right="1rem"
          class="ml-4"
          placeholder="شهر را انتخاب کنید"
        />

        <div class="flex flex-grow-0 items-center md:hidden">
          <span v-if="!loggedIn" class="mr-6 sm:mr-8 ml-2 cursor-pointer" @click="openRegisterModal">ثبت نام</span>
          <span v-if="!loggedIn">/</span>
          <span v-if="!loggedIn" class="mr-2 ml-6 sm:ml-8 cursor-pointer" style="color: #FF928F" @click="loginModal = true">ورود</span>
          <cart-btn v-if="loggedIn" class="mr-2 ml-6 sm:ml-8"/>
          <front-notifications-icon v-if="loggedIn"/>
          <Menu/>
        </div>

      </div>
      <div class=" w-full md:w-auto flex flex-wrap justify-center items-center flex-grow">
        <div class="w-full flex flex-wrap md:flex-nowrap justify-center items-center">
          <div class="w-full md:ml-2 lg:w-1/3 lg:px-4 pb-3 md:pb-0">
            <searchable-select
              v-model="street"
              placeholder="خیابان، محله را انتخاب کنید"
              :items="streets"
              tags-key="tags"
              input-class="w-full bg-white border border-gray-200 rounded p-3 sm:p-4 focus:outline-none focus:ring-2 focus:ring-blue-450 street-select"
            />
          </div>
          <div class="w-full md:ml-2 lg:w-1/3 lg:px-4 flex">
            <input
              v-model="searchKey"
              placeholder="نام کالا، نام پزشک، نام مجموعه"
              class="w-full bg-white border rounded p-3 sm:p-4 focus:outline-none focus:ring-2 focus:ring-blue-450"
            />
            <div>
              <button class="md:hidden mr-2 bg-blue-450 text-white block h-full rounded px-3" @click="search">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div class="w-full md:flex md:w-auto flex-wrap justify-center items-center mt-2">
            <button @click="selectBusinesses" class="px-4 py-2 m-1 bg-cyan-250 text-white rounded">کسب و کارها</button>
            <button @click="selectImages" class="px-4 py-2 m-1 bg-cyan-250 text-white rounded">تصاویر</button>
            <button @click="selectStories" class="px-4 py-2 m-1 bg-cyan-250 text-white rounded">استسsوری</button>
            <button @click="openFilters" class="px-4 py-2 m-1 bg-cyan-250 text-white rounded">فیلتر</button>
          </div>

<StoryList :stories="stories" />

          <popover
            ref="popover1"
            :mask="false"
            top="3rem"
            left="-12rem"
            :close-on-click-outside="autoClose"
            class="flex"
          >
            <template #activator>
              <button class="hidden lg:inline-block mx-6 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </template>
            <div id="more-menu" dir="rtl" class="px-4 py-8 border shadow rounded bg-white flex w-72">
              <div class="w-1/2 border-l">
                <button class="block w-full" @click="openFilters = true">
                  <i class="flaticon-067-filter text-4xl block mb-2"></i>
                  <span>فیلتر</span>
                </button>
              </div>
              <div class="w-1/2">
                <popover
                  top="10rem"
                  left="0rem"
                  anchor="#more-menu"
                  @open="autoClose = false"
                  @close="autoClose = true"
                >
                  <template #activator>
                    <button class="block w-full">
                      <i class="flaticon-086-qr-code text-4xl block mb-2"></i>
                      <span>کیو آر کد</span>
                    </button>
                  </template>
                  <div dir="rtl" class="p-4 rounded bg-white w-40 border shadow">
                    <div class="border-b">
                      <button class="p-2 pb-4" @click="$router.push('/scan-qr')">اسکن با دوربین</button>
                    </div>
                    <div>
                      <button class="p-2 pt-4" @click="$refs.qr_file.$el.click()">اسکن از گالری</button>
                    </div>
                  </div>
                </popover>
              </div>
            </div>
          </popover>

          <button
            :class="[
              'hidden md:flex items-center bg-blue-450 text-white rounded lg:py-4 py-3',
              'md:w-auto md:mb-0 md:justify-center',
              'lg:w-auto lg:mb-0 lg:justify-start',
            ]"
            @blur="search"
            @click="search"
          >
            <span v-if="!loading" class="lg:pr-8 lg:pl-4 pl-2 pr-4">جستجو</span>
            <span v-else class="loader mx-8 w-5 h-5 border-2 rounded-full border-blue-300"></span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <slide-down :open="openFilters" class="hidden lg:block w-full">
      <div class="flex items-center justify-center pt-8 w-full">
        <button @click="openFilters = false">
          <icons-outline-x class="w-6 h-6 text-red-550"/>
        </button>
        <div class="w-1/4 px-8 py-1">
          <price-input v-model="minPrice" placeholder="حداقل قیمت"/>
        </div>
        <span>تا</span>
        <div class="w-1/4 px-8 py-1">
          <price-input v-model="maxPrice" placeholder="حداکثر قیمت"/>
        </div>
        <checkbox v-model="iranian" label-class="text-gray-900" label="جستجو در کالای ایرانی"/>
      </div>
      <div class="hidden">
        <qrcode-capture ref="qr_file" @decode="onDecodeQR"/>
      </div>
    </slide-down>

    <div v-if="items.length" class="pt-6 md:pt-12">
      <div>
        <div class="lg:border-b h-5 mb-9 lg:mb-20">
          <div class="flex lg:inline-flex lg:pr-52 lg:pl-8 items-center bg-gray-50">
            <button
              :class="[
                'px-2 lg:px-4 py-1 lg:ml-4 ml-2 rounded',
                searchIn === 'businesses' ? 'bg-cyan-250 text-white' : 'border border-cyan-250 text-cyan-250'
              ]"
              @click="searchIn = 'businesses'"
            >
              <i class="flaticon-045-align-right ml-1"></i>
              کسب و کارها
            </button>
            <button
              :class="[
                'px-2 lg:px-4 py-1 lg:ml-12 ml-2 rounded',
                searchIn === 'products' ? 'bg-cyan-250 text-white' : 'border border-cyan-250 text-cyan-250'
              ]"
              @click="searchIn = 'products'"
            >
              <i class="flaticon-063-picture"></i>
              محصولات
            </button>
            <span v-if="hasFilter" class="lg:hidden px-2 lg:px-4 py-1 lg:ml-4 rounded bg-cyan-250" @click="openMobileFilters = true">
              <i class="flaticon-067-filter"></i>
              فیلتر
            </span>
            <div v-if="total" class="hidden lg:block">
              جستجوی شما
              {{ total }}
              نتیجه در برداشت
            </div>
            <div v-else class="hidden lg:block">جستجوی شما هیچ نتیجه ای نداشت</div>

            <div class="lg:hidden flex-grow flex justify-end">
              <popover
                ref="popover3"
                :mask="false"
                top="0rem"
                left="3rem"
                :close-on-click-outside="autoClose"
                class="flex"
              >
                <template #activator>
                  <button class="lg:inline-block text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </button>
                </template>
                <div id="more-menu-mobile" dir="rtl" class="px-2 py-4 text-sm border shadow-xl rounded bg-white flex w-52">
                  <div class="w-1/2 border-l">
                    <button class="block w-full" @click="openMobileFilters = true">
                      <i class="flaticon-067-filter text-3xl block mb-2"></i>
                      <span>فیلتر</span>
                    </button>
                  </div>
                  <div class="w-1/2">
                    <popover
                      ref="popover4"
                      top="7rem"
                      left="0rem"
                      anchor="#more-menu-mobile"
                      @open="autoClose = false"
                      @close="autoClose = true"
                    >
                      <template #activator>
                        <button class="block w-full">
                          <i class="flaticon-086-qr-code text-3xl block mb-2"></i>
                          <span>کیو آر کد</span>
                        </button>
                      </template>
                      <div dir="rtl" class="p-2 rounded bg-white w-32 border shadow-2xl text-sm">
                        <div class="border-b">
                          <button class="p-1 pb-2" @click="$router.push('/scan-qr')">اسکن با دوربین</button>
                        </div>
                        <div>
                          <button class="p-1 pt-2" @click="$refs.qr_file.$el.click()">اسکن از گالری</button>
                        </div>
                      </div>
                    </popover>
                  </div>
                </div>
              </popover>
            </div>
          </div>
        </div>
        <div v-if="items.length && searchIn === 'businesses'" class="single-col-list">
          <div v-for="item in items" :key="item.id" class="mb-6">
            <business-list-item-large
              :item="item"
            />
          </div>
        </div>
        <front-products-list
          v-if="items.length && searchIn === 'products'"
          :items="items"
          class="mb-6"
        />
        <div v-if="items.length && searchIn === 'images'" class="single-col-list">
          <div v-for="item in items" :key="item.id" class="mb-6">
            <img :src="item.imageUrl" alt="Image" class="w-full h-auto"/>
          </div>
        </div>
        <div v-if="items.length && searchIn === 'stories'" class="single-col-list">
          <div v-for="item in items" :key="item.id" class="mb-6">
            <p>{{ item.storyText }}</p>
          </div>
        </div>
        <button v-if="hasMore" class="w-full text-center bg-blue-450 text-white py-2 rounded" @click="$fetch">
          بیشتر
        </button>
        <div v-else class="flex justify-center border-b-2 h-3">
          <span class="text-gray-400 font-light bg-gray-50 px-4 h-6">
            پایان لیست
          </span>
        </div>
      </div>
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
import { QrcodeCapture } from 'vue-qrcode-reader'
import BusinessListItemLarge from "../components/business/ListItemLarge";
import SearchableSelect from "../components/SearchableSelect";
import FrontProductsList from "../components/front/productsList";
import SlideDown from "../components/SlideDown";
import PriceInput from "../components/PriceInput";
import Popover from "../components/popover";
import SlideOver from "../components/SlideOver";
import StoryList from '@/components/StoryList.vue'; // مسیر را با پروژه خود تنظیم کنید

export default {
  name: "SearchPage",
  components: {SlideOver, Popover, PriceInput, SlideDown, FrontProductsList, SearchableSelect, BusinessListItemLarge, QrcodeCapture  ,StoryList},
  middleware: 'load.cities',
  data() {
    return {
      city: +this.$route.query?.c || +this.$store.state.city_id,
      street: +this.$route.query?.s || '',
      guild: +this.$route.query?.g || '',
      streets: [],
      stories: [],
      searchKey: this.$route.query?.q || '',
      minPrice: this.$route.query?.min ? +this.$route.query.min : 0,
      maxPrice: this.$route.query?.max ? +this.$route.query.max : 0,
      iranian: !!this.$route.query?.iranian,
      searchIn: this.$route.query?.min || this.$route.query?.max || this.$route.query?.iranian ? 'products' : 'businesses',
      businesses: null,
      products: null,
      images: null,
      stories: null,
      loading: null,
      autoClose: true,
      loginModal: false,
      openFilters: !!(this.$route.query?.min || this.$route.query?.max || this.$route.query?.iranian),
      openMobileFilters: false,
      items: [],
      total: null,
      page: 0,
      hasMore: true,
    }
  },
  async fetch() {
    if (!this.hasMore) {
      return
    }
    const data = {
      list: this.searchIn,
      page: ++this.page,
      city_id: this.city,
      street_id: this.street,
      guild_id: this.guild,
      key: this.searchKey,
    };

    if (this.minPrice) {
      data.minPrice = this.minPrice
    }

    if (this.maxPrice) {
      data.maxPrice = this.maxPrice
    }

    if (this.iranian) {
      data.iranian = true
    }

    await this.$axios.$post(`/search`, data)
      .then(response => {
        if (this.searchIn === 'products') {
          this.items.push(...response.data)
          this.products = response
          this.total = response.total
          this.hasMore = response.last_page > response.current_page
        } else if (this.searchIn === 'businesses') {
          this.items.push(...response.data)
          this.businesses = response
          this.total = response.meta.total
          this.hasMore = response.meta.last_page > response.meta.current_page
        } else if (this.searchIn === 'images') {
          this.items.push(...response.data)
          this.images = response
          this.total = response.total
          this.hasMore = response.last_page > response.current_page
        } else if (this.searchIn === 'stories') {
          this.items.push(...response.data)
          this.stories = response
          this.total = response.total
          this.hasMore = response.last_page > response.current_page
        }
      })
  },
  computed: {
    hasFilter() {
      return !!this.minPrice || !!this.maxPrice || !!this.iranian
    },
    loggedIn() {
      return this.$store.getters["user/loggedIn"]
    }
  },
  watch: {
    city() {
      this.loadStreets()
      this.businesses = null
      this.products = null
      this.images = null
      this.stories = null
      this.items = []
      this.page = 0
      this.hasMore = true
      this.$fetch()
      this.street = ''
    },
    searchIn(value) {
      if (this.$data[value] === null) {
        this.businesses = null
        this.products = null
        this.images = null
        this.stories = null
        this.items = []
        this.page = 0
        this.hasMore = true
        this.$fetch()
      }
    },
    openFilters() {
      this.$refs.popover1.active = false
    },
    openMobileFilters() {
      this.$refs.popover3.active = false
    }
  },
  created() {
    if (this.city) {
      this.loadStreets()
    }
  },
  methods: {
    
   selectStories() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  this.searchIn = 'stories';
  this.items = [
    {
      id: 1,
      storyText: 'استوری آزمایشی کسب و کار شماره 1',
      businessProfileImage: 'https://via.placeholder.com/100',
      businessName: 'کسب و کار شماره 1',
      productName: 'محصول 1',
      productPrice: 150000,
      isLocked: true,
      views: 120,
    },
    {
      id: 2,
      storyText: 'استوری آزمایشی کسب و کار شماره 2',
      businessProfileImage: 'https://via.placeholder.com/100',
      businessName: 'کسب و کار شماره 2',
      productName: 'محصول 2',
      productPrice: 85000,
      isLocked: false,
      views: 80,
    },
  ];
},

    openRegisterModal() {
      this.loginModal = true
      this.$refs.loginModal.type = 'register'
    },
    loadStreets() {
      this.$axios.$get(`/search/cities/${this.city}/streets?all=1`).then(response => {
        this.streets = response
      })
    },
    search() {
      this.businesses = null
      this.products = null
      this.images = null
      this.stories = null
      this.items = []
      this.page = 0
      this.hasMore = true
      this.$fetch()
    },
    onDecodeQR(data) {
      const origin = window.location.origin;
      if (data.startsWith(origin)) {
        this.$router.push(data.substring(origin.length))
      }
    },
    clearFilters() {
      this.iranian = false
      this.minPrice = 0
      this.maxPrice = 0
      this.businesses = null
      this.products = null
      this.images = null
      this.stories = null
      this.items = []
      this.page = 0
      this.hasMore = true
      this.$fetch()
      this.openMobileFilters = false
    },
    applyFilters() {
      this.businesses = null
      this.products = null
      this.images = null
      this.stories = null
      this.items = []
      this.page = 0
      this.hasMore = true
      this.$fetch()
      this.openMobileFilters = false
    },
    selectBusinesses() {
      this.searchIn = 'businesses';
      this.search();
    },
    selectImages() {
      this.searchIn = 'images';
      this.search();
    },
    selectStories() {
      this.searchIn = 'stories';
      this.search();
    },
    openFilters() {
      this.openMobileFilters = true;
    }
  }
}
</script>