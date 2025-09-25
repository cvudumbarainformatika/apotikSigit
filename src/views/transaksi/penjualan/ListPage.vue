<template>
  <u-list :items="items" anim>
    <template #item="{ item }">
      <u-view padding="px-3 py-3" flex1 class="w-full cursor-pointer" @click="handleEdit(item)">
        <u-row flex1 class="w-full">
          <u-row flex1>
            <!-- <u-row>
              <u-avatar size="w-8 h-8" :label="item?.supplier?.nama"></u-avatar>
            </u-row> -->
            <u-row flex1>
              <u-col gap="gap-0" class="w-full">
                <u-row flex1>
                  <u-text class="font-medium" color="text-primary">{{ item?.nopenjualan }}</u-text>
                  <!-- <u-text class="font-bold" color="text-gray-500">{{ item?.supplier?.nama }}</u-text> -->
                </u-row>
                <u-row>
                  <u-icon size="14" name="shopping-cart"></u-icon>
                  <u-text class="" color="text-gray-500">{{ new Set(item?.rinci?.map(r => r?.kode_barang))?.size }} items</u-text>
                </u-row>
                <u-row class="mt-1">
                  <u-text class="font-bold" color="text-gray-500">{{ item?.cara_bayar || '-' }}</u-text>
                </u-row>
              </u-col>
            </u-row>
          </u-row>

          <u-col align="items-end" gap="gap-0" class="" padding="p-0">
            <u-text color="text-gray-500" style="font-size: 10px !important;">{{ useWaktuLaluReactive(item?.created_at) }}</u-text>
            <u-text class="font-bold" size="md" color="text-primary"><span class="text-xs font-light">Rp. </span>{{ formatRupiah(getTotal(item?.rinci)) }}</u-text>
            <u-badge class="mt-1 -mr-1" :variant="item?.flag ? 'success' : 'warning'" size="xs">{{ item?.flag ? 'Complete' : 'Draft' }}</u-badge>
          </u-col>
        </u-row>
      </u-view>
    </template>
  </u-list>
</template>

<script setup>
import { useWaktuLaluReactive } from '@/utils/dateHelper'
import { formatRupiah } from '@/utils/numberHelper'
const props = defineProps({
  store: { type: Object, required: true },
  items: { type: Array, default: ()=> [] },
})


const handleEdit = (item) => {
  props.store.maxRight = false
  props.store.initModeEdit(item)
}

const getTotal = (items) => {
  let total = 0
  items.forEach(item => {
    total += parseInt(item?.subtotal || 0)
  });
  return total
}

</script>