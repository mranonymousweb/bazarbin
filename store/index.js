export const state = () => ({
  qriousLoaded: false,
  googleMapApiLoaded: false,
  isMobile: false,
  screenSize: '',
  adminSearchKey: '',
  city_id: localStorage.getItem('city_id') || '',
})

export const mutations = {
  set(state, payload) {
    if (payload.key === 'city_id') {
      localStorage.setItem(payload.key, payload.value)
    }
    state[payload.key] = payload.value
  },
  googleMapApiLoaded(state) {
    state.googleMapApiLoaded = true
  },
  qriousLoaded(state) {
    state.qriousLoaded = true
  }
}

export const actions = {
  async nuxtServerInit ({ dispatch }) {
    await dispatch('city/load')
    await dispatch('guild/load')
  }
}
