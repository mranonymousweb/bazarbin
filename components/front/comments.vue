<template>
  <div class="text-sm md:text-base mt-4">
    <div class="flex flex-wrap lg:flex-nowrap">
      <div class="w-full lg:w-8/12 lg:pl-4 mb-4 lg:mb-0">
        <div class="bg-white rounded p-4">

          <div class="lg:hidden text-center mb-4">
            <div>امتیاز دهید</div>
            <div class="text-gray-300 flex justify-evenly my-4 mx-14" dir="ltr" @mouseleave="votePreview = -1">
              <svg
                v-for="i in 5"
                :key="i"
                :class="['w-7 h-7 cursor-pointer mx-0.5', votePreview >= 0 && votePreview >= i || votePreview === -1 && form.score >= i ? 'text-gold' : '']"
                viewBox="0 0 24 24"
                fill="currentColor"
                @mouseover="votePreview = i"
                @click="form.score = i"
              >
                <path v-if="votePreview >= 0 && votePreview >= i || votePreview === -1 && form.score >= i" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                <path v-else d="M12 5.173l2.335 4.817 5.305.732-3.861 3.71.942 5.27-4.721-2.524-4.721 2.525.942-5.27-3.861-3.71 5.305-.733 2.335-4.817zm0-4.586l-3.668 7.568-8.332 1.151 6.064 5.828-1.48 8.279 7.416-3.967 7.416 3.966-1.48-8.279 6.064-5.827-8.332-1.15-3.668-7.569z"/>
              </svg>
            </div>
          </div>

          <Input
            v-model="form.comment"
            type="textarea"
            rows="6"
            placeholder="نظر خود را در مورد این کسب و کار بنویسید"
          />
          <div class="hidden lg:flex items-center mt-4">
            <span>امتیاز دهید: </span>
            <div class="text-gray-300 flex justify-evenly my-4 mx-14" dir="ltr" @mouseleave="votePreview = -1">
              <svg
                v-for="i in 5"
                :key="i"
                :class="['w-7 h-7 cursor-pointer mx-0.5', votePreview >= 0 && votePreview >= i || votePreview === -1 && form.score >= i ? 'text-gold' : '']"
                viewBox="0 0 24 24"
                fill="currentColor"
                @mouseover="votePreview = i"
                @click="form.score = i"
              >
                <path v-if="votePreview >= 0 && votePreview >= i || votePreview === -1 && form.score >= i" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                <path v-else d="M12 5.173l2.335 4.817 5.305.732-3.861 3.71.942 5.27-4.721-2.524-4.721 2.525.942-5.27-3.861-3.71 5.305-.733 2.335-4.817zm0-4.586l-3.668 7.568-8.332 1.151 6.064 5.828-1.48 8.279 7.416-3.967 7.416 3.966-1.48-8.279 6.064-5.827-8.332-1.15-3.668-7.569z"/>
              </svg>
            </div>
            <span class="flex-grow"></span>
            <div class="w-1/3">
              <button class="bg-blue-450 text-white rounded py-2 w-full" @click="submit">
                <span v-if="myReview">ویرایش نظر</span>
                <span v-else>ثبت نظر</span>
              </button>
            </div>
          </div>
          <div class="mt-4 lg:hidden">
            <button class="bg-blue-450 text-white rounded py-2 w-8/12 block mx-auto" @click="submit">
              <span v-if="myReview">ویرایش نظر</span>
              <span v-else>ثبت نظر</span>
            </button>
          </div>
        </div>
      </div>
      <div class="w-full lg:w-4/12">
        <div class="bg-white rounded p-4 lg:px-8 h-full" dir="ltr">
          <div v-for="i in 5" :key="i" :class="['flex w-100 items-center leading-none cursor-pointer', i < 5 ? 'mb-4 lg:mb-6' : '']" @click="$emit('filter', 6 - i)">
            <span class="w-6">{{6 - i}}</span>
            <svg class="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
            </svg>
            <div class="flex-grow h-2 w-60 bg-gray-200 rounded-full mx-6">
              <div class="h-2 rounded-full bg-gold" :style="{width: scoresPercent[5-i] +'%'}"></div>
            </div>
            <span class="w-8">{{ scoresPercent[5-i] }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="bg-white rounded mt-4 lg:p-8 p-4">
      <div v-if="filter" class="mb-8 flex">
        <div class="bg-purple-100 rounded-xl px-2 py-1.5 text-xs flex items-center">
          <b class="pl-1">فیلتر:</b>
          <span class="pl-2">{{ filter }} ستاره</span>
          <button type="button" @click="$emit('filter',0)">
            <IconsOutlineX class="w-5 h-5 text-red-500 cursor-pointer" />
          </button>
        </div>
      </div>
      <div class="flex justify-center my-12">
        <span class="loader w-8 h-8 border-2 rounded-full border-blue-300"></span>
      </div>
    </div>

    <div v-else-if="reviews && reviews.length" class="bg-white rounded mt-4 lg:p-8 p-4">
      <div v-if="filter" class="mb-8 flex">
        <div class="bg-purple-100 rounded-xl px-2 py-1.5 text-xs flex items-center">
          <b class="pl-1">فیلتر:</b>
          <span class="pl-2">{{ filter }} ستاره</span>
          <button type="button" @click="$emit('filter',0)">
            <IconsOutlineX class="w-5 h-5 text-red-500 cursor-pointer" />
          </button>
        </div>
      </div>
      <div v-for="review in reviews" :key="review.id" class="mb-6 lg:mb-12">
        <div class="flex">
          <div class="flex-shrink-0">
            <img :src="baseUrl+review.avatar" alt="" class="w-12 h-12 lg:w-20 lg:h-20 rounded-full object-cover lg:ml-9 ml-2">
          </div>
          <div class="w-auto lg:w-1/2">
            <div class="mb-2 lg:mb-4">{{ review.name }}</div>
            <div class="bg-coolGray-200 rounded-b-2xl rounded-tl-2xl p-3 lg:py-6 lg:px-10 lg:flex">
              <div class="lg:hidden flex mb-1">
                <div class="flex items-center ml-4">
                  <svg class="w-4 h-4 ml-2 text-gold" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                  </svg>
                  <span>{{ review.score }}</span>
                </div>
                <time class="lg:hidden text-gray-500">{{ formatDate(review.date, 'jYYYY/jMM/jDD') }}</time>
              </div>
              <div class="flex-grow lg:pl-8" v-html="review.comment.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2')"></div>
              <div class="hidden lg:flex mt-2 justify-end flex-shrink-0 items-end">
                <div class="flex items-center ml-8">
                  <svg class="w-5 h-5 ml-2 text-gold" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                  </svg>
                  <span>{{ review.score }}</span>
                </div>
                <time class="text-gray-500">{{ formatDate(review.date, 'jYYYY/jMM/jDD') }}</time>
              </div>
            </div>
          </div>
          <div class="hidden lg:flex items-end mr-8">
            <span class="">{{ review.likes }}</span>
            <button @click="like(review)">
              <svg :fill="review.liked ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" class="text-red-550 w-6 h-6 mr-2">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>
            <button
              class="flex items-center text-sm mr-4 text-gray-500"
              @click="report(review.id)"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM19 14.9L14.9 19H9.1L5 14.9V9.1L9.1 5h5.8L19 9.1v5.8z"/>
                <circle cx="12" cy="16" r="1"/>
                <path d="M11 7h2v7h-2z"/>
              </svg>
              <span class="mr-1">گزارش تخلف</span>
            </button>
          </div>
        </div>
        <div class="lg:hidden flex justify-end mt-1">
          <div class="flex items-end mr-8">
            <span class="">{{ review.likes }}</span>
            <button @click="like(review)">
              <svg :fill="review.liked ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" class="text-red-550 w-5 h-5 mr-2">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>
            <button
              class="flex items-center text-sm mr-4 text-gray-500"
              @click="report(review.id)"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM19 14.9L14.9 19H9.1L5 14.9V9.1L9.1 5h5.8L19 9.1v5.8z"/>
                <circle cx="12" cy="16" r="1"/>
                <path d="M11 7h2v7h-2z"/>
              </svg>
              <span class="mr-1">گزارش تخلف</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded mt-4 lg:p-8 p-4">
      <div v-if="filter" class="mb-8 flex">
        <div class="bg-purple-100 rounded-xl px-2 py-1.5 text-xs flex items-center">
          <b class="pl-1">فیلتر:</b>
          <span class="pl-2">{{ filter }} ستاره</span>
          <button type="button" @click="$emit('filter',0)">
            <IconsOutlineX class="w-5 h-5 text-red-500 cursor-pointer" />
          </button>
        </div>
      </div>
      <div class="flex justify-center my-12">هیچ نظری یافت نشد</div>
    </div>

    <ReportModal
      :id="reportId"
      :subject="type + '_review'"
      :open="reportModal"
      @close="reportModal = false"
    />

  </div>
</template>

<script>
import moment from "../../mixins/moment";
import errorParser from "../../mixins/error_parser";
import IconsOutlineX from "../icons/outline/x";
import ReportModal from "../ReportModal.vue";

export default {
  name: "FrontComments",
  components: {ReportModal, IconsOutlineX},
  mixins: [moment, errorParser],
  props: {
    reviews: {
      type: Array,
      required: true
    },
    scores: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    itemId: {
      type: Number,
      required: true
    },
    filter: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    },
    myReview: {
      type: Object,
      default: null
    },
  },
  data() {
    return {
      votePreview: -1,
      form: {
        score: this.$route.query?.score || 0,
        comment: '',
      },
      baseUrl: process.env.storagePath,
      reportId: 0,
      reportModal: false,
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters["user/loggedIn"]
    },
    scoreTotal() {
      return this.scores.reduce((a, b) => a + b, 0)
    },
    scoresPercent() {
      if (!this.scoreTotal) {
        return [0,0,0,0,0]
      }

      return [
        +(this.scores[0] * 100 / this.scoreTotal).toFixed(1),
        +(this.scores[1] * 100 / this.scoreTotal).toFixed(1),
        +(this.scores[2] * 100 / this.scoreTotal).toFixed(1),
        +(this.scores[3] * 100 / this.scoreTotal).toFixed(1),
        +(this.scores[4] * 100 / this.scoreTotal).toFixed(1),
      ]
    }
  },
  watch: {
    myReview(val) {
      this.form.comment = val ? val.comment : ''
      this.form.score = val ? val.score : 0
    }
  },
  created() {
    if (this.myReview) {
      this.form.comment = this.myReview.comment
      this.form.score = this.myReview.score
    }
  },
  methods: {
    submit() {
      if (!this.loggedIn) {
        alert('برای ثبت نظر لازم است به حساب کاربری خود وارد شوید.')
        return;
      }
      const url = this.myReview
        ? `${this.type === 'users' ? '/home' : ''}/${this.type}/reviews/${this.myReview.id}`
        : `${this.type === 'users' ? '/home' : ''}/${this.type}/${this.itemId}/reviews`
      const data = this.myReview
        ? {...this.form, _method: 'put'}
        : this.form
      this.$axios.$post(url, data)
        .then(response => {
          this.$store.commit(
            'notification/success',
            'نظر شما با موفقیت ثبت شد.'
          )
          this.myReview
            ? this.$emit('edit-review', response.data)
            : this.$emit('submit-review', response.data)
        })
        .catch(response => {
          this.showError(response)
        })
    },
    like(review) {
      if (!this.loggedIn) {
        alert('برای لایک لازم است به حساب کاربری خود وارد شوید.')
        return;
      }
      const action = review.liked ? 'unlike' : 'like'
      this.$axios.$get(`${this.type === 'users' ? '/home' : ''}/${this.type}/reviews/${review.id}/like?action=${action}`)
        .then(response => {
          review.liked = !review.liked
          review.likes = response.likes
          this.$store.commit(
            'notification/success',
            review.liked
              ? 'امتیاز شما ثبت شد.'
              : 'امتیاز شما حذف شد.'
          )
        })
    },
    report(id) {
      this.reportId = id
      this.reportModal = true
    }
  }
}
</script>
