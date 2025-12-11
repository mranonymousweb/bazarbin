<template>
  <div>
    <front-header class="mb-8"/>
    <div class="text-center pt-8">
      <p class="text-red-550">{{ error }}</p>
      <qrcode-stream  @decode="onDecode" @init="onInit"/>
    </div>
  </div>
</template>

<script>

import { QrcodeStream  } from 'vue-qrcode-reader'

export default {
  name: "ScanQrPage",
  components: {QrcodeStream},
  data() {
    return {
      error: ""
    }
  },
  methods: {
    async onInit (promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.error = "خطا: اجازه دسترسی به دوربین تایید نشده است."
        } else if (error.name === 'NotFoundError') {
          this.error = "خطا: دوربین یافت نشد."
        } else if (error.name === 'NotSupportedError') {
          this.error = "خطا: برای استفاده از دوربین ارتباط HTTPS امن لازم است."
        } else if (error.name === 'NotReadableError') {
          this.error = "خطا: دوربین درحال استفاده می باشد."
        } else if (error.name === 'OverconstrainedError') {
          this.error = "خطا: دوربین شما قابل استفاده نمی باشد."
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = "خطا: مرورگر شما قدیمی می باشد."
        } else if (error.name === 'InsecureContextError') {
          this.error = 'خطا: برای استفاده از دوربین ارتباط HTTPS امن لازم است.';
        } else {
          this.error = `خطا در فعالسازی دوربین(${error.name})`;
        }
      }
    },
    onDecode(data) {
      const origin = window.location.origin;
      if (data.startsWith(origin)) {
        this.$router.push(data.substring(origin.length))
      }
    }
  }
}
</script>
