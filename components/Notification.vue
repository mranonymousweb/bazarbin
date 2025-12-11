<template>
  <div class="fixed bottom-4 w-80 md:w-96 max-w-full left-1/2 -ml-40 md:-ml-48 z-50">
    <transition name="fade">
      <div v-if="show" :class="['flex px-6 py-4 shadow-md rounded-md relative', cssClass]">
        <div class="pl-3 md:pl-6">
          <slot name="icon"/>
          <i class="
            flaticon-034-cancel
            font-bold text-xs text-gray-300 hover:text-gray-700 transition-all
            absolute left-4 top-3 cursor-pointer" @click="$emit('close')"></i>
        </div>
        <div>
          <h3 :class="['mb-2 font-bold', titleClass]" v-html="title"></h3>
          <p v-if="message" :class="['text-xs', textClass]" v-html="message"></p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Notification",
  props: {
    title: {
      type: String,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 0
    },
    cssClass: {
      type: String,
      default: 'bg-white border border-gray-100'
    },
    titleClass: {
      type: String,
      default: 'text-gray-800'
    },
    textClass: {
      type: String,
      default: 'text-gray-500'
    },
  },
  data() {
    return {
      timeout: null
    }
  },
  watch: {
    show(value) {
      if (value && this.duration) {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          this.$emit('close')
          this.timeout = false
        }, this.duration)
      }
    }
  }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
