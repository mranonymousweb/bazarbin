<template>
  <form class="check-verify-code-form" @submit.prevent="submit">
    <div class="w-full mb-4">
      <img src="~/assets/images/logo.png" alt="" class="block mx-auto w-28 sm:w-auto mb-4 sm:mb-0 mt-8 sm:mt-0">
      <p class="text-blue-450 font-bold text-center mt-2 mb-6">کد تأیید را وارد کنید</p>
      <p class="text-center text-sm font-medium mt-4">
        کد تأیید به شماره
        <span class="text-red-550" v-text="phone"></span>
        ارسال شد.
        <span class="text-blue-450 cursor-pointer" @click="$emit('change-phone')">تغییر شماره</span>
      </p>
    </div>

    <div class="flex justify-between mt-12 mb-24 sm:mb-12" dir="ltr">
      <input
        v-for="i in 5"
        :key="i"
        v-model="$data[`code${i}`]" type="number" min="0" max="9"
        placeholder="•"
        :tabindex="i"
        class="w-1/6 text-center border-0 border-b-2 focus:ring-0"
        @keyup="keyUp"
      >
    </div>

    <div class="text-center text-red-550 font-medium text-sm mb-2 h-5">
      <FadeTransition>
        <span v-if="resend">کد تأیید مجددا ارسال شد.</span>
      </FadeTransition>
      <FadeTransition>
        <span v-if="!resend && showResendLink" class="cursor-pointer" @click="resendCode">کد تأیید را دریافت نکردید؟</span>
      </FadeTransition>
    </div>

    <div class="w-full">
      <button
        type="submit"
        class="w-full ml-1 flex items-center bg-blue-450 text-white rounded py-3 justify-center"
      >
        تأیید کد
      </button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    phone: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showResendLink: false,
      resend: false,
      timeout: false,
      code1: '',
      code2: '',
      code3: '',
      code4: '',
      code5: '',
    }
  },
  mounted() {
    this.timeout = setTimeout(() => {
      this.showResendLink = true
    }, 30000)
  },
  beforeDestroy() {
    clearTimeout(this.timeout)
  },
  methods: {
    submit() {
      const { $axios } = useNuxtApp()
      
      clearTimeout(this.timeout)
      const form = {
        phone: this.phone,
        verification_code: this.code1.toString()
          + this.code2.toString()
          + this.code3.toString()
          + this.code4.toString()
          + this.code5.toString()
      }
      $axios.$post('verify_number', form)
        .then(response => {
          this.$emit('done', response.verification_token)
        })
        .catch(error => {
          console.error('Verification error:', error)
        })
    },
    resendCode() {
      const { $axios } = useNuxtApp()
      
      $axios.$post('send_verification', {phone: this.phone})
        .then(() => {
          this.resend = true
        })
        .catch(error => {
          console.error('Resend code error:', error)
        })
    },
    keyUp(event) {
      if (event.key === 'Backspace') {
        if (!event.target.value && event.target.previousElementSibling) {
          event.target.previousElementSibling.focus()
        }
      } else if (event.target.nextElementSibling) {
        event.target.nextElementSibling.focus()
      }
    }
  }
}
</script>

<style lang="scss">

.check-verify-code-form {
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
}

</style>
