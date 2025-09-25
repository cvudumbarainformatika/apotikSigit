<template>
  <div flex1 class="w-full p-3">
    <!-- Glow bawah -->
    <div class="absolute -bottom-1 left-4 right-4 h-[2px] rounded-full bg-white/40 blur-md"></div>

    <!-- Kiri: Nama & Detail -->
    <u-row flex1 class="w-full" cols="4">
      <u-row flex1 class="w-full">
        <u-col gap="gap-1">
          <u-row gap="gap-2">
            <!-- <span>💊 </span> -->
            <u-text size="md" class="font-bold">{{ item?.mbeban?.nama_beban || '-' }}</u-text>
          </u-row>
          <u-row gap="gap-1">
            <u-badge variant="warning">Rp. {{ formatRupiah(item?.subtotal) }}</u-badge>
          </u-row>
        </u-col>
      </u-row>
      <u-row gap="gap-0">
        <u-col align="items-end" gap="gap-1">
          <u-row gap="gap-2">
            <u-text color="text-primary" class="italic">{{ formatDateIndo(item?.created_at) }}</u-text>
            <!-- <u-icon v-if="isHovered" name="pencil" size="18" class="mb-0 text-light-primary cursor-pointer" @click="handleSelectedBarang(item)"  /> -->
            <u-icon v-if="isHovered" name="delete" size="18" class="mb-0 text-danger cursor-pointer"
              @click.stop="handleDelete(item)" />
          </u-row>
          <u-row gap="gap-1">
            <u-text color="text-primary" class="italic">{{ formatJamMenit(item?.created_at) }}</u-text>
          </u-row>
        </u-col>
      </u-row>
    </u-row>
  </div>
</template>

<script setup>
import { api } from '@/services/api';
import { useNotificationStore } from '@/stores/notification';
import { formatDateIndo, formatJamMenit } from '@/utils/dateHelper';
import { formatRupiah } from '@/utils/numberHelper';
import { ref } from 'vue';

const notify = useNotificationStore().notify
const focusId = ref(null)
const loadingHapusItem = ref(false)
const props = defineProps({
  item: { type: Object, default: null },
  store: { type: Object, required: true },
  isHovered: { type: Boolean, default: false },
})

const handleDelete = async (item) => {

  const payload = {
    notransaksi: props.store.form?.notransaksi,
    id: item?.id ?? null,
  }

  console.log('handleDelete payload', payload);

  try {
    const resp = await api.post(`api/v1/transactions/beban/delete`, payload)
    if (resp.data.success === true) {
      notify({ message: resp.data.message ?? 'Data Berhasil dihapus', type: 'success' })
    
    }
    console.log('resp hapus', resp);
    const rincian = props?.store?.form?.rincian?.filter(el => el?.id !== item?.id)
    props.store.form.rincian = rincian

    // console.log('handleDelete resp', props.store.form.rinci);
    if (props?.store?.form?.rincian?.length === 0) {
      props.store.init()
    }
    props.store.fetchAll()

  } catch (error) {
    console.log('error', error);
  } finally {
    loadingHapusItem.value = false
  }


}
</script>