<template>
  <div class="bg-white p-2 sm:p-4 rounded-xl gallery-wrapper">
    <div class="w-full mb-4">
      <img :src="baseUrl+gallery[bigImage]" alt="" class="max-w-full mx-auto rounded-xl">
    </div>
    <div
      class="flex images-thumb relative overflow-hidden -ml-2"
      :style="{'--first-item': sliderFirst}"
      @mouseenter="stopSlider"
      @mouseleave="startSlider"
    >
      <div v-for="(image, index) in gallery" :key="image" class="w-1/2 flex-shrink-0 pl-2">
        <div class="relative image-wrapper w-full">
          <img :src="baseUrl+image" alt="" class="rounded-xl bg-gray-100" @click="bigImage = index">
        </div>
      </div>
      <button
        v-if="gallery.length > 2"
        class="absolute bg-blueGray-500 text-white font-bold text-sm rounded-full w-8 h-8 z-10 top-1/2 -mt-4 right-2 flex items-center justify-center"
        @click="sliderFirst > 0 && sliderFirst--"
      >
        <i class="flaticon-115-left-arrow flex transform rotate-180"></i>
      </button>
      <button
        v-if="gallery.length > 2"
        class="absolute bg-blueGray-500 text-white font-bold text-sm rounded-full w-8 h-8 z-10 top-1/2 -mt-4 left-4 flex items-center justify-center"
        @click="sliderFirst < gallery.length - 2 && sliderFirst++"
      >
        <i class="flaticon-115-left-arrow flex"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Gallery",
  props: {
    gallery: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      bigImage: 0,
      sliderFirst: 0,
      sliderInterval: null,
      baseUrl: process.env.storagePath
    }
  },
  mounted() {
    this.startSlider()
  },
  beforeDestroy() {
    this.stopSlider()
  },
  methods: {
    startSlider() {
      if (this.gallery.length > 2) {
        this.sliderInterval = setInterval(() => {
          this.sliderFirst = this.sliderFirst >= this.gallery.length - 2 ? 0 : this.sliderFirst + 1
        }, 3000)
      }
    },
    stopSlider() {
      if (this.sliderInterval) {
        clearInterval(this.sliderInterval)
        this.sliderInterval = null
      }
    }
  }
}
</script>

<style lang="scss">
.gallery-wrapper {

  .image-wrapper {
    padding-top: 56.25%;

    img {
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      position: absolute;
      object-fit: contain;
      border-radius: 0.25rem;
    }
  }

  .images-thumb {

    > div {
      :first-child {
        transition: margin .5s;
        margin-right: calc((50% + .25rem) * (0 - var(--first-item)));
      }
    }

    button {
      opacity: 0;
      visibility: hidden;
      transition: opacity .5s, visibility .5s linear .5s;
    }

    img {
      cursor: pointer;
    }

    &:hover {

      img {
        &:not(:hover) {
          opacity: .5;
        }
      }

      button {
        opacity: 1;
        visibility: visible;
        transition: opacity .5s;
      }
    }
  }
}
</style>
