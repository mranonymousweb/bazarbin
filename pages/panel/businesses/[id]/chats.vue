<template>
  <div>
    <div v-if="business">
      <panel-business-navigation :id="$route.params.id" :has-category="business.has_category"/>
      {{ business.name }}
      chats
    </div>
  </div>
</template>

<script>
export default {
  layout: 'panel',
  data() {
    return {
      business: null
    }
  },
  async fetch() {
    await this.$axios.$get('home/businesses/' + this.$route.params.id)
      .then(response => {
        this.business = response.data
      })
  },
}
</script>
