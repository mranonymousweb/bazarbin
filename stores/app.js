import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    qriousLoaded: false,
    googleMapApiLoaded: false,
    isMobile: false,
    screenSize: '',
    adminSearchKey: '',
    city_id: typeof window !== 'undefined' ? localStorage.getItem('city_id') || '' : ''
  }),
  
  actions: {
    set(key, value) {
      if (key === 'city_id' && typeof window !== 'undefined') {
        localStorage.setItem(key, value)
      }
      this[key] = value
    },
    setCityId(value) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('city_id', value)
      }
      this.city_id = value
    },
    setScreenSize(size) {
      this.screenSize = size
    },
    setAdminSearchKey(key) {
      this.adminSearchKey = key
    },
    googleMapApiLoaded() {
      this.googleMapApiLoaded = true
    },
    qriousLoaded() {
      this.qriousLoaded = true
    }
  }
})
