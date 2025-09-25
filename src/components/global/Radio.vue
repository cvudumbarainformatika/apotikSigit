<script setup>
defineProps({
  modelValue: String, // nilai yang dipilih di parent
  value: String,      // nilai radio ini
  label: String,      // teks label radio
})

defineEmits(['update:modelValue'])
</script>

<template>
  <label
    class="group relative flex items-center justify-between rounded-2xl border px-2 py-1 cursor-pointer select-none transition shadow-sm hover:shadow focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
    :class="modelValue === value ? 'border-primary ring-1 ring-primary' : 'border-secondary'"
  >
    <div class="flex items-center gap-2">
      <span
        class="inline-flex h-4 w-4 items-center justify-center rounded-full border"
        :class="modelValue === value ? 'border-primary' : 'border-slate-400'"
      >
        <span
          v-if="modelValue === value"
          class="block h-2.5 w-2.5 rounded-full bg-primary"
        ></span>
      </span>
      <span class="text-sm">{{ label }}</span>
    </div>
    <input
      type="radio"
      class="sr-only"
      :value="value"
      :checked="modelValue === value"
      @change="$emit('update:modelValue', value)"
    />
  </label>
</template>
