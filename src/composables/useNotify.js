// src/composables/useNotify.js
import { reactive, readonly, inject, provide } from 'vue'

const notifications = reactive([])

function addNotification({ title, message, timeout = 3000 }) {
  const id = Date.now()
  notifications.push({ id, title, message })

  setTimeout(() => {
    const index = notifications.findIndex(n => n.id === id)
    if (index !== -1) notifications.splice(index, 1)
  }, timeout)
}

function removeNotification(index) {
  notifications.splice(index, 1)
}

export function provideNotification() {
  provide('notifications', readonly(notifications))
  provide('removeNotification', removeNotification)
}

export function useNotify() {
  return { notify: addNotification }
}
