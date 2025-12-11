<template>
  <div class="text-sm md:text-base">

    <div ref="progress" class="flex overflow-x-auto new-business-progress-bar h-20 lg:mb-4">
      <div class="w-full lg:w-3/5 flex-shrink-0 ml-4 lg:ml-6"></div>
      <div class="flex-shrink-0 border-t-4 border-dashed border-blueGray-350 relative">
        <span
          v-for="n in 4"
          :key="n"
          :class="['bg-blue-450 text-white flex justify-center items-center rounded-full absolute w-10 h-10 lg:w-16 lg:h-16 -top-5 lg:-top-8 text-xl font-bold', `n${n}`,n === 4 ? 'left-0 -ml-4 lg:-ml-8' : n === 1 ? 'right-0 -mr-4 lg:-mr-8' : '']"
        >{{ n }}</span>
      </div>
    </div>

    <div ref="container" class="flex new-business-container overflow-x-auto pt-4">

      <div class="w-full lg:w-3/5 flex-shrink-0 ml-4 lg:ml-6"></div>

      <!-- step 1-->
      <div class="w-full lg:w-3/5 flex-shrink-0 ml-4 lg:ml-6">
        <panel-business-new-step
          ref="step_1"
          :active="step === 1"
          @click-prev-btn="$router.push('/panel/businesses')"
          @click-next-btn="step = 2"
        >
          <Input
            v-model="form.name"
            class="mb-4"
            input-class="pr-12 h-12"
            label="نام کسب و کار را وارد کنید"
            @keyup.enter="step = 2"
          >
            <template #icon>
              <i class="flaticon-028-user-1 text-coolGray-500 absolute right-4"></i>
            </template>
          </Input>
        </panel-business-new-step>
      </div>

      <!-- step 2-->
      <div class="w-full lg:w-3/5 flex-shrink-0 ml-4 lg:ml-6">
        <panel-business-new-step
          ref="step_2"
          :active="step === 2"
          @click-prev-btn="step = 1"
          @click-next-btn="step = 3"
        >
          <searchable-select
            v-model="form.guild_id"
            :items="guilds"
            :result-list-width=".8"
            :x-anchor=".1"
            label="صنف کسب و کار را وارد کنید"
          />
        </panel-business-new-step>
      </div>

      <!-- step 3-->
      <div class="w-full lg:w-3/5 flex-shrink-0 ml-4 lg:ml-6">
        <panel-business-new-step
          ref="step_3"
          :active="step === 3"
          @click-prev-btn="step = 2"
          @click-next-btn="step = 4"
        >
          <div class="flex mb-4">
            <div class="w-1/2 pl-2">
              <searchable-select
                v-model="form.city_id"
                :items="cityList"
                label="شهر"
                :result-list-width="1.4"
                :x-anchor="-.4"
              />
            </div>
            <div class="w-1/2 pr-2">
              <searchable-select
                v-model="form.street_id"
                :items="streets"
                label="خیابان"
                :result-list-width="1.5"
                :x-anchor="-.5"
              />
            </div>
          </div>

          <div class="mb-4">
            <Input
              v-model="form.address"
              label="آدرس"
              input-class="pr-12 h-12"
            >
              <template #icon>
                <i class="flaticon-064-pin-1 text-coolGray-500 absolute right-4"></i>
              </template>
            </Input>
          </div>
        </panel-business-new-step>
      </div>

      <!-- step 4-->
      <div class="w-full lg:w-4/5 flex-shrink-0">
        <panel-business-new-step
          ref="step_4"
          :step="step"
          :active="step === 4"
          next-btn-label="ثبت کسب و کار"
          @click-prev-btn="step = 3"
          @click-next-btn="submit"
          @click-my-location-btn="goToMyLocation"
        >
          <div class="-mx-12">
            <div ref="map" class="w-full h-96"></div>
          </div>
        </panel-business-new-step>
      </div>

    </div>
  </div>
</template>

<script>
import errorParser from "~/mixins/error_parser";
import PanelBusinessNewStep from "~/components/panel/business/new/step";
import { useCityStore } from '~/stores/city'
import { useNotificationStore } from '~/stores/notification'
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: 'panel'
})

