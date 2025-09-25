<template>
  <div
    class="inline-block text-xs font-semibold px-3 py-1 rounded-full transition-all duration-300 cursor-default"
    :class="[baseClasses]"
  >
    <slot>{{ label }}</slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  label: { type: String, default: '' },
  variant: {
    type: String,
    default: 'primary',
    validator: (val) =>
      ['primary', 'secondary', 'info', 'success', 'warning', 'danger'].includes(val),
  },
})

const baseClasses = computed(() => {
  const variants = {
    primary: 'bg-primary/10 text-primary border-2 border-primary',
    secondary: 'bg-gray-100 text-gray-700 border-2 border-gray-300',
    info: 'bg-blue-100 text-blue-700 border-2 border-blue-300',
    success: 'bg-green-100 text-green-700 border-2 border-green-300',
    warning: 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300',
    danger: 'bg-red-100 text-red-700 border-2 border-red-300',
  }

  return variants[props.variant] || variants.primary
})

const hoverClasses = computed(() => {
  const hover = {
    primary: 'hover:bg-primary/20 hover:shadow-primary',
    secondary: 'hover:bg-gray-200 hover:shadow-md',
    info: 'hover:bg-blue-200 hover:shadow-blue-200',
    success: 'hover:bg-green-200 hover:shadow-green-200',
    warning: 'hover:bg-yellow-200 hover:shadow-yellow-200',
    danger: 'hover:bg-red-200 hover:shadow-red-200',
  }

  return 'hover:shadow-md ' + (hover[props.variant] || hover.primary)
})
</script>
