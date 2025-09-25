<template>
  <u-col gap="gap-1" class="w-full px-4 py-1">
    <u-view padding="0" flex1 class="w-full">
      <u-row class="justify-between">
        <div class="font-bold">{{ item?.nama }}</div>
        <div class="text-xs text-gray-400">{{ item?.kode }}</div>
      </u-row>
    </u-view>

    <u-separator />

    <u-view padding="0" flex1 class="w-full">
      <u-row>
        <u-col gap="gap-1">
          <div>{{ item?.kategori }}</div>
          <div class="text-sm text-light-primary">{{ item?.deskripsi }}</div>
        </u-col>
      </u-row>

      <u-row flex1 right>
        <u-btndrop label="Aksi" :items="['Edit', 'Hapus']" />
      </u-row>
    </u-view>
  </u-col>
</template>

<script setup>
defineProps({
  item: { type: Object, default: null },
})
</script>