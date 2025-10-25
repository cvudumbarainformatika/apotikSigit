<template>
 <div class="w-full relative">
   <!-- <div v-if="store?.barangSelected && isEdited === item?.id" class="relative w-full z-10 left-0 top-0">
      <FormBarangSelected v-if="store?.barangSelected && isEdited === item?.id"  ref="childRef" :form="form" :store="store" :is-error="isError" :error-message="errorMessage" @handleSubmit="handleSubmit" @handleBatal="handleBatal" />
    </div> -->
   <u-view flex1 class="w-full z-0 cursor-pointer" >
    <u-grid cols="1" v-if="store?.barangSelected && isEdited === item?.id">
      <FormBarangSelected ref="childRef" :is-edited="isEdited !== null" :form="form" :store="store" :is-error="isError" :error-message="errorMessage" @handleSubmit="handleSubmit" @handleBatal="handleBatal" />
    </u-grid>
    <u-grid v-else cols="4" @click="handleEdit(item)">
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
          <u-text size="xl" class="font-bold" color="text-gray-500">{{ item?.jumlah_pesan || 0 }} </u-text>
          <u-text size="xs">{{ item?.satuan_b }}</u-text>
        </u-row>
      </u-col>
    </u-grid>
  </u-view>
  
 </div>
</template>

<script setup>
import { ref } from 'vue'
import { api } from '@/services/api'
import { formatJamMenit } from '@/utils/dateHelper'
import { useNotificationStore } from '@/stores/notification'

import FormBarangSelected from './FormBarangSelected.vue'

const notify = useNotificationStore().notify
const props = defineProps({
  item: { type: Object, default: null },
  form: { type: Object, default: null },
  store: { type: Object, required: true },
  isHovered: { type: Boolean, default: false },
  isError: {
    type: Function,
    required: true
  },
  errorMessage: {
    type: Function,
    required: true
  }
})

const emits = defineEmits(['handleEdit', 'handleSubmit', 'handleBatal'])
const loadingHapusItem = ref(false)
const isEdited = ref(null)

const handleDelete = async (item) => {
  console.log('handleDelete', item);
  const payload = {
    kode_barang: item?.kode_barang ?? null,
    nomor_order: props.store.form?.nomor_order,
  }

  

  // console.log('handleDelete payload', props.store.form.rinci);

  try {
    const resp = await api.post(`api/v1/transactions/order/delete-record`, payload)

    // console.log('resp hapus', resp);
    const rincian = props?.store?.form?.order_records?.filter(el => el?.kode_barang !== item?.kode_barang)
    props.store.form.order_records = rincian


    // console.log('handleDelete resp', props.store.form.rinci);

    props.store.fetchAll()

  } catch (error) {
    console.log('error', error);
  } finally {
    loadingHapusItem.value = false
  }
  
}


const handleEdit = (item) => {
  // console.log('handleEdit', item);
  isEdited.value = item?.id
  emits('handleEdit', item)
  
}

const handleBatal = (e) => {
  isEdited.value = null
  emits('handleBatal', e)
}

const handleSubmit = (e) => {
  isEdited.value = null
  emits('handleSubmit', e)
}

</script>

