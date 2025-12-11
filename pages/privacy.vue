<template>
  <div>
    <front-header/>
    <div v-if="page" class="mt-8">
      <h2 class="font-bold text-lg mb-4">سیاست حفظ حریم خصوصی</h2>
      <div v-html="page.body"></div>
    </div>
  </div>
</template>

<script>

import FrontHeader from "../components/front/header.vue";

export default {
  name: "HelpPage",
  components: {FrontHeader},
  data() {
    return {
      page: null
    }
  },
  async fetch () {
    await this.$axios.$get('/pages/privacy')
      .then(response => {
        this.page = response
      })
  }
}

</script>
