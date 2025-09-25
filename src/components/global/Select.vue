<!-- ✅ Sudah sesuai kode Anda, hanya dropdown dimasukkan ke <teleport> agar muncul di atas modal/footer -->
<template>
  <div class="relative w-full autocomplete-wrapper" ref="wrapperRef">
    <!-- Input -->
    <input
      v-model="query"
      @focus="handleFocus"
      @input="open = true"
      @keydown="onKeyDown"
      :placeholder="placeholder"
      class="peer w-full px-4 py-2 pr-10 focus:bg-background border rounded-full focus:outline-none focus:ring-1 transition"
      :class="[
        error ? 'border-danger text-danger focus:ring-danger' : 'border-light-primary text-primary focus:border-primary focus:ring-primary',
        hasValue ? 'bg-background' : 'bg-transparent'
      ]"
    />

    <!-- Floating Label -->
    <label
      :for="id"
      :class="[
        'absolute text-xs left-4 -top-2 px-2 text-background  rounded-lg transition-all duration-200',
        'peer-placeholder-shown:top-2 peer-placeholder-shown:bg-transparent',
        'peer-focus:-top-2 peer-focus:text-xs peer-focus:text-background ',
        error ? 'bg-danger peer-placeholder-shown:text-danger peer-focus:bg-danger peer-focus' : 'bg-light-primary peer-placeholder-shown:text-gray-600 peer-focus:bg-light-primary peer-focus'
      ]"
    >
      {{ label }}
    </label>

    <!-- Clear Button -->
    <button
      v-if="query"
      type="button"
      class="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-xl bg-secondary hover:bg-primary text-primary hover:text-background transition"
      @click="clear"
      aria-label="Clear"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Dropdown via Teleport -->
    <Teleport to="body">
      <div
        v-show="open"
        class="absolute z-[9999] bg-secondary border rounded-lg shadow-lg max-h-60 overflow-auto"
        :style="dropdownStyle"
      >
        <div
          v-for="(opt, idx) in props.options"
          :key="opt.value"
          @click="select(opt, idx)"
          class="px-4 py-2 text-xs cursor-pointer transition flex hover:bg-primary/10 hover:text-white"
          :class="{
            'autocomplete-active bg-light-primary text-white font-medium': idx === activeIndex
          }"
        >
          <template v-for="(part, i) in splitLabel(opt.label)" :key="i">
            <strong v-if="part.match">{{ part.text }}</strong>
            <span v-else>{{ part.text }}</span>
          </template>
        </div>
      </div>
    </Teleport>

    <!-- Error icon & message -->
    <div
      v-if="error"
      class="absolute inset-y-0 right-2 flex items-center gap-1 px-2 bg-transparent rounded-r-xl"
    >
      <p class="text-xs text-danger whitespace-nowrap mr-2">
        {{ errorMessage }}
      </p>
      <div class="w-5 h-5 flex items-center justify-center text-danger border border-danger border-2 rounded-sm font-bold rotate-45">
        <span class="-rotate-45 text-md font-bold">!</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  id: { type: String, default: () => `input-${Math.random().toString(36).substring(2, 8)}` },
  modelValue: [String, Number],
  options: { type: Array, default: () => [] },
  label: String,
  placeholder: { type: String, default: ' ' },
  error: { type: Boolean, default: false },
  errorMessage: { type: String, default: 'Harap diisi' },
})
const emit = defineEmits(['update:modelValue'])

const wrapperRef = ref(null)
const query = ref('')
const open = ref(false)
const activeIndex = ref(-1)
const dropdownStyle = ref({})

watch(() => props.modelValue, () => {
  const match = props.options.find(o => o.value === props.modelValue)
  query.value = match?.label || ''
})

function splitLabel(label) {
  const match = query.value.trim().toLowerCase()
  if (!match) return [{ text: label, match: false }]
  const parts = label.split(new RegExp(`(${match})`, 'gi'))
  return parts.map(part => ({
    text: part,
    match: part.toLowerCase() === match
  }))
}

function select(opt, idx) {
  query.value = opt.label
  emit('update:modelValue', opt.value)
  open.value = false
  activeIndex.value = idx
}

function clear() {
  query.value = ''
  emit('update:modelValue', null)
  open.value = false
  activeIndex.value = -1
}

function onKeyDown(e) {
  if (!open.value) open.value = true
  const max = props.options.length
  if (max === 0) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % max
    scrollToActive()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + max) % max
    scrollToActive()
  } else if (e.key === 'Enter') {
    if (activeIndex.value >= 0) {
      select(props.options[activeIndex.value])
      e.preventDefault()
    }
  } else if (e.key === 'Escape') {
    open.value = false
    activeIndex.value = -1
  }
}

function scrollToActive() {
  nextTick(() => {
    const el = document.querySelector('.autocomplete-active')
    if (el) el.scrollIntoView({ block: 'nearest' })
  })
}

function handleClickOutside(e) {
  if (!wrapperRef.value.contains(e.target)) {
    open.value = false
    activeIndex.value = -1
  }
}

function handleFocus() {
  open.value = true
  const i = props.options.findIndex(o => o.value === props.modelValue)
  activeIndex.value = i >= 0 ? i : -1
  updateDropdownPosition()
}

function updateDropdownPosition() {
  nextTick(() => {
    const inputEl = wrapperRef.value?.querySelector('input')
    if (inputEl) {
      const rect = inputEl.getBoundingClientRect()
      dropdownStyle.value = {
        top: `${rect.bottom + window.scrollY}px`,
        left: `${rect.left + window.scrollX}px`,
        width: `${rect.width}px`,
        position: 'absolute',
      }
    }
  })
}

const hasValue = computed(() => !!props.modelValue)

onMounted(() => window.addEventListener('click', handleClickOutside))
onUnmounted(() => window.removeEventListener('click', handleClickOutside))
</script>
