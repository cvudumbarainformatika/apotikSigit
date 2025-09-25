<template>
  <u-col gap="gap-1" class="w-full px-4 py-1">
    <u-view padding="0" flex1 class="w-full">
      <u-row flex1 class="w-full">
        <div>
          <div class="font-bold">{{ item?.nama_beban }}</div>
          <div class="text-xs text-gray-400">{{ useWaktuLaluReactive(item?.created_at) }}</div>
        </div>
      </u-row>
      <u-row right class="">
        <div>
          <div class="flex flex-col items-end gap-1 pt-2">
            <u-btndrop label="Aksi" :items="['Edit', 'Hapus']" @select="val => handleSelect(val, item)" />
            <span class="text-xs text-gray-400">{{ useWaktuLaluReactive(item?.created_at) }}</span>
          </div>
        </div>
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

  if (val === 'edit') {
    emit('edit', item)
  } else if (val === 'hapus') {
    emit('delete', item)
  }
}
</script>