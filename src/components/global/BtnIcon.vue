<template>
  <div class="relative inline-block group">
    <!-- Tooltip -->
    <div
      v-if="tooltip || $slots.tooltip"
      class="absolute top-11 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] text-primary bg-secondary rounded shadow-md opacity-0 group-hover:opacity-100 transition z-50 whitespace-nowrap pointer-events-none"
    >
      <slot name="tooltip">{{ tooltip }}</slot>
    </div>
    <button
      :disabled="disabled"
      v-bind="$attrs"
      :class="[
        baseClasses,
        variantClasses,
        props.class
      ]"
    >
    <slot name="icon">
      <u-icon :name="icon" class="w-5 h-5" />
    </slot>
  </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  icon: {
    type: String,
    default: 'plus', // rotate-cw

  },
  disabled: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (val) => ['primary', 'secondary'].includes(val),
  },
  tooltip: {
    type: String,
    default: '',
  },
  class: {
    type: String,
    default: ''
  }
});

const baseClasses =
  'p-[6px] rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition w-auto cursor-pointer border border-primary';

const variantClasses = computed(() => {
  return props.variant === 'secondary'
    ? 'text-primary bg-grady-secondary hover:bg-grady-secondary-hover hover:shadow-secondary'
    : 'text-secondary bg-grady-primary hover:text-background hover:bg-grady-primary-hover hover:shadow-primary'; // efek shine saat hover// default = primary
});
</script>

<style scoped>
</style>
