<template>
  <Notification
    title="عملیات با موفقیت انجام شد!"
    :show="show"
    :message="message"
    :duration="duration"
    css-class="bg-green-500"
    title-class="text-white"
    text-class="text-white"
    @close="$emit('close')"
  >
    <template #icon>
      <i class="
            flaticon-151-check font-bold text-base text-white border-2 border-white
            rounded-full inline-block w-8 h-8 flex justify-center items-center"
      ></i>
    </template>
  </Notification>
</template>

<script>
export default {
  name: "SuccessNotification",
  props: {
    show: {
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 6000
    }
  }
}
</script>
