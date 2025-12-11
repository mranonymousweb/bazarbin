export const state = () => ({
  items: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],
})

export const mutations = {
  add(state, data) {
    if (data.type === 'product') {
      const exist = state.items.find(x => x.price_id === data.price_id)
      if (exist) {
        exist.count += data.count
      } else {
        state.items.push(data)
      }
    } else {
      state.items.push(data)
    }
    localStorage.setItem('cart', JSON.stringify(state.items))
  },
  removeItems(state, data) {
    data.forEach(id => {
      const index = state.items.findIndex(x => x.price_id === id)
      state.items.splice(index,1)
    })
    state.items.length ? localStorage.setItem('cart', JSON.stringify(state.items)) : localStorage.removeItem('cart')
  },
  removeAppointment(state, data) {
    const index = state.items.findIndex(x => x.appointment_id === data.appointment_id && x.date === data.date)
    state.items.splice(index,1)
    state.items.length ? localStorage.setItem('cart', JSON.stringify(state.items)) : localStorage.removeItem('cart')
  },
  removeAll(state) {
    state.items = []
    localStorage.removeItem('cart')
  }
}
