<template>
  <div class="relative">
    <div @click="open = ! open">
      <slot name="trigger"></slot>
    </div>

    <!-- Full Screen Dropdown Overlay -->
    <div v-show="open" class="fixed inset-0 z-40" @click="open = false">
    </div>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95">
      <div v-show="open"
           class="shadow-lg"
           :class="['z-50', slideOnMobile ? 'fixed inset-0 sm:absolute sm:mt-2 sm-rounded-md' : 'absolute mt-2 rounded-md', widthClass, alignmentClasses, ...containerClasses]"
           @click="open = closeOnClick ? false : open">
        <div :class="['ring-1 ring-black ring-opacity-5', slideOnMobile ? 'h-full sm:h-auto overflow-auto ' : 'rounded-md', contentClasses]">
          <slot name="content"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'Dropdown',
  props: {
    align: {
      type: String,
      default: 'right'
    },
    slideOnMobile: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '48'
    },
    containerClasses: {
      type: Array,
      default: () => []
    },
    contentClasses: {
      type: Array,
      default: () => ['py-1', 'bg-white']
    },
    closeOnClick: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      open: false
    }
  },

  computed: {
    widthClass() {
      return {
        '48': 'w-48',
        '80': 'w-80',
        '96': 'w-96',
      }[this.width.toString()]
    },

    alignmentClasses() {
      if (this.align === 'left') {
        return 'origin-top-left left-0 sm:left-0 sm:right-auto'
      } else if (this.align === 'right') {
        return 'origin-top-right right-0 sm:right-0 sm:left-auto'
      } else {
        return 'origin-top'
      }
    },
  },

  mounted() {
    document.addEventListener('keydown', this.closeOnEscape)
  },

  beforeUnmount() {
    document.removeEventListener('keydown', this.closeOnEscape)
  },

  methods: {
    closeOnEscape(e) {
      if (this.open && e.keyCode === 27) {
        this.open = false
      }
    }
  }
}
</script>
