<script setup>
import { ref } from 'vue'

const props = defineProps({
  id: { type: String, default: () => `textarea-${Math.random().toString(36).substring(2, 8)}` },
  modelValue: String,
  label: { type: String, required: true },
  placeholder: { type: String, default: ' ' },
  rows: { type: Number, default: 3 },
  error: { type: Boolean, default: false },
  errorMessage: { type: String, default: 'Harap diisi' }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])
const isFocussed = ref(false)

function handleFocus() {
  isFocussed.value = true
  emit('focus')
}

function handleBlur() {
  isFocussed.value = false
  emit('blur')
}
</script>

<template>
  <div class="relative w-full">
    <textarea
      :id="id"
      :rows="rows"
      :placeholder="placeholder"
      class="peer w-full px-4 py-2 bg-transparent border rounded-xl resize-none focus:outline-none focus:ring-1 transition duration-200"
      :class="[
        error ? 'border-danger focus:border-danger focus:ring-danger text-danger' : 'border-light-primary focus:border-primary focus:ring-primary text-primary'
      ]"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="handleFocus"
      @blur="handleBlur"
    ></textarea>

    <!-- Floating Label -->
    <label
      :for="id"
      class="absolute text-xs left-4 -top-2 px-2 text-background rounded-lg transition-all duration-200"
      :class="[
        'peer-placeholder-shown:top-2 peer-placeholder-shown:bg-transparent',
        'peer-focus:-top-2 peer-focus:text-xs peer-focus:text-background',
        error ? 'bg-danger peer-placeholder-shown:text-danger peer-focus:bg-danger' : 'bg-light-primary peer-placeholder-shown:text-gray-600 peer-focus:bg-light-primary'
      ]"
    >
      {{ label }}
    </label>

    <!-- Error -->
    <div
      v-if="error && !isFocussed"
      class="absolute inset-y-0 right-2 flex items-center gap-1 px-2 bg-transparent rounded-r-xl"
    >
      <p class="text-xs text-danger whitespace-nowrap mr-2">{{ errorMessage }}</p>
      <div class="w-5 h-5 flex items-center justify-center text-danger border border-danger border-2 rounded-sm font-bold rotate-45">
        <span class="-rotate-45 text-md font-bold">!</span>
      </div>
    </div>
  </div>
</template>
