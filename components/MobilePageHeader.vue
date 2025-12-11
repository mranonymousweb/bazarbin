<template>
  <div class="flex items-center flex-wrap">
    <div class="flex w-full sm:w-auto">

      <div class="flex-grow">
        <nuxt-link to="/">
          <i class="flaticon-065-right-arrow-1"></i>
        </nuxt-link>
      </div>

    </div>
    <div class=" w-full sm:w-auto flex flex-wrap justify-center items-center flex-grow">
      <div class="w-full flex flex-wrap justify-center items-center">
        <div class="w-full sm:w-1/3 sm:px-4 pb-3 sm:pb-0">
          <searchable-select
            v-model="street"
            placeholder="خیابان، محله را انتخاب کنید"
            :items="streets"
            tags-key="tags"
            input-class="w-full bg-white border border-gray-200 rounded p-3 sm:p-4 focus:outline-none focus:ring-2 focus:ring-blue-450 street-select"
          />
        </div>
        <div class="w-full sm:w-1/3 sm:px-4">
          <input
            v-model="searchKey"
            placeholder="نام کالا، نام پزشک، نام مجموعه"
            class="w-full bg-white border rounded p-3 sm:p-4 focus:outline-none focus:ring-2 focus:ring-blue-450"
          />
        </div>

        <popover
          ref="popover1"
          :mask="false"
          top="3rem"
          left="-12rem"
          :close-on-click-outside="autoClose"
          class="flex"
        >
          <template #activator>
            <button class="hidden sm:inline-block mx-6 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>
          </template>
          <div id="more-menu" dir="rtl" class="px-4 py-8 border shadow rounded bg-white flex w-72">
            <div class="w-1/2 border-l">
              <button class="block w-full" @click="openFilters = true">
                <i class="flaticon-067-filter text-4xl block mb-2"></i>
                <span>فیلتر</span>
              </button>
            </div>
            <div class="w-1/2">
              <popover
                top="10rem"
                left="0rem"
                anchor="#more-menu"
                @open="autoClose = false"
                @close="autoClose = true"
              >
                <template #activator>
                  <button class="block w-full">
                    <i class="flaticon-086-qr-code text-4xl block mb-2"></i>
                    <span>کیو آر کد</span>
                  </button>
                </template>
                <div dir="rtl" class="p-4 rounded bg-white w-40 border shadow">
                  <div class="border-b">
                    <button class="p-2 pb-4" @click="$router.push('/scan-qr')">اسکن با دوربین</button>
                  </div>
                  <div>
                    <button class="p-2 pt-4" @click="$refs.qr_file.$el.click()">اسکن از گالری</button>
                  </div>
                </div>
              </popover>
            </div>
          </div>
        </popover>

        <button
          :class="[
              'hidden sm:flex items-center bg-blue-450 text-white rounded py-4',
              'md:w-full md:mb-4 md:justify-center',
              'lg:w-auto lg:mb-0 lg:justify-start',
            ]"
          @blur="search"
          @click="search"
        >
          <span v-if="!loading" class="pr-8 pl-4">جستجو</span>
          <span v-else class="loader mx-8 w-5 h-5 border-2 rounded-full border-blue-300"></span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MobilePageHeader"
}
</script>
