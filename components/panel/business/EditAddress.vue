<template>
  <div class="bg-white rounded p-3 lg:p-6">

    <div class="flex items-center">
      <i class="text-base flaticon-064-pin-1 ml-2"></i>
      <span class="flex-grow lg:text-gray-500 font-bold">آدرس</span>
      <span class="cursor-pointer text-blue-450" @click="open = !open">
        <i v-if="!open" class="flaticon-043-plus"></i>
        <span>{{ open ? 'بستن' : 'ویرایش اطلاعات' }}</span>
      </span>
    </div>

    <slide-down :open="open">
      <div class="flex flex-wrap p-1 pt-4">
        <div class="w-full lg:w-1/2 lg:pl-2 mb-5 lg:mb-0">
          <searchable-select
            v-model="form.city_id"
            :items="$store.state.city.list"
            label="شهر"
            @input="$emit('input', form)"
          />
        </div>
        <div class="w-full lg:w-1/2 lg:pr-2">
          <SearchableMultipleSelect
            v-model="form.streets"
            :items="streets"
            label="خیابان"
            placeholder="خیابان یا محله"
            @input="$emit('input', form)"
          />
        </div>
        <div class="w-full my-5">
          <Input
            v-model="form.address"
            label="آدرس"
            @input="$emit('input', form)"
          />
        </div>
        <div class="w-full">
          <div ref="map" class="w-full h-96"></div>
        </div>
        <div class="w-full flex gap-4 justify-center mt-5 p-1">
          <button
            class="border-blue-450 rounded px-3 py-2 text-blue-450 text-center border-2"
            @click="goToMyLocation"
          >
            برو به موقعیت من
          </button>
          <submit-btn
            v-if="exist"
            @click="submit"
          />
        </div>
      </div>
    </slide-down>

    <table v-if="!open && false" class="w-full text-sm">
      <thead>
      <tr class="bg-gray-50 h-12">
        <th class="text-right px-2 w-48">شهر</th>
        <th class="text-right px-2 w-48">خیابان</th>
        <th class="text-right px-2 hidden lg:table-cell">آدرس</th>
      </tr>
      </thead>

      <tbody>
      <tr>
        <td class="p-2">{{ city && city.name }}</td>
        <td class="p-2">{{ street && street.name }}</td>
        <td class="p-2 hidden lg:table-cell">{{ form.address }}</td>
      </tr>
      <tr class="lg:hidden h-12 bg-gray-50">
        <th colspan="2" class="text-right px-2 ">آدرس</th>
      </tr>
      <tr class="lg:hidden">
        <td colspan="2" class="p-2">{{ form.address }}</td>
      </tr>
      </tbody>

    </table>

  </div>
</template>

<script>
import errorParser from "~/mixins/error_parser";

export default {
  name: "PanelBusinessEditAddress",
  mixins: [errorParser],
  props: {
    value: {
      type: Object,
      required: true
    },
    exist: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      open: !this.exist,
      loading: false,
      streets: [],
      interval: null,
      map: null,
      marker: null,
      form: {
        address: '',
        city_id: null,
        streets: [],
        lat: 35.6892,
        lng: 51.3890,
      }
    }
  },
  computed: {
    isAdmin() {
      return this.$store.state.user.data.roles.findIndex(x => x.name === 'super-admin') >= 0
    },
    url() {
      return this.isAdmin ? `admin/businesses/${this.$route.params.id}` : `home/business/${this.$route.params.id}`
    },
    city() {
      return this.form.city_id ? this.$store.state.city.list.find(x => x.id === this.form.city_id) : null
    },
    street() {
      return this.form.streets?.length ? this.streets.find(x => x.id === this.form.streets[this.form.streets.length-1]) : null
    }
  },
  watch: {
    city(val) {
      this.loadStreets()
      if (val) {
        this.marker.setLatLng({lat: this.city.lat, lng: this.city.lng})
        this.map.setView({lat: this.city.lat, lng: this.city.lng})
      }
    },
    street(val) {
      if (val) {
        if (this.street) {
          this.marker.setLatLng({lat: this.street.lat, lng: this.street.lng})
          this.map.setView({lat: this.street.lat, lng: this.street.lng})
        }
      }
    }
  },
  created() {
    this.parseValue()
    this.loadStreets()
  },
  mounted() {
    this.mapInit()
  },
  destroyed() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    parseValue() {
      this.form.streets = this.value.streets
      this.form.city_id = this.value.city_id
      this.form.address = this.value.address
      this.form.lat = this.value.lat
      this.form.lng = this.value.lng
    },
    loadStreets() {
      this.streets = []

      if (!this.form.city_id)
        return

      this.$axios.$get(`/search/cities/${this.form.city_id}/streets?all=1`)
        .then(response => {
          this.streets = response
          this.form.streets = this.form.streets.filter(x => !!this.streets.find(y => y.id === x))
        })
    },
    mapInit() {
      const position = {lat: this.form.lat, lng: this.form.lng}

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
        }),
        draggable: true
      }).addTo(this.map);

      this.map.on('click', (e) => {
        this.marker.setLatLng(e.latlng)
        this.form.lat = e.latlng.lat
        this.form.lng = e.latlng.lng
        this.$emit('input', this.form)
      })

      this.marker.on('move', (e) => {
        this.form.lat = e.latlng.lat
        this.form.lng = e.latlng.lng
        this.$emit('input', this.form)
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
          this.$store.commit('notification/error',{
            code: 400,
            message: 'خطا در دریافت موقعیت شما'
          })
        });
      } else {
        this.$store.commit('notification/error',{
          code: 400,
          message: 'استفاده از موقعیت مکانی شما فعال نمی باشد.'
        })
      }
    },
    submit() {
      this.$axios.$put(this.url, this.form)
        .then(() => {
          this.$store.commit('notification/success', 'اطلاعات کسب و کار با موفقیت بروزرسانی شد.')
        })
        .catch(error => this.showError(error))
    }
  }
}
</script>
