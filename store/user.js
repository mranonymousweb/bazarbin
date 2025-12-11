export const state = () => ({
  data: null,
  token: null,
  has_business: false,
  businesses: [],
})

export const mutations = {
  setToken(state, token) {
    state.token = token
    token
      ? localStorage.setItem('user-token', token)
      : localStorage.removeItem('user-token')
  },
  setUser(state, data) {
    state.data = data
  },
  hasBusiness(state, value) {
    state.has_business = value
  },
  setBusinesses(state, value) {
    state.businesses = value
  }
}

export const getters = {

  loggedIn(state) {
    return !!state.data
  },

  isAdmin(state) {
    return !(!state.data ||
      !state.data?.roles ||
      state.data.roles.findIndex(x => x.name === 'super-admin') < 0);
  }
}
