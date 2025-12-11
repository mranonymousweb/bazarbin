<template>
  <button
    :class="[
              'flex items-center bg-blue-450 text-white rounded py-2',
              'md:w-full md:mb-4 md:justify-center',
              'lg:w-auto lg:mb-0 lg:justify-start',
            ]"
    @click="$emit('click')"
  >
    <i v-if="icon" :class="['px-3 md:px-4 xl:px-3 2xl:px-4', icon, iconClass]"></i>
    <span v-if="!loading" :class="['pl-3 md:pl-8', labelClass || ($route.params.id ? 'xl:pl-6 2xl:pl-8' : '')]">
      {{ label || ($route.params.id ? 'بروزرسانی' : 'ثبت') }}
    </span>
    <span v-else class="loader mx-8 w-5 h-5 border-2 rounded-full border-blue-300"></span>
  </button>
</template>

<script>
export default {
  name: "SubmitBtn",
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: 'flaticon-151-check'
    },
    iconClass: {
      type: String,
      default: 'font-bold'
    },
    label: {
      type: String,
      default: ''
    },
    labelClass: {
      type: String,
      default: ''
    },
  }
}
</script>
