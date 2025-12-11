<template>
  <div class="">
    <div class="bg-white rounded p-3 md:p-6">
      <div v-if="category" class="mb-8 flex flex-col gap-2 items-center">
        <div class="mx-2 md:mx-2">
          <img :src="`${baseUrl}${category.picture}`" alt="" class="w-14 h-14 rounded-full object-cover">
        </div>
        <div class="text-blue-450">
          {{ category.name }}
        </div>
      </div>
      <panel-business-search-general-products
        v-if="page === 'search'"
        @request="page = 'request'"
        @select="goToEditPage"
      />
      <panel-business-product-form
        v-if="page === 'request'"
        :category="category"
        :dateable="!!business.form.dateable"
        @click-prev="page = 'search'"
        @create="back"
        @close="back"
      />
      <panel-business-product-form
        v-if="page === 'form'"
        :general-product="selectedProduct"
        :category="category"
        :dateable="!!business.form.dateable"
        @click-prev="page = 'search'"
        @create="back"
        @close="back"
      />
    </div>
  </div>
</template>

<script>
import PanelBusinessProductForm from "~/components/panel/business/ProductForm.vue";
import PanelBusinessSearchGeneralProducts from "~/components/panel/business/SearchGeneralProducts.vue";

export default {
  components: {PanelBusinessSearchGeneralProducts, PanelBusinessProductForm},
  layout: 'panel',
  data() {
    return {
      open: false,
      business: null,
      category: null,
      page: 'search',
      selectedProduct: null,
      editingProductIndex: null,
      // products: [],
      baseUrl: process.env.storagePath,
    }
  },
  async fetch() {
    await this.$axios.$get('home/businesses/' + this.$route.params.id + '?products=1&categories=1')
      .then(response => {
        this.business = response.data
        this.category = response.data.categories.find((c) => c.id === +this.$route.params.cid)
      })
  },
  methods: {
    goToEditPage(product) {
      this.editingProductIndex = null
      this.selectedProduct = product
      this.page = 'form'
    },
    back(product) {
      this.$router.push(`/panel/businesses/${this.$route.params.id}/products`)
      // this.products.push(product)
      // this.editProduct(this.products.findIndex(x => x === product))
    },
  }
}

</script>
