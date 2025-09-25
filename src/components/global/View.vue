<script setup>
import { ref } from 'vue'
import { useScroll } from '@vueuse/core'

const scrollRef = ref(null)
const { arrivedState } = useScroll(scrollRef)
const { bottom } = arrivedState

// Ekspos ke parent biar bisa diakses (optional)
defineExpose({ scrollRef, arrivedState })
defineOptions({
  inheritAttrs: true
})

const props = defineProps({
  flex: { type: String, default: 'flex' },
  padding: { type: String, default: 'p-2' },
  class: { type: String, default: '' },
  flex1: { type: Boolean, default: false },
  scrollY: { type: Boolean, default: false },
  rounded: { type: String, default: '' },
})
</script>

<template>
  <div 
    ref="scrollRef"
    v-bind="$attrs"
    :class="[
    rounded, flex, props.class, padding, 
    flex1 ? `flex-1` : '', scrollY ? 'flex-col overflow-y-scroll pb-32' : ''
  ]">
    <slot />
  </div>
</template>
