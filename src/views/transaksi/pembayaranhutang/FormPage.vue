<template>
  <u-col class="w-full pb-4 pt-1 px-2 relative">
    <!-- <u-grid cols="5">
    </u-grid>
   -->
    <!-- CONTENT -->
    <u-grid cols="12">

      <!-- List Items -->
      <u-card class="col-span-8 h-full space-y-4">
        <u-row>
          <u-icon name="baggage-claim" class="w-4 h-4" />
          <u-text class="font-bold">Informasi Penerimaan</u-text>
        </u-row>
        <u-row>
          <u-autocomplete v-model="searchPenerimaan" placeholder="Cari No Transaksi Penerimaan" :debounce="300"
            :min-search-length="5" item-key="id" item-label="nama" not-found-text="Data Penerimaan tidak ditemukan"
            not-found-subtext="Coba kata kunci lain" :show-add-button="false"
            api-url="/api/v1/transactions/pembayaran-hutang/get-one-hutang" api-response-path="data.data"
            :api-params="{ per_page: 10 }" search-key="q" :use-api="true" @select="handleSelectedPenerimaan"
            @items-loaded="onItemsLoadedBarang">
            <template #item="{ item }">
              <u-col gap="gap-1">
                <u-row flex1 class="w-full" gap="gap-2" padding="px-2 py-3">
                  <u-col flex1 class="w-full" gap="gap-1">
                    <u-row flex1 class="w-full items-start">
                      <u-text size="sm" class="font-medium"> {{ item?.suplier?.nama }} ({{ item?.nopenerimaan }})
                      </u-text>
                    </u-row>
                  </u-col>
                  <u-row gap="gap-3">
                    <div class="flex flex-col">
                    </div>
                    <div class="w-64">
                      <u-badge variant="warning">Nilai Hutang : Rp. {{ formatRupiah(item?.total) }} </u-badge>
                    </div>

                    <u-btn
                      :loading="store.loadingSave" variant="primary" size="sm"
                      @click.stop="handleSave(item)">Bayar</u-btn>
                  </u-row>
                </u-row>
              </u-col>
            </template>
          </u-autocomplete>
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

        <u-card class="w-full space-y-4">
          <u-row>
            <u-icon name="layers" class="w-4 h-4" />
            <u-text class="font-bold">Informasi Pembayaran</u-text>
          </u-row>
          <u-row>
            <u-input-date type="date" v-model="form.tgl_pelunasan" :error="errorMessage('tgl_pelunasan')" />
          </u-row>
          <u-row>
            <u-input v-model="form.nopelunasan" label="Nomor Pembayaran (Auto)" readonly :error="isError('nopelunasan')"
              :error-message="errorMessage('nopelunasan')" />
          </u-row>
        </u-card>


        <u-text class="font-bold" size="sm">Ringkasan Pembayaran Hutang</u-text>
        <u-separator spacing="-my-2"></u-separator>
        <!-- <u-row class="-mb-2">
          <u-text>No. Penerimaan : {{ store.penerimaanSelected?.nopenerimaan }}</u-text>
          <u-text class="font-bold" size="sm">{{ store.form?.nopenerimaan || '-' }}</u-text>
        </u-row> -->
        <u-row>
          <u-text>Total Pelunasan : </u-text>
          <u-text class="font-bold" size="sm">Rp. {{ formatRupiah(totalPembayaran) }}</u-text>
        </u-row>
        <u-row>
          <u-badge v-if="store.form?.flag" variant="danger">Terkunci</u-badge>
          <u-badge v-else :variant="store.mode === 'add' ? 'success' : 'warning'">Mode {{ store.mode === 'add' ?
            'Tambah' : 'Edit' }}</u-badge>
        </u-row>
        <u-separator spacing="-my-1"></u-separator>
        <u-row class="z-9">
          <u-btn v-if="store.mode === 'edit'" variant="secondary" @click="initForm">Form Baru</u-btn>
          <u-btn v-if="store.form" :loading="loadingLock" @click.stop="handleKunci">{{ store.form?.flag ? 'Cetak' :
            'Kunci' }}</u-btn>
        </u-row>
      </u-col>
    </u-grid>

    <div v-if="store.form?.flag"
      class="absolute top-0 left-0 right-0 w-full h-full rounded-2xl flex items-center justify-center p-4 bg-light-primary/10"
      padding="p-0"></div>


    <!-- Cetak -->
    <modal-cetak v-model="modalCetak" title="Pembayaran Hutang" :store="store" @close="modalCetak = false" />
  </u-col>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch, defineAsyncComponent } from 'vue'
import { formatRupiah } from '@/utils/numberHelper'
import { useNotificationStore } from '@/stores/notification'
const notify = useNotificationStore().notify

import { api } from '@/services/api'
import ModalCetak from './ModalCetak.vue'

const ListRincian = defineAsyncComponent(() => import('./ListRincian.vue'))

const props = defineProps({
  store: { type: Object, required: true },
  title: { type: String, default: 'Data' },
  mode: { type: String, default: 'add' }
})

const searchSupplier = ref('')
const searchPenerimaan = ref('')
const menuBarangRef = ref(null)
const inpJumlahRef = ref(null)
const loadingLock = ref(false)
const modalCetak = ref(false)

