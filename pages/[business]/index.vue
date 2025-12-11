<template>
  <div class="business-page text-sm sm:text-base">
    <FrontHeader v-if="!page" class="mb-8"/>

    <div v-if="loaded">
      <div v-if="page === 'images'">
        <div class="mb-8 mt-4 mx-4">
          <button class="flex items-center" @click="closeGallery">
            <i class="flaticon-065-right-arrow-1 ml-4"></i>
          </button>
        </div>
        <Gallery v-if="item.gallery && item.gallery.length" :gallery="item.gallery"/>
      </div>

      <div v-else-if="page === 'description'">
        <div class="mb-8 mt-4 mx-4">
          <button class="flex items-center" @click="closeDescription">
            <i class="flaticon-065-right-arrow-1 ml-4"></i>
          </button>
        </div>
        <p class="whitespace-pre-wrap">{{ item.description }}</p>
      </div>

      <div v-else>
        <div class="lg:bg-white lg:p-6 lg:rounded">
          <FrontBusinessHeader
            id="business-header"
            :item="item"
            @click-avatar="showGallery"
            @change-liked="item.liked = !item.liked"
            @change-bookmarked="item.bookmarked = !item.bookmarked"
          />

          <div class="flex flex-col">
            <div class="mt-6 multiline-truncate text-lines-3 lg:order-2">
              {{ item.description }}
            </div>
            <div class="flex justify-between lg:justify-end lg:order-3 mt-4 text-gray-400 font-medium">
              <div class="lg:hidden">
                تاریخ عضویت:
                {{ formatDate(item.created_at, 'jYYYY/jMM/jDD') }}
              </div>
              <button
                class="flex items-center gap-1"
                @click="showDescription"
              >
                <span>بیشتر</span>
                <IconsSolidChevronLeft
                  class="w-3.5"
                />
              </button>
            </div>
            <div class="flex flex-wrap justify-between mt-8">
              <FrontBusinessIcons
                v-if="loaded"
                class="w-full lg:w-1/3 lg:order-2"
                :item="item"
                @click-bookmark="bookmark"
              />

              <div class="w-full lg:w-1/3 flex mt-6 lg:mt-0">
                <div class="w-1/2 pl-2">
                  <button
                    :class="['block w-full text-center py-2', item.liked ? 'bg-blue-450 text-white' : 'bg-blueGray-150']"
                    @click="like"
                  >
                    مشتری
                  </button>
                </div>
                <div class="w-1/2 pr-2">
                  <button class="block w-full text-center py-2 bg-blueGray-150" @click="showInformation">
                    اطلاعات تماس
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!item.form.show_in_index">
          <p class="hidden lg:block border-b border-blueGray-300 mt-12 mb-12 h-4 text-gray-700 font-medium">
            <span class="bg-gray-50 pl-4">دسته بندی</span>
          </p>
          <div class="categories grid gap-x-3 gap-y-2 lg:gap-x-6 lg:gap-y-6 mt-6">
            <div
              v-for="category in item.categories"
              :key="category.id"
            >
              <figure class="lg:bg-white lg:rounded overflow-hidden">
                <div class="bg-white rounded image-wrapper relative w-full h-auto mb-2 lg:mb-6">
                  <nuxt-link :to="`/${$route.params.business}/${category.id}`" class="block">
                    <img
                      :src="baseUrl+category.picture"
                      :alt="category.name"
                      class="top-0 right-0 absolute w-full h-full rounded object-cover lg:object-contain">
                  </nuxt-link>
                </div>
                <figcaption class="px-2 lg:px-6 lg:pb-4">
                  <h3 class="lg:text-lg font-medium text-gray-700 lg:mb-4">{{ category.name }}</h3>
                  <div class="hidden lg:block text-left">
                    <nuxt-link
                      :to="`/${$route.params.business}/${category.id}`"
                      class="text-cyan-250"
                    >
                      بیشتر
                      <i class="flaticon-115-left-arrow font-bold pr-2"></i>
                    </nuxt-link>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap lg:flex-nowrap mt-4">
          <div class="w-full lg:pl-4 order-2 lg:order-1">
            <div v-if="item.form.show_in_index" class="mb-4 bg-white p-8 pt-20 rounded">
              <div class="flex">
                <div class="w-2/4 flex-shrink-0 p-4">
                </div>
                <div class="w-1/6 flex-shrink-0"></div>
                <div class="w-1/2">
                  <nuxt-link :to="`/${item.link}/appointment`" class="w-full block text-center bg-blue-450 text-white rounded py-2">
                    {{ item.form.submit_text }}
                  </nuxt-link>
                </div>
              </div>
            </div>
            <div ref="information" class="bg-white">
              <Tabs :tabs="tabs" :active="tab" active-tab-class="font-medium" @click="tab = $event"/>
              <div>

                <div v-if="tab === 'services'" class="services relative flex justify-between items-end p-8 pt-12">
                  <ul
                    class="text-gray-500 ml-4 pr-8 overflow-hidden transition-all whitespace-nowrap"
                    :style="{'height': servicesOpen ? services.length * 40 +'px' : '120px'}"
                  >
                    <li v-for="service in services" :key="service" class="py-2">{{ service }}</li>
                  </ul>
                  <div>
                    <button
                      v-if="services.length > 3"
                      class="text-cyan-250 flex items-center"
                      @click="servicesOpen = !servicesOpen"
                    >
                      <span v-if="servicesOpen">کمتر</span>
                      <span v-else>بیشتر</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="6" viewBox="0 0 8 13.429" class="mr-2">
                        <path
                          d="M9.258,12.563l5.43-5.43a1.281,1.281,0,1,1,1.819,1.806l-4.534,4.534,4.534,4.534a1.281,1.281,0,0,1-1.819,1.806l-5.43-5.43a1.281,1.281,0,0,1,0-1.819Z"
                          transform="translate(-8.879 -6.754)" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                  <span v-if="item.discount" class="hidden lg:block absolute bg-red-550 text-white p-4 rounded-t-2xl rounded-br-2xl left-8 top-8">
                    {{ item.discount }}% تخفیف
                  </span>
                </div>

                <div v-if="tab === 'contacts'" class="contacts flex justify-between items-end p-8 pt-12">
                  <ul
                    class="text-gray-500 ml-4 pr-8 overflow-hidden transition-all whitespace-nowrap"
                    :style="{'height': contactsOpen ? contacts.length * 40 +'px' : '120px'}"
                  >
                    <li v-for="contact in contacts" :key="contact.value" class="py-2">
                      <a :href="contact.link">{{ contact.title }}: {{ contact.value }}</a>
                    </li>
                  </ul>
                  <div>
                    <button
                      v-if="contacts.length > 3"
                      class="text-cyan-250 flex items-center"
                      @click="contactsOpen = !contactsOpen"
                    >
                      <span v-if="contactsOpen">کمتر</span>
                      <span v-else>بیشتر</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="6" viewBox="0 0 8 13.429" class="mr-2">
                        <path
                          d="M9.258,12.563l5.43-5.43a1.281,1.281,0,1,1,1.819,1.806l-4.534,4.534,4.534,4.534a1.281,1.281,0,0,1-1.819,1.806l-5.43-5.43a1.281,1.281,0,0,1,0-1.819Z"
                          transform="translate(-8.879 -6.754)" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div v-if="tab === 'description'" class="contacts flex justify-between items-end p-8 pt-12">
                  {{ item.description }}
                </div>

                <div v-if="tab === 'workTime'" class="contacts flex justify-between items-end p-8 pt-12">
                  {{ item.active_hour }}
                </div>

              </div>
            </div>
            <div class="mt-4 bg-white p-4 rounded">
              <div class="lg:hidden">
                <p class="border-b border-blueGray-300 mb-6 h-3 text-gray-700 font-medium">
                  <span class="bg-white pl-4">آدرس</span>
                </p>
                <p class="text-gray-500 mb-8">{{ item.address }}</p>
              </div>
              <div ref="map" class="w-full h-72"></div>
              <p class="hidden lg:block address text-gray-500 pr-8 mt-4">{{ item.address }}</p>
            </div>
          </div>
          <div class="hidden w-full lg:w-5/12 order-1 mb-4 lg:mb-0 relative bg-white rounded-xl">
            <gallery v-if="item.gallery && item.gallery.length" :gallery="item.gallery"/>
            <span v-if="item.discount" class="lg:hidden absolute bg-red-550 text-white p-2 rounded-tl-xl rounded-br-xl left-2 top-2 sm:left-4 sm:top-4">
              {{ item.discount }}% تخفیف
            </span>

            <div id="mobile-action-btns" class="lg:hidden flex px-2 sm:px-4 pb-4 justify-end">
              <button
                class="mx-2 inline-block"
              >
                <svg width="24" height="24" viewBox="0 0 20 22" fill="none" stroke="currentColor">
                  <path d="M10 6.75V12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M0.919922 7.58003C0.919922 6.46003 1.51993 5.41999 2.48993 4.84999L8.42993 1.42C9.39993 0.86 10.6 0.86 11.58 1.42L17.52 4.84999C18.49 5.40999 19.09 6.45003 19.09 7.58003V14.42C19.09 15.54 18.49 16.58 17.52 17.15L11.58 20.58C10.61 21.14 9.40993 21.14 8.42993 20.58L2.48993 17.15C1.51993 16.59 0.919922 15.55 0.919922 14.42V11.66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10 15.2V15.2999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>

              <popover
                tag="button"
                anchor="#mobile-action-btns"
                top="2rem"
                left="6rem"
                class="mx-2"
              >
                <template #activator>
                  <i class="flaticon-086-qr-code text-2xl"></i>
                </template>
                <div class="bg-white shadow border rounded py-8 px-8">
                  <div class="flex justify-center mb-4">
                    <img v-if="qrImage" :src="qrImage" alt="" style="width: 100px" @click="openQr">
                  </div>
                </div>
              </popover>

              <popover
                ref="shareBtn"
                tag="button"
                anchor="#mobile-action-btns"
                top="2rem"
                left="-1rem"
                class="mx-2"
              >
                <template #activator>
                  <i class="flaticon-009-share text-2xl"></i>
                </template>

                <div class="bg-white shadow border rounded py-4 px-4 w-screen">
                  <div class="mb-4 text-center">به اشتراک بگذارید</div>
                  <div class="flex justify-center flex-wrap gap-4">
                    <a :href="`https://telegram.me/share/url?url=${fullPageLink}&text=${item.name}`" target="_blank" class="w-10 h-10" @click="$refs.shareBtn.active = false">
                      <svg class="w-10 h-10" viewBox="0 0 47 47">
                        <g fill="none" fill-rule="evenodd" transform="translate(-4 -4)">
                          <polygon points="0 55 0 0 55 0 55 55"/>
                          <g fill-rule="nonzero" transform="translate(4.477 4.477)">
                            <circle cx="23.023" cy="23.023" r="22.917" fill="#37AEE2"/>
                            <path fill="#FFF" d="M34.4242985,12.7107558 L30.1320058,34.6259631 C30.1320058,34.6259631 29.9475256,35.6274203 28.7054433,35.6274203 C28.0454433,35.6274203 27.7051308,35.3134631 27.7051308,35.3134631 L18.4078381,27.5985683 L13.8588808,25.3057558 L8.02086105,23.7531506 C8.02086105,23.7531506 6.98159128,23.4529433 6.98159128,22.5935683 C6.98159128,21.8774235 8.05065378,21.5359631 8.05065378,21.5359631 L32.475236,11.8330453 C32.4740913,11.8319006 33.2211735,11.5637756 33.7654433,11.5649167 C34.1000256,11.5649167 34.4815913,11.7081506 34.4815913,12.1378381 C34.4815913,12.4242953 34.4242953,12.7107558 34.4242953,12.7107558 L34.4242985,12.7107558 Z"/>
                            <path fill="#B0BEC5" d="M21.8774235,30.4769006 L17.9517985,34.3429433 C17.9517985,34.3429433 17.7810683,34.4747131 17.5530485,34.4804433 C17.473986,34.482736 17.3891933,34.4701308 17.302111,34.4311735 L18.4066933,27.5962788 L21.8774235,30.4769006 Z"/>
                            <path fill="#CFD8DC" d="M29.780236,16.3728381 C29.5865913,16.1207558 29.2290913,16.0749203 28.9770058,16.2662756 L13.8565881,25.3149203 C13.8565881,25.3149203 16.2697131,32.0661703 16.6375256,33.2349203 C17.0064828,34.4048151 17.3021078,34.4323151 17.3021078,34.4323151 L18.4066901,27.5974203 L29.6725224,17.1749203 C29.9246047,16.9835651 29.9715849,16.6249203 29.7802297,16.3728381 L29.780236,16.3728381 Z"/>
                          </g>
                        </g>
                      </svg>
                    </a>

                    <a :href="`https://wa.me/?text=${fullPageLink}`" target="_blank" class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: #25D366" @click="$refs.shareBtn.active = false">
                      <svg fill="#fff" class="w-8 h-8" viewBox="0 0 40 40">
                        <path d="m25 21.7q0.3 0 2.2 1t2 1.2q0 0.1 0 0.3 0 0.8-0.4 1.7-0.3 0.9-1.6 1.5t-2.2 0.6q-1.3 0-4.3-1.4-2.2-1-3.8-2.6t-3.3-4.2q-1.6-2.3-1.6-4.3v-0.2q0.1-2 1.7-3.5 0.5-0.5 1.2-0.5 0.1 0 0.4 0t0.4 0.1q0.4 0 0.6 0.1t0.3 0.6q0.2 0.5 0.8 2t0.5 1.7q0 0.5-0.8 1.3t-0.7 1q0 0.2 0.1 0.3 0.7 1.7 2.3 3.1 1.2 1.2 3.3 2.2 0.3 0.2 0.5 0.2 0.4 0 1.2-1.1t1.2-1.1z m-4.5 11.9q2.8 0 5.4-1.1t4.5-3 3-4.5 1.1-5.4-1.1-5.5-3-4.5-4.5-2.9-5.4-1.2-5.5 1.2-4.5 2.9-2.9 4.5-1.2 5.5q0 4.5 2.7 8.2l-1.7 5.2 5.4-1.8q3.5 2.4 7.7 2.4z m0-30.9q3.4 0 6.5 1.4t5.4 3.6 3.5 5.3 1.4 6.6-1.4 6.5-3.5 5.3-5.4 3.6-6.5 1.4q-4.4 0-8.2-2.1l-9.3 3 3-9.1q-2.4-3.9-2.4-8.6 0-3.5 1.4-6.6t3.6-5.3 5.3-3.6 6.6-1.4z"></path>
                      </svg>
                    </a>

                    <a :href="`https://www.linkedin.com/shareArticle?mini=true&url=${fullPageLink}&title=${item.name}&summary=${item.description}&source=`" target="_blank" class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: #0e76a8" @click="$refs.shareBtn.active = false">
                      <svg class="w-8 h-8" fill="#fff" viewBox="0 0 40 40">
                        <path d="m13.3 31.7h-5v-16.7h5v16.7z m18.4 0h-5v-8.9c0-2.4-0.9-3.5-2.5-3.5-1.3 0-2.1 0.6-2.5 1.9v10.5h-5s0-15 0-16.7h3.9l0.3 3.3h0.1c1-1.6 2.7-2.8 4.9-2.8 1.7 0 3.1 0.5 4.2 1.7 1 1.2 1.6 2.8 1.6 5.1v9.4z m-18.3-20.9c0 1.4-1.1 2.5-2.6 2.5s-2.5-1.1-2.5-2.5 1.1-2.5 2.5-2.5 2.6 1.2 2.6 2.5z"></path>
                      </svg>
                    </a>

                    <a :href="`mailto:?body=${fullPageLink}`" target="_blank" class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: #7d7d7d" @click="$refs.shareBtn.active = false">
                      <svg class="w-8 h-8" fill="#fff" viewBox="0 0 40 40">
                        <path d="m33.4 13.4v-3.4l-13.4 8.4-13.4-8.4v3.4l13.4 8.2z m0-6.8q1.3 0 2.3 1.1t0.9 2.3v20q0 1.3-0.9 2.3t-2.3 1.1h-26.8q-1.3 0-2.3-1.1t-0.9-2.3v-20q0-1.3 0.9-2.3t2.3-1.1h26.8z"></path>
                      </svg>
                    </a>

                    <a :href="`https://twitter.com/intent/tweet?text=${fullPageLink}`" target="_blank" class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: #1DA1F2" @click="$refs.shareBtn.active = false">
                      <svg class="w-8 h-8" fill="#fff" viewBox="0 0 40 40">
                        <path d="m31.5 11.7c1.3-0.8 2.2-2 2.7-3.4-1.4 0.7-2.7 1.2-4 1.4-1.1-1.2-2.6-1.9-4.4-1.9-1.7 0-3.2 0.6-4.4 1.8-1.2 1.2-1.8 2.7-1.8 4.4 0 0.5 0.1 0.9 0.2 1.3-5.1-0.1-9.4-2.3-12.7-6.4-0.6 1-0.9 2.1-0.9 3.1 0 2.2 1 3.9 2.8 5.2-1.1-0.1-2-0.4-2.8-0.8 0 1.5 0.5 2.8 1.4 4 0.9 1.1 2.1 1.8 3.5 2.1-0.5 0.1-1 0.2-1.6 0.2-0.5 0-0.9 0-1.1-0.1 0.4 1.2 1.1 2.3 2.1 3 1.1 0.8 2.3 1.2 3.6 1.3-2.2 1.7-4.7 2.6-7.6 2.6-0.7 0-1.2 0-1.5-0.1 2.8 1.9 6 2.8 9.5 2.8 3.5 0 6.7-0.9 9.4-2.7 2.8-1.8 4.8-4.1 6.1-6.7 1.3-2.6 1.9-5.3 1.9-8.1v-0.8c1.3-0.9 2.3-2 3.1-3.2-1.1 0.5-2.3 0.8-3.5 1z"></path>
                      </svg>
                    </a>

                    <a :href="`https://pinterest.com/pin/create/button/?url=${fullPageLink}&media=${baseUrl+item.avatar}&description=${item.name}`" target="_blank" class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: #E60023" @click="$refs.shareBtn.active = false">
                      <svg class="w-8 h-8" fill="#fff" viewBox="0 0 40 40">
                        <path d="m37.3 20q0 4.7-2.3 8.6t-6.3 6.2-8.6 2.3q-2.4 0-4.8-0.7 1.3-2 1.7-3.6 0.2-0.8 1.2-4.7 0.5 0.8 1.7 1.5t2.5 0.6q2.7 0 4.8-1.5t3.3-4.2 1.2-6.1q0-2.5-1.4-4.7t-3.8-3.7-5.7-1.4q-2.4 0-4.4 0.7t-3.4 1.7-2.5 2.4-1.5 2.9-0.4 3q0 2.4 0.8 4.1t2.7 2.5q0.6 0.3 0.8-0.5 0.1-0.1 0.2-0.6t0.2-0.7q0.1-0.5-0.3-1-1.1-1.3-1.1-3.3 0-3.4 2.3-5.8t6.1-2.5q3.4 0 5.3 1.9t1.9 4.7q0 3.8-1.6 6.5t-3.9 2.6q-1.3 0-2.2-0.9t-0.5-2.4q0.2-0.8 0.6-2.1t0.7-2.3 0.2-1.6q0-1.2-0.6-1.9t-1.7-0.7q-1.4 0-2.3 1.2t-1 3.2q0 1.6 0.6 2.7l-2.2 9.4q-0.4 1.5-0.3 3.9-4.6-2-7.5-6.3t-2.8-9.4q0-4.7 2.3-8.6t6.2-6.2 8.6-2.3 8.6 2.3 6.3 6.2 2.3 8.6z"></path>
                      </svg>
                    </a>

                    <a :href="`https://www.facebook.com/sharer/sharer.php?u=${fullPageLink}`" target="_blank" class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: #4267B2" @click="$refs.shareBtn.active = false">
                      <svg class="w-10 h-10" fill="#fff" viewBox="0 0 40 40">
                        <path d="m21.7 16.7h5v5h-5v11.6h-5v-11.6h-5v-5h5v-2.1c0-2 0.6-4.5 1.8-5.9 1.3-1.3 2.8-2 4.7-2h3.5v5h-3.5c-0.9 0-1.5 0.6-1.5 1.5v3.5z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </popover>

              <button :class="['mx-2', item.liked ? 'text-red-550' : '']" @click="like">
                <i class="flaticon-053-heart text-2xl"></i>
              </button>

              <nuxt-link :to="`/${item.link}/comments`" class="mx-2">
                <i class="flaticon-029-star text-2xl"></i>
              </nuxt-link>

              <button :class="['mr-2', item.bookmarked ? 'text-red-550' : '']" @click="bookmark">
                <i class="flaticon-154-bookmark text-2xl"></i>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script>

