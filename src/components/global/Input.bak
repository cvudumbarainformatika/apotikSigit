<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  id: { type: String, default: () => `input-${Math.random().toString(36).substring(2, 8)}` },
  placeholder: { type: String, default: ' ' }, // default harus ada spasi agar placeholder-shown berfungsi
  error: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

const hasValue = computed(() => !!modelValue)

const isFocussed = ref(false)

const handleFocus = () => {
  emit('focus')
  isFocussed.value = true
}

const handleBlur = () => {
  emit('blur')
  isFocussed.value = false
}

</script>

<template>
  <div class="relative w-full">
    <!-- Input -->
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="emit('update:modelValue', $event.target.value)"
      @focus="handleFocus"
      @blur="handleBlur"
      v-bind="$attrs"

      :class="[
        'peer w-full px-4 py-2 bg-transparent border rounded-full focus:outline-none focus:ring-1 transition duration-200',
        error ? 'border-danger focus:border-danger focus:ring-danger text-danger' : 'border-light-primary focus:border-primary focus:ring-primary text-primary',
      ]"

    />

    <!-- Floating Label (Overlay on border top) -->
    <label
      :for="id"
      :class="[
        'absolute text-xs left-4 -top-2 px-2 text-background  rounded-lg transition-all duration-200',
        'peer-placeholder-shown:top-2  peer-placeholder-shown:bg-transparent',
        'peer-focus:-top-2 peer-focus:text-xs peer-focus:text-background',
        error ? 'bg-danger peer-placeholder-shown:text-danger peer-focus:bg-danger peer-focus' : 'bg-light-primary peer-placeholder-shown:text-gray-600 peer-focus:bg-light-primary peer-focus'
      ]"
    >
      {{ label }}
    </label>


   <!-- Error icon & message overlay -->
    <div
      v-if="error && !isFocussed"
      class="absolute inset-y-0 right-2 flex items-center gap-1 px-2 bg-transparent rounded-r-xl"
    >
      <!-- Error message -->
      <p class="text-xs text-danger whitespace-nowrap mr-2">
        {{ errorMessage }}
      </p>
      <!-- Error icon -->
      <div class="w-5 h-5 flex items-center justify-center text-danger border border-danger border-2 rounded-sm font-bold rotate-45">
        <span class="-rotate-45 text-md font-bold">!</span>
      </div>

      
    </div>
  </div>
</template>

<style scoped>
</style>