const form = ref({
  nopelunasan: null,
  tgl_pelunasan: null,
  total_dibayar: null,
  noorder: null,
  nopenerimaan: null,
  nofaktur: null,
  kode_suplier: null,
  nominal: null,
  pajak: null,
  diskon: null,
  total: null,
  
})
const totalPembayaran = computed(() => {
  const items = props?.store?.form?.rinci ?? []
  return items.reduce((a, b) => a + Number(b?.total), 0)
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

const handleSelectedPenerimaan = (item) => {
  props.store.penerimaanSelected = item
  searchPenerimaan.value = ''
  handleFocus(inpJumlahRef)
}


const handleFocus = async (e) => {
  
  await nextTick()
  const el = e?.value
  // console.log('handleFocus', el);
  el?.inputRef?.focus()
  el?.inputRef?.select()
  
}


const onItemsLoadedBarang = (items) => {
  // console.log('items', items);
  
}

const clearSelectedSupplier = () => {
  // props.store.supplierSelected = null
  // form.value.kode_supplier = ''
}
const clearSelectedBarang = () => {
  props.store.penerimaanSelected = null
  // form.value.kode_barang = ''
  // form.value.satuan_k = ''
  // form.value.satuan_b = ''
  // form.value.isi = 0
  // form.value.jumlah_pesan = 1
}

const handleSave = (e) => {
  // e.preventDefault()
  // e.stopPropagation()
 
  form.value.nopenerimaan = e?.nopenerimaan || null
  form.value.noorder = e?.noorder || null
  form.value.nofaktur = e?.nofaktur || null
  form.value.kode_suplier = e?.kode_suplier || null
  form.value.nominal = e?.nominal
  form.value.pajak = e?.pajak
  form.value.diskon = e?.diskon
  form.value.total = e?.total
  // form.value.nominal = e?.rincian?.reduce((a, b) => a + (parseInt(b.harga_b) * parseInt(b.jumlah_b) || 0), 0) || 0
  // form.value.pajak = e?.rincian?.reduce((a, b) => a + (parseInt(b.pajak_rupiah) * parseInt(b.jumlah_k) || 0), 0) || 0
  // form.value.diskon = e?.rincian?.reduce((a, b) => a + (parseInt(b.diskon_rupiah) * parseInt(b.jumlah_k) || 0), 0) || 0
  // form.value.total = e?.rincian?.reduce((a, b) => a + (parseInt(b.subtotal) || 0), 0) || 0
 
  props.store.create(form.value)
  .then(() => {
    searchPenerimaan.value = ''
    // clearSelectedBarang()
  })
}



const handleKunci = async (e) => {
  e.preventDefault()
  e.stopPropagation()


  const flag = (props.store.form?.flag === '1' || props.store.form?.flag === 1)
  if (flag) {
    modalCetak.value = true
    return 
  }
  
  const id = props.store.form?.id
  const nopelunasan = props.store.form?.nopelunasan
  const payload = {
    id,
    nopelunasan
  }
  loadingLock.value = true

  let resp
  try {
    if (!flag) {
    resp = await api.post(`api/v1/transactions/pembayaran-hutang/kunci`, payload)
    }
    // else {
    //   resp = await api.post(`api/v1/transactions/returpembelian/unlock-order`, payload)
    // }
    // resp = await api.post(`api/v1/transactions/returpembelian/lock-retur-lock_retur_pembelian`, payload)
    // console.log('resp', resp);
    notify({ message: resp?.data?.message, type: 'success' })
  } catch (error) {
    console.log('error', error);
    notify({
      type: 'error',
      message: error?.message
    })
    
  } finally {
    loadingLock.value = false
  }
  const data = resp?.data?.data
  props.store.form.flag = data?.flag
  props.store.initModeEdit(data)
}


onMounted(() => {
  // document.addEventListener('click', handleClickOutside)
  initForm()
})

function initForm(){
  const today = new Date().toISOString().split('T')[0];
  form.value.tgl_pelunasan = today
  form.value.nopelunasan = ''
  // form.value.nopenerimaan = ''
  // form.value.noorder = ''
  props.store.init()
  clearSelectedBarang()
  clearSelectedSupplier()
} 

onUnmounted(() => {
  // document.removeEventListener('click', handleClickOutside)
})

watch(() => ({ ...props.store.form }), (newForm, oldForm) => {
  
  for (const key in newForm) {
    if (newForm[key] !== oldForm[key]) {
      props.store.clearFieldError(key)
    }
  }

  if (newForm) {
    for (const key in newForm) {
      if (key in form.value) {
        form.value[key] = newForm[key]
      }
    }


    const onlyDate = newForm?.tgl_pelunasan?.split(" ")[0] 
    form.value.tgl_pelunasan = onlyDate


    if (props.store.mode === 'add') {
      initForm()
    }
  }

}, { deep: true })

watch(() => props.store.maxRight, (newMax, oldMax) => {
  // if (!newMax) {
  //   initForm()
  // }
  // console.log('newMax', newMax);
  // console.log('form', form.value);
  
}, { deep: true })

</script>

<style scoped>
@keyframes shake {
  0% {
    transform: translateX(0);
  }

  20% {
    transform: translateX(-4px);
  }

  40% {
    transform: translateX(4px);
  }

  60% {
    transform: translateX(-4px);
  }

  80% {
    transform: translateX(4px);
  }

  100% {
    transform: translateX(0);
  }
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}
</style>