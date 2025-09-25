<script setup>
import { ref } from 'vue'
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  bordered: {
    type: Boolean,
    default: false,
  },
  striped: {
    type: Boolean,
    default: false,
  },
  spaced: {
    type: Boolean,
    default: true,
  },
  anim: {
    type: Boolean,
    default: false,
  },
  mb: {
    type: [String, Number],
    default: 80,
  },
  loadingDeletes: {
    type: Array, default: () => []
  },

})

const hoverIndex = ref(null)

const emit = defineEmits(['item-hover' ])
const onItemHover = (index) => {
  // console.log('index hover', index);
  hoverIndex.value = index
  emit('item-hover', index)
}
</script>

<template>
  <div class="w-full">
    <!-- Optional Header -->
    <div v-if="$slots.header" class="mb-2">
      <slot name="header" />
    </div>

    <ul
      class="w-full divide-y divide-gray-200 rounded-md overflow-visible"
      :class="[
        bordered && !spaced ? 'border border-gray-300' : '',
        spaced ? 'space-y-1' : '',
      ]"
    >
      <li
        v-for="(item, index) in items"
        :key="item"
        @mouseenter="onItemHover(index)"
        @mouseleave="onItemHover(null)"
        :class="[
          `flex items-center flex-1 bg-background hover:bg-secondary  transition-all duration-300  hover:shadow-lg relative ${anim ? 'hover:translate-y-[2px]'  : ''}`,
          striped && index % 2 === 1 ? 'bg-gray-50' : '',
          spaced ? 'border border-primary/40 hover:border-light-primary rounded-md' : '',
        ]"
      >
        <!-- <slot name="item" :item="item" :index="index">
          <div >{{ item }}</div>
        </slot> -->

         <!-- Jika loading, gunakan slot loading -->
        <!-- <template v-if="isItemLoading(item, index)">
          <slot name="loading" :item="item" :index="index">
            <div class="w-full h-6 bg-gray-200 animate-pulse rounded"></div>
          </slot>
        </template> -->

        <!-- Jika item tertentu sedang loading -->
        <template v-if="loadingDeletes.includes(index)">
          <slot name="loading" :item="item" :index="index">
            <!-- Default skeleton -->
            <div class="w-full animate-pulse p-2">
              <div class="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </slot>
        </template>

        <!-- Normal rendering -->
        <template v-else>
          <slot name="item" :item="item" :index="index" :isHovered="index === hoverIndex">
            <div>{{ item }}</div>
          </slot>
        </template>

      </li>

      <div v-if="mb" :style="`margin-bottom: ${mb}px`"></div>
    </ul>
  </div>
</template>
