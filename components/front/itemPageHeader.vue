<template>
  <div>
    <div class="hidden lg:flex items-center bg-white rounded px-8 py-4">
      <nuxt-link v-if="type === 'business'" :to="`/${item.link}`">
        <img :src="baseUrl+(item.avatar || item.picture)" alt="" class="w-24 h-24 rounded-full object-cover ml-9">
      </nuxt-link>
      <img v-else-if="type === 'product'" :src="baseUrl+(item.business.avatar || item.business.picture)" alt="" class="w-24 h-24 rounded-full object-cover ml-9">
      <img v-else :src="baseUrl+(item.avatar || item.picture || item.general.picture )" alt="" class="w-24 h-24 rounded-full object-cover ml-9">
      <div class="flex-grow">
        <div class="flex mb-4">
          <h2 class="ml-12">{{ item.name || item.general.name }}</h2>
          <div class="flex items-center">
            <icons-solid-star class="text-gold w-6 h-6 ml-2"/>
            <span>{{ type === 'category' ? business.score : item.score }}</span>
          </div>
        </div>
        <div class="flex items-center">
          <div v-if="type === 'product'">
            <nuxt-link :to="'/search/?c='+item.business.city_id">
              {{ item.business.city.name }}
            </nuxt-link>،
            <nuxt-link :to="`/search/?c=${item.business.city_id}&s=${item.business.street_id}`">
              {{ item.business.street.name }}
            </nuxt-link>،
            <nuxt-link :to="`/search/?c=${item.business.city_id}&g=${item.business.guild_id}`">
              {{ item.business.guild.name }}
            </nuxt-link>،
            <nuxt-link :to="`/${item.business.link}`">
              {{ item.business.name }}
            </nuxt-link>،
            <nuxt-link :to="`/${item.business.link}/${item.category_id}`">
              {{ item.category.name }}
            </nuxt-link>،
            <span class="text-cyan-250">{{ item.name || item.general.name }}</span>
          </div>
          <div v-else>
            <nuxt-link :to="'/search/?c='+(business ? business.city_id : item.city.id)">
              {{ business ? business.city.name : item.city.name }}
            </nuxt-link>،
            <nuxt-link :to="`/search/?c=${business ? business.city_id : item.city.id}&s=${business ? business.street_id : item.street.id}`">
              {{ business ? business.street.name : item.street.name }}
            </nuxt-link>،
            <nuxt-link :to="`/search/?c=${business ? business.city_id : item.city.id}&g=${business ? business.guild_id : item.guild.id}`">
              {{ business ? business.guild.name : item.guild.name }}
            </nuxt-link>،
            <span v-if="type === 'business'" class="text-cyan-250">{{ item.name }}</span>
            <nuxt-link v-if="type === 'category'" :to="`/${business.link}`" >{{ business.name }}</nuxt-link>
            <span v-if="type === 'category'">،</span>
            <span v-if="type === 'category'" class="text-cyan-250">{{ item.name }}</span>
          </div>

          <div class="flex items-center mr-12">
            <span>{{ type === 'category' ? business.likes : item.likes }}</span>
            <icons-outline-heart class="text-gray-400 w-5 h-5 mr-2"/>
          </div>

          <div class="flex items-center mr-8">
            <span>{{ type === 'category' ? business.views : item.views }}</span>
            <icons-outline-eye class="text-gray-400 w-5 h-5 mr-2"/>
          </div>
        </div>
      </div>
      <div>

        <button
          class="mx-2 inline-block"
          @click="reportModal = true"
        >
          <svg width="24" height="24" viewBox="0 0 20 22" fill="none" stroke="currentColor">
            <path d="M10 6.75V12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M0.919922 7.58003C0.919922 6.46003 1.51993 5.41999 2.48993 4.84999L8.42993 1.42C9.39993 0.86 10.6 0.86 11.58 1.42L17.52 4.84999C18.49 5.40999 19.09 6.45003 19.09 7.58003V14.42C19.09 15.54 18.49 16.58 17.52 17.15L11.58 20.58C10.61 21.14 9.40993 21.14 8.42993 20.58L2.48993 17.15C1.51993 16.59 0.919922 15.55 0.919922 14.42V11.66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 15.2V15.2999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <nuxt-link v-if="type === 'business'" :to="`/panel/chat?business=${item.id}`" class="mx-2 inline-block">
          <icons-chat2 class="w-6 h-6"/>
        </nuxt-link>

        <nuxt-link v-else-if="type === 'product'" :to="`/panel/chat?product=${item.id}`" class="mx-2 inline-block">
          <icons-chat2 class="w-6 h-6"/>
        </nuxt-link>

        <nuxt-link v-else-if="type === 'category'" :to="`/panel/chat?business=${business.id}`" class="mx-2 inline-block">
          <icons-chat2 class="w-6 h-6"/>
        </nuxt-link>

        <popover
          tag="button"
          anchor="#business-header"
          top="6rem"
          left="2.5rem"
          class="mx-2"
        >
          <template #activator>
            <i class="flaticon-086-qr-code text-2xl"></i>
          </template>
          <div class="bg-white rounded py-8 px-8">
            <div class="flex justify-center mb-4">
              <img v-if="qrImage" :src="qrImage" alt="" style="width: 100px" @click="openQr">
            </div>
            <div class="text-center">برای مشاهده در موبایل اسکن کنید</div>
          </div>
        </popover>

        <popover
          ref="shareBtn"
          tag="button"
          anchor="#business-header"
          top="6rem"
          left="2.5rem"
          class="mx-2"
        >
          <template #activator>
            <i class="flaticon-009-share text-2xl"></i>
          </template>

          <div class="bg-white rounded py-4 px-8">
            <div class="mb-4 text-center">به اشتراک بگذارید</div>
            <div class="flex">
              <a :href="`https://telegram.me/share/url?url=${fullPageLink}&text=${item.name}`" target="_blank" class="w-12 h-12 mx-2" @click="$refs.shareBtn.active = false">
                <svg class="w-12 h-12" viewBox="0 0 47 47">
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

              <a :href="`https://wa.me/?text=${fullPageLink}`" target="_blank" class="w-12 h-12 mx-2 rounded-full flex items-center justify-center" style="background-color: #25D366" @click="$refs.shareBtn.active = false">
                <svg fill="#fff" class="w-8 h-8" viewBox="0 0 40 40">
                  <path d="m25 21.7q0.3 0 2.2 1t2 1.2q0 0.1 0 0.3 0 0.8-0.4 1.7-0.3 0.9-1.6 1.5t-2.2 0.6q-1.3 0-4.3-1.4-2.2-1-3.8-2.6t-3.3-4.2q-1.6-2.3-1.6-4.3v-0.2q0.1-2 1.7-3.5 0.5-0.5 1.2-0.5 0.1 0 0.4 0t0.4 0.1q0.4 0 0.6 0.1t0.3 0.6q0.2 0.5 0.8 2t0.5 1.7q0 0.5-0.8 1.3t-0.7 1q0 0.2 0.1 0.3 0.7 1.7 2.3 3.1 1.2 1.2 3.3 2.2 0.3 0.2 0.5 0.2 0.4 0 1.2-1.1t1.2-1.1z m-4.5 11.9q2.8 0 5.4-1.1t4.5-3 3-4.5 1.1-5.4-1.1-5.5-3-4.5-4.5-2.9-5.4-1.2-5.5 1.2-4.5 2.9-2.9 4.5-1.2 5.5q0 4.5 2.7 8.2l-1.7 5.2 5.4-1.8q3.5 2.4 7.7 2.4z m0-30.9q3.4 0 6.5 1.4t5.4 3.6 3.5 5.3 1.4 6.6-1.4 6.5-3.5 5.3-5.4 3.6-6.5 1.4q-4.4 0-8.2-2.1l-9.3 3 3-9.1q-2.4-3.9-2.4-8.6 0-3.5 1.4-6.6t3.6-5.3 5.3-3.6 6.6-1.4z"></path>
                </svg>
              </a>

              <a :href="`https://www.linkedin.com/shareArticle?mini=true&url=${fullPageLink}&title=${item.name}&summary=${item.description}&source=`" target="_blank" class="w-12 h-12 mx-2 rounded-full flex items-center justify-center" style="background-color: #0e76a8" @click="$refs.shareBtn.active = false">
                <svg class="w-8 h-8" fill="#fff" viewBox="0 0 40 40">
                  <path d="m13.3 31.7h-5v-16.7h5v16.7z m18.4 0h-5v-8.9c0-2.4-0.9-3.5-2.5-3.5-1.3 0-2.1 0.6-2.5 1.9v10.5h-5s0-15 0-16.7h3.9l0.3 3.3h0.1c1-1.6 2.7-2.8 4.9-2.8 1.7 0 3.1 0.5 4.2 1.7 1 1.2 1.6 2.8 1.6 5.1v9.4z m-18.3-20.9c0 1.4-1.1 2.5-2.6 2.5s-2.5-1.1-2.5-2.5 1.1-2.5 2.5-2.5 2.6 1.2 2.6 2.5z"></path>
                </svg>
              </a>

              <a :href="`mailto:?body=${fullPageLink}`" target="_blank" class="w-12 h-12 mx-2 rounded-full flex items-center justify-center" style="background-color: #7d7d7d" @click="$refs.shareBtn.active = false">
                <svg class="w-8 h-8" fill="#fff" viewBox="0 0 40 40">
                  <path d="m33.4 13.4v-3.4l-13.4 8.4-13.4-8.4v3.4l13.4 8.2z m0-6.8q1.3 0 2.3 1.1t0.9 2.3v20q0 1.3-0.9 2.3t-2.3 1.1h-26.8q-1.3 0-2.3-1.1t-0.9-2.3v-20q0-1.3 0.9-2.3t2.3-1.1h26.8z"></path>
                </svg>
              </a>

              <a :href="`https://twitter.com/intent/tweet?text=${fullPageLink}`" target="_blank" class="w-12 h-12 mx-2 rounded-full flex items-center justify-center" style="background-color: #1DA1F2" @click="$refs.shareBtn.active = false">
                <svg class="w-8 h-8" fill="#fff" viewBox="0 0 40 40">
                  <path d="m31.5 11.7c1.3-0.8 2.2-2 2.7-3.4-1.4 0.7-2.7 1.2-4 1.4-1.1-1.2-2.6-1.9-4.4-1.9-1.7 0-3.2 0.6-4.4 1.8-1.2 1.2-1.8 2.7-1.8 4.4 0 0.5 0.1 0.9 0.2 1.3-5.1-0.1-9.4-2.3-12.7-6.4-0.6 1-0.9 2.1-0.9 3.1 0 2.2 1 3.9 2.8 5.2-1.1-0.1-2-0.4-2.8-0.8 0 1.5 0.5 2.8 1.4 4 0.9 1.1 2.1 1.8 3.5 2.1-0.5 0.1-1 0.2-1.6 0.2-0.5 0-0.9 0-1.1-0.1 0.4 1.2 1.1 2.3 2.1 3 1.1 0.8 2.3 1.2 3.6 1.3-2.2 1.7-4.7 2.6-7.6 2.6-0.7 0-1.2 0-1.5-0.1 2.8 1.9 6 2.8 9.5 2.8 3.5 0 6.7-0.9 9.4-2.7 2.8-1.8 4.8-4.1 6.1-6.7 1.3-2.6 1.9-5.3 1.9-8.1v-0.8c1.3-0.9 2.3-2 3.1-3.2-1.1 0.5-2.3 0.8-3.5 1z"></path>
                </svg>
              </a>

              <a :href="`https://pinterest.com/pin/create/button/?url=${fullPageLink}&media=${baseUrl+item.avatar}&description=${item.name}`" target="_blank" class="w-12 h-12 mx-2 rounded-full flex items-center justify-center" style="background-color: #E60023" @click="$refs.shareBtn.active = false">
                <svg class="w-8 h-8" fill="#fff" viewBox="0 0 40 40">
                  <path d="m37.3 20q0 4.7-2.3 8.6t-6.3 6.2-8.6 2.3q-2.4 0-4.8-0.7 1.3-2 1.7-3.6 0.2-0.8 1.2-4.7 0.5 0.8 1.7 1.5t2.5 0.6q2.7 0 4.8-1.5t3.3-4.2 1.2-6.1q0-2.5-1.4-4.7t-3.8-3.7-5.7-1.4q-2.4 0-4.4 0.7t-3.4 1.7-2.5 2.4-1.5 2.9-0.4 3q0 2.4 0.8 4.1t2.7 2.5q0.6 0.3 0.8-0.5 0.1-0.1 0.2-0.6t0.2-0.7q0.1-0.5-0.3-1-1.1-1.3-1.1-3.3 0-3.4 2.3-5.8t6.1-2.5q3.4 0 5.3 1.9t1.9 4.7q0 3.8-1.6 6.5t-3.9 2.6q-1.3 0-2.2-0.9t-0.5-2.4q0.2-0.8 0.6-2.1t0.7-2.3 0.2-1.6q0-1.2-0.6-1.9t-1.7-0.7q-1.4 0-2.3 1.2t-1 3.2q0 1.6 0.6 2.7l-2.2 9.4q-0.4 1.5-0.3 3.9-4.6-2-7.5-6.3t-2.8-9.4q0-4.7 2.3-8.6t6.2-6.2 8.6-2.3 8.6 2.3 6.3 6.2 2.3 8.6z"></path>
                </svg>
              </a>

              <a :href="`https://www.facebook.com/sharer/sharer.php?u=${fullPageLink}`" target="_blank" class="w-12 h-12 mx-2 rounded-full flex items-center justify-center" style="background-color: #4267B2" @click="$refs.shareBtn.active = false">
                <svg class="w-10 h-10" fill="#fff" viewBox="0 0 40 40">
                  <path d="m21.7 16.7h5v5h-5v11.6h-5v-11.6h-5v-5h5v-2.1c0-2 0.6-4.5 1.8-5.9 1.3-1.3 2.8-2 4.7-2h3.5v5h-3.5c-0.9 0-1.5 0.6-1.5 1.5v3.5z"></path>
                </svg>
              </a>
            </div>
          </div>
        </popover>

        <button :class="['mx-2', item.liked || (type === 'category' && business.liked) ? 'text-red-550' : '']" @click="like">
          <i class="flaticon-053-heart text-2xl"></i>
        </button>

        <button v-if="isCommentPage" class="mx-2">
          <i class="flaticon-029-star text-2xl"></i>
        </button>

        <popover
          v-else
          tag="button"
          anchor="#business-header"
          top="6rem"
          left="2.5rem"
          class="mx-2"
        >
          <template #activator>
            <i class="flaticon-029-star text-2xl"></i>
          </template>
          <div class="bg-white rounded py-8 px-8 persian-number text-gray-500">
            <div v-for="i in 5" :key="i" class="flex items-center text-sm leading-none mb-3">
              <span class="w-6">{{6 - i}}</span>
              <svg class="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
              </svg>
              <div class="flex-grow-1 h-1.5 w-60 bg-gray-200 rounded-full mx-4">
                <div
                  class="h-1.5 rounded-full bg-gold"
                  :style="{width: scoreTotal ? (type === 'category' ? business[`score_${6 - i}`] : item[`score_${6 - i}`]) * 100 / scoreTotal : 0 + '%'} "
                ></div>
              </div>
              <span class="w-8">{{ scoreTotal ? (type === 'category' ? business[`score_${6 - i}`] : item[`score_${6 - i}`]) * 100 / scoreTotal : 0 }}%</span>
            </div>
            <div class="text-gray-300 flex justify-evenly my-4 mx-14" @mouseleave="votePreview = 0">
              <svg
                v-for="i in 5"
                :key="i"
                :class="['w-7 h-7 cursor-pointer', votePreview >= i ? 'text-gold' : '']"
                viewBox="0 0 24 24"
                fill="currentColor"
                @mouseover="votePreview = i"
                @click="$router.push(`${pageLink}/comments?score=${i}`)"
              >
                <path v-if="votePreview >= i" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                <path v-else d="M12 5.173l2.335 4.817 5.305.732-3.861 3.71.942 5.27-4.721-2.524-4.721 2.525.942-5.27-3.861-3.71 5.305-.733 2.335-4.817zm0-4.586l-3.668 7.568-8.332 1.151 6.064 5.828-1.48 8.279 7.416-3.967 7.416 3.966-1.48-8.279 6.064-5.827-8.332-1.15-3.668-7.569z"/>
              </svg>
            </div>
            <div class="text-center">امتیاز دهید</div>
          </div>
        </popover>

        <button :class="['mx-2', item.bookmarked || (type === 'category' && business.bookmarked) ? 'text-red-550' : '']" @click="bookmark">
          <i class="flaticon-154-bookmark text-2xl"></i>
        </button>
      </div>
    </div>
    <div class="lg:hidden bg-white relative mt-12 pr-1 text-sm">
      <div class="flex absolute w-full -top-8 right-0">
        <nuxt-link v-if="type === 'business'" :to="`/${item.link}`">
          <img :src="baseUrl+(item.avatar || item.picture)" alt="" class="w-16 h-16 rounded-full object-cover ml-9">
        </nuxt-link>
        <img v-else-if="type === 'product'" :src="baseUrl+(item.business.avatar || item.business.picture)" alt="" class="w-16 h-16 rounded-full object-cover ml-9">
        <img v-else :src="baseUrl+(item.avatar || item.picture || item.general.picture )" alt="" class="w-16 h-16 rounded-full object-cover ml-9">

        <nuxt-link :to="`${pageLink}/comments`" class="flex flex-col justify-center items-center">
          <icons-solid-star class="text-gold w-6 h-6"/>
          <span>{{ type === 'category' ? business.score : item.score }}</span>
        </nuxt-link>

        <div class="flex flex-col justify-center items-center mx-5">
          <icons-outline-heart class="text-gray-400 w-5 h-5"/>
          <span>{{ type === 'category' ? business.likes : item.likes }}</span>
        </div>

        <div class="flex flex-col justify-center items-center">
          <icons-outline-eye class="text-gray-400 w-5 h-5"/>
          <span>{{ type === 'category' ? business.views : item.views }}</span>
        </div>

        <div class="flex-grow"></div>

        <div class="pt-2">
          <nuxt-link v-if="type === 'business'" :to="`/panel/chat?business=${item.id}`" class="inline-block">
            <icons-chat2 class="w-6 h-6"/>
          </nuxt-link>

          <nuxt-link v-else-if="type === 'product'" :to="`/panel/chat?product=${item.id}`" class="inline-block">
            <icons-chat2 class="w-6 h-6"/>
          </nuxt-link>

          <nuxt-link v-else-if="type === 'category'" :to="`/panel/chat?business=${business.id}`" class="inline-block">
            <icons-chat2 class="w-6 h-6"/>
          </nuxt-link>
        </div>

      </div>

      <div>
        <h2 class="pt-9 pb-2 font-extrabold text-cyan-600">{{ item.name || item.general.name }}</h2>
        <div class="pb-2">
          <div v-if="type === 'product'">
            <nuxt-link :to="'/search/?c='+item.business.city_id">
              {{ item.business.city.name }}
            </nuxt-link> /
            <nuxt-link :to="`/search/?c=${item.business.city_id}&s=${item.business.street_id}`">
              {{ item.business.street.name }}
            </nuxt-link> /
            <nuxt-link :to="`/search/?c=${item.business.city_id}&g=${item.business.guild_id}`">
              {{ item.business.guild.name }}
            </nuxt-link> /
            <nuxt-link :to="`/${item.business.link}`">
              {{ item.business.name }}
            </nuxt-link> /
            <nuxt-link :to="`/${item.business.link}/${item.category_id}`">
              {{ item.category.name }}
            </nuxt-link> /
            <span class="text-cyan-600">{{ item.name || item.general.name }}</span>
          </div>
          <div v-else>
            <nuxt-link :to="'/search/?c='+(business ? business.city_id : item.city.id)">
              {{ business ? business.city.name : item.city.name }}
            </nuxt-link> /
            <nuxt-link :to="`/search/?c=${business ? business.city_id : item.city.id}&s=${business ? business.street_id : item.street.id}`">
              {{ business ? business.street.name : item.street.name }}
            </nuxt-link> /
            <nuxt-link :to="`/search/?c=${business ? business.city_id : item.city.id}&g=${business ? business.guild_id : item.guild.id}`">
              {{ business ? business.guild.name : item.guild.name }}
            </nuxt-link> /
            <span v-if="type === 'business'" class="text-cyan-600">{{ item.name }}</span>
            <nuxt-link v-if="type === 'category'" :to="`/${business.link}`" >{{ business.name }}</nuxt-link>
            <span v-if="type === 'category'"> / </span>
            <span v-if="type === 'category'" class="text-cyan-600">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <ReportModal
      :id="item.id"
      :subject="type"
      :open="reportModal"
      @close="reportModal = false"
    />
  </div>
