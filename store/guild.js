export const state = () => ({
  list: [],
  loaded: false
})

export const mutations = {
  add(state, items) {
    state.list.push(...items)
    state.loaded = true
  }
}

export const actions = {
  async load ({ commit, state }) {
    if (!state.loaded) {
      const response = await this.$axios.$get(`search/guilds?all=1`)
      if (response) {
        commit('add', response)
      }
    }
  }
}
