<template>
  <div>
    <button
      :disabled="disabled || loading"
      v-bind="$attrs"
      :class="[
        baseClasses,
        variantClasses,
        fullWidth ? 'w-full' : 'w-auto',
        props.class
      ]"
    >
      <slot>{{ label }}</slot>
      <svg
        v-if="!loading"
        xmlns="http://www.w3.org/2000/svg"
        class="w-[14px] h-[14px]"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M6.5 4.5a.5.5 0 0 1 .79-.41l7 5a.5.5 0 0 1 0 .82l-7 5a.5.5 0 0 1-.79-.41v-10z"
          clip-rule="evenodd"
        />
      </svg>

      <svg
        v-else
        class="animate-spin w-[14px] h-[14px]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12" cy="12" r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
  </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  label: {
    type: String,
    default: 'Label',

  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (val) => ['primary', 'secondary'].includes(val),
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  class: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const baseClasses =
  'inline-flex items-center justify-center gap-1 px-[16px] py-[6px] rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition w-auto cursor-pointer border border-primary';

const variantClasses = computed(() => {
  return props.variant === 'secondary'
    ? 'text-primary bg-grady-secondary hover:bg-grady-secondary-hover hover:shadow-secondary'
    : 'text-white bg-grady-primary hover:bg-grady-primary-hover hover:shadow-primary'; // efek shine saat hover// default = primary
});
</script>

<style scoped>
</style>
