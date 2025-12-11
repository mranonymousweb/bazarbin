<template>
  <div class="bg-white rounded p-3 lg:p-8 pl-0 lg:pl-0 flex flex-wrap lg:flex-nowrap business-list-item-large justify-between">

    <div class="w-full mb-2 lg:hidden">
      <nuxt-link :to="`/${item.link}`" class="block">
        <span class="text-orange-500 text-sm">
          {{ item.guild.name }}
        </span>
        <span class="font-bold">
          <nuxt-link :to="`/${item.link}`">{{ item.name }}</nuxt-link>
        </span>
      </nuxt-link>
    </div>

    <div class="w-4/12 max-w-44 flex-shrink-0 lg:w-44 lg:ml-4">
      <nuxt-link :to="`/${item.link}`" class="image-wrapper block relative">
        <img :src="`${baseUrl}${item.avatar}`" alt="" class="absolute top-0 right-0 h-full w-full object-contain overflow-hidden rounded">
      </nuxt-link>
    </div>

    <div class="w-1/3 ml-4 hidden lg:block">
      <nuxt-link :to="`/${item.link}`" class="block h-full">
        <div class=" flex flex-col justify-between h-full">

          <p class="text-orange-500 text-sm">
            {{ item.guild.name }}
          </p>
          <p class="font-bold">
            <nuxt-link :to="`/${item.link}`">{{ item.name }}</nuxt-link>
          </p>
          <p class="text-gray-400">
            {{ item.address }}
          </p>
        </div>
      </nuxt-link>
    </div>

    <div class="w-4/12 lg:w-44 lg:ml-4">
      <nuxt-link :to="`/${item.link}`" class="block h-full px-4 lg:px-0">
        <ul class="flex flex-col justify-between text-gray-500 h-full py-1">
          <li v-for="service in services" :key="service" class="truncate">{{ service }}</li>
        </ul>
      </nuxt-link>
    </div>

    <div class="hidden lg:block w-44 flex flex-col justify-around ml-4 text-blue-400">
      <div v-for="contact in contacts" :key="contact.value">
        <a :href="contact.link">{{ contact.value }}</a>
      </div>
    </div>

    <div class="w-2/12 lg:w-16 flex flex-col justify-between lg:ml-4">

      <div class="flex items-center justify-end pl-2 lg:pl-0">
        <span class="ml-2">{{ item.likes }}</span>
        <svg class="text-gray-400 w-5 h-5" viewBox="0 0 22 22" fill="currentColor">
          <path d="M8.16055 10.62C8.13055 10.62 8.11055 10.62 8.08055 10.62C8.03055 10.61 7.96055 10.61 7.90055 10.62C5.00055 10.53 2.81055 8.25 2.81055 5.44C2.81055 2.58 5.14055 0.25 8.00055 0.25C10.8605 0.25 13.1905 2.58 13.1905 5.44C13.1805 8.25 10.9805 10.53 8.19055 10.62C8.18055 10.62 8.17055 10.62 8.16055 10.62ZM8.00055 1.75C5.97055 1.75 4.31055 3.41 4.31055 5.44C4.31055 7.44 5.87055 9.05 7.86055 9.12C7.92055 9.11 8.05055 9.11 8.18055 9.12C10.1405 9.03 11.6805 7.42 11.6905 5.44C11.6905 3.41 10.0305 1.75 8.00055 1.75Z"/>
          <path d="M15.5404 10.75C15.5104 10.75 15.4804 10.75 15.4504 10.74C15.0404 10.78 14.6204 10.49 14.5804 10.08C14.5404 9.67 14.7904 9.3 15.2004 9.25C15.3204 9.24 15.4504 9.24 15.5604 9.24C17.0204 9.16 18.1604 7.96 18.1604 6.49C18.1604 4.97 16.9304 3.74 15.4104 3.74C15.0004 3.75 14.6604 3.41 14.6604 3C14.6604 2.59 15.0004 2.25 15.4104 2.25C17.7504 2.25 19.6604 4.16 19.6604 6.5C19.6604 8.8 17.8604 10.66 15.5704 10.75C15.5604 10.75 15.5504 10.75 15.5404 10.75Z"/>
          <path d="M8.16961 21.55C6.20961 21.55 4.23961 21.05 2.74961 20.05C1.35961 19.13 0.599609 17.87 0.599609 16.5C0.599609 15.13 1.35961 13.86 2.74961 12.93C5.74961 10.94 10.6096 10.94 13.5896 12.93C14.9696 13.85 15.7396 15.11 15.7396 16.48C15.7396 17.85 14.9796 19.12 13.5896 20.05C12.0896 21.05 10.1296 21.55 8.16961 21.55ZM3.57961 14.19C2.61961 14.83 2.09961 15.65 2.09961 16.51C2.09961 17.36 2.62961 18.18 3.57961 18.81C6.06961 20.48 10.2696 20.48 12.7596 18.81C13.7196 18.17 14.2396 17.35 14.2396 16.49C14.2396 15.64 13.7096 14.82 12.7596 14.19C10.2696 12.53 6.06961 12.53 3.57961 14.19Z"/>
          <path d="M17.3402 19.75C16.9902 19.75 16.6802 19.51 16.6102 19.15C16.5302 18.74 16.7902 18.35 17.1902 18.26C17.8202 18.13 18.4002 17.88 18.8502 17.53C19.4202 17.1 19.7302 16.56 19.7302 15.99C19.7302 15.42 19.4202 14.88 18.8602 14.46C18.4202 14.12 17.8702 13.88 17.2202 13.73C16.8202 13.64 16.5602 13.24 16.6502 12.83C16.7402 12.43 17.1402 12.17 17.5502 12.26C18.4102 12.45 19.1602 12.79 19.7702 13.26C20.7002 13.96 21.2302 14.95 21.2302 15.99C21.2302 17.03 20.6902 18.02 19.7602 18.73C19.1402 19.21 18.3602 19.56 17.5002 19.73C17.4402 19.75 17.3902 19.75 17.3402 19.75Z"/>
        </svg>

      </div>

      <div class="flex items-center justify-end pl-2 lg:pl-0">
        <span class="ml-2">{{ item.views }}</span>
        <icons-outline-eye class="text-gray-400 w-5 h-5"/>
      </div>

      <div class="flex items-center justify-end pl-2 lg:pl-0">
        <span class="ml-2">{{ item.score }}</span>
        <icons-solid-star class="text-gold w-6 h-6"/>
      </div>
    </div>

    <div :class="[item.discount ? 'w-2/12' : 'w-auto', 'max-w-16 lg:w-16 flex-grow-0 flex-shrink-0 flex flex-col justify-around']">
      <div v-if="item.discount" class="bg-red-550 text-white rounded-r-xl w-full h-20 flex flex-col justify-evenly items-center">
        <span>%{{ item.discount }}</span>
        <span>تخفیف</span>
      </div>
    </div>

    <p class="w-full lg:hidden text-gray-400 mt-2">
      {{ item.address }}
    </p>

  </div>
</template>

<script>
import IconsOutlineEye from "../icons/outline/eye";
export default {
  name: "BusinessListItemLarge",
  components: {IconsOutlineEye},
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      baseUrl: process.env.storagePath,
    }
  },
  computed: {
    contacts() {
      return this.item.contacts?.slice(0,2).map(x => {
        return {
          value: x.value,
          link: x.template.link ? x.template.link + x.value : null
        }
      }) || []
    },
    services() {
      return this.item.services?.split(/(?:, ?|، ?)/).slice(0,3) || []
    }
  }
}
</script>

<style lang="scss">
.business-list-item-large {

  .image-wrapper {
    padding-top: 66%;
  }

  li {
    &::before {
      content: "\2022";
      color: #1290fe;
      font-weight: bold;
      display: inline-block;
      width: 1em;
      margin-right: -1em;
      font-size: 1em;
    }
  }
}
</style>
