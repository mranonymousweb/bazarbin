export const state = () => ({
  token: null,
  active: true,
  saved: false
})

export const mutations = {
  setToken(state, payload) {
    ['token', 'active', 'saved'].forEach(key => {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        state[key] = payload[key]
        localStorage.setItem(`fcm-${key}`, key === 'token' ? payload[key] : payload[key] ? 'yes' : 'no')
      }
    })
  }
}
