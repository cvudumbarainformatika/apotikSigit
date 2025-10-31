<template>
  <u-col class="w-full pb-4 pt-1 px-2 relative">
    <u-grid cols="5">

      <!-- HEADER 1 -->
      <u-card class="col-span-2 h-full min-h-[100px] space-y-4">
        <u-row>
          <u-icon name="layers" class="w-4 h-4" />
          <u-text class="font-bold">Informasi Permintaan</u-text>
        </u-row>
        <u-row>
          <u-input v-model="form.kode_mutasi" label="Nomor Permintaan(Auto)" readonly :error="isError('kode_mutasi')"
            :error-message="errorMessage('kode_mutasi')" />
        </u-row>
      </u-card>

      <!-- HEADER 2 -->
      <u-card class="col-span-3 h-full space-y-4">
        <u-row>
          <u-icon name="users" class="w-4 h-4" />
          <u-text class="font-bold">Terima Dari Cabang</u-text>
        </u-row>
        <u-row>
          <div v-if="store.supplierSelected"
            class="bg-primary/10 border border-primary rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md w-full">
            <div class="flex flex-1 justify-between items-start">
              <u-row flex1 class="w-full">
                <u-icon name="UserSearch" class="w-5 h-5 text-primary" />
                <u-text>
                  {{ store.supplierSelected?.tujuan?.namacabang }}
                </u-text>
              </u-row>
              <button @click="clearSelectedSupplier" class="text-primary hover:text-danger " aria-label="Hapus">
                <u-icon name="X" class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div v-else
            class="bg-danger/10 border border-danger rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md w-full">
            <u-row class="items-start" padding="p-0">
              <u-icon name="UserSearch" class="w-4 h-4 text-primary" />
              <div>
                <u-text>
                  Nama Cabang
                </u-text>
              </div>
            </u-row>
          </div>
        </u-row>
      </u-card>



    </u-grid>

    <!-- CONTENT -->
    <u-grid cols="12">
      <!-- List Items -->
      <u-card class="col-span-8 h-full space-y-4">
        <u-row>
          <u-icon name="baggage-claim" class="w-4 h-4" />
          <u-text class="font-bold">Informasi Item</u-text>
        </u-row>
        <u-row>
          <u-empty v-if="!store.form?.rinci?.length" title="Belum Ada Items" icon="baggage-claim" />
          <u-list v-else :spaced="true" anim :items="store.form?.rinci">
            <template #item="{ item, isHovered }">
              <ListRincian :item="item" :store="store" :is-hovered="isHovered" @distribusi-saved="handleDistribusiSaved"
                @distribusi-delete="handleDistribusiDelete" />
            </template>
          </u-list>
        </u-row>

      </u-card>

      <u-col align="items-end" class="col-span-4">
        <u-text class="font-bold" size="sm">Ringkasan Distribusi</u-text>
        <u-separator spacing="-my-2"></u-separator>
        <u-row>
          <u-text>Total Item Distribusi : </u-text>
          <u-text class="font-bold" size="sm">{{ store.form?.rinci?.length || 0 }}</u-text>
        </u-row>
        <u-row>
          <u-badge v-if="store.form?.status === '2'" variant="danger">Belum Diterima</u-badge>
          <u-badge v-else :variant="store.mode === 'add' ? 'success' : 'warning'">Mode {{ store.mode === 'add' ?
            'Tambah' : 'Edit' }}</u-badge>
        </u-row>
        <u-separator spacing="-my-1"></u-separator>
        <u-row class="z-9">
          <!-- <u-btn v-if="store.mode === 'edit'" variant="secondary" @click="initForm">Form Baru</u-btn> -->
          <u-btn v-if="store.mode === 'edit'" variant="secondary" :loading="loadingLock"
            @click="handlePrint">Print</u-btn>
          <u-btn v-if="store.form" :loading="loadingLock" @click="handleKunci">Terima</u-btn>

        </u-row>
        <u-row class="z-9">
        </u-row>
      </u-col>
    </u-grid>

    <div v-if="store.form?.status === '2'"
      class="absolute top-0 left-0 right-0 w-full h-full rounded-2xl flex items-center justify-center p-4 bg-light-primary/10"
      padding="p-0"></div>

    <!-- Cetak -->
    <modal-cetak v-model="modalCetak" title="Cetak Order" :store="store" @close="modalCetak = false" />
  </u-col>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch, defineAsyncComponent } from 'vue'

