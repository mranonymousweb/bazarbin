<template>
  <div class="text-sm sm:text-base">
    <front-header class="mb-8"/>

    <div>
      <div class="relative flex items-center bg-white rounded px-4 lg:px-12 py-4 mt-14 md:mt-0">
        <div class="absolute -top-10 right-2 md:static w-20 h-20 md:w-24 md:h-24 bg-white flex justify-center items-center rounded-full object-cover ml-9 border border-cyan-250">
          <i class="flaticon-091-shopping-cart cursor-pointer text-3xl md:text-4xl text-gray-800"></i>
        </div>
        <div class="flex-grow">
          <div class="font-semibold mb-3 -mt-3 md:mt-0 pr-20 md:pr-0 text-base md:text-lg">سبد خرید</div>
          <div class="pt-4 md:pt-0">
            <span class="text-cyan-250">فرم مشخصات را پر کنید</span>
          </div>
        </div>
      </div>
    </div>

    <div class="md:px-12 px-4 md:py-8 py-4 bg-white rounded mt-4 flex flex-wrap">
      <div v-for="field in fields" :key="field.id" class="w-full md:w-1/2 md:px-12 md:mb-8 mb-4">
        <Input v-model="form[field.name].value" :label="field.title"/>
      </div>
    </div>
    <div class="mt-4 bg-white p-4 rounded">
      <div ref="map" class="w-full h-96"></div>
    </div>
    <div class="flex justify-center md:mt-20 mt-4">
      <button
        class="flex items-center justify-center border border-blue-450 text-blue-450 w-52 rounded py-2 px-4 ml-2 md:py-3 md:px-12 md:ml-4"
        @click="$router.back()"
      >
        بازگشت
      </button>
      <button
        class="flex items-center justify-center bg-blue-450 text-white w-52 rounded py-2 px-4 mr-2 md:py-3 md:px-12 md:mr-4"
        @click="submit"
      >
        تکمیل سفارش
      </button>
    </div>
  </div>
</template>

<script>

import Input from "../../components/Input";
import errorParser from "../../mixins/error_parser";

export default {
  name: "CartFormPage",
  components: {Input},
  mixins: [errorParser],
  data() {
    return {
      fields: [],
      form: {
      },
      lat: 35.6892,
      lng: 51.3890,
      map: null,
      marker: null,
      interval: null,
    }
  },
  async fetch() {
    await this.$axios.$post('cart/form', {items: this.$store.state.cart.items})
      .then(response => {
        response.fields.forEach(x => {
          this.form[x.name] = {
            id: x.id,
            value: ''
          }
        })
        this.fields = response.fields
      })
      .catch(error => this.showError(error))
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
    mapInit() {
      const position = {lat: this.lat, lng: this.lng}

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
        this.lat = e.latlng.lat
        this.lng = e.latlng.lng
        this.marker.setLatLng(e.latlng)
      })

      this.marker.on('move', e => {
        this.lat = e.latlng.lat
        this.lng = e.latlng.lng
      })

    },
    submit() {
      const data = {
        lat: this.lat,
        lng: this.lng,
        fields: {},
        items: this.$store.state.cart.items
      }

      const empty = []
      Object.keys(this.form).forEach(key => {
        if (!this.form[key].value) { empty.push(this.fields.find(x => x.name === key)?.title) }
        data.fields[this.form[key].id] = this.form[key].value
      })

      if (empty.length) {
        let message = 'لطفا اطلاعات فرم را تکمیل کنید.' + '<br><br>'
        empty.forEach((title, i) => {
          if (i > 0) {
            message += '، '
          }
          message += `<b>${title}</b>`
        })
        this.$store.commit('notification/error', {message, code: 422, duration: 10000})
        return
      }

      this.$axios.$post('/home/invoices', data)
        .then(() => {
          this.$store.commit('cart/removeAll')
          this.$store.commit('notification/success', 'سفارش شما با موفقیت ثبت شد.')
          this.$router.push('/panel/my-orders')
        })
        .catch(error => this.showError(error))
    }
  }
}
</script>
