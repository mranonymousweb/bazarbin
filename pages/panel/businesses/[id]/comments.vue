<template>
  <div class="text-sm md:text-base">
    <div v-if="business">
      <panel-business-navigation :id="business.id" :has-category="business.has_category"/>
      <div v-if="!business.reviews.length" class="text-center pt-8">
        <i class="flaticon-016-sad text-5xl"></i>
        <div class="font-semibold mt-4">
          هیچ نظری برای این کسب و کار شما ثبت نشده است.
        </div>
      </div>
      <div v-else class="bg-white rounded mt-4 p-2 md:p-8">
        <div v-for="(review, index) in business.reviews" :key="review.id" :class="['flex text-sm', index + 1 < business.reviews.length ? 'mb-8 md:mb-12' : '']">
          <div class="flex-shrink-0">
            <img :src="baseUrl+review.user.avatar" alt="" class="w-10 h-10 md:w-20 md:h-20 ml-1.5 md:ml-9 rounded-full object-cover">
          </div>
          <div class="w-1/2 flex-grow md:flex-grow-0">
            <div class="mb-1 md:mb-2 flex justify-between">
              <span class="font-medium text-gray-500 text-xs md:text-base">{{ review.user.firstname }} {{ review.user.lastname }}</span>
              <span v-if="review.product" class="font-medium text-xs md:text-base">{{ review.product.name || review.product.general.name }}</span>
            </div>
            <div class="bg-coolGray-200 rounded-b-lg rounded-tl-lg md:rounded-b-2xl md:rounded-tl-2xl px-1.5 py-1 md:py-6 md:px-10 flex flex-wrap md:flex-nowrap">
              <div class="flex-grow md:pl-8" v-html="review.comment.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2')"></div>
              <div class="w-full mt-2 flex justify-end flex-shrink-0 items-center md:items-end">
                <div class="flex items-center ml-4 md:ml-8 text-xs md:text-base">
                  <svg class="w-5 h-5 ml-2 text-gold" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                  </svg>
                  <span>{{ review.score }}</span>
                </div>
                <time class="text-gray-500 text-xs md:text-base">{{ formatDate(review.date, 'jYYYY/jMM/jDD') }}</time>
              </div>
            </div>
          </div>
          <div v-if="review.product" class="mr-1.5 md:mr-8">
            <img :src="baseUrl+(review.product.picture || review.product.general.picture)" alt="" class="w-12 h-8 md:w-28 md:h-18 rounded object-contain md:ml-9">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "../../../../mixins/moment";

export default {
  mixins: [moment],
  layout: 'panel',
  data() {
    return {
      business: null,
      items: [],
      baseUrl: process.env.storagePath
    }
  },
  async fetch() {
    await this.$axios.$get('home/businesses/' + this.$route.params.id + '?reviews=1')
      .then(response => {
        this.business = response.data
      })
  },
}
</script>
