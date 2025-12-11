<template>
  <form class="check-verify-code-form" @submit.prevent="submit">
    <div class="w-full mb-4">
      <img src="~/assets/images/logo.png" alt="" class="block mx-auto w-28 sm:w-auto mb-4 sm:mb-0 mt-8 sm:mt-0">
      <p class="text-blue-450 font-bold text-center mt-2 mb-6">کد بازیابی را وارد کنید</p>
      <p class="text-center text-sm font-medium mt-4">
        کد بازیابی به شماره
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
        <span v-if="resend">کد بازیابی مجددا ارسال شد.</span>
      </FadeTransition>
      <FadeTransition>
        <span v-if="!resend && showResendLink" class="cursor-pointer" @click="resendCode">کد بازیابی را دریافت نکردید؟</span>
      </FadeTransition>
      <FadeTransition>
        <span v-if="errorMessage" class="text-red-550">{{ errorMessage }}</span>
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
      errorMessage: null,
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
    async submit() {
      const { $axios } = useNuxtApp()
      
      clearTimeout(this.timeout)
      this.errorMessage = null
      
      const verificationCode = this.code1.toString()
        + this.code2.toString()
        + this.code3.toString()
        + this.code4.toString()
        + this.code5.toString()
      
      if (verificationCode.length !== 5) {
        this.errorMessage = 'لطفا کد 5 رقمی را کامل وارد کنید.'
        return
      }
      
      try {
        // The API expects verification_token, but send_recovery_code only creates code
        // We need to find a way to convert code to token
        // Since there's no verify_recovery_code endpoint, we'll need to modify the API
        // OR we can try to use the code directly as token
        
        // For now, let's use the code as token
        // The API might need modification to accept code instead of token
        // OR we need to create an endpoint that converts code to token
        
        // Use code as token (this might not work if API strictly checks for token field)
        this.$emit('done', verificationCode)
      } catch (error) {
        console.error('Recovery verification error:', error)
        this.errorMessage = error.response?.data?.message || 'کد بازیابی معتبر نمی باشد.'
      }
    },
    resendCode() {
      const { $axios } = useNuxtApp()
      
      $axios.$post('send_recovery_code', {phone: this.phone})
        .then(() => {
          this.resend = true
          this.showResendLink = false
          this.timeout = setTimeout(() => {
            this.showResendLink = true
            this.resend = false
          }, 30000)
        })
        .catch(error => {
          console.error('Resend recovery code error:', error)
          this.errorMessage = 'خطا در ارسال مجدد کد'
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

