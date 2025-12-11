<template>
  <div class="transition-all overflow-hidden duration-500">
    <slot/>
  </div>
</template>

<script>
export default {
  name: "SlideDown",
  props: {
    open: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loaded: false
    }
  },
  watch: {
    open() {
      this.setHeight()
    }
  },
  mounted() {
    this.setHeight()
  },
  methods: {
    setHeight() {
      if (this.open) {
        this.$el.style.height = this.$el.scrollHeight + 'px'
        this.$nextTick(() => {
          setTimeout(() => {
            this.$el.style.height = 'auto'
          },600)
        })
      } else if (this.loaded) {
        this.$el.style.height = this.$el.clientHeight + 'px'
        setTimeout(() => {
          this.$el.style.height = 0
        }, 0)
      } else {
        this.$el.style.height = 0
      }

      this.loaded = true
    }
  }
}
</script>
