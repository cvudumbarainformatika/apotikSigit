<script setup>
import { ref } from 'vue'

const props = defineProps({
  text: String,
  placement: {
    type: String,
    default: 'top', // top | bottom | left | right
  },
})

const isShown = ref(false)

const placementClass = {
  top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
  bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
  left: 'right-full mr-2 top-1/2 -translate-y-1/2',
  right: 'left-full ml-2 top-1/2 -translate-y-1/2',
}
</script>

<template>
  <div
    class="relative inline-flex group"
    @mouseenter="isShown = true"
    @mouseleave="isShown = false"
  >
    <!-- Slot target -->
    <slot />

    <!-- Tooltip -->
    <transition name="fade">
      <div
        v-if="isShown"
        class="absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded shadow-lg whitespace-nowrap pointer-events-none transition-all"
        :class="placementClass[placement]"
      >
        {{ text }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
