<template>
  <div class="fixed top-4 right-4 z-[9999] space-y-4 w-full max-w-sm">
    <transition-group name="fade" tag="div">
      <div
        v-for="n in store.list"
        :key="n.id"
        class="rounded-lg shadow-lg px-4 py-3 text-sm text-white relative overflow-hidden mb-2 transition-all"
        :class="{
          'bg-green-500': n.type === 'success',
          'bg-red-600': n.type === 'error',
          'bg-blue-500': n.type === 'info',
          'bg-yellow-500': n.type === 'warning',
        }"
      >
        <div class="flex items-start justify-between gap-4">
          
          <div class="flex-1 flex items-center gap-4">
            <u-icon :name="n.type === 'success' ? 'check-check' : 'triangle-alert'" class="w-6 h-6" />
            <div>{{ n.message }}</div>
          </div>
          <button @click="store.remove(n.id)" class="text-white/80 hover:text-white">×</button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useNotificationStore } from '@/stores/notification'
const store = useNotificationStore()
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}


.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-active {
  position: absolute; /* Supaya tidak bikin lompatan */
}

</style>
