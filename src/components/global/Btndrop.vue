<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: 'Dropdown',
  },
})

const emit = defineEmits(['select'])

const isOpen = ref(false)
const dropdownRef = ref(null)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const onClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})

const hasDefaultMenu = computed(() => props.items.length > 0)
</script>

<template>
  <div class="relative inline-block cursor-pointer" ref="dropdownRef">
    <!-- Trigger Button -->
    <button
      @click="toggle"
      class="inline-flex items-center gap-1 transition px-[16px] py-[6px] rounded-lg bg-grady-primary text-secondary hover:text-background hover:shadow-primary z-40 relative disabled:cursor-not-allowed"
    >
      <slot>{{ label }}</slot>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-[14px] h-[14px] transition-transform duration-200"
        :class="{ 'rotate-90': isOpen }"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M6.5 4.5a.5.5 0 0 1 .79-.41l7 5a.5.5 0 0 1 0 .82l-7 5a.5.5 0 0 1-.79-.41v-10z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <transition name="fade" appear>
      <div
        v-if="isOpen"
        class="absolute text-xs right-0 top-8 pt-1 min-w-32  w-full rounded-md shadow-lg bg-background ring-1 ring-primary ring-opacity-5 z-50 "
        
      >
        <div class="py-1">
          <!-- If items prop provided, render default -->
          <template v-if="hasDefaultMenu">
            <button
              v-for="(item, idx) in items"
              :key="idx"
              @click="() => { emit('select', item); close() }"
              class="w-full text-left block px-4 py-2 text-primary hover:bg-secondary/50"
            >
              {{ typeof item === 'string' ? item : item.label }}
            </button>
          </template>

          <!-- Else use custom slot -->
          <template v-else>
            <slot name="menu" />
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
