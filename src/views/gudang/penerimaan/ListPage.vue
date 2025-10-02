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
              <u-col gap="gap-1" class="w-full">
                <u-row flex1 class="w-full pt-1">
                  <u-row flex1>
                    <u-text class="font-bold text-light-primary text-xs" color="text-gray-500">
                      {{ item?.nopenerimaan }}
                    </u-text>
                  </u-row>
                  <u-row>
                    <u-text color="text-primary">Rp. {{ formatRupiah(item?.totals) }}</u-text>
                  </u-row>
                </u-row>

                <u-row>
                  <u-icon size="14" name="file-check-2"></u-icon>
                  <u-text class="" color="text-gray-500">{{ item?.suplier?.nama }} ||</u-text>
                  <u-text class="" color="text-gray-500">Order: {{ item?.noorder }}</u-text>
                </u-row>

                <u-row>
                  <u-text class="" color="text-gray-500">No Faktur :{{ item?.nofaktur }}</u-text>
                </u-row>
              </u-col>
            </u-row>
          </u-row>

          <u-col align="items-end" gap="gap-0" class="" padding="p-0">
            <u-icon :name="item?.flag ? 'lock' : 'lock-open'" size="18" class="mb-1"
              :class="!item?.flag ? 'text-success' : 'text-danger'" />
            <u-text color="text-gray-500" style="font-size: 10px !important;">{{ useWaktuLaluReactive(item?.created_at)
              }}</u-text>
          </u-col>
          <!-- <u-col align="items-end" gap="gap-0" class="w-full -mt-4 p-0" padding="p-0">
            <u-text color="text-gray-400">{{ useWaktuLaluReactive(item?.created_at) }}</u-text>
          </u-col> -->
        </u-row>
      </u-view>
    </template>

  </u-list>
</template>

<script setup>
import { useWaktuLaluReactive } from '@/utils/dateHelper'
import { computed, watch } from 'vue';
import { formatRupiah } from '@/utils/numberHelper';
const props = defineProps({
  store: { type: Object, required: true },
  items: { type: Array, default: ()=> [] },
})


const handleEdit = (item) => {
  // console.log('handleEdit', item);
  props.store.maxRight = false
  props.store.initModeEdit(item)
}

watch(
  () => props.items,
  (newItems) => {
    const totalMap = newItems.reduce((acc, item) => {
      const total = item.rincian?.reduce((sum, r) => {
        return sum + (parseFloat(r.subtotal) || 0);
      }, 0) || 0;

      acc[item.nopenerimaan] = total;
      return acc;
    }, {});

    newItems.forEach(item => {
      item.totals = totalMap[item.nopenerimaan] || 0;
    });
  },
  { deep: true, immediate: true }
);

</script>