</template>

<script>
import Popover from "../popover";
import IconsChat2 from "../icons/Chat2";
import IconsSolidStar from "../icons/solid/star";
import IconsOutlineEye from "../icons/outline/eye";
import IconsOutlineHeart from "../icons/outline/heart";
import ReportModal from "../ReportModal.vue";

export default {
  name: "FrontItemPageHeader",
  components: {ReportModal, IconsChat2, IconsOutlineEye, IconsOutlineHeart, IconsSolidStar, Popover},
  props: {
    item: {
      type: Object,
      required: true,
    },
    business: {
      type: Object,
      default: null,
    },
    type: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      votePreview: 0,
      qrImage: null,
      reportModal: false,
      baseUrl: process.env.storagePath
    }
  },
  /* head() {
    const skip = this.$store.state.qriousLoaded
    this.$store.commit('qriousLoaded')
    return {
      script: [
        {
          async: true,
          src: '/qrious.min.js',
          defer: true,
          once: true,
          skip
        }
      ]
    }
  }, */
  computed: {
    pageLink() {
      return this.type === 'business'
        ? '/' + this.item.link
        : this.type === 'category'
          ? '/' + this.business.link
          : '/' + this.item.business.link + '/' + this.item.category_id + '/' + this.item.id
    },
    fullPageLink() {
      return window.location.origin + this.pageLink
    },
    isCommentPage() {
      const routeName = this.$route.name.split('___')[0].split('-');
      return routeName[routeName.length-1] === 'comments'
    },
    scoreTotal() {
      return this.type === 'category'
        ? this.business.score_1 + this.business.score_2 + this.business.score_3 + this.business.score_4 + this.business.score_5
        : this.item.score_1 + this.item.score_2 + this.item.score_3 + this.item.score_4 + this.item.score_5
    }
  },
  mounted() {
    setTimeout(() => {this.drawQr()}, 3000)
  },
  methods: {
    bookmark() {
      if (!this.$store.getters["user/loggedIn"]) {
        alert('برای ذخیره کسب و کار لازم است به حساب کاربری خود وارد شوید.')
        return;
      }

      const url = this.type === 'category'
        ? `/home/business/${this.business.id}/bookmark${this.business.bookmarked ? '?action=unbookmark' : ''}`
        : `/home/${this.type}/${this.item.id}/bookmark${this.item.bookmarked ? '?action=unbookmark' : ''}`

      this.$axios.$get(url)
        .then(() => {
          this.$emit('change-bookmarked')
          this.$store.commit(
            'notification/success',
            (this.type === 'category' && this.business.bookmarked) || this.item.bookmarked
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

      const url = this.type === 'category'
        ? `/business/${this.business.id}/like${this.business.liked ? '?action=unlike' : ''}`
        : `/${this.type}/${this.item.id}/like${this.item.liked ? '?action=unlike' : ''}`

      this.$axios.$get(url)
        .then(() => {
          this.$emit('change-liked')
          this.$store.commit(
            'notification/success',
            (this.type === 'category' && this.business.liked) || this.item.liked
              ? 'امتیاز شما ثبت شد.'
              : 'امتیاز شما حذف شد.'
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
    }
  }
}
</script>
