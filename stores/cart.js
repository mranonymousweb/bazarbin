import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: typeof window !== 'undefined' && localStorage.getItem('cart') 
      ? JSON.parse(localStorage.getItem('cart')) 
      : []
  }),
  
  getters: {
    count: (state) => state.items.length
  },
  
  actions: {
    add(data) {
      const existingIndex = this.items.findIndex(item => {
        if (data.type === 'product') {
          return item.type === 'product' && item.price_id === data.price_id
        } else if (data.type === 'appointment') {
          return item.type === 'appointment' && 
                 item.appointment_id === data.appointment_id && 
                 item.date === data.date
        }
        return false
      })

      if (existingIndex >= 0) {
        if (data.type === 'product') {
          this.items[existingIndex].count += data.count || 1
        }
      } else {
        this.items.push(data)
      }
      
      this.saveToLocalStorage()
    },
    
    removeItems(priceIds) {
      this.items = this.items.filter(item => 
        !(item.type === 'product' && priceIds.includes(item.price_id))
      )
      this.saveToLocalStorage()
    },
    
    removeAppointment(data) {
      this.items = this.items.filter(item => 
        !(item.type === 'appointment' && 
          item.appointment_id === data.appointment_id && 
          item.date === data.date)
      )
      this.saveToLocalStorage()
    },
    
    removeAll() {
      this.items = []
      this.saveToLocalStorage()
    },
    
    saveToLocalStorage() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(this.items))
      }
    }
  }
})





