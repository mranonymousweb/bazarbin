export default {
  beforeDestroy () {
    if (typeof window === 'undefined') return
    window.removeEventListener('resize', this.onResize, { passive: true })
  },
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  methods: {
    onResize () {
      this.$store.commit('set', {key: 'isMobile', value: window.innerWidth < 640})
      if (window.innerWidth < 640) {
        this.$store.commit('set', {key: 'screenSize', value: 'xs'})
      } else if (window.innerWidth < 768) {
        this.$store.commit('set', {key: 'screenSize', value: 'sm'})
      } else if (window.innerWidth < 1024) {
        this.$store.commit('set', {key: 'screenSize', value: 'md'})
      } else if (window.innerWidth < 1280) {
        this.$store.commit('set', {key: 'screenSize', value: 'lg'})
      } else if (window.innerWidth < 1536) {
        this.$store.commit('set', {key: 'screenSize', value: 'xl'})
      } else if (window.innerWidth >= 1536) {
        this.$store.commit('set', {key: 'screenSize', value: '2xl'})
      }
    },
  }
}
