<script setup>
import { computed, ref } from 'vue'
// import BaseInput from './BaseInput.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Tanggal'
  },
  placeholder: {
    type: String,
    default: 'Select date'
  },
  error: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  min: {
    type: String,
    default: ''
  },
  max: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const refDate = ref(null)

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const today = new Date().toISOString().split('T')[0]

function handleClick() {
  // console.log('handleClick', refDate.value.inputRef);
  refDate.value.inputRef.showPicker?.()
}
</script>

<template>
  <u-input ref="refDate" v-model="inputValue" :label="label" :placeholder="placeholder" :error="error" :required="required"
    :disabled="disabled" type="date" :min="min || '1900-01-01'" :max="max || '2100-12-31'"
    @click="handleClick"
    >
    
  </u-input>
</template>

<style scoped>
/* :deep(input[type="date"]) {
  @apply pl-10;
} */

/* :deep(input[type="date"]::-webkit-calendar-picker-indicator) {
  @apply absolute left-0 w-full h-full opacity-0 cursor-pointer;
} */
</style>
