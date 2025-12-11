import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    data: null,
    token: null,
    has_business: false,
    businesses: []
  }),
  
  getters: {
    loggedIn: (state) => !!state.data,
    isAdmin: (state) => {
      if (!state.data || !state.data?.roles) return false
      return state.data.roles.findIndex(x => x.name === 'super-admin') >= 0
    },
    user: (state) => state.data
  },
  
  actions: {
    setToken(token) {
      this.token = token
      if (typeof window !== 'undefined') {
        token
          ? localStorage.setItem('user-token', token)
          : localStorage.removeItem('user-token')
      }
    },
    setUser(data) {
      this.data = data
    },
    hasBusiness(value) {
      this.has_business = value
    },
    setBusinesses(value) {
      this.businesses = value
    },
    logout() {
      this.data = null
      this.token = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user-token')
      }
    }
  }
})
