<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  id: { type: String, default: () => `input-${Math.random().toString(36).substring(2, 8)}` },
  placeholder: { type: String, default: 'Cari ... Enter' }, // default harus ada spasi agar placeholder-shown berfungsi
  debounce: { type: Number, default: 500 },
  isLoading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'input', 'keydown'])


const inputValue = ref(props.modelValue)
const isFocussed = ref(false)

const hasValue = computed(() => !!inputValue.value)

// ✅ Sinkronisasi ke modelValue luar
watch(() => props.modelValue, (val) => {
  inputValue.value = val
})

const handleFocus = () => {
  emit('focus')
  isFocussed.value = true
}

const handleBlur = () => {
  emit('blur')
  isFocussed.value = false
}


let debounceTimeout
const handleSearch = (e) => {
  inputValue.value = e.target.value

  if (props.debounce > 0) {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      // emit('update:modelValue', inputValue.value)
      emit('input', inputValue.value)
    }, props.debounce)
  } else {
    // emit('update:modelValue', inputValue.value)
    emit('input', inputValue.value)
  }
  
}

const handleEnter = () => {
  emit('update:modelValue', inputValue.value)
}

function clear() {
  inputValue.value = ''
  emit('update:modelValue', '')
}

</script>

<template>
  <div class="relative w-full min-w-[280px]">
    <!-- Input -->
    <input
      :id="id"
      :type="type"
      :value="inputValue"
      :placeholder="placeholder"
      :aria-label="placeholder"
      @input="handleSearch"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown.enter="handleEnter"
      @keydown="emit('keydown', $event)"
      v-bind="$attrs"

      :class="[
        'peer w-full px-5 py-2 border rounded-full focus:outline-none focus:ring-1 transition duration-200',
        isFocussed || hasValue ? 'bg-background' : 'bg-transparent'
      ]"

    />
    <div class="absolute inset-y-0 right-0 flex items-center gap-1 px-3 bg-transparent rounded-r-full bg-grady-primary text-secondary peer-focus:text-background peer-focus:bg-grady-primary-hover">
      <u-icon v-if="hasValue" name="x" class="w-5 h-5 hover:text-red-500 cursor-pointer" @click="clear" />
      <u-icon v-else-if="isLoading" name="loader" class="w-5 h-5 animate-spin-slow" />
      <u-icon v-else name="search" class="w-5 h-5" />
    </div>
    
  </div>
</template>

<style scoped>
input:focus + div {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}
</style>