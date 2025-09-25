// src/composables/useConfirm.js
import { ref } from 'vue'

const isOpen = ref(false)
const resolveFn = ref(null)
const options = ref({
  title: 'Konfirmasi',
  message: 'Apakah Anda yakin?',
  confirmText: 'Ya',
  cancelText: 'Batal',
})

export function useConfirm() {
  function confirm(customOptions = {}) {
    isOpen.value = true
    options.value = { ...options.value, ...customOptions }

    return new Promise((resolve) => {
      resolveFn.value = resolve
    })
  }

  function onConfirm() {
    isOpen.value = false
    resolveFn.value?.(true)
  }

  function onCancel() {
    isOpen.value = false
    resolveFn.value?.(false)
  }

  return {
    confirm,
    dialogState: {
      isOpen,
      options,
      onConfirm,
      onCancel,
    },
  }
}
