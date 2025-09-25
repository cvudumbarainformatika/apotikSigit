<template>
  <u-view flex1 class="w-full">
    <u-grid cols="4">
      <u-col class="col-span-3" gap="gap-0">
        <u-text class="font-bold">{{ item?.master?.nama || '-' }}</u-text>
        <u-text size="xs" color="text-gray-500">{{ item?.kode_barang || '-' }} | Harga : {{ item?.harga || '-' }}</u-text>
         <u-text size="xs" color="text-gray-500">No Batch : {{ item?.nobatch || '-' }}</u-text>
      </u-col>
      <u-col align="items-end" class="col-span-1" gap="gap-0">
        <u-row>
          <u-col align="items-end" gap="gap-0">
            <u-text size="lg" class="font-bold" color="text-gray-500">{{ item?.jumlah_k || 0 }} </u-text>
            <span class="text-xs font-normal">{{ item?.satuan_k }}</span>
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
    noretur: props.store.form?.noretur,
    id_penerimaan_rinci: item?.id_penerimaan_rinci ?? null,
    id: item?.id ?? null
  }

  

  // console.log('handleDelete payload', props.store.form.rinci);

  try {
    const resp = await api.post(`api/v1/transactions/returpenjualan/delete`, payload)

    // console.log('resp hapus', resp);
    const rincian = props?.store?.form?.retur_penjualan_r?.filter(el => el?.id !== item?.id)
    props.store.form.retur_penjualan_r = rincian


    notify({ message: resp.data.message ?? 'Data Berhasil dihapus', type: 'success' })

    props.store.fetchAll()

  } catch (error) {
    console.log('error', error);
    notify({ message: error.response.data.message ?? 'Data Gagal dihapus', type: 'danger' })
  } finally {
    loadingHapusItem.value = false
  }

  
}

</script>