export default {
  mounted() {
    if (window.navigator && window.navigator.serviceWorker) {
      window.navigator.serviceWorker.register('/sw.js')
    }
  }
}
