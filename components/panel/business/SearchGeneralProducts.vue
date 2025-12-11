<template>
  <div class="search-general-products">
    <div class="flex items-center mb-4">
      <i class="flaticon-063-picture ml-2 text-xl"></i>
      <span class="flex-grow font-bold">افزودن محصول</span>
      <button class="cursor-pointer text-blue-450 text-sm" @click="$emit('request')">
        <i class="flaticon-043-plus"></i>
        <span>محصول من در سرچ نبود</span>
      </button>
    </div>

    <div>
      <p class="mb-6 text-sm">ما احتمالا محصول شما را از قبل ثبت کرده ایم، ابتدا از لیست زیر محصول را جستجو کنید</p>

      <div class="w-full md:w-1/2 mx-auto">
        <Input
          v-model="searchKey"
          placeholder="عنوان محصول خود را تایپ کنید"
          input-class="px-10 text-sm md:text-base"
        >
          <template #icon>
            <i class="flaticon-162-edit absolute right-3 top-2 text-gray-500"></i>
            <span v-if="searching" class="absolute left-3 top-3 loader w-5 h-5 border-2 rounded-full border-blue-300"></span>
          </template>
        </Input>
      </div>

      <div class="grid gap-3 md:gap-8 py-8 md:py-28 select-none">
        <div v-for="(item, index) in products" :key="item.id">
          <figure
            class="transition duration-500"
            :class="['cursor-pointer', ![index, null].includes(selected) ? 'opacity-20' : '']"
            @click="$emit('select', item)"
          >
            <div class="image-wrapper relative w-full h-auto mb-4">
              <img :src="`${baseUrl}${item.picture}`" alt="" class="top-0 right-0 absolute w-full h-full object-contain overflow-hidden rounded">
            </div>
            <figcaption class="font-bold">
              {{ item.name }}
            </figcaption>
          </figure>
        </div>
      </div>

      <slide-down :open="!!(products.length && selected !== null)">
        <div>
          <submit-btn
            label="مرحله بعدی"
            class="mx-auto"
            icon="flaticon-075-left-arrow-2"
            @click="$emit('select', products[selected])"
          />
        </div>
      </slide-down>

    </div>
  </div>
</template>

<script>

import SlideDown from "../../SlideDown";
import Input from "../../Input";
import SubmitBtn from "../../SubmitBtn";

export default {
  name: "PanelBusinessSearchGeneralProducts",
  components: {SubmitBtn, Input, SlideDown},
  data() {
    return {
      timeout: null,
      searchKey: '',
      searching: false,
      products: [],
      selected: null,
      baseUrl: process.env.storagePath,
    }
  },
  watch: {
    searchKey(value) {

      if (this.timeout) {
        clearTimeout(this.timeout)
      }

      if (!value) {
        this.timeout = null
        this.products = []
        return
      }

      this.timeout = setTimeout(() => {
        this.search()
      },1500)
    },
    timeout(value) {
      this.searching = value
    }
  },
  methods: {
    search() {
      this.$axios.$get('/home/general_products?search=' + this.searchKey)
        .then(response => {
          this.products = response
          this.timeout = null
        })
    }
  }
}
</script>

<style lang="scss">
.search-general-products {

  .grid {
    grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));

    .image-wrapper {
      padding-top: 57.7%;
    }

    @media (min-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(245px, 1fr));
    }
  }
}
</style>
