<template>
  <Notification
    title="عملیات با خطا مواجه شد!"
    :show="show"
    :message="message"
    :duration="duration"
    css-class="bg-red-550"
    title-class="text-white"
    text-class="text-white"
    @close="$emit('close')"
  >
    <template #icon>
      <div>
        <i class="
            flaticon-034-cancel font-bold text-base text-white border-2 border-white
            rounded-full inline-block w-8 h-8 flex justify-center items-center"
        ></i>
        <span v-if="code" class="font-bold text-2xl text-white mt-2 inline-block origin-number" v-text="code"></span>
      </div>
    </template>
  </Notification>
</template>

<script>
export default {
  name: "ErrorNotification",
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
    },
    code: {
      type: Number,
      default: null
    }
  }
}
</script>
