<template>
  <div>
    <div v-if="loaded">
      <div class="hidden lg:flex items-center bg-white rounded px-8 py-4">
        <img :src="baseUrl+item.avatar" alt="" class="w-24 h-24 rounded-full object-cover ml-9">
        <div class="flex-grow">
          <div class="flex mb-4">
            <h2 class="ml-12 font-medium">{{ item.firstname }} {{ item.lastname }}</h2>
            <div class="flex items-center">
              <icons-solid-star class="text-gold w-6 h-6 ml-2"/>
              <span>{{ item.score }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:hidden relative mt-12 text-sm pt-32 bg-white">
        <div class="flex flex-col items-center absolute w-full -top-8 right-2">
          <img :src="baseUrl+item.avatar" alt="" class="w-16 h-16 rounded-full object-cover mb-4">
          <h2 class="font-medium mb-4">{{ item.firstname }} {{ item.lastname }}</h2>
          <div class="flex justify-center items-center">
            <span>{{ item.score }}</span>
            <icons-solid-star class="text-gold w-6 h-6 mr-1"/>
          </div>
        </div>
      </div>

      <front-comments
        :reviews="item.reviews"
        :scores="scores"
        :my-review="item.my_review"
        :item-id="item.id"
        :filter="filter"
        :loading="loading"
        type="users"
        @submit-review="addMyReview"
        @edit-review="editMyReview"
        @filter="filterComments"
      />

    </div>
  </div>
</template>

<script>

export default {
  name: "UserCommentsPage",
  layout: 'panel',
  data() {
    return {
      item: null,
      loaded: false,
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
    await this.$axios.$get('home/users/' + this.$route.params.id + '?page=comments')
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
      const url = val ? 'home/users/' + this.item.id + '/reviews?score='+val : 'home/users/' + this.item.id + '/reviews'
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
