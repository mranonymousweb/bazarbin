<template>
  <div class="flex items-center select-none">
    <label :class="['ml-2 block cursor-pointer', labelClass]">
      <input
        v-model="val"
        type="checkbox"
        v-bind="$attrs"
        :class="['h-4 w-4 ml-2 rounded', inputClass]"
      >
      {{ label }}
    </label>
  </div>
</template>

<script>
export default {
  name: "Checkbox",
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    labelClass: {
      type: String,
      default: 'text-sm text-gray-900'
    },
    inputClass: {
      type: String,
      default: 'text-blue-450 focus:ring-blue-450 border-gray-300'
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      val: false
    }
  },
  watch: {
    modelValue(v) {
      this.val = v
    },
    val(val) {
      this.$emit('update:modelValue', val)
    }
  },
  created() {
    this.val = this.modelValue
  }
}
</script>
