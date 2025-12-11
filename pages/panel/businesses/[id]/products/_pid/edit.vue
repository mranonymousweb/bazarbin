<script>

import PanelBusinessProductForm from "~/components/panel/business/ProductForm.vue";

export default {
  components: {PanelBusinessProductForm},
  layout: 'panel',
  data() {
    return {
      product: null,
      business: null,
      category: null,
      page: 'search',
      selectedProduct: null,
      editingProductIndex: null,
      baseUrl: process.env.storagePath,
    }
  },
  async fetch() {
    await this.$axios.$get('home/product/' + this.$route.params.pid)
      .then(response => {
        this.product = response
        this.business = response.business
        this.category = response.category
      })
  },
}
</script>

<template>
  <div>
    <div class="bg-white rounded p-3 md:p-6">
      <div v-if="category" class="mb-8 flex flex-col gap-2 items-center">
        <div class="mx-2 md:mx-2">
          <img :src="`${baseUrl}${category.picture}`" alt="" class="w-14 h-14 rounded-full object-cover">
        </div>
        <div class="text-blue-450">
          {{ category.name }}
        </div>
      </div>
      <panel-business-product-form
        v-if="product"
        :product="product"
        :general-product="product.general"
        :category="category"
        :dateable="business && !!business.form.dateable"
        @create="$router.back()"
        @close="$router.back()"
      />
    </div>
  </div>
</template>
