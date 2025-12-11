<template>
  <nuxt-link to="/cart">
      <span class="relative flex">
        <i class="flaticon-091-shopping-cart cursor-pointer text-xl sm:text-2xl"></i>
        <span
          v-if="count"
          :class="['absolute flex items-center justify-center rounded-full bg-red-450 text-white pt-0.5 w-5 h-5 top-0 -right-3' , fontClass]"
        >
          {{ count }}
        </span>
      </span>
  </nuxt-link>
</template>

<script>
import { useCartStore } from '~/stores/cart'

export default {
  name: "CartBtn",
  components: {},
  computed: {
    cartStore() {
      return useCartStore()
    },
    count() {
      return this.cartStore.items.length
    },
    fontClass() {
      return this.count > 9 ? 'text-xs font-medium' : 'text-sm font-medium'
    }
  }

}
</script>
