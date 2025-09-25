<template>
  <div
    class="relative inline-flex items-center justify-center rounded-full border-1 border-gray-50 bg-primary/50 text-background font-semibold overflow-hidden"
    :class="[size]"
  >
    <!-- Icon slot -->
    <slot name="icon" v-if="icon">
      <u-icon name="user" class="w-6 h-6" />
    </slot>

    <!-- Image -->
    <img
      v-else-if="img"
      :src="img"
      alt="avatar"
      class="object-cover w-full h-full rounded-full"
    />

    <!-- Initial label -->
    <span v-else class="uppercase">{{ initials }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  img: {String, default: null},
  icon: {String, default: null},
  label: {
    type: String,
    default: 'A',
  },
  size: {
    type: String,
    default: 'w-10 h-10', 
  },
})



// Function to generate initials
const initials = computed(() => {
  const trimmed = props.label.trim()
  if (!trimmed) return 'A'
  const parts = trimmed.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return trimmed.length >= 2
    ? trimmed.slice(0, 2).toUpperCase()
    : trimmed[0].toUpperCase()
})
</script>
