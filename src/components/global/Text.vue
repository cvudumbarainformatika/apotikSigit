<template>
  <div 
    :class="`text-${size} ${color}  ${props.class} `"
  >
    <slot>{{ label }}</slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  label: { type: String, default: '' },
  class: { type: String, default: '' },
  size: { type: String, default: 'xs' },
  color: { type: String, default: 'text-gray-900 dark:text-white' },
})

const textClass = computed(() => `text-${props.size} text-gray-900 dark:text-white`)
</script>