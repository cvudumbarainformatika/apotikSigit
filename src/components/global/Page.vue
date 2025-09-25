<template>
  <div
    class="flex flex-1 flex-col w-full"
    :class="[padding, props.class, space, { 'overflow-y-scroll': scrollY }]"
  >
    <slot />
  </div>
</template>
<script setup>
const props = defineProps({
  padding: { type: String, default: 'p-4' },
  space: { type: String, default: '' }, // space-y-4 md:space-y-6
  class: { type: String, default: '' },
  scrollY: { type: Boolean, default: false },
})
</script>