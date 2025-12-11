<template>
  <div class="search-result-page text-sm sm:text-base">
    <div class="flex items-center flex-wrap text-sm lg:text-base">
      <!-- لوگوی مستر رایت در سمت راست -->
      <div class="flex-shrink-0 mr-4">
        <img src="~/assets/images/logo.png" alt="Master Right Logo" class="h-10 w-auto" />
      </div>

      <!-- آیکون‌های سمت چپ (سرچ، سبد خرید، زنگوله، منو) -->
      <div class="flex items-center flex-grow justify-end">
        <!-- آیکون سرچ -->
        <button class="ml-4 text-gray-700" @click="search">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <!-- سبد خرید -->
        <cart-btn v-if="loggedIn" class="ml-4" />
        <!-- زنگوله (نوتیفیکیشن) -->
        <front-notifications-icon v-if="loggedIn" class="ml-4" />
        <!-- منو -->
        <Menu class="ml-4" />
      </div>

      <!-- انتخاب شهر و خیابان -->
      <div class="w-full md:w-auto flex flex-wrap justify-center items-center mt-4">
        <div class="w-full md:ml-2 lg:w-1/3 lg:px-4 pb-3 md:pb-0">
          <searchable-select
            v-model="city"
            :items="$store.state.city.list"
            results-class="w-full-2r md:w-auto"
            result-list-width="auto"
            right="1rem"
            class="ml-4"
            placeholder="شهر را انتخاب کنید"
          />
        </div>
        <div class="w-full md:ml-2 lg:w-1/3 lg:px-4 pb-3 md:pb-0">
          <searchable-select
            v-model="street"
            placeholder="خیابان، محله را انتخاب کنید"
            :items="streets"
            tags-key="tags"
            input-class="w-full bg-white border border-gray-200 rounded p-3 sm:p-4 focus:outline-none focus:ring-2 focus:ring-blue-450 street-select"
          />
        </div>
        <!-- اینپوت جستجو با آیکون دوربین -->
        <div class="w-full md:ml-2 lg:w-1/3 lg:px-4 flex relative">
          <input
            v-model="searchKey"
            placeholder="نام کالا، نام پزشک، نام مجموعه"
            class="w-full bg-white border rounded p-3 sm:p-4 focus:outline-none focus:ring-2 focus:ring-blue-450 pr-12"
          />
          <!-- آیکون دوربین -->
          <button class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" @click="openImageSearch">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 9l6-6 6 6m-6 6l-6 6m6-6l6 6m-9-9h12" />
            </svg>
          </button>
          <!-- دکمه جستجو -->
          <button class="md:hidden ml-2 bg-blue-450 text-white block h-full rounded px-3" @click="search">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- بقیه بخش‌های هدر (فیلترها، دکمه‌ها و غیره) -->
      <div class="w-full md:flex md:w-auto flex-wrap justify-center items-center mt-2">
        <button @click="selectBusinesses" class="px-4 py-2 m-1 bg-cyan-250 text-white rounded">کسب و کارها</button>
        <button @click="selectImages" class="px-4 py-2 m-1 bg-cyan-250 text-white rounded">تصاویر</button>
        <button @click="selectStories" class="px-4 py-2 m-1 bg-cyan-250 text-white rounded">استوثری</button>
        <button @click="openFilters" class="px-4 py-2 m-1 bg-cyan-250 text-white rounded">فیلتر</button>
      </div>

      <!-- بقیه کدهای قالب (مانند پاپ‌اوور، اسلاید و غیره) بدون تغییر باقی می‌مانند -->
      <!-- ... -->
    </div>

    <!-- بقیه بخش‌های قالب -->
    <slide-down :open="openFilters" class="hidden lg:block w-full">
      <!-- ... -->
    </slide-down>
    <!-- ... -->
  </div>
</template>

<script>
import { QrcodeCapture } from 'vue-qrcode-reader';
import BusinessListItemLarge from '../components/business/ListItemLarge';
import SearchableSelect from '../components/SearchableSelect';
import FrontProductsList from '../components/front/productsList';
import SlideDown from '../components/SlideDown';
import PriceInput from '../components/PriceInput';
import Popover from '../components/popover';
import SlideOver from '../components/SlideOver';

export default {
  name: 'SearchPage',
  components: { SlideOver, Popover, PriceInput, SlideDown, FrontProductsList, SearchableSelect, BusinessListItemLarge, QrcodeCapture },
  middleware: 'load.cities',
  data() {
    return {
      city: +this.$route.query?.c || +this.$store.state.city_id,
      street: +this.$route.query?.s || '',
      guild: +this.$route.query?.g || '',
      streets: [],
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
      imageSearchModal: false, // برای باز کردن مودال جستجو با تصویر
    };
  },
  async fetch() {
    // بدون تغییر
  },
  computed: {
    hasFilter() {
      return !!this.minPrice || !!this.maxPrice || !!this.iranian;
    },
    loggedIn() {
      return this.$store.getters['user/loggedIn'];
    },
  },
  watch: {
    // بدون تغییر
  },
  created() {
    if (this.city) {
      this.loadStreets();
    }
  },
  methods: {
    openRegisterModal() {
      // بدون تغییر
    },
    loadStreets() {
      // بدون تغییر
    },
    search() {
      // بدون تغییر
    },
    onDecodeQR(data) {
      // بدون تغییر
    },
    clearFilters() {
      // بدون تغییر
    },
    applyFilters() {
      // بدون تغییر
    },
    selectBusinesses() {
      // بدون تغییر
    },
    selectImages() {
      // بدون تغییر
    },
    selectStories() {
      // بدون تغییر
    },
    openFilters() {
      // بدون تغییر
    },
    openImageSearch() {
      // باز کردن مودال یا ورودی برای آپلود تصویر
      this.imageSearchModal = true;
      // یا می‌توانید مستقیماً ورودی فایل را فعال کنید:
      this.$refs.image_file.$el.click();
    },
    async onImageSearch(event) {
      const file = event.target.files[0];
      if (!file) return;

      // آپلود تصویر به سرور یا پردازش تصویر
      const formData = new FormData();
      formData.append('image', file);

      try {
        this.loading = true;
        const response = await this.$axios.$post('/search/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        this.items = response.data;
        this.total = response.total;
        this.hasMore = response.last_page > response.current_page;
        this.searchIn = 'images';
      } catch (error) {
        console.error('Error in image search:', error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>


<style scoped>
/* استایل برای لوگو */
.logo img {
  max-height: 40px;
}

/* استایل برای آیکون‌های هدر */
.header-icons button,
.header-icons svg {
  transition: color 0.2s ease;
}

.header-icons button:hover svg {
  color: #FF928F;
}

/* استایل برای اینپوت جستجو با آیکون دوربین */
.search-input-container {
  position: relative;
}

.search-input-container input {
  padding-left: 3rem; /* فضای کافی برای آیکون دوربین */
}

.search-input-container button {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
}
</style>