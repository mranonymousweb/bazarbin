<template>
  <div class="mt-4 mb-8 category-products">
    <div>
      <NuxtLink
        :to="`/panel/businesses/${$route.params.id}/products/${category.id}/new`"
        class="cursor-pointer text-blue-450"
      >
        <i class="flaticon-043-plus"></i>
        <span>افزودن محصول</span>
      </NuxtLink>
    </div>

    <slide-down :open="open">
      <div class="pt-4">
        <div class="bg-white rounded p-3 md:p-6">
          <panel-business-search-general-products
            v-if="page === 'search'"
            @request="page = 'request'"
            @select="goToEditPage"
          />
          <panel-business-request-general-products
            v-if="page === 'request'"
            :category="category"
            @click-prev="page = 'search'"
          />
          <panel-business-product-form
            v-if="page === 'form'"
            :general-product="selectedProduct"
            :product="editingProductIndex !== null ? products[editingProductIndex] : null"
            :category="category"
            :dateable="dateable"
            @click-prev="page = 'search'"
            @create="addNewProduct"
            @update="updateProduct"
            @close="open = false"
          />
        </div>
      </div>
    </slide-down>

    <div v-if="products.length" class="grid gap-3 md:gap-4 mt-4 category-products">
      <div v-for="(product, index) in products" :key="product.id">
        <figure class="bg-white rounded overflow-hidden">
          <div class="image-wrapper relative w-full h-auto mb-1">
            <img v-if="product.picture" :src="`${baseUrl}${product.picture || product.general.picture}`" alt="" class="top-0 right-0 absolute w-full h-full rounded object-contain">
            <img v-else-if="product.general &&  product.general.picture" :src="`${baseUrl}${product.general.picture}`" alt="" class="top-0 right-0 absolute w-full h-full rounded object-contain">
          </div>
          <figcaption class="px-2 md:px-4 pb-2 md:pb-4">
            <h3 class="mb-3">{{ product.name || product.general.name }}</h3>

            <div class="flex justify-between items-center">

              <div class="flex items-center">
                <icons-solid-star class="text-gold w-6 h-6 ml-2"/>
                <span>{{ product.score }}</span>
              </div>

              <div class="flex items-center">
                <span>{{ product.likes }}</span>
                <i class="flaticon-053-heart mr-2"></i>
              </div>

              <div class="flex items-center">
                <span>{{ product.views }}</span>
                <i class="flaticon-057-eye mr-2"></i>
              </div>

            </div>

            <div class="flex justify-center mt-4">
              <edit-button label="ویرایش" class="mx-4" @click="editProduct(index)"/>
              <delete-button label="حذف" class="mx-4" @click="deleteProduct(index)"/>
            </div>
          </figcaption>
        </figure>
      </div>
    </div>

  </div>
</template>

<script>

import SlideDown from "../../SlideDown";
import EditButton from "../../EditButton";
import DeleteButton from "../../DeleteButton";
import PanelBusinessSearchGeneralProducts from "./SearchGeneralProducts";
import PanelBusinessRequestGeneralProducts from "./RequestGeneralProducts";
import PanelBusinessProductForm from "./ProductForm";
import errorParser from "~/mixins/error_parser";

export default {
  name: "PanelBusinessCategoryProducts",
  components: {
    DeleteButton,
    EditButton,
    PanelBusinessProductForm,
    PanelBusinessRequestGeneralProducts, PanelBusinessSearchGeneralProducts, SlideDown},
  mixins: [errorParser],
  props: {
    category: {
      type: Object,
      required: true
    },
    dateable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      open: false,
      page: 'search',
      selectedProduct: null,
      editingProductIndex: null,
      products: [],
      baseUrl: process.env.storagePath,
    }
  },
  created() {
    this.products = this.category.products || []
  },
  watch: {
    open(val) {
      if (!val) {
        this.page = 'search'
        this.editingProductIndex = null
      }
    }
  },
  methods: {
    goToEditPage(product) {
      this.editingProductIndex = null
      this.selectedProduct = product
      this.page = 'form'
    },
    addNewProduct(product) {
      this.products.push(product)
      this.editProduct(this.products.findIndex(x => x === product))
    },
    editProduct(index) {
      this.$router.push(`/panel/businesses/${this.$route.params.id}/products/${this.products[index].id}/edit`)

      /* this.selectedProduct = this.products[index].general
      this.editingProductIndex = index
      this.page = 'form'
      this.$nextTick(() => {
        this.open = true
      }) */
    },
    updateProduct(data) {
      const prodact = this.products[this.editingProductIndex]
      Object.keys(data).forEach(key => {
        prodact[key] = data[key]
      })
      this.open = false
      this.page = 'search'
    },
    deleteProduct(index) {
      this.$axios.$delete(`/home/product/${this.products[index].id}/delete`)
        .then(() => {
          this.products.splice(index, 1)
          this.$store.commit('notification/success', 'محصول با موفقیت حذف شد.')
        })
        .catch(error => {
          this.showError(error)
        })
    }
  }
}
</script>

<style lang="scss">
.category-products {
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
  }

  .image-wrapper {
    padding-top: 57.7%;
  }
}
</style>
