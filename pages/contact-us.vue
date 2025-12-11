<template>
  <div>
    <front-header/>
    <div v-if="page" class="mt-8">
      <h2 class="font-bold text-lg mb-4">تماس با ما</h2>
      <div v-html="page.body"></div>
    </div>
    <div v-else class="mt-8 text-center py-10">
      <p class="text-gray-500">در حال بارگذاری...</p>
    </div>
  </div>
</template>

<script>
import FrontHeader from "~/components/front/header.vue";

export default {
  name: "ContactPage",
  components: {FrontHeader},
  data() {
    return {
      page: null
    }
  },
  async mounted() {
    await this.loadPage()
  },
  methods: {
    async loadPage() {
      try {
        const { $axios } = useNuxtApp()
        const response = await $axios.$get('/pages/contact-us')
        this.page = response
      } catch (e) {
        console.error('Error loading page:', e)
      }
    }
  }
}
</script>
