<template>
  <Modal
    :show="open"
    :full-page-on-mobile="true"
    @close="$emit('close')"
  >
    <div class="bg-white sm:shadow-xl p-6 w-full h-screen sm:h-auto relative overflow-y-auto">
      <i
        class="flaticon-034-cancel absolute left-4 top-4 text-red-550 font-bold text-lg cursor-pointer"
        @click="$emit('close')"
      ></i>

      <div class="text-lg font-medium mb-8">
        گزارش تخلف
      </div>

      <ul class="text-gray-500 text-sm mb-4 text-justify list-disc pr-4">
        <li>گزارش شما در اولین فرصت بررسی خواهد شد.</li>
        <li>بازاربین صرفا جهت مشاهده کالا و خدمات مشاغل می باشد و هیچ گونه مسئولیتی در قبال کالا یا خدمات ارائه شده ندارد، از پرداخت وجه یا بیعانه بپرهیزید، برای پرداخت وجه، با مراجعه حضوری به کسب و کار مدنظر اقدام نمایید.</li>
      </ul>

      <div>
        <Input
          v-model="description"
          type="textarea"
          rows="6"
          label="توضیحات"
          placeholder="توضیحات خود را در این قسمت بنویسید..."
        />
      </div>

      <div class="flex justify-center mt-8">
        <button
          type="submit"
          class="w-full sm:w-1/2 sm:ml-1 flex items-center bg-blue-450 text-white rounded py-3 justify-center"
          @click="submit"
        >
          <span v-if="saving" class="loader mx-8 w-5 h-5 border-2 rounded-full border-blue-300"></span>
          <span v-else>ثبت گزارش</span>
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>

export default {
  props: {
    open: {
      type: Boolean,
      required: true
    },
    id: {
      type: [Number, String],
      required: true
    },
    subject: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      description: '',
      saving: false,
    }
  },
  methods: {
    submit() {
      this.saving = true
      this.$axios.$post('report', {
        id: this.id,
        subject: this.subject,
        description: this.description
      })
        .then(response => {
          this.$store.commit('notification/success', response.message)
          this.$emit('close')
        })
        .catch(error => this.showError(error))
        .finally(() => {
          this.saving = false
        })
    }
  }
}

</script>
