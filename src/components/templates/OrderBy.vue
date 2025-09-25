<template>
  <div class="inline-flex items-center gap-2">
    <!-- Field selector custom dropdown -->
    <label v-if="label" class="text-sm text-gray-600">{{ label }}</label>

    <div class="relative" ref="dropdownRef">
      <button
        type="button"
        class="w-40 inline-flex justify-between items-center rounded-2xl border px-3 py-2 text-sm shadow-sm bg-background hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-light-primary disabled:opacity-60"
        :disabled="disabled"
        @click="toggleDropdown"
      >
        <span>{{ getLabel(selectedKey) || placeholder }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4 ml-2">
          <path fill="currentColor" d="M7 10l5 5 5-5z" />
        </svg>
      </button>
      <!-- <u-btn @click="toggleDropdown">{{ getLabel(selectedKey) || placeholder }}</u-btn> -->

      <ul
        v-if="dropdownOpen"
        class="absolute mt-1 w-40 rounded-xl border bg-background shadow-lg max-h-60 overflow-auto z-99"
      >
        <li
          v-for="f in props.fields"
          :key="f.label"
          class="cursor-pointer px-3 py-2 text-sm hover:bg-secondary hover:text-light-primary text-gray-700"
          :class="{ 'bg-indigo-50 text-primary font-medium': f.label === selectedKey }"
          @click="selectField(f.label)"
        >
          {{ f.label }}
        </li>
      </ul>
    </div>

    
  </div>
</template>

<script setup>
import { computed, watch, ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  fields: Array,
  modelValue: { type: String, default: 'Nama' },
  multi: Boolean,
  defaultDirection: { type: String, default: 'asc' },
  placeholder: { type: String, default: 'Order by...' },
  label: { type: String, default: '' },
  
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const selectedKey = ref(props.modelValue)
const dropdownOpen = ref(false)
const dropdownRef = ref(null)
// const model = computed({
//   get: () => props.modelValue,
//   set: (val) => emit('update:modelValue', val)
// })

function getLabel(key) {
  return props?.fields?.find(f => f.key === key)?.label || key
}

function toggleDropdown() {
if (props.disabled) return
dropdownOpen.value = !dropdownOpen.value
}

function selectField(key) {
  selectedKey.value = key
  dropdownOpen.value = false

  emit('update:modelValue', key)
}



function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  selectedKey.value = props.modelValue
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))


</script>
