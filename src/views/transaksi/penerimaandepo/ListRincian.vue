<template>
  <u-view flex1 class="w-full">
    <u-grid cols="4">
      <u-col class="col-span-2" gap="gap-0">
        <u-text>{{ item?.master?.nama || '-' }}</u-text>
        <u-text color="text-gray-400">{{ item?.master?.kode || '-' }}</u-text>
      </u-col>
      <u-col align="items-end" class="col-span-2" gap="gap-0">
        <u-text size="lg" class="font-bold" color="text-gray-500">{{ item?.jumlah_pesanan || 0 }}</u-text>
      </u-col>
    </u-grid>
  </u-view>
</template>

<script setup>
const props = defineProps({
  item: { type: Object, default: null },
  store: { type: Object, required: true },
})
</script>