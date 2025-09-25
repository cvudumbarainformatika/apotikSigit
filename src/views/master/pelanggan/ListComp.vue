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
              <u-row flex1 class="text-xs">
                <div>Contact : </div>
                <div class="font-bold">{{ item?.tlp }}</div>
                <!-- <div>Rek : </div>
                <div class="font-bold">{{ item?.rekening }}</div> -->
                
              </u-row>
              <u-row flex1 class="w-full text-xs">
                <div>Alamat : </div>
                <div class="font-light">{{ item?.alamat }}</div>
              </u-row>
              
             
            </div>
            
          </u-row>
          <u-row right class="">
            <u-btndrop label="Aksi" :items="['Edit', 'Hapus']" @select="val => handleSelect(val, item)" />
          </u-row>
        </u-row>
      </u-col>
    </u-view>
  </u-col>
</template>

<script setup>
import { useWaktuLaluReactive } from '@/utils/dateHelper'
import { formatRupiah } from '@/utils/numberHelper'
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