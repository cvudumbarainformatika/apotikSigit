<script setup>
const props = defineProps({
  gap: { type: String, default: 'gap-4' },
  justify: { type: String, default: 'justify-start' },
  align: { type: String, default: 'items-start' },
  wrap: { type: Boolean, default: false },
  flex1: { type: Boolean, default: false },
  class: { type: String, default: '' },
  scrollY: { type: Boolean, default: false },
})
</script>

<template>
  <div :class="`flex flex-col ${gap} ${justify} ${align} ${wrap ? 'flex-wrap' : ''} ${props.class} ${flex1 ? 'flex-1' : ''} ${scrollY ? 'overflow-y-scroll' : ''}`">
    <slot />
  </div>
</template>
