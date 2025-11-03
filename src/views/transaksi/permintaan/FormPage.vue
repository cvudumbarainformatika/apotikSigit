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
          <u-input-date type="date" v-model="form.tgl_permintaan" :error="errorMessage('tgl_permintaan')" />
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
          <u-text class="font-bold">Permintaan ke Cabang</u-text>
        </u-row>
        <u-row>
          <u-autocomplete v-model="searchSupplier" placeholder="Cari Cabang" :debounce="300" :min-search-length="2"
            item-key="id" item-label="namacabang" not-found-text="Data Cabang tidak ditemukan"
            not-found-subtext="Coba kata kunci lain" :show-add-button="false"
            api-url="/api/v1/transactions/mutasi/get-cabang" api-response-path="data.data"
            :api-params="{ per_page: 10 }" :use-api="true" @select="handleSelected"
            @items-loaded="onItemsLoaded"></u-autocomplete>
        </u-row>
        <u-row>
          <div v-if="store.supplierSelected"
            class="bg-primary/10 border border-primary rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md w-full">
            <div class="flex flex-1 justify-between items-start">
              <u-row flex1 class="w-full">
                <u-icon name="UserSearch" class="w-5 h-5 text-primary" />
                <u-text>
                  {{ store.supplierSelected?.tujuan?.namacabang ?? store.supplierSelected?.namacabang }}
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
                  Silahkan cari dan pilih Cabang di atas untuk melanjutkan order
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
          <u-autocomplete v-model="searchBarang" placeholder="Cari Barang" :debounce="300" :min-search-length="2"
            item-key="id" item-label="nama" not-found-text="Data Barang tidak ditemukan"
            not-found-subtext="Coba kata kunci lain" :show-add-button="false"
            api-url="/api/v1/transactions/mutasi/get-barang" api-response-path="data.data"
            :api-params="{ per_page: 10 }" :use-api="true" @select="handleSelectedBarang"
            @items-loaded="onItemsLoadedBarang">
            <template #item="{ item }">
              <u-col gap="gap-1">
                <u-text size="sm" class="font-medium">{{ item?.nama }}</u-text>
                <u-row class="-mt-1" gap="gap-1">
                  <u-text class="">{{ item?.kode }}</u-text>,
                  <u-text class="">{{ item?.satuan_k }}</u-text> |
                  <u-text class="">{{ item?.satuan_b }}</u-text>
                  <u-text class="">Isi {{ item?.isi }}</u-text>
                </u-row>
              </u-col>
            </template>
          </u-autocomplete>
        </u-row>

        <u-row class="relative -mt-4">
          <div v-if="store?.barangSelected" ref="menuBarangRef"
            class="bg-background border-1 border-primary rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md w-full absolute z-10 -top-4">
            <u-grid cols="12" gap="gap-4">
              <div class="col-span-4">
                <u-text class="font-bold">Nama Barang</u-text>
                <u-text>{{ store.barangSelected?.nama || '-' }}</u-text>
              </div>
              <div class="col-span-4 text-center">
                <u-text class="font-bold">Satuan</u-text>
                <u-text>{{ store.barangSelected?.satuan_k || '-' }} | {{ store.barangSelected?.satuan_b || '-' }}, {{
                  store.barangSelected?.isi || 0 }}</u-text>
              </div>
              <div class="col-span-4 text-right">
                <u-text class="font-bold">Kode</u-text>
                <u-text>{{ store.barangSelected?.kode || '-' }}</u-text>
              </div>

              <div class="col-span-12">
                <u-separator spacing="-my-2 "></u-separator>
              </div>

              <u-row class="col-span-4">
                <u-input ref="inpJumlahRef" v-model="form.jumlah_k" label="jml permintaan" type="number"
                  :error="isError('jumlah_k')" :error-message="errorMessage('jumlah_k')" />
              </u-row>
              <u-row right class="col-span-8 ">
                <u-btn variant="secondary" label="Batal" @click="handleBatal" />
                <u-btn :loading="store.loadingSave" label="Simpan" @click.stop="handleSubmit" />
              </u-row>
            </u-grid>
          </div>
        </u-row>
        <u-row>
          <u-empty v-if="!store.form?.rinci?.length" title="Belum Ada Items" icon="baggage-claim" />
          <u-list v-else :spaced="true" anim :items="store.form?.rinci">
            <template #item="{ item, isHovered }">
              <ListRincian :item="item" :store="store" :is-hovered="isHovered" />
            </template>
          </u-list>
        </u-row>

      </u-card>

      <u-col align="items-end" class="col-span-4">
        <u-text class="font-bold" size="sm">Ringkasan Permintaan</u-text>
        <u-separator spacing="-my-2"></u-separator>
        <u-row>
          <u-text>Total Item Permintaan : </u-text>
          <u-text class="font-bold" size="sm">{{ store.form?.rinci?.length || 0 }}</u-text>
        </u-row>
        <u-row>
          <u-badge v-if="store.form?.status" variant="danger">Terkunci</u-badge>
          <u-badge v-else :variant="store.mode === 'add' ? 'success' : 'warning'">Mode {{ store.mode === 'add' ?
            'Tambah' : 'Edit' }}</u-badge>
        </u-row>
        <u-separator spacing="-my-1"></u-separator>
        <u-row class="z-9">
          <u-btn v-if="store.mode === 'edit'" variant="secondary" @click="initForm">Form Baru</u-btn>
          <u-btn v-if="store.mode === 'edit'" variant="secondary" :loading="loadingLock" @click="handlePrint">Print</u-btn>
          <u-btn v-if="store.form" :loading="loadingLock" @click="handleKunci">Kirim</u-btn>

        </u-row>
        <u-row class="z-9">
        </u-row>
      </u-col>
    </u-grid>

    <div v-if="store.form?.status"
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

