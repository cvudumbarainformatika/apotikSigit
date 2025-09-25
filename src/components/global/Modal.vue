<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="modelValue"
        ref="modalRef"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click="handleBackdropClick"
      >
        <div
          class="relative w-full max-h-[90vh] overflow-hidden flex flex-col bg-secondary dark:bg-gray-800 rounded-2xl shadow-2xl px-4 py-2 border border-primary dark:border-gray-700"
          :class="[sizeClass[size], { 'animate-shake': animateReject }]"
        >
          <!-- Header -->
          <u-row flex1 padding="px-2 py-2 pb-1">
            <u-row flex1>
              <div class="text-md font-semibold text-primary dark:text-white">{{ title }}</div>
            </u-row>
            <u-row>
              <button
                v-if="!hideClose"
                @click="close"
                :disabled="!closable"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <u-icon name="close" class="w-6 h-6" />
              </button>
            </u-row>
            
          </u-row>

          <u-separator />

          <!-- Content -->
          <div class=" flex-1 overflow-y-scroll scroll-pb-32 ">
            <slot />
          </div>
          
          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="items-center justify-end gap-2 px-4 py-3 border-t border-primary dark:border-gray-700"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: val => ['sm', 'md', 'lg', 'xl'].includes(val)
  },
  hideClose: Boolean,
  closable: { type: Boolean, default: true },
  persistent: {
    type: Boolean,
    default: false // ✅ default: bisa klik luar untuk close
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const modalRef = ref(null)
const animateReject = ref(false)

const close = () => {
  if (props.closable) {
    emit('update:modelValue', false)
    emit('close')
  }
}

const handleBackdropClick = (e) => {
  if (event.target === modalRef.value) {
    if (props.persistent) {
      animateReject.value = false
      requestAnimationFrame(() => {
        animateReject.value = true
      })
    } else if (props.closable) {
      close()
    }
  }
}

const sizeClass = {
  sm: 'max-w-lg',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
}

watch(() => props.modelValue, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
}, { immediate: true })
</script>

<style scoped>

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}


@keyframes shake {
  0% { transform: translateX(0); }
  15% { transform: translateX(-8px); }
  30% { transform: translateX(8px); }
  45% { transform: translateX(-6px); }
  60% { transform: translateX(6px); }
  75% { transform: translateX(-4px); }
  90% { transform: translateX(4px); }
  100% { transform: translateX(0); }
}

.animate-shake {
  animation: shake 0.4s ease;
}
</style>


