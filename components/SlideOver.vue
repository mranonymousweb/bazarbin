<template>
  <transition leave-active-class="duration-200" @after-leave="$emit('leave-completed')">
    <div
      v-show="show"
      class="fixed inset-0 overflow-hidden sm:px-0 z-40"
      scroll-region
    >
      <transition enter-active-class="ease-in-out duration-500"
                  enter-class="opacity-0"
                  enter-to-class="opacity-100"
                  leave-active-class="ease-in-out duration-500"
                  leave-class="opacity-100"
                  leave-to-class="opacity-0">
        <div v-show="show" class="fixed inset-0 transform transition-all" @click="close">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
      </transition>

      <transition
        enter-active-class="transform transition ease-in-out duration-500"
        enter-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transform transition ease-in-out duration-500"
        leave-class="translate-y-0"
        leave-to-class="translate-y-full"
      >
        <div
          v-show="show"
          :class="[
            'absolute',
            side === 'bottom' ? 'bottom-0' : side === 'left' ? 'left-0' : side === 'right' ? 'right-0' : 'top-0',
            ['top','bottom'].includes(side) ? 'w-full' : 'h-full'
            ]"
        >
          <slot></slot>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>

import 'animate.css/source/zooming_exits/zoomOut.css'
import 'animate.css/source/zooming_entrances/zoomIn.css'

export default {
  name: 'SlideOver',

  props: {
    show: {
      type: Boolean,
      default: false
    },
    side: {
      type: String,
      required: true
    },
    closeable: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    maxWidthClass() {
      return {
        'sm': 'sm:max-w-sm',
        'md': 'sm:max-w-md',
        'lg': 'sm:max-w-lg',
        'xl': 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '3xl': 'sm:max-w-3xl',
        '4xl': 'sm:max-w-4xl',
      }[this.maxWidth]
    }
  },

  watch: {
    show(show) {
      if (show) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = null
      }
    }
  },

  mounted() {
    document.addEventListener('keydown', this.closeOnEscape)
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.closeOnEscape)
    document.body.style.overflow = null
  },

  methods: {
    close() {
      if (this.closeable) {
        this.$emit('close')
      }
    },
    closeOnEscape(e) {
      if (e.key === 'Escape' && this.show) {
        this.close()
      }
    }
  }
}

</script>
