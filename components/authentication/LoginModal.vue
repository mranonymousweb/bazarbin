<template>
  <Modal
    max-width="xl"
    :show="open"
    :full-page-on-mobile="true"
    @close="$emit('close')"
  >
    <div class="bg-white sm:shadow-xl p-8 sm:p-20 pb-32 sm:pb-20 w-full h-screen sm:h-auto relative overflow-y-auto">
      <i
        class="flaticon-034-cancel absolute left-8 top-6 text-red-550 font-bold text-lg cursor-pointer"
        @click="$emit('close')"
      ></i>

      <div class="grid">
        <FadeTransition>
          <authentication-LoginForm
            v-if="type === 'login'"
            class="col-start-1 row-start-1"
            @login="$emit('close')"
            @register="type = 'verification-request'"
            @forget-password="type = 'password-recovery'"
          />
        </FadeTransition>

        <FadeTransition>
          <authentication-VerificationRequestForm
            v-if="type === 'verification-request'"
            class="col-start-1 row-start-1"
            @done="showVerifyCheckForm"
          />
        </FadeTransition>

        <FadeTransition>
          <authentication-VerifyCheckForm
            v-if="type === 'verification-check'"
            :phone="phone"
            class="col-start-1 row-start-1"
            @change-phone="type = 'verification-request'"
            @done="showRegisterForm"
          />
        </FadeTransition>

        <FadeTransition>
          <authentication-RegisterForm
            v-if="type === 'register'"
            :phone="phone"
            :token="token"
            class="col-start-1 row-start-1"
            @done="$emit('close')"
          />
        </FadeTransition>

        <FadeTransition>
          <authentication-PasswordRecovery
            v-if="type === 'password-recovery'"
            class="col-start-1 row-start-1"
            @done="showPasswordRecoveryVerify"
          />
        </FadeTransition>

        <FadeTransition>
          <authentication-PasswordRecoveryVerifyForm
            v-if="type === 'password-recovery-verify'"
            :phone="phone"
            class="col-start-1 row-start-1"
            @change-phone="type = 'password-recovery'"
            @done="showPasswordResetForm"
          />
        </FadeTransition>

        <FadeTransition>
          <authentication-PasswordResetForm
            v-if="type === 'password-reset'"
            :phone="phone"
            :token="token"
            class="col-start-1 row-start-1"
            @done="$emit('close')"
          />
        </FadeTransition>

      </div>

    </div>
  </Modal>
</template>

<script>
export default {
  name: "LoginModal",
  props: {
    open: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      type: 'login',
      phone: '',
      token: '',
    }
  },
  watch: {
    open(value) {
      if (!value) {
        this.type = 'login'
      }
    }
  },
  methods: {
    showVerifyCheckForm(phone) {
      this.phone = phone
      this.type = 'verification-check'
    },
    showRegisterForm(token) {
      this.token = token
      this.type = 'register'
    },
    showPasswordRecoveryVerify(phone) {
      this.phone = phone
      this.type = 'password-recovery-verify'
    },
    showPasswordResetForm(token) {
      this.token = token
      this.type = 'password-reset'
    }
  }
}
</script>
