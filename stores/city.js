import { defineStore } from 'pinia'

export const useCityStore = defineStore('city', {
  state: () => ({
    list: []
  }),
  
  actions: {
    add(data) {
      this.list.push(...data)
    },
    setList(data) {
      this.list = data
    },
    update(data) {
      const index = this.list.findIndex(x => x.id === data.id)
      if (index >= 0) {
        this.list[index].name = data.name
        this.list[index].status = data.status
        this.list[index].lat = data.lat
        this.list[index].lng = data.lng
      }
    },
    remove(data) {
      const index = this.list.findIndex(x => x.id === data.id)
      if (index >= 0) {
        this.list.splice(index, 1)
      }
    },
    async load() {
      const { $axios } = useNuxtApp()
      try {
        const response = await $axios.$get('search/cities?all=1')
        this.list = [{id: 0, name: 'تمام شهرها'}, ...response]
      } catch (e) {
        console.error('Error loading cities:', e)
      }
    }
  }
})
