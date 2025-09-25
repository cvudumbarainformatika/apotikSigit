<script setup>
import { computed, ref, watch } from 'vue'
import { formatDateIndo, parseDateIndo } from '@/utils/dateHelper'

const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: [String, Number], default: '' },
  readonly: { type: Boolean, default: false },
  disable: { type: Boolean, default: false },
  type: { type: String, default: 'text' },
  id: { type: String, default: () => `input-${Math.random().toString(36).substring(2, 8)}` },
  placeholder: { type: String, default: ' ' },
  error: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },

  login: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'click'])

const inputRef = ref(null)
const isFocussed = ref(false)
const internalValue = ref('')

watch(() => props.modelValue, (val) => {
  if (props.type === 'number' && !isFocussed.value) {
    internalValue.value = formatNumber(val)
  } else {
    internalValue.value = val?.toString() ?? ''
  }
}, { immediate: true })

function formatNumber(value) {
  if (value === null || value === undefined || value === '') return ''
  const [intPart, decimalPart] = value.toString().split(/[.,]/)
  const formattedInt = Number(intPart).toLocaleString('id-ID')
  return decimalPart ? `${formattedInt},${decimalPart}` : formattedInt
}

function parseNumber(str) {
  return Number(str.replace(/\./g, '').replace(',', '.'))
}

function formatDate(value) {
  if (value === null || value === undefined || value === '') return ''
  return formatDateIndo(value)
}

function parseDate(str) {
  return parseDateIndo(str)
}

function handleInput(e) {
 let raw = e.target.value

  // ❗ Hanya izinkan angka dan koma
  if (props.type === 'number') {
    raw = raw.replace(/[^\d,]/g, '') // Hanya digit dan koma
    e.target.value = raw // Untuk refleksi langsung di input
    internalValue.value = raw

    const parsed = parseNumber(raw)
    emit('update:modelValue', isNaN(parsed) ? null : parsed)

  
  } else {
    internalValue.value = raw
    emit('update:modelValue', raw)
  }
}

function handleFocus(e) {
  emit('focus', e)
  isFocussed.value = true
}

function handleBlur() {
  emit('blur')
  isFocussed.value = false
  if (props.type === 'number') {
    internalValue.value = formatNumber(props.modelValue)
  }
}


function handleClickError() {
  inputRef.value?.focus()
}

const hasValue = computed(() => !!props.modelValue)

defineExpose({ inputRef })
</script>


<template>
  <div class="relative w-full">
    
    <!-- Input -->
    <input
      :id="id"
      ref="inputRef"
      :type="type === 'number' ? 'text' : type"
      :value="internalValue"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disable"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @click="$emit('click')"
      v-bind="$attrs"

      :class="[
        'peer w-full text-sm px-4 py-2  border rounded-full focus:outline-none focus:ring-1 transition duration-200',
        error ? 'border-danger focus:border-danger focus:ring-danger text-danger' 
          : login ? 'border-secondary focus:border-background focus:ring-background text-background'
            : 'border-light-primary focus:border-primary focus:ring-primary text-primary focus:bg-background',
        hasValue ? !login ? 'bg-background' : 'bg-gray-600' : 'bg-transparent',

        // ✅ tambahan kondisi readonly & disable
        readonly ? 'border-dashed border-primary/50  cursor-default' : '',
        disable ? ' border-dashed border-primary/50 cursor-not-allowed' : ''
      ]"

    />

   

    <!-- Floating Label (Overlay on border top) -->
    <label
      :for="id"
      :class="[
        'absolute text-xs left-4 -top-2 px-2  rounded-lg transition-all duration-200',
        'peer-placeholder-shown:top-2  peer-placeholder-shown:bg-transparent',
        'peer-focus:-top-2 peer-focus:text-xs ',
        error ? 'bg-danger text-background peer-placeholder-shown:text-danger peer-focus:bg-danger peer-focus:text-background peer-focus' 
          : login ? 'bg-secondary text-primary peer-placeholder-shown:text-secondary peer-focus:bg-secondary peer-focus:text-primary peer-focus'
            : 'bg-light-primary text-background peer-placeholder-shown:text-gray-600 peer-focus:bg-light-primary peer-focus:text-background peer-focus'
      ]"
    >
      {{ label }} {{ props.type === 'date' ? formatDateIndo(props.modelValue) ?? '' : '' }}
    </label>


   <!-- Error icon & message overlay -->
    <div
      v-if="error && !isFocussed"
      class="absolute inset-y-0 right-2 flex items-center gap-1 px-2 bg-transparent rounded-r-xl"
      @click="handleClickError"
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

<style>

input[type="date"] {
  width: 100%;
  cursor: pointer;
}

</style>