import moment from "~/mixins/moment";

export default {
  name: "BusinessPage",
  mixins: [moment],
  data() {
    return {
      item: null,
      qrImage: null,
      interval: null,
      loaded: false,
      mapLoaded: false,
      servicesOpen: false,
      contactsOpen: false,
      page: null,
      tab: 'contacts',
      tabs: [
        {name: 'contacts', label: 'اطلاعات تماس'},
        {name: 'workTime', label: 'ساعت کاری'},
        {name: 'services', label: 'امکانات'},
        {name: 'description', label: 'شرح فعالیت'},
      ],
      baseUrl: process.env.storagePath
    }
  },
  async fetch() {
    await this.$axios.$get('business/' + this.$route.params.business + '?page=business')
      .then(response => {
        this.item = response.data
        this.loaded = true
      })
      .catch(error => {
        this.$store.commit('notification/error',{message: error.response.data.message, code: error.response.status})
      })
  },
  computed: {
    services() {
      return this.item.services?.split(/(?:, ?|، ?)/) || []
    },
    contacts() {
      return this.item.contacts?.map(x => {
        return {
          title: x.title,
          value: x.value,
          link: x.template.link ? x.template.link + x.value : null
        }
      }) || []
    },
    fullPageLink() {
      return this.item ? window.location.origin + '/' + this.item.link : ''
    },
  },
  watch: {
    page(val) {
      if (!val) {
        this.mapLoaded = false
        this.$nextTick(() => {
          this.mapInit()
        })
      }
    }
  },
  mounted() {
    if (this.loaded) {
      this.mapInit()
    } else {
      this.interval = setInterval(() => {
        if (this.loaded) {
          this.mapInit()
          clearInterval(this.interval)
          this.interval = null
        }
      }, 1000)
    }
    setTimeout(() => {this.drawQr()}, 3000)
  },
  destroyed() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    showInformation() {
      const el = this.$refs.information;

      if (el) {
        el.scrollIntoView({behavior: 'smooth'});
      }
    },
    showGallery() {
      this.page = 'images'
      window.addEventListener('popstate', this.closeGallery);
      window.history.pushState('gallery', null, window.location.origin + window.location.pathname + '#gallery');
    },
    closeGallery() {
      this.page = null
      window.history.pushState(null, null, window.location.origin + window.location.pathname);
      window.removeEventListener('popstate', this.closeGallery);
    },
    showDescription() {
      this.page = 'description'
      window.addEventListener('popstate', this.closeDescription);
      window.history.pushState('gallery', null, window.location.origin + window.location.pathname + '#description');
    },
    closeDescription() {
      this.page = null
      window.history.pushState(null, null, window.location.origin + window.location.pathname);
      window.removeEventListener('popstate', this.closeDescription);
    },
    mapInit() {

      if (this.mapLoaded) return

      this.mapLoaded = true

      const position = {lat: this.item.lat, lng: this.item.lng}

      this.map = new window.L.Map(this.$refs.map, {
        key: process.env.NESHAN_WEB_APP_KEY,
        maptype: 'dreamy-gold',
        poi: true,
        traffic: false,
        center: position,
        zoom: 16
      });

      this.marker = window.L.marker(position, {
        icon: window.L.icon({
          iconUrl: require('~/assets/images/marker2.png'),
          iconSize: [64, 77],
          iconAnchor: [32, 77],
        })
      }).addTo(this.map);

      // this.directionsService = new window.google.maps.DirectionsService();
      // this.directionsRenderer = new window.google.maps.DirectionsRenderer();
      // this.directionsRenderer.setMap(this.map);

    },
    calculateAndDisplayRoute() {
      if (navigator.geolocation) {
        navigator.geolocation
          .getCurrentPosition(position => {

              this.directionsService
                .route({
                  origin: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  },
                  destination: {
                    lat: this.item.lat,
                    lng: this.item.lng
                  },
                  // travelMode: window.google.maps.TravelMode.DRIVING,
                })
                .then((response) => {
                  this.directionsRenderer.setDirections(response);
                })
            }
          )
      }
    },
    bookmark() {
      if (!this.$store.getters["user/loggedIn"]) {
        alert('برای ذخیره کسب و کار لازم است به حساب کاربری خود وارد شوید.')
        return;
      }

      const url = `/home/business/${this.item.id}/bookmark${this.item.bookmarked ? '?action=unbookmark' : ''}`

      this.$axios.$get(url)
        .then(() => {
          this.item.bookmarked = !this.item.bookmarked
          this.$store.commit(
            'notification/success',
            this.item.bookmarked
              ? 'کسب و کار به لیست علاقه مندی های شما اضافه شد.'
              : 'کسب و کار از لیست علاقه مندی های شما حذف شد.'
          )
        })
    },
    like() {
      if (!this.$store.getters["user/loggedIn"]) {
        alert('برای لایک کسب و کار لازم است به حساب کاربری خود وارد شوید.')
        return;
      }

      const url = `/business/${this.item.id}/like${this.item.liked ? '?action=unlike' : ''}`

      this.$axios.$get(url)
        .then(() => {
          this.item.liked = !this.item.liked
          this.$store.commit(
            'notification/success',
            this.item.liked
              ? 'شما به لیست مشتریان این کسب و کار اضافه شدید.'
              : 'شما از لیست مشتریان این کسب و کار حذف شدید.'
          )
        })
    },
    drawQr() {
      const q = new window.QRious({
        foreground: '#383c55',
        size: 512,
        value: this.fullPageLink
      });
      this.qrImage = q.toDataURL();
    },
    openQr() {
      const byteCharacters = window.atob(this.qrImage.substr(`data:image/png;base64,`.length));
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, {type: 'image/png'});
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, '_blank');
    },
    submit() {

    }
  }
}
</script>

<style lang="scss">
.business-page {

  .services, .contacts {

    li {
      &::before {
        content: "\2022";
        color: #1290fe;
        font-weight: bold;
        display: inline-block;
        width: 1em;
        margin-right: -1em;
        font-size: 1em;
      }
    }
  }

  .address {

    &::before {
      content: "\2022";
      color: #1290fe;
      font-weight: bold;
      display: inline-block;
      width: 1em;
      margin-right: -1em;
      font-size: 1em;
    }
  }

  .categories {
    grid-template-columns: repeat(auto-fill, minmax(149px, 1fr));

    .image-wrapper {
      padding-top: 100%;
    }

    .flaticon-115-left-arrow {
      font-size: 10px;
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

      .image-wrapper {
        padding-top: 57.7%;
      }
    }
  }
}
</style>
