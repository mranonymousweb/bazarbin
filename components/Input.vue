<template>
  <div>

    <label v-if="label" :class="'block pb-2 ' + labelClass">
      {{ label }}
    </label>

    <slot name="after-label"/>

    <div class="relative">

      <textarea
        v-if="type === 'textarea'"
        ref="input"
        :value="modelValue"
        :placeholder="placeholder"
        v-bind="$attrs"
        :class="['block bg-gray-50 rounded w-full p-2 border-none focus:outline-none focus:ring-2 focus:ring-blue-450 ', inputClass, type === 'number' ? 'pl-6' : '']"
        @input="$emit('update:modelValue', $event.target.value)"
      ></textarea>

      <input
        v-else
        ref="input"
        :value="modelValue"
        v-bind="$attrs"
        :placeholder="placeholder"
        :class="['block bg-gray-50 rounded w-full p-2 border-none focus:outline-none focus:ring-2 focus:ring-blue-450 ', inputClass, type === 'number' ? 'pl-6' : '']"
        :type="type"
        @input="$emit('update:modelValue', $event.target.value)"
      >

      <div v-if="type === 'number'" :class="['absolute flex flex-col', numberButtonsClass]">
        <i @click="stepUp">
          <icons-solid-chevron-up view-box="3 3 14 14" class="w-3 h-3 text-cyan-250 cursor-pointer"/>
        </i>
        <i @click="stepDown()">
          <icons-solid-chevron-down view-box="3 3 14 14" class="w-3 h-3 text-cyan-250 cursor-pointer" />
        </i>
      </div>

      <slot name="icon"/>
    </div>

    <ul v-if="errors" :class="'mt-2 text-red-550 text-sm' + errorListClass">
      <li v-for="(e,index) in errors" :key="index" v-text="e"></li>
    </ul>

  </div>
</template>

<script>
import IconsSolidChevronUp from "~/components/icons/solid/ChevronUp.vue";
import IconsSolidChevronDown from "~/components/icons/solid/ChevronDown.vue";
export default {
  name: "Input",
  components: {IconsSolidChevronDown, IconsSolidChevronUp},
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'text'
    },
    inputClass: {
      type: String,
      default: ''
    },
    labelClass: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    errorListClass: {
      type: String,
      default: ''
    },
    errors: {
      type: Array,
      default: null
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    numberButtonsClass: {
      type: String,
      default: 'left-2 top-2'
    }
  },
  emits: ['update:modelValue'],
  methods: {
    focus() {
      this.$refs.input.focus()
    },
    stepUp() {
      this.$refs.input.stepUp()
      this.$emit('update:modelValue', this.$refs.input.value)
    },
    stepDown() {
      this.$refs.input.stepDown()
      this.$emit('update:modelValue', this.$refs.input.value)
    }
  }
}
</script>

<style>
input[type="number"] {
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
  appearance: textfield;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>
