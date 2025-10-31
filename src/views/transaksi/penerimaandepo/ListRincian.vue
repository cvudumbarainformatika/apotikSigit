<template>
  <div flex1 class="w-full p-3 ">
    <!-- Glow bawah -->
    <div class="absolute -bottom-1 left-4 right-4 h-[2px] rounded-full bg-white/40 blur-md"></div>

    <!-- Kiri: Nama & Detail -->
    <u-row flex1 class="w-full" cols="4">
      <u-row flex1 class="w-full">
        <u-col gap="gap-1">
          <u-row gap="gap-2">
            <span>💊 </span>
            <u-text size="md" class="font-bold">{{ item?.master?.nama || '-' }}</u-text>
          </u-row>
          <u-row gap="gap-2">
            <u-badge variant="warning" class="">Permintaan : {{ item?.jumlah || 0 }} {{ item?.satuan_k }}</u-badge>
            
          </u-row>
          <u-row>

          </u-row>
        </u-col>
      </u-row>
      <u-row gap="gap-0">
        <u-col align="items-end" gap="gap-1">
          <u-row gap="gap-2">
            <u-icon v-if="parseInt(item.distribusi) > 0 && isHovered" name="delete" size="18" class="mb-0 text-danger cursor-pointer"
              @click.stop="handleDelete(item)" />
          </u-row>
          <u-row gap="gap-1">
            <div class="pl-5">Jumlah Penerimaan : </div>
            <div class="w-20" :class="{ 'animate-shake': parseInt(item?.jumlah) < parseInt(item?.distribusi) }">
              <u-input type="number" v-model.number="distribusiInput" label="Jml" @focus="handleFocusJumlah"
                :error="parseInt(item?.jumlah) < distribusiInput" />
            </div>
            <u-btn-icon  v-if="parseInt(item?.distribusi) === 0"
              :disabled="(parseInt(item?.jumlah) < distribusiInput) || parseInt(item?.jumlah) === 0 || loadingAdd"
              :loading="loadingAdd" icon="check" variant="secondary" size="sm" @click.stop="handleAdd(item)" />
          </u-row>
        </u-col>
      </u-row>
    </u-row>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { api } from '@/services/api'
import { formatRupiah } from '@/utils/numberHelper'
import { formatJamMenit } from '@/utils/dateHelper'
import { useNotificationStore } from '@/stores/notification'


const notify = useNotificationStore().notify
const focusId = ref(null)
const loadingAdd = ref(false)
const loadingHapusItem = ref(false)
const distribusiInput = ref(0)
const props = defineProps({
  item: { type: Object, default: null },
  store: { type: Object, required: true },
  isHovered: { type: Boolean, default: false },
})

const emit = defineEmits(['distribusi-saved', 'distribusi-delete'])

// const form = ref({
//   kode_mutasi: '',
//   kode_barang: '',
//   distribusi: '',
//   harga_beli: '',
//   satuan_k: '',

// })


const handleFocusJumlah = async (e) => {
  // console.log('handleFocusJumlah', e);
}

// const handleAdd = async (item) => {

//   form.value.kode_mutasi = item?.kode_mutasi ?? ''
//   form.value.kode_barang = item?.master?.kode ?? null
//   form.value.satuan_k = item?.satuan_k ?? null
//   form.value.harga_beli = item?.harga_beli ?? null
//   form.value.distribusi = distribusiInput.value 
//   loadingAdd.value = true
//   try {

//     const resp = await api.post('/api/v1/transactions/mutasi/simpan-distribusi', form.value)
//     console.log('resp tambah distribusi', resp);
//     notify({ message: resp?.data?.message, type: 'success' })
//     item.distribusi = distribusiInput.value 

//     emit('distribusi-saved', item)
//   } catch (error) {
//     console.log('error', error);
//     notify({ message: error?.message ?? 'Gagal tambah distribusi', type: 'error' })
//     return
//   } finally {
//     loadingAdd.value = false
//   }
// }

// const handleDelete = async (item) => {

//   form.value.kode_mutasi = item?.kode_mutasi ?? ''
//   form.value.kode_barang = item?.master?.kode ?? null
//   form.value.satuan_k = item?.satuan_k ?? null
//   form.value.harga_beli = item?.harga_beli ?? null
//   form.value.distribusi = 0
//   loadingHapusItem.value = true

//   try {
//     const resp = await api.post(`/api/v1/transactions/mutasi/simpan-distribusi`, form.value)
//     notify({ message: 'Berhasil Reset', type: 'success' })
//     item.distribusi = 0
//     distribusiInput.value = 0

//     emit('distribusi-delete', item)
//   } catch (error) {
//     console.log('error', error);
//   } finally {
//     loadingHapusItem.value = false
//   }
// }

watch(() => props.item, (val) => {
  distribusiInput.value = parseInt(val?.distribusi ?? 0)
}, { immediate: true })
</script>