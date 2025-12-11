<template>
  <div class="relative">
    <input
      v-model="val"
      :placeholder="placeholder"
      v-bind="$attrs"
      class="w-full bg-white border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-450"
      @keypress="checkVal"
    />
    <span :class="['absolute', suffixClass]">{{ suffix }}</span>
  </div>
</template>

<script>
export default {
  name: "PriceInput",
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [Number, String],
      default: 0
    },
    placeholder: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: 'تومان'
    },
    suffixClass: {
      type: String,
      default: 'left-4 top-4 text-sm text-gray-400'
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      val: '',
      price: 0,
    }
  },
  watch: {
    modelValue(v) {
      if (this.price !== v) {
        this.price = v || 0
        this.val = this.price ? this.price.toLocaleString() : ''
      }
    },
    val(val) {
      if (!val) {
        this.price = 0
        this.$emit('update:modelValue', 0)
        return
      }
      this.price = val.includes(',') ? +(val.replaceAll(',', '')) : +val
      if (val !== this.price.toLocaleString()) {
        this.$nextTick(() => {
          this.val = this.price ? this.price.toLocaleString() : ''
          this.$emit('update:modelValue', this.price)
        })
      }
    }
  },
  created() {
    this.price = this.modelValue || 0
    this.val = this.price ? this.price.toLocaleString() : ''
  },
  methods: {
    checkVal(event) {
      if (!['0','1','2','3','4','5','6','7','8','9'].includes(event.key)) {
        event.preventDefault()
        return false
      }
    }
  }
}
</script>
