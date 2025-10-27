<template>
  <u-view flex1 class="w-full">
    <u-grid cols="4">
      <u-col class="col-span-2" gap="gap-0">
        <u-text>{{ item?.master?.nama || '-' }}</u-text>
        <u-text color="text-gray-400">{{ item?.master?.kode || '-' }}</u-text>
      </u-col>
      <u-col align="items-end" class="col-span-2" gap="gap-0">
        <u-row>
          <u-text color="text-primary" class="italic">{{ formatJamMenit(item?.created_at) }}</u-text>
          <div v-if="isHovered && !loadingHapusItem" class="ml-2">
            <u-icon size="20" name="delete" class="mb-0 text-danger cursor-pointer" @click.stop="handleDelete(item)" />
          </div>
        </u-row>
          
        <u-row>
          <u-text size="xl" class="font-bold" color="text-gray-500">{{ item?.jumlah || 0 }} </u-text>
          <u-text size="xs">{{ item?.satuan_k }}</u-text>
        </u-row>
      </u-col>
    </u-grid>
  </u-view>
</template>

<script setup>
import { ref } from 'vue'
import { api } from '@/services/api'
import { formatJamMenit } from '@/utils/dateHelper'
import { useNotificationStore } from '@/stores/notification'

const notify = useNotificationStore().notify
const props = defineProps({
  item: { type: Object, default: null },
  store: { type: Object, required: true },
  isHovered: { type: Boolean, default: false },
})

const loadingHapusItem = ref(false)

const handleDelete = async (item) => {
  loadingHapusItem.value = true
  const payload = {
    kode_barang: item?.kode_barang ?? null,
    kode_mutasi: props.store.form?.kode_mutasi,
  }

  try {
    const resp = await api.post(`api/v1/transactions/mutasi/delete`, payload)

    const rincian = props?.store?.form?.rinci?.filter(el => el?.kode_barang !== item?.kode_barang)
    props.store.form.rinci = rincian
    notify({ message: resp?.data.message, type: 'success' })

    props.store.fetchAll()
    loadingHapusItem.value = false
  } catch (error) {
    console.log('error', error);
  } finally {
    loadingHapusItem.value = false
  }
  
}

</script>

