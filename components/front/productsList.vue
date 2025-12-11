<template>
  <div class="products-list grid gap-3 lg:gap-6 text-sm md:text-base">
    <div
      v-for="item in items"
      :key="item.id"
    >
      <figure class="bg-white rounded overflow-hidden h-full flex flex-col">
        <nuxt-link :to="`/${businessLink || item.business.link}/${item.category_id}/${item.id}`" class="block">
          <div class="image-wrapper relative w-full h-auto md:mb-8 mb-1">
            <img
              v-if="item.picture"
              :src="baseUrl+item.picture"
              :alt="item.name"
              class="top-0 right-0 absolute w-full h-full rounded object-contain">
            <img
              v-else-if="item.general && item.general.picture"
              :src="baseUrl+item.general.picture"
              :alt="item.name"
              class="top-0 right-0 absolute w-full h-full rounded object-contain">
            <span
              v-if="item.price && item.price.discount && new Date(item.price.discount_expire) > now"
              class="absolute bg-red-550 text-white px-8 -left-7 -top-7 text-sm lg:hidden transform -rotate-45 origin-bottom-right"
            >
                %{{ item.price.discount }}
            </span>
          </div>
        </nuxt-link>
        <figcaption class="px-2 pb-2 lg:px-6 lg:pb-4 flex flex-col justify-between flex-grow">
          <h3 class="md:text-lg font-medium text-gray-700 lg:mb-6">
            <nuxt-link :to="`/${businessLink || item.business.link}/${item.category_id}/${item.id}`" class="block">{{ item.name || item.general.name }}</nuxt-link>
          </h3>
          <div v-if="item.price">
            <div v-if="item.price.discount && new Date(item.price.discount_expire) > now" class="relative flex lg:block justify-between">
              <span class="absolute bg-red-550 text-white py-2 px-4 rounded-t-xl rounded-bl-xl right-0 top-0 hidden lg:block">
                {{ item.price.discount }}%
              </span>
              <div class="text-left line-through decoration-red-500 text-xs lg:text-base">
                <span class="lg:inline hidden">&nbsp;&nbsp;</span>
                {{ item.price.price.toLocaleString() }} تومان
                <span class="lg:inline hidden">&nbsp;&nbsp;</span>
              </div>
              <div class="text-left text-sm lg:text-lg font-medium">{{ item.price.price_after_discount.toLocaleString() }} تومان</div>
            </div>
            <div v-else class="text-left text-sm lg:text-lg font-medium">
              {{ item.price.price.toLocaleString() }} تومان
            </div>
          </div>
          <div class="flex justify-between items-center lg:mt-6 mt-1">
            <div class="flex items-center">
              <icons-solid-star class="text-gold w-5 md:w-7 ml-2"/>
              <span>{{ item.score }}</span>
            </div>

            <div v-if="false" class="flex items-center">
              <span>{{ item.likes }}</span>
              <i class="flaticon-053-heart md:text-xl leading-none text-blueGray-500 mr-2 flex"></i>
            </div>

            <div class="flex items-center">
              <span>{{ item.views }}</span>
              <i class="flaticon-057-eye md:text-xl leading-none text-blueGray-500 mr-2 flex"></i>
            </div>
          </div>
        </figcaption>
      </figure>
    </div>
  </div>
</template>

<script>
import IconsSolidStar from "../icons/solid/star";
export default {
  name: "FrontProductsList",
  components: {IconsSolidStar},
  props: {
    items: {
      type: Array,
      required: true
    },
    businessLink: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      now: new Date(),
      baseUrl: process.env.storagePath
    }
  },
  created() {
    this.items.forEach(x => {
      x.price = this.price(x)
    })
  },
  methods: {
    price(item) {
      if (!item.prices.length) {
        return null
      }

      return item.prices.reduce((prev, curr) => curr.discount > prev.discount && new Date(curr.discount_expire) > this.now
        ? curr
        : prev.price < curr.price ? prev : curr
      );
    }
  }
}
</script>

<style lang="scss">
.products-list {
  grid-template-columns: repeat(auto-fill, minmax(158px, 1fr));

  .image-wrapper {
    padding-top: 57.7%;
  }

  .line-through {
    text-decoration-color: #ff0555;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}
</style>
