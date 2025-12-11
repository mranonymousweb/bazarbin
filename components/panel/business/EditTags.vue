<template>
  <div class="bg-white rounded p-3 lg:p-6">
    <div class="flex items-center">
      <i class="text-base flaticon-032-briefcase ml-2"></i>
      <span class="flex-grow lg:text-gray-500 font-bold">برچسب ها</span>
      <span class="cursor-pointer text-blue-450" @click="open = !open">
        <i v-if="!open" class="flaticon-043-plus"></i>
        <span>{{ open ? 'بستن' : 'ویرایش اطلاعات' }}</span>
      </span>
    </div>

    <slide-down :open="open">
      <div class="p-1 pt-4">
        <tags-input v-model="tags"/>
      </div>
    </slide-down>
  </div>
</template>

<script>
export default {
  name: "PanelBusinessEditTags",
  props: {
    value: {
      type: String,
      default: null
    },
    exist: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      open: !this.exist,
      tags: '',
    }
  },
  watch: {
    value() {
      this.tags = this.value
    },
    tags() {
      this.$emit('input', this.tags)
    }
  },
  created() {
    this.tags = this.value
  },
}
</script>
