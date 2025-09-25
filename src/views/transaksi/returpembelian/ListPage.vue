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

                  <u-text class="font-bold" color="text-gray-500">{{ item?.noretur }}</u-text>
                  <!-- <u-text class="" color="text-primary">{{ item?.nomor_order }}</u-text> -->
                </u-row>
                <u-row>
                  <u-icon size="14" name="shopping-cart"></u-icon>
                  <u-text class="" color="text-gray-500">{{ item?.rincian?.length }} items</u-text>
                </u-row>
                <u-row class="mt-1">
                  <u-icon size="14" name="users"></u-icon>
                  <u-text class="font-bold" color="text-gray-500">{{ item?.suplier?.nama }}</u-text>
                </u-row>
                
              </u-col>
            </u-row>
          </u-row>

          <u-col align="items-end" gap="gap-0" class="" padding="p-0">
            <u-icon :name="item?.flag ? 'lock' : 'lock-open'" size="18" class="mb-1" :class="!item?.flag ? 'text-success' : 'text-danger'" />
            <u-text color="text-gray-500" style="font-size: 10px !important;">{{ useWaktuLaluReactive(item?.created_at) }}</u-text>
          </u-col>
        </u-row>
      </u-view>
    </template>
  </u-list>
</template>

<script setup>
import { useWaktuLaluReactive } from '@/utils/dateHelper'
const props = defineProps({
  store: { type: Object, required: true },
  items: { type: Array, default: ()=> [] },
})


const handleEdit = (item) => {
  props.store.maxRight = false
  props.store.initModeEdit(item)
}

</script>