<template>
  <div class="category-page">
    <front-header class="mb-8"/>
    <div v-if="loaded">
      <front-category-header
        v-if="false"
        id="business-header"
        :category="category"
        :business="business"
        class="lg:mb-12 mb-4"
        @change-liked="business.liked = !business.liked"
        @change-bookmarked="business.bookmarked = !business.bookmarked"
      />
      <div class="flex gap-6 items-center mb-8">
        <img :src="baseUrl+(category.avatar || category.picture)" alt="" class="w-16 h-16 lg:w-24 lg:h-24 rounded-full object-cover">
        <div>
          <h2 class="font-medium">{{ category.name }}</h2>
          <NuxtLink :to="`/${business.link}`" class="text-cyan-600">{{ business.name }}</NuxtLink>
        </div>
      </div>
      <front-products-list
        v-if="category.products.length"
        :items="category.products"
        :business-link="business.link"
      />
      <div v-else class="text-center py-8 text-gray-400">
        <p>هیچ محصولی در این دسته بندی وجود ندارد</p>
      </div>
    </div>
  </div>
</template>

<script>
import FrontHeader from "../../../components/front/header";
import FrontProductsList from "../../../components/front/productsList";
import FrontCategoryHeader from "../../../components/front/categoryHeader";
export default {
  name: "BusinessCategoryPage",
  components: {FrontCategoryHeader, FrontProductsList, FrontHeader},
  data() {
    return {
      business: null,
      category: null,
      loaded: false,
      baseUrl: process.env.storagePath,
    }
  },
  async fetch() {
    await this.$axios.$get('business/' + this.$route.params.business + '/' + this.$route.params.category)
      .then(response => {
        this.business = response.business
        this.category = response.category
        this.loaded = true
      })
      .catch(error => {
        this.$store.commit('notification/error',{message: error.response.data.message, code: error.response.status})
      })
  },
}
</script>
