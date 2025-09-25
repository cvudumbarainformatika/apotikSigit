import { h, render } from 'vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

export default {
  install(app) {
    const container = document.createElement('div')
    document.body.appendChild(container)

    function $confirm({ message, title = 'Konfirmasi', confirmText = 'Ya', cancelText = 'Batal' }) {
      return new Promise((resolve, reject) => {
        const vnode = h(ConfirmDialog, {
          show: true,
          message,
          title,
          confirmText,
          cancelText,
          onConfirm: () => {
            cleanup()
            resolve(true)
          },
          onCancel: () => {
            cleanup()
            resolve(false)
          },
        })

        function cleanup() {
          render(null, container)
        }

        render(vnode, container)
      })
    }

    app.provide('confirm', $confirm)
    app.config.globalProperties.$confirm = $confirm // optional
  }
}
