export const state = () => ({
  list: [],
})

export const mutations = {
  add(state, data) {
    state.list.push(...data)
  },
  update(state, data) {
    const index = state.list.findIndex(x => x.id === data.id)
    if (index >= 0) {
      state.list[index].name = data.name
      state.list[index].status = data.status
      state.list[index].lat = data.lat
      state.list[index].lng = data.lng
    }
  },
  remove(state, data) {
    const index = state.list.findIndex(x => x.id === data.id)
    if (index >= 0) {
      state.list.splice(index, 1)
    }
  }
}

export const actions = {
  async load ({ commit }) {
    let page = 1;
    let loaded = false
    while (!loaded) {
      const response = await this.$axios.$get(`search/cities?page=${page}`)
      page++
      if (response) {
        loaded = response.current_page === response.last_page
        commit('add', response.data)
      } else {
        loaded = true
      }
    }
  }
}
