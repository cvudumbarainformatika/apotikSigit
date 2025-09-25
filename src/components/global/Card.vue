<template>
  <div class="bg-secondary relative rounded-lg shadow-md"
    :class="[props.class, props.padding]"
  >
    <slot></slot>
  </div>
</template>
<script setup>
const props = defineProps({
  class: { type: String, default: '' },
  padding: { type: String, default: 'p-4' },
})
</script>