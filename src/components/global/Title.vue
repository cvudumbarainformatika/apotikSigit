<template>
  <div class="text-md font-bold">
    <slot>{{ label }}</slot>
  </div>
</template>
<script setup>
const props = defineProps({
  label: { type: String, default: '' },
})
</script>