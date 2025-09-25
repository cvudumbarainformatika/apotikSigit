import { defineStore } from 'pinia'

let id = 0

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    list: []
  }),
  actions: {
    notify({ message, type = 'info', duration = 3000 }) {
      const newNotif = {
        id: ++id,
        message,
        type,
      }

      this.list.push(newNotif)

      setTimeout(() => {
        this.remove(newNotif.id)
      }, duration)
    },
    remove(id) {
      this.list = this.list.filter(n => n.id !== id)
    }
  }
})
