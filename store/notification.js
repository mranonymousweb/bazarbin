export const state = () => ({
  success: {
    active: false,
    duration: 6000,
    message: ''
  },
  error: {
    active: false,
    message: '',
    code: 0,
    duration: 6000,
  }
})

export const mutations = {
  error(state, payload) {
    state.error.message = typeof payload === 'string' ? payload : payload.message
    state.error.code = typeof payload === 'string' ? 400 : payload.code
    state.error.duration = Object.prototype.hasOwnProperty.call(payload, "duration")
      ? payload.duration
      : 6000
    state.error.active = true
  },
  success(state, payload) {
    state.success.message = typeof payload === 'string' ? payload : payload.message
    state.success.duration = typeof payload === 'object' && Object.prototype.hasOwnProperty.call(payload, "duration")
      ? payload.duration
      : 6000
    state.success.active = true
  },
  close(state, type) {
    state[type].active = false
  },
  closeAll(state) {
    state.success.active = false
    state.error.active = false
  }
}
