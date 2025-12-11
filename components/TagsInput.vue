<template>
  <div>

    <label v-if="label" :class="'block pb-2 ' + labelClass" v-text="label"></label>

    <slot name="after-label"/>

    <div :class="['tags-input block bg-gray-50 rounded w-full px-2 pt-2 border-none', focused && 'outline-none ring-2 ring-blue-450']">
      <ul class="flex flex-wrap" @click="clickOnList">
        <li
          v-for="tag in tags"
          :key="tag"
          class="inline-block bg-blue-450 px-2 py-1 rounded mx-1 mb-2 text-white"
        >
          <span v-text="tag"></span>
          <i class="flaticon-034-cancel cursor-pointer" @click="removeTag(tag)"></i>
        </li>
      </ul>
      <div>
        <input
          ref="input"
          class="w-full border-none focus:outline-none focus:ring-0 bg-transparent pt-0 px-1 text-sm"
          type="text"
          :placeholder="placeholder"
          @focus="focused = true"
          @blur="focused = false"
          @keydown.enter.prevent="addTag"
        >
      </div>
    </div>
    <div class="flex justify-end">
      <button class="bg-green-500 flex items-center text-white px-1 rounded-b" @click="addTag">
        <i class="flaticon-043-plus pl-1"></i>
        افزودن
      </button>
    </div>

    <ul v-if="errors" :class="'mt-2 text-red-550 text-sm' + errorListClass">
      <li v-for="(e,index) in errors" :key="index" v-text="e"></li>
    </ul>

  </div>
</template>

<script>
export default {
  name: "TagsInput",
  props: {
    value: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: null
    },
    labelClass: {
      type: String,
      default: ''
    },
    errorListClass: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'برچسب ها را تایپ کنید و برای ثبت کلید افزودن یا Enter را بزنید'
    },
    errors: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      focused: false,
      tags: []
    }
  },
  watch: {
    tags(value) {
      this.$emit('input', value.join(','))
    },
    value(value) {
      this.tags = value ? value.split(/(?:, ?|، ?)/) : []
    }
  },
  created() {
    this.tags = this.value ? this.value.split(/(?:, ?|، ?)/) : []
  },
  methods: {
    addTag() {
      if (!this.$refs.input.value)
        return
      this.tags.push(this.$refs.input.value)
      this.$refs.input.value = ''
    },
    removeTag(tag) {
      const index = this.tags.findIndex(x => tag === x)

      if (index < 0)
        return

      this.tags.splice(index,1)
    },
    clickOnList(event) {
      if (event.target.tagName === 'UL') {
        this.$refs.input.focus()
      }
    }
  }
}
</script>

<style lang="scss">
.tags-input {

  .flaticon-034-cancel {
    font-size: .5rem;
  }
}
</style>
