<template>
  <u-col gap="gap-1" class="w-full px-4 py-1">
    <u-view padding="0" flex1 class="w-full">
      <u-row class="">
        <div>
          <div class="font-bold">{{ item?.nama }}</div>
          <div class="text-xs text-gray-400">{{ useWaktuLaluReactive(item?.created_at) }}</div>
        </div>
      </u-row>
      <u-row flex1 right class=" w-full">
        <u-btndrop label="Aksi" :items="['Edit', 'Hapus']" @select="val => handleSelect(val, item)" />
      </u-row>
    </u-view>
  </u-col>
</template>

<script setup>
import { useWaktuLaluReactive } from '@/utils/dateHelper'
defineProps({
  item: { type: Object, default: null },
})

const emit = defineEmits(['edit', 'delete'])

function handleSelect(x, item) {
  const val = x?.toLowerCase()
  // console.log(val, item);
  
  if (val === 'edit') {
    emit('edit', item)
  } else if (val === 'hapus') {
    emit('delete', item)
  }
}
</script>