import { api } from '@/services/api'
import { useNotificationStore } from '@/stores/notification'
import ModalCetak from './ModalCetak.vue'
import { formatDateIndo, formatWaktuSisa, getYearEndDate, getYearStartDate } from '@/utils/dateHelper'
import { useAppStore } from '@/stores/app'

const notify = useNotificationStore().notify
const ListRincian = defineAsyncComponent(() => import('./ListRincian.vue'))

const props = defineProps({
  store: { type: Object, required: true },
  title: { type: String, default: 'Data' },
  mode: { type: String, default: 'add' }
})
const app = useAppStore()
const cabangList = ref([])
const menuBarangRef = ref(null)
const loadingLock = ref(false)
const modalCetak = ref(false)
const loading = ref(false)

const today = new Date().toISOString().split('T')[0];
const kodetoko = computed(() => app?.form?.kode_toko || null)
const form = ref({
  kode_mutasi: '',
  kode_barang: '',
  distribusi: '',
  harga_beli: '',
  satuan_k: '',
  
})
const terimaDistribusi = ref(false)

function handleDistribusiSaved(item) {
  terimaDistribusi.value = true
}
function handleDistribusiDelete(item) {
  terimaDistribusi.value = false
}

const error = computed(() => {
  const err = props.store.error
  const status = err?.status === 422
  if (status) {
    return err?.response?.data?.errors
  }
  return null
})

function isError(field){
  return !!error.value?.[field]
}

function errorMessage(field){
  return error.value?.[field]?.[0] ?? null
} 


const handlePrint = () => {
  modalCetak.value = true
}


async function loadCabang() {
  loading.value = true
  try {
    const response = await api.get('/api/v1/transactions/mutasi/get-cabang')
    if (response.status === 200) {
      const allcabang = response.data
      cabangList.value = allcabang.data.filter(a => a.kodecabang === kodetoko.value).map(c => c.kodecabang)

    }
  } catch (err) {
    console.error('Gagal load cabang:', err)
    err.message || 'Gagal memuat data cabang'
  } finally {
    loading.value = false
  }
}

const handleKunci = async (e) => {
  e.preventDefault()
  e.stopPropagation()
  const kode_mutasi = props.store.form?.kode_mutasi
  const payload = {
    kode_mutasi
  }

  loadingLock.value = true

  let resp
  try {
    resp = await api.post(`api/v1/transactions/mutasi/terima`, payload)
  
    notify({ message: resp?.data?.message, type: 'success' })

  } catch (error) {
    console.log('error', error);
    notify({ message: error?.message ?? 'Gagal Kirim', type: 'error' })
    return
  } finally {
    loadingLock.value = false
  }
  if (!kodetoko.value) await app.fetchData()
  await loadCabang()
  await nextTick()
  const params = {
    from: getYearStartDate(),
    to: getYearEndDate(),
    dari: cabangList.value,
    status: '2'
  }
  await props.store.fetchAll(params)
  initForm()

}

onMounted(async () => {
  await app.fetchData()
  await loadCabang()
  initForm()
})

function initForm(){
  const today = new Date().toISOString().split('T')[0];
  form.value.tgl_permintaan = today
  form.value.kode_mutasi = ''
  props.store.init()
  clearSelectedBarang()
  // clearSelectedSupplier()
} 

onUnmounted(() => {
  // document.removeEventListener('click', handleClickOutside)
})

const clearSelectedSupplier = () => {
  // cabangselected.value = null
  props.store.supplierSelected = null
  initForm()
}
const clearSelectedBarang = () => {
  props.store.barangSelected = null
  form.value.kode_barang = ''
  form.value.satuan_k = ''
  form.value.jumlah_k = ''
  form.value.harga_beli = ''
}
watch(() => ({ ...props.store.form }), (newForm, oldForm) => {
  
  for (const key in newForm) {
    if (newForm[key] !== oldForm[key]) {
      props.store.clearFieldError(key)
    }
  }

  if (newForm) {
    form.value = {
      kode_mutasi: newForm?.kode_mutasi ?? '',
      tgl_permintaan: newForm?.tgl_permintaan
        ? newForm.tgl_permintaan.substring(0, 10) // ambil yyyy-mm-dd saja
        : '',
      // kode_user: newForm?.kode_user,
      tujuan: newForm?.tujuan?.kodecabang ?? newForm?.tujuan ?? '',
      
    }
  }

}, { deep: true })

watch(() => props.store.maxRight, (newMax, oldMax) => {
  // if (!newMax) {
  //   initForm()
  // }
  console.log('newMax', newMax);
  console.log('form', form.value);
  
}, { deep: true })

</script>