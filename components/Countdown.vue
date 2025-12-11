<template>
<div class="flex flex-col items-start">

  <div class="flex dir-ltr text-white">
    <p class="bg-cyan-250 rounded lg:rounded-lg mr-1 lg:mr-2 w-10 h-8 lg:w-12 lg:h-10 flex justify-center items-center lg:text-lg font-bold relative">
      <span class="absolute w-14 border-b-2 border-white"></span>
      {{ days }}
    </p>

    <p class="bg-cyan-250 rounded lg:rounded-lg mr-1 lg:mr-2 w-10 h-8 lg:w-12 lg:h-10 flex justify-center items-center lg:text-lg font-bold relative">
      <span class="absolute w-14 border-b-2 border-white"></span>
      {{ hours }}
    </p>

    <p class="bg-cyan-250 rounded lg:rounded-lg mr-1 lg:mr-2 w-10 h-8 lg:w-12 lg:h-10 flex justify-center items-center lg:text-lg font-bold relative">
      <span class="absolute w-14 border-b-2 border-white"></span>
      {{ minutes }}
    </p>

    <p class="bg-cyan-250 rounded lg:rounded-lg w-10 h-8 lg:w-12 lg:h-10 flex justify-center items-center lg:text-lg font-bold relative">
      <span class="absolute w-14 border-b-2 border-white"></span>
      {{ seconds }}
    </p>
  </div>

  <div class="flex dir-ltr text-xs lg:text-sm text-gray-500 font-medium mt-1 lg:mt-2">
    <span class="mr-1 lg:mr-2">روز تا اتمام شارژ</span>
    <span class="w-10 lg:w-12 mr-1 lg:mr-2 text-center">ساعت</span>
    <span class="w-10 lg:w-12 mr-1 lg:mr-2 text-center">دقیقه</span>
    <span class="w-10 lg:w-12 text-center">ثانیه</span>
  </div>

</div>
</template>

<script>
export default {
  name: "Countdown",
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      current: 0,
      interval: null
    }
  },
  computed: {
    days() {
      return Math.floor(this.current / 86400)
    },
    hours() {
      const value = Math.floor((this.current - (this.days * 86400)) / 3600)
      return value > 9 ? value : `0${value}`
    },
    minutes() {
      const value = Math.floor((this.current - (this.days * 86400) - (this.hours * 3600)) / 60)
      return value > 9 ? value : `0${value}`
    },
    seconds() {
      const value = this.current - (this.days * 86400) - (this.hours * 3600) - (this.minutes * 60)
      return value > 9 ? value : `0${value}`
    }
  },
  watch: {
    value() {
      this.start()
    }
  },
  created() {
    this.start()
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    start() {
      if (this.interval) {
        clearInterval(this.interval)
      }
      this.current = this.value
      this.interval = setInterval(() => {
        if (this.current > 0) {
          this.current--
        } else {
          clearInterval(this.interval)
        }
      }, 1000)
    }
  }
}
</script>
