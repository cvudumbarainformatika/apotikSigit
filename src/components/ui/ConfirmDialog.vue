<script setup>
import { ref, watch } from 'vue'
import Btn from '../global/Btn.vue'

const props = defineProps({
  show: Boolean,
  title: { type: String, default: 'Konfirmasi' },
  message: { type: String, required: true },
  confirmText: { type: String, default: 'Ya' },
  cancelText: { type: String, default: 'Batal' },
})

const emit = defineEmits(['confirm', 'cancel'])

const visible = ref(props.show)

watch(() => props.show, val => (visible.value = val))

function handleConfirm() {
  emit('confirm')
}
function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <transition name="fade">
    <div v-if="visible" class="fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center ">
      <div class="bg-secondary dark:bg-gray-800 p-4 rounded-xl shadow-xl w-full max-w-sm border border-primary dark:border-gray-700 animate-fade-in-up">
        <div class="text-sm font-bold mb-2 text-gray-800 dark:text-white">{{ title }}</div>
        <hr class="my-2 border-primary dark:border-gray-500" />
        <div class="text-gray-600 dark:text-gray-300 mt-6 mb-8 px-4">{{ message }}</div>
        <div class="flex justify-end gap-2">
          <!-- <button class="px-4 py-2 bg-grady-secondary text-primary dark:bg-gray-700 rounded" @click="handleCancel">{{ cancelText }}</button> -->
          <!-- <button class="px-4 py-2 bg-grady-primary text-white rounded hover:bg-red-700" @click="handleConfirm">{{ confirmText }}</button> -->
          <Btn variant="secondary" :label="cancelText" @click="handleCancel" />
          <Btn :label="confirmText" @click="handleConfirm" />
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.animate-fade-in-up {
  animation: fadeInUp 0.25s ease;
}
@keyframes fadeInUp {
  from {
    transform: translateY(12px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
