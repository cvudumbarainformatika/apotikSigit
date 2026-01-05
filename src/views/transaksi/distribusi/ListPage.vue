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

                  <u-text class="font-bold" color="text-gray-500">{{ item?.kode_mutasi }}</u-text>
                  <u-text class="font-bold" color="text-gray-500">{{ item?.dari?.namacabang }}</u-text>
                </u-row>
                <u-row>
                  <u-icon size="14" name="shopping-cart"></u-icon>
                  <u-text class="" color="text-gray-500">{{ item?.rinci?.length }} items</u-text>
                  <u-text class="" color="text-gray-500">Tujan ke {{ item?.tujuan?.namacabang }}</u-text>
                </u-row>

              </u-col>
            </u-row>
          </u-row>

          <u-col align="items-end" gap="gap-0" class="" padding="p-0">
            <u-icon :name="Number(item?.status)==1 ?  'lock-open':'lock' " size="18" class="mb-1"
              :class="Number(item?.status)==1 ? 'text-danger':'text-success'" />
            <u-text color="text-gray-500" style="font-size: 10px !important;">{{ useWaktuLaluReactive(item?.created_at)
              }}</u-text>
              <u-text >{{getStatusText(item?.status)}} </u-text>
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
function getStatusText(val){
  switch (val) {
    case '1':
      return 'Dikirim';
      break;
    case '2':
      return 'Terdistribusi';
      break;
    case '3':
      return 'Diterima';
      break;
    case null:
      return 'Draft';
      break;
  
    default:
      return '-';
      break;
  }
}

</script>