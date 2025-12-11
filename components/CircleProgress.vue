<template>
  <div class="grid">
    <div class="col-start-1 row-start-1 rounded-full" :style="style"></div>
    <div class="col-start-1 row-start-1">
      <svg :width="size" :height="size" viewBox="0 0 88 88" class="relative">
        <circle
          cx="44"
          cy="44"
          :r="r"
          :stroke-dasharray="dasharray"
          :stroke-dashoffset="dashoffset"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
          fill="none"
        />
      </svg>
    </div>
    <div dir="ltr" class="flex justify-center items-center col-start-1 row-start-1" :style="style">
      <slot>
        <span :class="valueClass">{{ value }}</span>
        <span :class="percentClass">%</span>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "CircleProgress",
  props: {
    value: {
      type: Number,
      required: true
    },
    size: {
      type: Number,
      default: 88
    },
    valueClass: {
      type: String,
      default: 'font-bold text-lg pt-1 pl-1'
    },
    percentClass: {
      type: String,
      default: 'text-xs text-sky-400 pb-1'
    }
  },
  data() {
    return {
      r: 39.5
    }
  },
  computed: {
    dasharray() {
      return Math.PI * this.r * 2
    },
    dashoffset() {
      return (100 - this.value) * this.dasharray / 100
    },
    style() {
      const sub = (this.size * 8) / 88
      return {
        width: (this.size - sub) +'px',
        height: (this.size - sub) +'px',
        "margin-top": (sub / 2) +'px',
        "margin-right": (sub / 2) +'px',
      }
    }
  }
}
</script>
