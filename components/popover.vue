<template>
  <component
    :is="tag"
    @click="active = openOnHover ? active : !active"
    @mouseover="active = openOnHover ? true : active"
    @mouseleave="active = openOnHover ? false : active"
  >
    <transition name="fade">
      <div
        v-if="mask"
        v-show="active"
        ref="mask"
        class="fixed w-screen h-screen top-0 left-0 bg-gray-800 opacity-30"
        @click="active = false"
      ></div>
    </transition>
    <transition name="fade">
      <div
        v-show="active"
        ref="popover"
        class="absolute z-30"
        :style="{left: x, top: y}"
      >
        <slot></slot>
      </div>
    </transition>
    <slot name="activator"></slot>
  </component>
</template>

<script>
export default {
  name: "Popover",
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    anchor: {
      type: String,
      default: ''
    },
    top: {
      type: String,
      default: ''
    },
    left: {
      type: String,
      default: ''
    },
    mask: {
      type: Boolean,
      default: false
    },
    openOnHover: {
      type: Boolean,
      default: false
    },
    closeOnClickOutside: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      active: false,
      x: '0',
      y: '0',
    }
  },
  watch: {
    active(value) {
      if (value) {
        this.disableScroll()
        this.fixPosition()
        this.$emit('open')
      } else {
        this.enableScroll()
        this.$emit('close')
      }
    },
    closeOnClickOutside(val) {
      if (!this.mask) {
        val
          ? document.addEventListener('click', this.closeOnClick)
          : document.removeEventListener('click', this.closeOnClick)
      }
    }
  },
  mounted() {
    if (this.mask && this.$refs.mask) {
      document.body.append(this.$refs.mask)
    }
    if (this.$refs.popover) {
      document.body.append(this.$refs.popover)
    }
    window.addEventListener('resize', this.fixPosition)
    if (!this.mask && this.closeOnClickOutside) {
      document.addEventListener('click', this.closeOnClick)
    }
  },
  beforeUnmount() {
    if (this.$refs.popover) {
      this.$refs.popover.remove()
    }
    if (this.mask && this.$refs.mask) {
      this.$refs.mask.remove()
    }
    this.enableScroll()
    window.removeEventListener('resize', this.fixPosition)
    if (!this.mask && this.closeOnClickOutside) {
      document.removeEventListener('click', this.closeOnClick)
    }
  },
  methods: {
    fixPosition() {
      const el = this.anchor ? document.querySelector(this.anchor) : this.$el
      const rect = el.getBoundingClientRect()
      this.x = this.left ? `calc(${rect.x + window.scrollX}px + (${this.left}))`: (rect.x + window.scrollX) + 'px'
      this.y = this.top ? `calc(${rect.y + window.scrollY}px + (${this.top}))`: (rect.y + window.scrollY ) + 'px'
    },
    closeOnClick(event) {
      if (this.active && !this.$el.contains(event.target) && !this.$refs.popover.contains(event.target)) {
        this.active = false
      }
    },
    disableScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      window.onscroll = function () {
        window.scrollTo(scrollLeft, scrollTop);
      };
    },
    enableScroll() {
      window.onscroll = function () {
      };
    },
  }
}
</script>
