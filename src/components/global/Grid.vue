<script setup>
import { computed } from 'vue'
const props = defineProps({
  cols: { type: [Number, String], default: null }, // contoh: 1, 2, 3
  minWidth: { type: String, default: null },       // contoh: "200px"
  fill: { type: Boolean, default: false },         // auto-fill vs auto-fit
  gap: { type: String, default: 'gap-2 md:gap-4' },
  class: { type: String, default: '' },
})

const gridStyle = computed(() => {
  if (props.minWidth) {
    return {
      gridTemplateColumns: `repeat(${props.fill ? 'auto-fill' : 'auto-fit'}, minmax(${props.minWidth}, 1fr))`,
    }
  }
  return {}
})

const gridClass = computed(() => {
  const map = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2 ',
    3: 'grid-cols-1 md:grid-cols-3 ',
    4: 'grid-cols-1 md:grid-cols-4 ',
    5: 'grid-cols-1 md:grid-cols-5 ',
    6: 'grid-cols-1 md:grid-cols-6 ',
    7: 'grid-cols-1 md:grid-cols-7 ',
    8: 'grid-cols-1 md:grid-cols-8 ',
    9: 'grid-cols-1 md:grid-cols-9 ',
    9: 'grid-cols-1 md:grid-cols-9 ',
    10: 'grid-cols-1 md:grid-cols-10 ',
    11: 'grid-cols-1 md:grid-cols-11 ',
    12: 'grid-cols-1 md:grid-cols-12 ',
  }
  return props.minWidth ? '' : map[props.cols] ?? 'grid-cols-1'
})
</script>

<template>
  <div
    class="grid w-full"
    :class="[gap, gridClass, props.class]"
    :style="gridStyle"
  >
    <slot />
  </div>
</template>
