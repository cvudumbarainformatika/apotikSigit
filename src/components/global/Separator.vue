<script setup>
const props = defineProps({
  direction: {
    type: String,
    default: 'horizontal', // or 'vertical'
    validator: (val) => ['horizontal', 'vertical'].includes(val),
  },
  color: {
    type: String,
    default: 'border-primary/40',
  },
  thickness: {
    type: String,
    default: '0.5px',
  },
  spacing: {
    type: String,
    default: 'my-1', // Tailwind spacing class (mt-4 mb-4)
  },
});
</script>

<template>
  <div
    role="separator"
    :class="[
      direction === 'horizontal' ? 'w-full' : 'h-full',
      direction === 'horizontal' ? 'border-t' : 'border-l',
      color,
      spacing,
    ]"
    :style="{
      borderWidth: thickness,
    }"
  />
</template>
