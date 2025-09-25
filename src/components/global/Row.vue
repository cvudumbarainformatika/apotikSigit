<script setup>
const props = defineProps({
  gap: { type: String, default: 'gap-2' },
  padding: { type: String, default: '' },
  align: { type: String, default: 'items-center' },
  wrap: { type: Boolean, default: false },
  right: { type: Boolean, default: false },
  class: { type: String, default: '' },
  flex1: { type: Boolean, default: false },
  separator: { type: Boolean, default: false },
})
</script>

<template>
  <div :class="`flex flex-row ${padding} ${gap} ${right ? 'justify-end' : 'justify-start'} ${align} ${wrap ? 'flex-wrap' : ''} ${flex1 ? 'flex-1' : ''} ${props.class} ${separator ? 'border-b border-primary dark:border-gray-700' : ''}`">
    <slot />
  </div>
</template>
