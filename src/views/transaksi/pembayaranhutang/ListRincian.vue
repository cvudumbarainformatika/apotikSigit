<template>
  <u-view flex1 class="w-full">
    <u-grid cols="4">
      <u-col class="col-span-3" gap="gap-1">
        <u-text class="font-bold">{{ item?.nopenerimaan }}</u-text>
        <u-text size="xs" color="text-gray-500">No Order : {{ item?.noorder || '-' }}</u-text>
         <u-text size="xs" color="text-gray-500">No Faktur : {{ item?.nofaktur || '-' }}</u-text>
      </u-col>
      <u-col align="items-end" class="col-span-1" gap="gap-0">
        <u-row>
          <u-col align="items-end" gap="gap-0">
            <u-text size="md" class="font-bold" color="text-gray-500">Rp. {{ formatRupiah(item?.total || 0) }} </u-text>
            <span class="text-xs font-normal">{{ item?.satuan_b }}</span>
          </u-col>
          <div v-if="isHovered && !loadingHapusItem" class="ml-2">
            <u-icon size="20" name="delete" class="mb-0 text-danger cursor-pointer" @click.stop="handleDelete(item)" />
          </div>
        </u-row>
      </u-col>
    </u-grid>
  </u-view>
</template>

<script setup>
import { ref } from 'vue'
import { api } from '@/services/api'
import { formatDateIndo } from '@/utils/dateHelper'

import { useNotificationStore } from '@/stores/notification'
import { formatRupiah } from '@/utils/numberHelper'


const props = defineProps({
  item: { type: Object, default: null },
  store: { type: Object, required: true },
  isHovered: { type: Boolean, default: false },
})


// console.log('item', props.item);
// console.log('store', props.store.form);

const loadingHapusItem = ref(false)

const notify = useNotificationStore().notify

const handleDelete = async (item) => {

  const payload = {
    nopelunasan: item?.nopelunasan,
    nopenerimaan: item?.nopenerimaan,
    noorder: item?.noorder
  }

  try {
    const resp = await api.post(`api/v1/transactions/pembayaran-hutang/delete`, payload)

    const rincian = props?.store?.form?.rinci?.filter(el => el?.id !== item?.id)
    props.store.form.rinci = rincian


    notify({ message: resp.data.message ?? 'Data Berhasil dihapus', type: 'success' })

    props.store.fetchAll()

  } catch (error) {
    console.log('error', error);
    notify({ message: error.response.data.message ?? 'Data Gagal dihapus', type: 'error' })
  } finally {
    loadingHapusItem.value = false
  }

  
}

</script>