<template>
  <div class="lg:border-b-2 border-blueGray-350 mb-12 -mt-16 lg:mt-0 -ml-4 mr-12 lg:mr-0 lg:ml-0 relative z-10">
    <div class="panel-business-page-navigation flex lg:justify-center -mb-6 whitespace-nowrap overflow-x-auto">

      <nuxt-link
        v-for="item in items"
        :key="item.icon"
        :to="{name: item.link + '___' + $i18n.locale, params: {id}}"
        :class="['border lg:border-2 border-cyan-250 px-2 py-1 lg:px-4 lg:py-2 ml-2 lg:ml-4 rounded-lg flex items-center', $route.name.startsWith(item.link) ? 'bg-cyan-250 text-white' : 'bg-gray-50']"
      >
        <icons-chat v-if="item.icon === 'chat'" :class="['w-5 h-5 ml-2', $route.name.startsWith(item.link) ? '' : 'text-cyan-250']"/>
        <i v-else :class="[item.icon, 'ml-2', $route.name.startsWith(item.link) ? '' : 'text-cyan-250']"></i>
        <span v-text="item.label"></span>
      </nuxt-link>

    </div>
  </div>
</template>

<script>
export default {
  name: "PanelBusinessNavigation",
  props: {
    id: {
      type: Number,
      required: true
    },
    hasCategory: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    items() {
      const prefix = this.$route.name.split('-')[0]

      const arr = [
        {label: 'کسب و کار', icon: 'flaticon-032-briefcase', link: `${prefix}-businesses-id-edit`},
      ]

      this.hasCategory && arr.push({label: 'محصولات', icon: 'flaticon-063-picture', link: `${prefix}-businesses-id-products`})

      arr.push(
        {label: 'نظرات', icon: 'flaticon-160-chat', link: `${prefix}-businesses-id-comments`},
        {label: 'سفارشات', icon: 'flaticon-044-file', link: `${prefix}-businesses-id-orders`},
        {label: 'چت', icon: 'chat', link: `${prefix}-businesses-id-chats`}
      )

      return arr
    }
  },
  mounted() {
    const active = this.$el.querySelector('a.bg-cyan-250')
    if (active) {
      const {x} = active.getBoundingClientRect()
      if (x < 0) {
        this.$el.querySelector('.overflow-x-auto').scrollTo(x - 32,0)
      }
    }
  }
}
</script>

<style lang="scss">
.panel-business-page-navigation {
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