export default {
  components: {PanelBusinessNewStep},
  mixins: [errorParser],
  data() {
    return {
      interval: null,
      map: null,
      marker: null,
      step: 1,
      guilds: [],
      streets: [],
      form: {
        name: '',
        guild_id: '',
        city_id: '',
        street_id: '',
        address: '',
        lat: '',
        lng: ''
      }
    }
  },
  computed: {
    cityList() {
      const cityStore = useCityStore()
      return cityStore.list
    }
  },
  watch: {
    step() {
      this.goToStep()
    },
    'form.city_id'() {
      this.streets = []
      this.form.street_id = ''
      this.loadStreets()
      const cityStore = useCityStore()
      const city = cityStore.list.find(x => x.id === this.form.city_id)
      if (city && this.map && this.marker) {
        this.marker.setLatLng({lat: city.lat, lng: city.lng})
        this.map.setView({lat: city.lat, lng: city.lng})
      }
    },
    'form.street_id'(val) {
      if (val && this.map && this.marker) {
        const street = this.streets.find(x => x.id === this.form.street_id)
        if (street) {
          this.marker.setLatLng({lat: street.lat, lng: street.lng})
          this.map.setView({lat: street.lat, lng: street.lng})
        }
      }
    }
  },
  mounted() {
    this.loadGuilds()
    window.addEventListener("resize", this.goToStep);
    this.goToStep('instant')
    this.mapInit()
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.goToStep);
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    mapInit() {
      try {
        const position = {lat: 35.6892, lng: 51.3890}
        const config = useRuntimeConfig()

        if (!this.$refs.map) {
          console.error('Map ref not found')
          return
        }

        if (!window.L) {
          console.error('Leaflet/Neshan map library not loaded')
          return
        }

        this.map = new window.L.Map(this.$refs.map, {
          key: config.public.NESHAN_WEB_APP_KEY,
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
          }),
          draggable: true
        }).addTo(this.map);

        this.map.on('click', (e) => {
          this.marker.setLatLng(e.latlng)
        })

        // تنظیم موقعیت اولیه فرم
        this.form.lat = position.lat
        this.form.lng = position.lng

        console.log('Map initialized successfully')
      } catch (error) {
        console.error('Error initializing map:', error)
        const notificationStore = useNotificationStore()
        notificationStore.showError('خطا در بارگذاری نقشه. لطفاً صفحه را مجدداً بارگذاری کنید.', 500)
      }
    },
    goToStep(behavior = 'smooth') {
      const containerRect = this.$refs.container.getBoundingClientRect()
      const rect = this.$refs['step_'+this.step].$el.getBoundingClientRect()
      const left = this.$refs.container.scrollLeft + rect.left - containerRect.left + (rect.width / 2) - (containerRect.width / 2)
      this.$refs.container.scrollTo({top: 0, left, behavior: typeof behavior === 'string' ? behavior : 'smooth'})
      this.$refs.progress.scrollTo({top: 0, left, behavior: typeof behavior === 'string' ? behavior : 'smooth'})
    },
    loadGuilds(page = 1) {
      const { $axios } = useNuxtApp()
      $axios.$get('search/guilds?page=' + page)
        .then(response => {
          this.guilds.push(...response.data)
          if (response.current_page < response.last_page) {
            this.loadGuilds(response.current_page + 1)
          }
        })
    },
    loadStreets(page = 1) {
      const { $axios } = useNuxtApp()
      $axios.$get(`/search/cities/${this.form.city_id}/streets?page=${page}`)
        .then(response => {
          this.streets.push(...response.data)
          if (response.current_page < response.last_page) {
            this.loadStreets(response.current_page + 1)
          }
        })
    },
    goToMyLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((e) => {
          const lat = e.coords.latitude
          const lng = e.coords.longitude
          this.marker.setLatLng({lat, lng})
          this.map.setView({lat, lng})
        }, e => {
          console.log(e)
          const notificationStore = useNotificationStore()
          notificationStore.showError('خطا در دریافت موقعیت شما', 400)
        });
      } else {
        const notificationStore = useNotificationStore()
        notificationStore.showError('استفاده از موقعیت مکانی شما فعال نمی باشد.', 400)
      }
    },
    submit() {
      // بررسی اینکه marker و map موجود هستند
      if (!this.marker || !this.map) {
        const notificationStore = useNotificationStore()
        notificationStore.showError('خطا در دریافت موقعیت جغرافیایی. لطفاً صفحه را مجدداً بارگذاری کنید.', 500)
        return
      }

      try {
        const {lat, lng} = this.marker.getLatLng()
        this.form.lat = lat
        this.form.lng = lng
      } catch (error) {
        console.error('Error getting marker position:', error)
        const notificationStore = useNotificationStore()
        notificationStore.showError('خطا در دریافت موقعیت جغرافیایی.', 500)
        return
      }

      // اعتبارسنجی فرم
      if (!this.form.name || !this.form.guild_id || !this.form.city_id || !this.form.street_id || !this.form.address) {
        const notificationStore = useNotificationStore()
        notificationStore.showError('لطفاً تمام فیلدهای الزامی را پر کنید.', 400)
        return
      }

      const { $axios } = useNuxtApp()
      console.log('Submitting form:', this.form)
      
      $axios.$post('home/businesses', this.form)
      .then(response => {
        console.log('Business created:', response)
        const userStore = useUserStore()
        userStore.hasBusiness(true)
        const notificationStore = useNotificationStore()
        notificationStore.showSuccess('کسب و کار شما با موفقیت ثبت شد و پس از تأیید فعال می شود.')
        this.$router.push('/panel/businesses')
      })
      .catch(error => {
        console.error('Error creating business:', error)
        console.error('Error response:', error.response)
        this.showError(error)
      })
    }
  }
}
</script>

<style lang="scss">

.new-business-container {
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .flaticon-032-briefcase {
    font-size: 2.25rem;
  }

  .flaticon-064-pin-1,
  .flaticon-028-user-1 {
    font-size: 1.3rem;
    line-height: 1;
    top: 13px;
  }

  .step {

    &::before {
      content: "";
      border: 1rem solid transparent;
      border-bottom-color: #fff;
      position: absolute;
      top: -2rem;
      left: 50%;
      margin-left: -1rem;
    }
  }
}

.new-business-progress-bar {
  padding-top: 35px;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .border-dashed {
    margin-left: 50%;
    margin-right: 50%;
    width: calc(300% + 3rem);

    @media (min-width: 1024px) {
      margin-right: 30%;
      width: calc(190% + 4.5rem);
      margin-left: 40%
    }
  }

  > div {
    span {
      &.n2 {
        right: calc(33.3333% - 1.25rem);
      }

      &.n3 {
        right: calc(66.6666% - 1.25rem);
      }

      @media (min-width: 1024px) {
        &.n2 {
          right: calc(31.57894% - 2rem);
        }

        &.n3 {
          right: calc(63.15789% - 2rem);
        }
      }
    }
  }
}

</style>
