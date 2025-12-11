<template>
  <div class="text-sm sm:text-base">
    <front-header class="mb-8"/>
    <div v-if="loaded">
      <front-business-header
        id="business-header"
        :item="item"
        @change-liked="item.liked = !item.liked"
        @change-bookmarked="item.bookmarked = !item.bookmarked"
      />
      <front-comments
        :reviews="item.reviews"
        :scores="scores"
        :my-review="item.my_review"
        :item-id="item.id"
        :filter="filter"
        :loading="loading"
        type="business"
        @submit-review="addMyReview"
        @edit-review="editMyReview"
        @filter="filterComments"
      />
    </div>
  </div>
</template>

<script>
import FrontHeader from "../../components/front/header";
import FrontComments from "../../components/front/comments";
import FrontBusinessHeader from "../../components/front/business/header";
import moment from "../../mixins/moment";

export default {
  name: "BusinessCommentsPage",
  components: {FrontComments, FrontBusinessHeader, FrontHeader},
  mixins: [moment],
  data() {
    return {
      item: null,
      loaded: false,
      loading: false,
      filter: 0,
      votePreview: -1,
      form: {
        score: this.$route.query?.score || 0,
        comment: '',
      },
      baseUrl: process.env.storagePath,
    }
  },
  async fetch() {
    await this.$axios.$get('business/' + this.$route.params.business + '?page=comments')
      .then(response => {
        this.item = response.data
        if (this.item.my_review) {
          this.form.comment = this.item.my_review.comment
          this.form.score = this.item.my_review.score
        }
        this.loaded = true
      })
  },
  computed: {
    scoreTotal() {
      return this.item.score_1 + this.item.score_2 + this.item.score_3 + this.item.score_4 + this.item.score_5
    },
    scores() {
      if (!this.loaded) return null

      return [
        this.item.score_1,
        this.item.score_2,
        this.item.score_3,
        this.item.score_4,
        this.item.score_5,
      ]
    }
  },
  methods: {
    addMyReview(data) {
      this.item.my_review = data
      this.item.reviews = [data, ...this.item.reviews]
    },
    editMyReview(data) {
      this.item.my_review = data
      const review = this.item.reviews.find(x => x.id === data.id)
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
      const url = val ? 'business/' + this.item.id + '/reviews?score='+val : 'business/' + this.item.id + '/reviews'
      this.$axios.$get(url)
        .then(response => {
          this.item.reviews = response.data
          this.item.reviews_count = response.meta.total
          this.item.reviews_pages = response.meta.last_page
          this.loading = false
        })
        .catch(() => {this.loading = false})
    }
  }
}
</script>
