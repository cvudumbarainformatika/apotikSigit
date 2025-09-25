<template>
  <label class="inline-flex items-center space-x-2 cursor-pointer select-none">
    <input
      type="checkbox"
      :class="[`form-checkbox h-4 w-4 rounded-md`,
        login ? 'text-background border-primary focus:ring-primary' : 'text-primary border-background focus:ring-background'
      ]"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span :class="login ? 'text-background' : 'text-primary'">{{ label }}</span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
  login: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])
</script>
