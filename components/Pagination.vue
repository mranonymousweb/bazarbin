<template>
  <div class="bg-white py-3 flex items-center justify-between border-t border-gray-200 select-none">
    <div class="flex-1 flex justify-between sm:hidden">
      <span
        :class="{
          'relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md':true,
          'bg-white border-gray-300':true,
          'text-gray-400 cursor-default':currentPage < 2,
          'text-gray-700 hover:bg-gray-50 cursor-pointer': currentPage > 1
        }"
        @click="currentPage > 1 && $emit('select-page', currentPage - 1)"
      >
        صفحه قبل
      </span>
      <span
        :class="{
          'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300': true,
          'text-sm font-medium rounded-md bg-white': true,
          'text-gray-400 cursor-default':currentPage === lastPage,
          'text-gray-700 cursor-pointer hover:bg-gray-50': lastPage > currentPage
        }"
        @click="lastPage > currentPage && $emit('select-page', currentPage + 1)"
      >
        صفحه بعد
      </span>
    </div>
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          ردیف
          <span class="font-medium" v-text="fromItem"></span>
          تا
          <span class="font-medium" v-text="toItem"></span>
          از مجموع
          <span class="font-medium" v-text="totalItems"></span>
          مورد
        </p>
      </div>
      <div>
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">

          <span
            :class="{
              'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300':true,
              'bg-white text-sm font-medium -mx-px':true,
              'text-gray-300 cursor-default': currentPage < 2,
              'text-gray-500 hover:bg-gray-50 cursor-pointer': currentPage > 1
            }"
            @click="currentPage > 1 && $emit('select-page', 1)"
          >
            <span class="sr-only">صفحه اول</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-5 w-5"
            >
              <polygon points="7 6 14 12 7 18 7 6"></polygon>
              <line x1="18" y1="6" x2="18" y2="18"></line>
            </svg>
          </span>

          <span
            :class="{
              'relative inline-flex items-center px-2 py-2 border border-gray-300':true,
              'bg-white text-sm font-medium':true,
              'text-gray-300 cursor-default': currentPage < 2,
              'text-gray-500 hover:bg-gray-50 cursor-pointer': currentPage > 1
            }"
            @click="currentPage > 1 && $emit('select-page', currentPage - 1)"
          >
            <span class="sr-only">صفحه قبل</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                 aria-hidden="true">
              <path fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"/>
            </svg>
          </span>

          <span
            v-for="page in pages"
            :key="page.page"
            :aria-current="currentPage === page.page ? 'page' : false"
            :class="{
              'z-10 bg-indigo-50 border-indigo-300 text-indigo-600 relative inline-flex': page.active,
              'items-center px-4 py-2 border text-sm font-medium': page.active,
              'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex': !page.active,
              'relative items-center px-4 py-2 border text-sm font-medium cursor-pointer': !page.active,
            }"
            @click="page.active || $emit('select-page', page.page)"
            v-text="page.page"
          />

          <span
            :class="{
              'relative inline-flex items-center px-2 py-2 border border-gray-300': true,
              'bg-white text-sm font-medium': true,
              'text-gray-300 cursor-default': currentPage === lastPage,
              'text-gray-500 hover:bg-gray-50 cursor-pointer': lastPage > currentPage
            }"
            @click="lastPage > currentPage && $emit('select-page', currentPage + 1)"
          >
            <span class="sr-only">صفحه بعد</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                 aria-hidden="true">
              <path fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"/>
            </svg>
          </span>

          <span
            :class="{
              'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300': true,
              'bg-white text-sm font-medium': true,
              'text-gray-300 cursor-default': currentPage === lastPage,
              'text-gray-500 hover:bg-gray-50 cursor-pointer': lastPage > currentPage
            }"
            @click="lastPage > currentPage && $emit('select-page', lastPage)"
          >
            <span class="sr-only">صفحه آخر</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-5 w-5"
            >
              <polygon points="17 6 10 12 17 18 17 6"></polygon>
              <line x1="6" y1="6" x2="6" y2="18"></line>
            </svg>
          </span>

        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    lastPage: {
      type: Number,
      required: true,
    },
    totalItems: {
      type: Number,
      required: true,
    },
    fromItem: {
      type: Number,
      required: true,
    },
    toItem: {
      type: Number,
      required: true,
    },
  },
  computed: {
    pages() {

      const pages = []

      const after = this.lastPage - this.currentPage > 2 ? 2 : this.lastPage - this.currentPage;

      for (let i = after < 2 ? 2 + (2 - after) : 2; i > 0; i--) {
        if (this.currentPage > i) {
          pages.push({
            active: false,
            page: this.currentPage - i
          })
        }
      }

      pages.push({active: true, page: this.currentPage})

      let i = 1;

      while (pages.length < 5 && this.currentPage + i <= this.lastPage) {
        pages.push({
          active: false,
          page: this.currentPage + i
        })
        i++
      }

      return pages
    }
  }
}
</script>