const notify = useNotificationStore().notify
const ListRincian = defineAsyncComponent(() => import('./ListRincian.vue'))

const props = defineProps({
  store: { type: Object, required: true },
  title: { type: String, default: 'Data' },
  mode: { type: String, default: 'add' }
})

const searchSupplier = ref('')
const searchBarang = ref('')
const menuBarangRef = ref(null)
const inpJumlahRef = ref(null)
const loadingLock = ref(false)
const cabangselected = ref(null)
const modalCetak = ref(false)

const today = new Date().toISOString().split('T')[0];

const form = ref({
  kode_mutasi: '',
  tgl_permintaan: today,
  pengirim: '',
  dari: '',
  tujuan: '',
  satuan_k: '',
  jumlah_k: '',
  harga_beli: '',
})

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

const handleSelected = (item) => {
  // console.log('handleSelected cabang', item);
  // cabangselected.value = item
  props.store.supplierSelected = item
  form.value.tujuan = item?.kodecabang ?? null
  searchSupplier.value = ''
  
}
const handleSelectedBarang = (item) => {
  props.store.barangSelected = item
  form.value.kode_barang = item?.kode ?? null
  form.value.satuan_k = item?.satuan_k ?? null
  form.value.harga_beli = item?.harga_beli ?? null
  searchBarang.value = ''
  handleFocus(inpJumlahRef)
}

const handlePrint = () => {
  modalCetak.value = true
}

const handleFocus = async (e) => {
  
  await nextTick()
  const el = e?.value
  el?.inputRef?.focus()
  el?.inputRef?.select()
  
}

function handleClickOutside(event) {
  if (menuBarangRef.value && !menuBarangRef.value.contains(event.target)) {
    clearSelectedBarang()
  }
}

const onItemsLoaded = (items) => {
  // console.log('items', items);
  
}
const onItemsLoadedBarang = (items) => {
  // console.log('items', items);
  
}


const handleSubmit = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const supplierBackup = props.store.supplierSelected
  props.store.create(form.value)
  .then(() => {
    clearSelectedBarang()
    props.store.supplierSelected = supplierBackup
  })
}

const handleBatal = () => {
  clearSelectedBarang()
}

const handleKunci = async (e) => {
  e.preventDefault()
  e.stopPropagation()
  const status = (props.store.form?.status === '1' || props.store.form?.status === 1)
  const kode_mutasi = props.store.form?.kode_mutasi
  const payload = {
    kode_mutasi
  }

  loadingLock.value = true

  let resp
  try {
    if (!status) {
      resp = await api.post(`api/v1/transactions/mutasi/kirim`, payload)
    } 
    // else {
    //   resp = await api.post(`api/v1/transactions/order/unlock-order`, payload)
    // }
    notify({ message: resp?.data?.message, type: 'success' })
    // console.log('resp', resp);
    // return
  } catch (error) {
    console.log('error', error);
    notify({ message: error?.message ?? 'Gagal Kirim', type: 'error' })
    return
  } finally {
    loadingLock.value = false
  }
  

  const data = resp?.data?.data
  props.store.form.status = data?.status
  props.store.initModeEdit(data)
  props.store.fetchAll()
  initForm()

}

onMounted(() => {
  // document.addEventListener('click', handleClickOutside)
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