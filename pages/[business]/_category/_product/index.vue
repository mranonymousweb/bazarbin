<template>
  <div class="category-page text-sm sm:text-base select-none">
    <front-header class="mb-8"/>
    <div v-if="loaded">
      <front-product-header
        id="business-header"
        :item="product"
        class="mb-4"
        @change-liked="product.liked = !product.liked"
        @change-bookmarked="product.bookmarked = !product.bookmarked"
      />
      <SlideDown :open="step === 1">
        <div class="flex flex-wrap lg:flex-nowrap mb-4">
          <div class="order-2 lg:order-1 w-full lg:w-7/12 lg:pl-4 flex flex-col">
            <div class="bg-white p-2 lg:p-4 lg:pt-28 mb-4">
              <div class="flex flex-wrap lg:flex-nowrap items-end justify-between">
                <div v-if="!product.business.form.dateable" class="w-1/3 lg:w-1/4 flex-shrink-0 p-2 lg:p-4">
                  <Input
                    v-model="orderForm.count"
                    type="number"
                    label="مقدار"
                    input-class="py-3"
                    number-buttons-class="left-2 top-3"
                    :max="maxCount"
                  />
                </div>
                <div class="w-2/3 lg:w-1/4 flex-shrink-0 p-2 lg:p-4">
                  <label v-if="product.business.form.dateable" class="block pb-2">انتخاب قیمت</label>
                  <label v-else class="block pb-2">واحد</label>
                  <select
                    v-if="product.prices.length > 1"
                    v-model="orderForm.price_id"
                    class="bg-gray-50 rounded w-full p-2 pl-12 cursor-pointer border-none focus:outline-none focus:ring-2 focus:ring-blue-450 h-12 flex items-center"
                  >
                    <option v-for="p in product.prices" :key="p.id" :value="p.id">{{ p.title }}</option>
                  </select>
                  <span v-else-if="product.prices[0]" class="bg-gray-50 rounded w-full p-2 pl-12 border-none h-12 flex items-center">
                  {{ product.prices[0].title }}
                </span>
                </div>
                <div class="hidden lg:block w-1/6 flex-shrink-0"></div>
                <div class="w-full lg:w-1/2 pl-4 lg:pb-4 pt-4 lg:pt-0 flex justify-between lg:block items-end">
                  <div v-if="price" class="w-1/2 text-center lg:text-right lg:w-full lg:mb-6">
                    <div v-if="price.discount" class="flex lg:justify-between justify-center">
                      <div>
                        <div class="line-through text-red-550">
                          <span class="text-sm text-black">{{ (price.price * orderForm.count).toLocaleString() }}</span>
                          <span class="text-sm text-black">تومان</span>
                        </div>
                        <div>
                          <span class="text-lg font-bold">{{ (price.price_after_discount * orderForm.count).toLocaleString() }}</span>
                          <span class="text-sm">تومان</span>
                        </div>
                      </div>
                      <div>
                        <div class="hidden lg:block bg-red-550 text-white px-4 py-2 rounded-t-xl rounded-br-xl text-sm">{{ price.discount }}% تخفیف</div>
                      </div>
                    </div>
                    <div v-else class="text-center">
                      <span class="text-lg font-bold">{{ (price.price * orderForm.count).toLocaleString() }}</span>
                      <span class="text-sm">تومان</span>
                    </div>
                  </div>
                  <div class="w-5/12 lg:w-full">
                    <button class="w-full bg-blue-450 text-white rounded py-2" @click="submit">
                      {{ product.business.form.submit_text }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-white flex-grow">
              <Tabs :tabs="tabs" :active="tab" active-tab-class="" @click="tab = $event"/>
              <div>
                <div v-if="tab === 'description'" class="flex justify-between items-end p-8 pt-12">
                  <p class="whitespace-pre-wrap">{{ product.description }}</p>
                </div>
                <div v-if="tab === 'price_description'" class="flex justify-between items-end p-8 pt-12">
                  <p v-if="price" class="whitespace-pre-wrap">{{ price.description }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="order-1 w-full lg:w-5/12 relative bg-white rounded-t-xl lg:rounded-none">
            <gallery v-if="product.gallery && product.gallery.length" :gallery="product.gallery"/>
            <gallery v-else-if="product.general.gallery && product.general.gallery.length" :gallery="product.general.gallery"/>
            <div id="mobile-action-btns" class="lg:hidden flex px-2 sm:px-4 pb-4 justify-end">

              <button
                class="mx-2 inline-block"
                @click="reportModal = true"
              >
                <svg width="24" height="24" viewBox="0 0 20 22" fill="none" stroke="currentColor">
                  <path d="M10 6.75V12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M0.919922 7.58003C0.919922 6.46003 1.51993 5.41999 2.48993 4.84999L8.42993 1.42C9.39993 0.86 10.6 0.86 11.58 1.42L17.52 4.84999C18.49 5.40999 19.09 6.45003 19.09 7.58003V14.42C19.09 15.54 18.49 16.58 17.52 17.15L11.58 20.58C10.61 21.14 9.40993 21.14 8.42993 20.58L2.48993 17.15C1.51993 16.59 0.919922 15.55 0.919922 14.42V11.66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10 15.2V15.2999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>

              <button class="mx-2" @click="openMobileQr = true">
                <i class="flaticon-086-qr-code text-2xl"></i>
              </button>

              <modal :show="openMobileQr" :center="true" @close="openMobileQr = false">
                <div class="p-6">
                  <canvas id="qrcode-mobile"></canvas>
                </div>
              </modal>

              <button class="mx-2" @click="openMobileShare = true">
                <i class="flaticon-009-share text-2xl"></i>
              </button>

              <modal :show="openMobileShare" :center="true" @close="openMobileShare = false">
                <div class="p-4">
                  <div class="mb-4 text-center">به اشتراک بگذارید</div>
                  <div class="flex justify-center flex-wrap gap-4">
                    <a :href="`https://telegram.me/share/url?url=${fullPageLink}&text=${product.name || product.general.name}`" target="_blank" class="w-10 h-10" @click="openMobileShare = false">
                      <svg class="w-10 h-10" viewBox="0 0 47 47">
                        <g fill="none" fill-rule="evenodd" transform="translate(-4 -4)">
                          <polygon points="0 55 0 0 55 0 55 55"/>
                          <g fill-rule="nonzero" transform="translate(4.477 4.477)">
                            <circle cx="23.023" cy="23.023" r="22.917" fill="#37AEE2"/>
                            <path fill="#FFF" d="M34.4242985,12.7107558 L30.1320058,34.6259631 C30.1320058,34.6259631 29.9475256,35.6274203 28.7054433,35.6274203 C28.0454433,35.6274203 27.7051308,35.3134631 27.7051308,35.3134631 L18.4078381,27.5985683 L13.8588808,25.3057558 L8.02086105,23.7531506 C8.02086105,23.7531506 6.98159128,23.4529433 6.98159128,22.5935683 C6.98159128,21.8774235 8.05065378,21.5359631 8.05065378,21.5359631 L32.475236,11.8330453 C32.4740913,11.8319006 33.2211735,11.5637756 33.7654433,11.5649167 C34.1000256,11.5649167 34.4815913,11.7081506 34.4815913,12.1378381 C34.4815913,12.4242953 34.4242953,12.7107558 34.4242953,12.7107558 L34.4242985,12.7107558 Z"/>
                            <path fill="#B0BEC5" d="M21.8774235,30.4769006 L17.9517985,34.3429433 C17.9517985,34.3429433 17.7810683,34.4747131 17.5530485,34.4804433 C17.473986,34.482736 17.3891933,34.4701308 17.302111,34.4311735 L18.4066933,27.5962788 L21.8774235,30.4769006 Z"/>
                            <path fill="#CFD8DC" d="M29.780236,16.3728381 C29.5865913,16.1207558 29.2290913,16.0749203 28.9770058,16.2662756 L13.8565881,25.3149203 C13.8565881,25.3149203 16.2697131,32.0661703 16.6375256,33.2349203 C17.0064828,34.4048151 17.3021078,34.4323151 17.3021078,34.4323151 L18.4066901,27.5974203 L29.6725224,17.1749203 C29.9246047,16.9835651 29.9715849,16.6249203 29.7802297,16.3728381 L29.780236,16.3728381 Z"/>
                          </g>
                        </g>
                      </svg>
                    </a>

                    <a :href="`https://wa.me/?text=${fullPageLink}`" target="_blank" class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: #25D366" @click="openMobileShare = false">
                      <svg fill="#fff" class="w-8 h-8" viewBox="0 0 40 40">
                        <path d="m25 21.7q0.3 0 2.2 1t2 1.2q0 0.1 0 0.3 0 0.8-0.4 1.7-0.3 0.9-1.6 1.5t-2.2 0.6q-1.3 0-4.3-1.4-2.2-1-3.8-2.6t-3.3-4.2q-1.6-2.3-1.6-4.3v-0.2q0.1-2 1.7-3.5 0.5-0.5 1.2-0.5 0.1 0 0.4 0t0.4 0.1q0.4 0 0.6 0.1t0.3 0.6q0.2 0.5 0.8 2t0.5 1.7q0 0.5-0.8 1.3t-0.7 1q0 0.2 0.1 0.3 0.7 1.7 2.3 3.1 1.2 1.2 3.3 2.2 0.3 0.2 0.5 0.2 0.4 0 1.2-1.1t1.2-1.1z m-4.5 11.9q2.8 0 5.4-1.1t4.5-3 3-4.5 1.1-5.4-1.1-5.5-3-4.5-4.5-2.9-5.4-1.2-5.5 1.2-4.5 2.9-2.9 4.5-1.2 5.5q0 4.5 2.7 8.2l-1.7 5.2 5.4-1.8q3.5 2.4 7.7 2.4z m0-30.9q3.4 0 6.5 1.4t5.4 3.6 3.5 5.3 1.4 6.6-1.4 6.5-3.5 5.3-5.4 3.6-6.5 1.4q-4.4 0-8.2-2.1l-9.3 3 3-9.1q-2.4-3.9-2.4-8.6 0-3.5 1.4-6.6t3.6-5.3 5.3-3.6 6.6-1.4z"></path>
                      </svg>
                    </a>

                    <a :href="`https://www.linkedin.com/shareArticle?mini=true&url=${fullPageLink}&title=${product.name || product.general.name}&summary=${product.description || product.general.description}&source=`" target="_blank" class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: #0e76a8" @click="openMobileShare = false">
                      <svg class="w-8 h-8" fill="#fff" viewBox="0 0 40 40">
                        <path d="m13.3 31.7h-5v-16.7h5v16.7z m18.4 0h-5v-8.9c0-2.4-0.9-3.5-2.5-3.5-1.3 0-2.1 0.6-2.5 1.9v10.5h-5s0-15 0-16.7h3.9l0.3 3.3h0.1c1-1.6 2.7-2.8 4.9-2.8 1.7 0 3.1 0.5 4.2 1.7 1 1.2 1.6 2.8 1.6 5.1v9.4z m-18.3-20.9c0 1.4-1.1 2.5-2.6 2.5s-2.5-1.1-2.5-2.5 1.1-2.5 2.5-2.5 2.6 1.2 2.6 2.5z"></path>
                      </svg>
                    </a>

                    <a :href="`mailto:?body=${fullPageLink}`" target="_blank" class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: #7d7d7d" @click="openMobileShare = false">
                      <svg class="w-8 h-8" fill="#fff" viewBox="0 0 40 40">
                        <path d="m33.4 13.4v-3.4l-13.4 8.4-13.4-8.4v3.4l13.4 8.2z m0-6.8q1.3 0 2.3 1.1t0.9 2.3v20q0 1.3-0.9 2.3t-2.3 1.1h-26.8q-1.3 0-2.3-1.1t-0.9-2.3v-20q0-1.3 0.9-2.3t2.3-1.1h26.8z"></path>
                      </svg>
                    </a>

                    <a :href="`https://twitter.com/intent/tweet?text=${fullPageLink}`" target="_blank" class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: #1DA1F2" @click="openMobileShare = false">
                      <svg class="w-8 h-8" fill="#fff" viewBox="0 0 40 40">
                        <path d="m31.5 11.7c1.3-0.8 2.2-2 2.7-3.4-1.4 0.7-2.7 1.2-4 1.4-1.1-1.2-2.6-1.9-4.4-1.9-1.7 0-3.2 0.6-4.4 1.8-1.2 1.2-1.8 2.7-1.8 4.4 0 0.5 0.1 0.9 0.2 1.3-5.1-0.1-9.4-2.3-12.7-6.4-0.6 1-0.9 2.1-0.9 3.1 0 2.2 1 3.9 2.8 5.2-1.1-0.1-2-0.4-2.8-0.8 0 1.5 0.5 2.8 1.4 4 0.9 1.1 2.1 1.8 3.5 2.1-0.5 0.1-1 0.2-1.6 0.2-0.5 0-0.9 0-1.1-0.1 0.4 1.2 1.1 2.3 2.1 3 1.1 0.8 2.3 1.2 3.6 1.3-2.2 1.7-4.7 2.6-7.6 2.6-0.7 0-1.2 0-1.5-0.1 2.8 1.9 6 2.8 9.5 2.8 3.5 0 6.7-0.9 9.4-2.7 2.8-1.8 4.8-4.1 6.1-6.7 1.3-2.6 1.9-5.3 1.9-8.1v-0.8c1.3-0.9 2.3-2 3.1-3.2-1.1 0.5-2.3 0.8-3.5 1z"></path>
                      </svg>
                    </a>

                    <a :href="`https://pinterest.com/pin/create/button/?url=${fullPageLink}&media=${baseUrl+(product.picture || product.general.picture)}&description=${product.name || product.general.name}`" target="_blank" class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: #E60023" @click="openMobileShare = false">
                      <svg class="w-8 h-8" fill="#fff" viewBox="0 0 40 40">
                        <path d="m37.3 20q0 4.7-2.3 8.6t-6.3 6.2-8.6 2.3q-2.4 0-4.8-0.7 1.3-2 1.7-3.6 0.2-0.8 1.2-4.7 0.5 0.8 1.7 1.5t2.5 0.6q2.7 0 4.8-1.5t3.3-4.2 1.2-6.1q0-2.5-1.4-4.7t-3.8-3.7-5.7-1.4q-2.4 0-4.4 0.7t-3.4 1.7-2.5 2.4-1.5 2.9-0.4 3q0 2.4 0.8 4.1t2.7 2.5q0.6 0.3 0.8-0.5 0.1-0.1 0.2-0.6t0.2-0.7q0.1-0.5-0.3-1-1.1-1.3-1.1-3.3 0-3.4 2.3-5.8t6.1-2.5q3.4 0 5.3 1.9t1.9 4.7q0 3.8-1.6 6.5t-3.9 2.6q-1.3 0-2.2-0.9t-0.5-2.4q0.2-0.8 0.6-2.1t0.7-2.3 0.2-1.6q0-1.2-0.6-1.9t-1.7-0.7q-1.4 0-2.3 1.2t-1 3.2q0 1.6 0.6 2.7l-2.2 9.4q-0.4 1.5-0.3 3.9-4.6-2-7.5-6.3t-2.8-9.4q0-4.7 2.3-8.6t6.2-6.2 8.6-2.3 8.6 2.3 6.3 6.2 2.3 8.6z"></path>
                      </svg>
                    </a>

                    <a :href="`https://www.facebook.com/sharer/sharer.php?u=${fullPageLink}`" target="_blank" class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: #4267B2" @click="openMobileShare = false">
                      <svg class="w-10 h-10" fill="#fff" viewBox="0 0 40 40">
                        <path d="m21.7 16.7h5v5h-5v11.6h-5v-11.6h-5v-5h5v-2.1c0-2 0.6-4.5 1.8-5.9 1.3-1.3 2.8-2 4.7-2h3.5v5h-3.5c-0.9 0-1.5 0.6-1.5 1.5v3.5z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </modal>

              <button :class="['mx-2', product.liked ? 'text-red-550' : '']" @click="like">
                <i class="flaticon-053-heart text-2xl"></i>
              </button>

              <nuxt-link :to="`/${product.business.link}/${product.category_id}/${product.id}/comments`" class="mx-2">
                <i class="flaticon-029-star text-2xl"></i>
              </nuxt-link>

              <button :class="['mr-2', product.bookmarked ? 'text-red-550' : '']" @click="bookmark">
                <i class="flaticon-154-bookmark text-2xl"></i>
              </button>
            </div>

            <span v-if="maxDiscount" class="lg:hidden absolute bg-red-550 text-white p-2 rounded-tl-xl rounded-br-xl left-2 top-2 sm:left-4 sm:top-4">
            {{ maxDiscount }}% تخفیف
          </span>
          </div>
        </div>
        <div class="bg-white p-4 rounded">
          <div ref="map" class="w-full h-96"></div>
          <p class="address text-gray-500 pr-8 mt-4">{{ product.business.address }}</p>
        </div>
      </SlideDown>
      <SlideDown :open="step === 2">
        <BusinessSelectDate
          v-model="selectedDate"
          :item-id="product.id"
          item-type="product"
          @cancel="returnToStep1"
          @submit="step = 3"
        />
      </SlideDown>
      <SlideDown :open="step === 3">
        <BusinessSelectAppointment
          v-model="selectedAppointment"
          :item-id="product.id"
          item-type="product"
          :date="selectedDate"
          @cancel="returnToStep2"
          @submit="submit"
        />
      </SlideDown>
    </div>

    <ReportModal
      v-if="product"
      :id="product.id"
      subject="product"
      :open="reportModal"
      @close="reportModal = false"
    />

  </div>
</template>

<script>
import Input from "../../../../components/Input";
import Gallery from "../../../../components/gallery";
import FrontHeader from "../../../../components/front/header";
import FrontProductHeader from "../../../../components/front/productHeader";
import Modal from "../../../../components/Modal";
import SlideDown from "../../../../components/SlideDown.vue";
import BusinessSelectDate from "../../../../components/business/SelectDate.vue";
import BusinessSelectAppointment from "../../../../components/business/SelectAppointment.vue";
import ReportModal from "../../../../components/ReportModal.vue";
export default {
  name: "ProductPage",
  components: {
    ReportModal,
    BusinessSelectAppointment,
    BusinessSelectDate, SlideDown, Modal, Input, FrontProductHeader, Gallery, FrontHeader},
  data() {
    return {
      activePrice: 0,
      product: null,
      loaded: false,
      openMobileQr: false,
      openMobileShare: false,
      interval: null,
      step: 1,
      selectedDate: '',
      selectedAppointment: null,
      tabs: [
        {name: 'description', label: 'توضیحات'},
        {name: 'price_description', label: 'توضیح قیمت'}
      ],
      tab: 'description',
      orderForm: {
        count: '1',
        price_id: '',
      },
      baseUrl: process.env.storagePath,
      reportModal: false,
    }
  },
  async fetch() {
    await this.$axios.$get('products/' + this.$route.params.product + '?page=product')
      .then(response => {
        this.product = response.data
        if (this.product.prices.length) {
          this.orderForm.price_id = this.product.prices[0].id
        }
        this.loaded = true
      })
      .catch(error => {
        this.$store.commit('notification/error',{message: error.response.data.message, code: error.response.status})
      })
  },
  computed: {
    workTimes() {
      const value = {}

      this.product.business.active_hour.forEach(x => {
        if (typeof value[x.day] === "undefined")
          value[x.day] = {}

        value[x.day][x.period] = {from: x.from, to: x.to}
      })

      return value
    },
    price() {
      if (!this.orderForm.price_id) {
        return ''
      }
      return this.product.prices.find(x => x.id === this.orderForm.price_id)
    },
    maxCount() {
      return this.price && this.price.inventory - this.price.ordered > 0 ? this.price.inventory - this.price.ordered : 0
    },
    fullPageLink() {
      return window.location.origin + '/' + this.product.business.link + '/' + this.product.category_id + '/' + this.product.id
    },
    maxDiscount() {
      return this.product.prices.reduce((a,b) => a.discount > b.discount ? a.discount : b.discount, 0)
    }
  },
  mounted() {
    if (this.product) {
      this.mapInit()
    } else {
      this.interval = setInterval(() => {
        if (this.product) {
          this.mapInit()
          clearInterval(this.interval)
          this.interval = null
        }
      }, 1000)
    }
    setTimeout(() => {this.drawQr()}, 3000)
  },
  destroyed() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    mapInit() {
      const position = {lat: this.product.business.lat, lng: this.product.business.lng}

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
    submit() {
      if (!this.$store.getters["user/loggedIn"]) {
        this.$store.commit('notification/error', 'برای ثبت سفارش لازم است وارد حساب کاربری خود شوید.')
        return
      }
      if (this.product.business.form.dateable && this.step === 1) {
        this.step = 2
        return;
      }
      if (this.product.business.form.dateable) {
        this.$store.commit('cart/add', {
          type: 'appointment',
          appointment_id: this.selectedAppointment,
          date: this.selectedDate,
          price_id: this.orderForm.price_id
        })
        this.$store.commit('notification/success', 'نوبت انتخابی به سبد خرید شما اضافه شد.')
      }
      else if (this.orderForm.count <= this.maxCount) {
        this.$store.commit('cart/add', {
          type: 'product',
          count: +this.orderForm.count,
          price_id: this.orderForm.price_id
        })
        this.$store.commit('notification/success', 'محصول به سبد خرید شما اضافه شد.')
        this.orderForm.count = '1'
      } else {
        this.$store.commit('notification/error', 'تعداد انتخاب شده بیش از موجودی محصول می باشد.')
      }
    },
    returnToStep1() {
      this.step = 1
      this.selectedDate = null
    },
    returnToStep2() {
      this.step = 2
      this.selectedAppointment = null
    },
    bookmark() {
      if (!this.$store.getters["user/loggedIn"]) {
        alert('برای ذخیره کسب و کار لازم است به حساب کاربری خود وارد شوید.')
        return;
      }

      const url = `/home/product/${this.product.id}/bookmark${this.product.bookmarked ? '?action=unbookmark' : ''}`

      this.$axios.$get(url)
        .then(() => {
          this.product.bookmarked = !this.product.bookmarked
          this.$store.commit(
            'notification/success',
            this.product.bookmarked
              ? 'کسب و کار به لیست علاقه مندی های شما اضافه شد.'
              : 'کسب و کار از لیست علاقه مندی های شما حذف شد.'
          )
        })
    },
    like() {
      if (!this.$store.getters["user/loggedIn"]) {
        alert('برای لایک کسب و کار لازم است به حساب کاربری خود وارد شوید.')
        return;
      }

      const url = `/product/${this.product.id}/like${this.product.liked ? '?action=unlike' : ''}`

      this.$axios.$get(url)
        .then(() => {
          this.product.liked = !this.product.liked
          this.$store.commit(
            'notification/success',
            this.product.liked
              ? 'امتیاز شما ثبت شد.'
              : 'امتیاز شما حذف شد.'
          )
        })
    },
    drawQr() {
      this.qr = new window.QRious({
        element: document.getElementById("qrcode-mobile"),
        foreground: '#383c55',
        value: this.fullPageLink
      });
    },
  }
}
</script>
