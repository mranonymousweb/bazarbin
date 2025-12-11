<template>
  <div class="text-sm md:text-base">
    <front-header class="mb-8"/>
    <div v-if="loaded">
      <front-product-header
        id="business-header"
        :item="product"
        class="mb-6"
        @change-liked="product.liked = !product.liked"
        @change-bookmarked="product.bookmarked = !product.bookmarked"
      />
      <div class="mb-6 flex justify-center">
        <button
          :class="[
                'px-2 lg:px-4 lg:py-1 ml-4 rounded flex items-center',
                type === 'product' ? 'bg-cyan-250 text-white' : 'border border-cyan-250 text-cyan-250'
              ]"
          @click="type = 'product'"
        >
          <i class="flaticon-032-briefcase text-lg ml-1"></i>
          فروشنده
        </button>
        <button
          :class="[
                'px-2 lg:px-4 lg:py-1 lg:ml-12 rounded flex items-center',
                type === 'general_product' ? 'bg-cyan-250 text-white' : 'border border-cyan-250 text-cyan-250'
              ]"
          @click="type = 'general_product'"
        >
          <i class="flaticon-063-picture text-lg ml-1"></i>
          محصول
        </button>
      </div>
      <front-comments
        :reviews="reviews"
        :scores="scores"
        :my-review="myReview"
        :item-id="itemId"
        :type="type"
        :filter="filter"
        :loading="loading"
        @submit-review="addMyReview"
        @edit-review="editMyReview"
        @filter="filterComments"
      />
    </div>
  </div>
</template>

<script>
import FrontHeader from "../../../../components/front/header";
import FrontProductHeader from "../../../../components/front/productHeader";
import FrontComments from "../../../../components/front/comments";
export default {
  name: "ProductCommentsPage",
  components: {FrontComments, FrontProductHeader, FrontHeader},
  data() {
    return {
      type: 'product',
      loaded: false,
      votePreview: -1,
      product: null,
      loading: false,
      filter: 0,
      form: {
        score: this.$route.query?.score || 0,
        comment: '',
      },
      baseUrl: process.env.storagePath,
    }
  },
  async fetch() {
    await this.$axios.$get('products/' + this.$route.params.product + '?page=comments')
      .then(response => {
        this.product = response.data
        this.loaded = true
      })
  },
  computed: {
    scores() {
      if (!this.loaded) return null

      if (this.type === 'product') {
        return [
          this.product.score_1,
          this.product.score_2,
          this.product.score_3,
          this.product.score_4,
          this.product.score_5,
        ]
      }

      return [
        this.product.general_score_1,
        this.product.general_score_2,
        this.product.general_score_3,
        this.product.general_score_4,
        this.product.general_score_5,
      ]
    },
    reviews() {
      if (!this.loaded) return null
      return this.type === 'product' ? this.product.reviews : this.product.general_reviews
    },
    myReview() {
      if (!this.loaded) return null
      return this.type === 'product' ? this.product.my_review : this.product.my_general_review
    },
    itemId() {
      if (!this.loaded) return null
      return this.type === 'product' ? this.product.id : this.product.general_id
    }
  },
  methods: {
    addMyReview(data) {
      if (this.type === 'product') {
        this.product.my_review = data
        this.product.reviews = [data, ...this.product.reviews]
      } else {
        this.product.my_general_review = data
        this.product.general_reviews = [data, ...this.product.general_reviews]
      }
    },
    editMyReview(data) {
      this.type === 'product'
        ? this.product.my_review = data
        : this.product.my_general_review = data

      const review = this.type === 'product'
        ? this.product.reviews.find(x => x.id === data.id)
        : this.product.general_reviews.find(x => x.id === data.id)

      if (review) {
        review.score = data.score
        review.comment = data.comment
        review.likes = data.likes
        review.liked = data.liked
      }
    },
    filterComments(val) {
      this.filter = val
      this.loading = true
      const url = val ? this.type + '/' + this.itemId + '/reviews?score='+val : this.type + '/' + this.itemId + '/reviews'
      this.$axios.$get(url)
        .then(response => {
          if (this.type === 'product') {
            this.product.reviews = response.data
            this.product.reviews_count = response.meta.total
            this.product.reviews_pages = response.meta.last_page
          } else {
            this.product.general_reviews = response.data
            this.product.general_reviews_count = response.meta.total
            this.product.general_reviews_pages = response.meta.last_page
          }
          this.loading = false
        })
        .catch(() => {this.loading = false})
    }
  }
}
</script>
