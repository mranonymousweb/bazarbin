<template>
  <div class="flex flex-wrap">
    <div class="w-full md:w-2/3 lg:w-3/5 xl:w-2/3 2xl:w-3/4 md:pl-4">
      <div class="rounded-t md:rounded-b p-4 bg-white">
        <h3 class="mb-4">
          <i class="pl-2 flaticon-043-plus"></i>
          <span v-if="city" class="font-semibold">ویرایش شهر</span>
          <span v-else class="font-semibold">افزودن شهر</span>
        </h3>
        <Input
          v-model="form.name"
          class="mb-4"
          label="نام شهر"
        />
        <div ref="map" class="w-full h-96"></div>
      </div>
    </div>

    <div class="w-full md:w-1/3 lg:w-2/5 xl:w-1/3 2xl:w-1/4 md:pr-4">
      <div class="rounded-b md:rounded-t p-4 bg-white">
        <h3 class="mb-4 hidden md:block">
          <i class="pl-2 flaticon-151-check"></i>
          <span v-if="city" class="font-semibold">ویرایش</span>
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
            <span v-if="!loading && city" class="pl-8 xl:pl-6 2xl:pl-8">بروزرسانی</span>
            <span v-else-if="!loading" class="pl-8">ثبت</span>
            <span v-else class="loader mx-8 w-5 h-5 border-2 rounded-full border-blue-300"></span>
          </button>
          <nuxt-link
            to="/admin/cities"
            :class="[
              'flex items-center border border-blue-450 text-blue-450 rounded py-2 ',
              'px-8 xl:px-6 2xl:px-8 mr-4 md:w-full lg:w-auto md:justify-center lg:justify-start md:mr-0 lg:mr-4'
            ]"
            @click="$emit('cancel-edit')"
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
  name: "AdminCitiesCityForm",
  props: {
    city: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {
        name: this.city ? this.city.name : '',
        status: this.city ? !! this.city.status : true,
        lat: null,
        lng: null
      },
      map: null,
      marker: null,
      loading: false,
      errors: null,
      interval: null
    }
  },
  mounted () {
    this.mapInit()
  },
  methods: {
    submit() {
      this.loading = true

      this.form.lat = this.marker.getLatLng().lat
      this.form.lng = this.marker.getLatLng().lng

      this.errors = null
      this.city
        ? this.editItem()
        : this.addItem()
    },
    mapInit() {
      const position = this.city
        ? {lat: +this.city.lat, lng: +this.city.lng}
        : {lat: 35.6892, lng: 51.3890}

      this.map = new window.L.Map(this.$refs.map, {
        key: process.env.NESHAN_WEB_APP_KEY,
        maptype: 'dreamy-gold',
        poi: true,
        traffic: false,
        center: position,
        zoom: 6
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
    },
    addItem() {
      this.$axios.$post('admin/cities', this.form)
        .then(response => {
          this.$store.commit('notification/success', `شهر جدید با نام <b>${this.form.name}</b> ایجاد شد.`)
          this.$store.commit('city/add', [response])
          this.$router.push('/admin/cities')
        })
        .catch(error => {
          this.$store.commit('notification/error', {
            message: error?.response?.data.message,
            code: error?.response?.status
          })
          this.errors = error.response?.data?.errors
        })
        .finally(() => {
          this.loading = false
        })
    },
    editItem() {
      this.$axios.$put('admin/cities/' + this.city.id, this.form)
        .then(() => {
          this.$store.commit('city/update', {
            id: this.city.id,
            ...this.form
          })
          this.$store.commit('notification/success', `شهر <b>${this.city.name}</b> ویرایش شد.`)
          this.$router.push('/admin/cities')
        })
        .catch(error => {
          this.$store.commit('notification/error', {
            message: error.response.data.message,
            code: error.response.status
          })
          this.errors = error.response.data?.errors
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
