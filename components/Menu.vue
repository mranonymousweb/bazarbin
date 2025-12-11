<template>
  <div class="relative">
    <Dropdown align="left" width="96" :slide-on-mobile="true" :container-classes="containerClasses">
      <template #trigger>
              <button class="cursor-pointer" :style="{color: iconColor}">
                <svg xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 32 12"
                     fill="none"
                     stroke="currentColor"
                     stroke-width="2.5"
                     stroke-linecap="round"
                     stroke-linejoin="round"
                     class="sm:w-7 sm:h-7 w-6 h-6"
                >
                  <line x1="0" y1="0" x2="32" y2="0"></line>
                  <line x1="12" y1="12" x2="32" y2="12"></line>
                </svg>
              </button>
      </template>
      <template #content>
        <div class="p-6">
          <div v-if="loggedIn" class="border-b mb-6 pb-6 flex items-center">
            <div class="pl-6">
              <img :src="storagePath + (user?.avatar || 'avatars/default.png')" alt="" class="w-24 h-24 rounded-full border border-cyan-250 object-cover">
            </div>
            <div>
              <div class="font-semibold" v-text="user?.firstname || user?.lastname ? `${user.firstname} ${user.lastname}` : 'کاربر بدون نام'"></div>
              <div v-text="user?.phone" class="text-gray-400 pt-2"></div>
            </div>
          </div>

          <div>

            <NuxtLink v-if="isAdmin" to="/admin" class="flex items-center py-2 mb-2">
              <i class="flaticon-032-briefcase pl-4 text-xl" style="color: #b1b0bf"></i>
              پنل مدیریت
            </NuxtLink>

            <NuxtLink v-if="loggedIn" to="/panel" class="flex items-center py-2 mb-2">
              <i class="flaticon-144-layout pl-4 text-xl" style="color: #b1b0bf"></i>
              <span >پنل کاربری</span>
            </NuxtLink>

            <NuxtLink to="/help" class="flex items-center py-2 mb-2">
              <i class="pl-4">
                <svg id="_032-information" data-name="032-information" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 25 25">
                  <g id="Group_5" data-name="Group 5">
                    <g id="Group_4" data-name="Group 4">
                      <path id="Path_7" data-name="Path 7" d="M12.5,0A12.5,12.5,0,1,0,25,12.5,12.493,12.493,0,0,0,12.5,0Zm0,23.047A10.547,10.547,0,1,1,23.047,12.5,10.541,10.541,0,0,1,12.5,23.047Z" fill="#b1b0bf"/>
                    </g>
                  </g>
                  <g id="Group_7" data-name="Group 7" transform="translate(11.523 10.465)">
                    <g id="Group_6" data-name="Group 6">
                      <path id="Path_8" data-name="Path 8" d="M236.977,214.33a.977.977,0,0,0-.977.977V221.6a.977.977,0,1,0,1.953,0v-6.289A.977.977,0,0,0,236.977,214.33Z" transform="translate(-236 -214.33)" fill="#b1b0bf"/>
                    </g>
                  </g>
                  <g id="Group_9" data-name="Group 9" transform="translate(11.182 6.633)">
                    <g id="Group_8" data-name="Group 8">
                      <circle id="Ellipse_8" data-name="Ellipse 8" cx="1.318" cy="1.318" r="1.318" fill="#b1b0bf"/>
                    </g>
                  </g>
                </svg>
              </i>
              <span >راهنمای سایت</span>
            </NuxtLink>

            <NuxtLink to="/privacy" class="flex items-center py-2 mb-2">
              <i class="pl-4">
                <svg id="_032-information" data-name="032-information" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 25 25">
                  <g id="Group_5" data-name="Group 5">
                    <g id="Group_4" data-name="Group 4">
                      <path id="Path_7" data-name="Path 7" d="M12.5,0A12.5,12.5,0,1,0,25,12.5,12.493,12.493,0,0,0,12.5,0Zm0,23.047A10.547,10.547,0,1,1,23.047,12.5,10.541,10.541,0,0,1,12.5,23.047Z" fill="#b1b0bf"/>
                    </g>
                  </g>
                  <g id="Group_7" data-name="Group 7" transform="translate(11.523 10.465)">
                    <g id="Group_6" data-name="Group 6">
                      <path id="Path_8" data-name="Path 8" d="M236.977,214.33a.977.977,0,0,0-.977.977V221.6a.977.977,0,1,0,1.953,0v-6.289A.977.977,0,0,0,236.977,214.33Z" transform="translate(-236 -214.33)" fill="#b1b0bf"/>
                    </g>
                  </g>
                  <g id="Group_9" data-name="Group 9" transform="translate(11.182 6.633)">
                    <g id="Group_8" data-name="Group 8">
                      <circle id="Ellipse_8" data-name="Ellipse 8" cx="1.318" cy="1.318" r="1.318" fill="#b1b0bf"/>
                    </g>
                  </g>
                </svg>
              </i>
              <span >سیاست حفظ حریم خصوصی</span>
            </NuxtLink>

            <NuxtLink to="/contact-us" class="flex items-center py-2 mb-2">
              <i class="pl-4">
                <svg id="_096-telephone" data-name="096-telephone" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                  <g id="Group_10" data-name="Group 10">
                    <path id="Path_9" data-name="Path 9" d="M.879,13.464l2.169-1.549a2.089,2.089,0,0,1,2.7.223l1.271,1.271a40.708,40.708,0,0,0,6.393-6.393L12.14,5.746a2.089,2.089,0,0,1-.223-2.7L13.466.877A2.1,2.1,0,0,1,16.653.614l2,2c1.8,1.8,1.8,4.232,0,6.677a40.67,40.67,0,0,1-9.357,9.357c-2.262,1.666-4.748,1.933-6.677,0l-2-2A2.1,2.1,0,0,1,.879,13.464Zm.841,2.082,2,2c1.388,1.388,3.071,1,4.646-.157a39.229,39.229,0,0,0,9.026-9.025c1.159-1.574,1.545-3.257.157-4.645l-2-2a.533.533,0,0,0-.811.067L13.188,3.954a.532.532,0,0,0,.057.687l1.691,1.691a.781.781,0,0,1,.184.814c-.539,1.518-6.456,7.434-7.973,7.972a.781.781,0,0,1-.814-.184L4.642,13.243a.532.532,0,0,0-.687-.057L1.787,14.736A.533.533,0,0,0,1.72,15.547Z" transform="translate(-0.001 0)" fill="#b1b0bf"/>
                  </g>
                </svg>
              </i>
              <span >تماس با ما</span>
            </NuxtLink>

            <NuxtLink to="/" class="flex items-center py-2 mb-2">
              <i class="pl-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="21.083" viewBox="0 0 22 21.083">
                  <g id="_381-share" data-name="381-share" transform="translate(0 -10.67)">
                    <g id="Group_12" data-name="Group 12" transform="translate(0 10.67)">
                      <g id="Group_11" data-name="Group 11">
                        <path id="Path_10" data-name="Path 10" d="M346.813,125.141c.011-.187.019-.368.019-.481a9.15,9.15,0,0,0-3.4-7.129.917.917,0,1,0-1.153,1.425,7.317,7.317,0,0,1,2.724,5.7h0a3.668,3.668,0,1,0,1.814.48ZM345,130.16a1.833,1.833,0,1,1,1.833-1.833A1.833,1.833,0,0,1,345,130.16Z" transform="translate(-326.666 -112.744)" fill="#b1b0bf"/>
                        <path id="Path_11" data-name="Path 11" d="M48.131,21.648a.917.917,0,0,0,1.1-.691,7.35,7.35,0,0,1,3.892-4.941,3.667,3.667,0,1,0-.4-1.833,9.183,9.183,0,0,0-5.277,6.368A.917.917,0,0,0,48.131,21.648ZM56.38,12.5a1.833,1.833,0,1,1-1.807,2.142l-.005-.029A1.835,1.835,0,0,1,56.38,12.5Z" transform="translate(-45.38 -10.67)" fill="#b1b0bf"/>
                        <path id="Path_12" data-name="Path 12" d="M13.445,294.92a7.349,7.349,0,0,1-6.845-1.05,3.664,3.664,0,1,0-1.479,1.166,9.181,9.181,0,0,0,8.935,1.612.917.917,0,0,0-.612-1.728Zm-11.611-3.25A1.833,1.833,0,1,1,3.667,293.5,1.833,1.833,0,0,1,1.833,291.671Z" transform="translate(0 -276.087)" fill="#b1b0bf"/>
                      </g>
                    </g>
                  </g>
                </svg>
              </i>
              <span >به اشتراک گذاری</span>
            </NuxtLink>

            <NuxtLink to="/" class="flex items-center py-2 mb-2">
              <i class="pl-4" style="color: #b1b0bf">
                <svg xmlns="http://www.w3.org/2000/svg"
                     class="w-6 h-6"
                     viewBox="0 0 50 50"
                     fill="currentColor"
                >
                  <path d="M 44.527344 34.75 C 43.449219 37.144531 42.929688 38.214844 41.542969 40.328125 C 39.601563 43.28125 36.863281 46.96875 33.480469 46.992188 C 30.46875 47.019531 29.691406 45.027344 25.601563 45.0625 C 21.515625 45.082031 20.664063 47.03125 17.648438 47 C 14.261719 46.96875 11.671875 43.648438 9.730469 40.699219 C 4.300781 32.429688 3.726563 22.734375 7.082031 17.578125 C 9.457031 13.921875 13.210938 11.773438 16.738281 11.773438 C 20.332031 11.773438 22.589844 13.746094 25.558594 13.746094 C 28.441406 13.746094 30.195313 11.769531 34.351563 11.769531 C 37.492188 11.769531 40.8125 13.480469 43.1875 16.433594 C 35.421875 20.691406 36.683594 31.78125 44.527344 34.75 Z M 31.195313 8.46875 C 32.707031 6.527344 33.855469 3.789063 33.4375 1 C 30.972656 1.167969 28.089844 2.742188 26.40625 4.78125 C 24.878906 6.640625 23.613281 9.398438 24.105469 12.066406 C 26.796875 12.152344 29.582031 10.546875 31.195313 8.46875 Z"></path>
                </svg>
              </i>
              <span >آی او اس</span>
            </NuxtLink>

            <NuxtLink to="/" class="flex items-center py-2">
              <i class="pl-4" style="color: #b1b0bf">
                <svg xmlns="http://www.w3.org/2000/svg"
                     class="w-6 h-6"
                     viewBox="0 0 24 24"
                     fill="currentColor"
                >
                  <path d="M 7.5 1 C 7.372 1 7.2439844 1.0489844 7.1464844 1.1464844 C 6.9514844 1.3414844 6.9514844 1.6585156 7.1464844 1.8535156 L 8.4570312 3.1640625 C 6.9691108 4.2559188 6 6.0127547 6 8 L 18 8 C 18 6.0127547 17.030889 4.2559188 15.542969 3.1640625 L 16.853516 1.8535156 C 17.048516 1.6575156 17.048516 1.3424844 16.853516 1.1464844 C 16.658516 0.95148437 16.341484 0.95148438 16.146484 1.1464844 L 14.664062 2.6289062 C 13.860616 2.2295595 12.95819 2 12 2 C 11.04181 2 10.139384 2.2295595 9.3359375 2.6289062 L 7.8535156 1.1464844 C 7.7560156 1.0489844 7.628 1 7.5 1 z M 9 5 L 10 5 L 10 6 L 9 6 L 9 5 z M 14 5 L 15 5 L 15 6 L 14 6 L 14 5 z M 4 9 C 3.448 9 3 9.448 3 10 L 3 16 C 3 16.552 3.448 17 4 17 C 4.552 17 5 16.552 5 16 L 5 10 C 5 9.448 4.552 9 4 9 z M 6 9 L 6 17 C 6 17.552 6.448 18 7 18 L 8 18 L 8 21.5 C 8 22.328 8.672 23 9.5 23 C 10.328 23 11 22.328 11 21.5 L 11 18 L 13 18 L 13 21.5 C 13 22.328 13.672 23 14.5 23 C 15.328 23 16 22.328 16 21.5 L 16 18 L 17 18 C 17.552 18 18 17.552 18 17 L 18 9 L 6 9 z M 20 9 C 19.448 9 19 9.448 19 10 L 19 16 C 19 16.552 19.448 17 20 17 C 20.552 17 21 16.552 21 16 L 21 10 C 21 9.448 20.552 9 20 9 z"></path>
                </svg>
              </i>
              <span >اندروید</span>
            </NuxtLink>

          </div>
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<script>
import { useUserStore } from '~/stores/user'

export default {
  name: "Menu",
  props: {
    iconColor: {
      type: String,
      default: '#383C54'
    },
    containerClasses: {
      type: Array,
      default: () => ['-ml-20']
    }
  },
  data() {
    return {
      storagePath: useRuntimeConfig().public.storagePath
    }
  },

  computed: {
    userStore() {
      return useUserStore()
    },
    user() {
      return this.userStore.user
    },
    loggedIn() {
      return this.userStore.loggedIn
    },
    isAdmin() {
      return this.userStore.isAdmin
    }
  }
}
</script>
