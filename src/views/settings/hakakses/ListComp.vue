<template>
  <u-col gap="gap-1" class="w-full px-4 py-1">
    <u-view padding="0" flex1 class="w-full">
      <u-col flex1 class="w-full" gap="gap-1">
        <u-row flex1 class="w-full pt-1">
          <u-row flex1 class="w-full">
            <div class="font-bold">{{ item?.nama }}</div>
            <div class="italic text-light-primary text-xs">{{ item?.kode }}</div>
          </u-row>
          <u-row class="">
            <div class="text-xs text-gray-400">{{ useWaktuLaluReactive(item?.created_at) }}</div>
          </u-row>
        </u-row>
        <u-separator></u-separator>
        <u-row flex1 class="w-full pt-0 pb-1">
          <u-row flex1 class="w-full">
            <div class="w-full">
              <u-row flex1 class="text-xs pt-1">
                <div class="font-bold">Email : </div>
                <div>{{ item?.email }}</div>
              </u-row>
              <u-row flex1 class="w-full text-xs pt-1">
                <div class="font-bold">Telp : </div>
                <div class="font-light">{{ formatTeleponID(item?.hp) }}</div>
              </u-row>
            </div>

          </u-row>
          <u-row right class="">
            <!-- <u-btndrop label="Role" :items="['Menu', 'Hapus']" @select="val => handleSelect(val, item)" /> -->
            <u-btn label="Role" size="sm" @click="emit('hak-akses', item)" />
          </u-row>
        </u-row>
      </u-col>
    </u-view>
  </u-col>
</template>

<script setup>
import { useWaktuLaluReactive } from '@/utils/dateHelper'
import { formatRupiah, formatTeleponID } from '@/utils/numberHelper'
defineProps({
  item: { type: Object, default: null },
})

const emit = defineEmits(['hak-akses'])

function handleSelect(x, item) {
  const val = x?.toLowerCase()
  if (val === 'hak akses') {
    emit('hak-akses', item)
  }
}
</script>