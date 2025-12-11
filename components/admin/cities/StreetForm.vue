<template>
  <div class="flex flex-wrap">

    <div class="w-full md:w-2/3 lg:w-3/5 xl:w-2/3 2xl:w-3/4 md:pl-4">
      <div class="rounded-t md:rounded-b p-4 bg-white">
        <h3 class="mb-4">
          <i class="pl-2 flaticon-043-plus"></i>
          <span v-if="street" class="font-semibold">ویرایش خیابان</span>
          <span v-else class="font-semibold">افزودن خیابان</span>
        </h3>
        <Input
          v-model="form.name"
          class="mb-4"
          label="نام خیابان"
          :errors="errors && errors.hasOwnProperty('name') ? errors.name : []"
        />
        <div class="mb-4">
          <label class="block pb-2">تگ ها</label>
          <TagsInput
            v-model="form.tags"
          />
          <ul v-if="errors && errors.hasOwnProperty('tags')" class="mt-2 text-red-550">
            <li v-for="(e,index) in errors.tags" :key="index" v-text="e"></li>
          </ul>
        </div>
        <div class="mb-4">
          <div class="flex border-b-2 border-gray-300 justify-center mb-12 mt-6 -mx-4">
            <select
              v-model="form.city_id"
              dir="rtl"
              class="block bg-gray-50 rounded w-1/3 min-w-min -mb-5 p-2 pr-4 pl-8 border-none focus:outline-none focus:ring-2 focus:ring-blue-450"
            >
              <option v-for="item in $store.state.city.list" :key="item.id" :value="item.id">
                {{ item.name }}
              </option>
            </select>
          </div>
        </div>
        <div ref="map" class="w-full h-96"></div>
      </div>
    </div>

    <div class="w-full md:w-1/3 lg:w-2/5 xl:w-1/3 2xl:w-1/4 md:pr-4">
      <div class="rounded-b md:rounded-t p-4 bg-white">
        <h3 class="mb-4 hidden md:block">
          <i class="pl-2 flaticon-151-check"></i>
          <span v-if="street" class="font-semibold">ویرایش</span>
          <span v-else class="font-semibold">ثبت</span>
        </h3>

        <div class="flex items-center mb-4">
          <input id="enable-input" v-model="form.status" type="checkbox"
                 class="h-4 w-4 ml-2 text-blue-450 focus:ring-blue-450 border-gray-300 rounded">
          <label for="enable-input" class="ml-2 block text-sm text-gray-900">
            وضعیت (فعال یا غیرفعال)
          </label>
        </div>

        <div class="flex md:flex-wrap justify-center">
          <button
            :class="[
              'flex items-center bg-blue-450 text-white rounded py-2',
              'md:w-full md:mb-4 md:justify-center',
              'lg:w-auto lg:mb-0 lg:justify-start',
            ]"
            @click="submit"
          >
            <i v-if="!loading" class="flaticon-151-check font-bold px-4 xl:px-3 2xl:px-4"></i>
            <span v-if="!loading && street" class="pl-8 xl:pl-6 2xl:pl-8">بروزرسانی</span>
            <span v-else-if="!loading" class="pl-8">ثبت</span>
            <span v-else class="loader mx-8 w-5 h-5 border-2 rounded-full border-blue-300"></span>
          </button>
          <nuxt-link
            :to="`/admin/cities/${form.city_id}`"
            :class="[
              'flex items-center border border-blue-450 text-blue-450 rounded py-2 ',
              'px-8 xl:px-6 2xl:px-8 mr-4 md:w-full lg:w-auto md:justify-center lg:justify-start md:mr-0 lg:mr-4'
            ]"
          >
            <span>انصراف</span>
          </nuxt-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "AdminCitiesStreetForm",
  props: {
    cityId: {
      type: [Number, String],
      required: true
    },
    street: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {
        name: this.street ? this.street.name : '',
        city_id: this.street ? this.street.city_id : null,
        tags: this.street ? this.street.tags : '',
        status: this.street ? this.street.status : true,
        lat: null,
        lng: null,
      },
      map: null,
      marker: null,
      loading: false,
      errors: null,
      interval: null
    }
  },
  computed: {
    city() {
      return this.form.city_id
        ? this.$store.state.city.list.find(x => x.id === this.form.city_id)
        : null
    }
  },
  watch: {
    city() {
      this.updateMapPosition()
    }
  },
  mounted() {
    if (!this.street) {
      this.form.city_id = parseInt(this.cityId)
    }
    this.mapInit()
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    submit() {
      this.loading = true
      const data = {...this.form}
      data.lat = this.marker.getLatLng().lat
      data.lng = this.marker.getLatLng().lng

      const method = this.street ? '$put' : '$post'
      const url = this.street ? `admin/streets/${this.street.id}` : 'admin/streets'
      this.$axios[method](url, data)
        .then(() => {
          const message = this.street
            ? `خیابان جدید با نام <b>${data.name}</b> ایجاد شد.`
            : `خیابان با نام <b>${data.name}</b> ویرایش شد.`
          this.$store.commit('notification/success', message)
          this.$router.push('/admin/cities/' + data.city_id)
        })
        .catch(error => {
          this.$store.commit('notification/error', {
            message: error?.response?.data.message,
            code: error?.response?.status
          })
          this.errors = error.response.data?.errors
        })
        .finally(() => {
          this.loading = false
        })
    },
    mapInit() {
      const position = this.street
        ? {lat: +this.street.lat, lng: +this.street.lng}
        : {lat: 35.6892, lng: 51.3890}

      this.map = new window.L.Map(this.$refs.map, {
        key: process.env.NESHAN_WEB_APP_KEY,
        maptype: 'dreamy-gold',
        poi: true,
        traffic: false,
        center: position,
        zoom: 13
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

      if (!this.street) {
        this.updateMapPosition()
      }
    },
    updateMapPosition() {
      if (!this.city || !this.map)
        return

      this.marker.setLatLng({lat: +this.city.lat, lng: +this.city.lng})
      this.map.setView({lat: +this.city.lat, lng: +this.city.lng})
    }
  },
}
</script>
