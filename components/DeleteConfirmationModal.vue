<template>
  <confirmation-modal :show="show" @close="$emit('close')" max-width="lg">
    <template #title>
      <span>تأیید حذف</span>
    </template>
    <template #content>
      <div>
        {{ message }}
        <br>
        آیا حذف را تأیید می کنید؟
      </div>
    </template>
    <template #footer>
      <button
        class="ml-4 bg-red-600 text-white rounded py-2 px-4 text-xs font-iranyekan"
        @click="$emit('confirm')"
      >
        بله حذف شود
      </button>
      <button
        class="bg-green-600 text-white rounded py-2 px-4 text-xs font-iranyekan"
        @click="$emit('close')"
      >منصرف شدم
      </button>
    </template>
  </confirmation-modal>
</template>

<script>
export default {
  name: "DeleteConfirmationModal",
  props: {
    show: {
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      default: 'عملیات حذف قابل بازگشت نمی باشد.'
    }
  }
}
</script>
