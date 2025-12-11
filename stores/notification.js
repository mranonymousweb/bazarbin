import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    success: {
      active: false,
      message: '',
      duration: 3000
    },
    error: {
      active: false,
      message: '',
      code: null,
      duration: 5000
    }
  }),
  
  actions: {
    showSuccess(message, duration = 3000) {
      this.success = {
        active: true,
        message,
        duration
      }
    },
    
    showError(message, code = null, duration = 5000) {
      this.error = {
        active: true,
        message,
        code,
        duration
      }
    },
    
    closeSuccess() {
      this.success.active = false
    },
    
    closeError() {
      this.error.active = false
    }
  }
})



