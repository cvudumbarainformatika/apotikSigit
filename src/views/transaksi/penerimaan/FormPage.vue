<template>
  <u-col class="w-full pb-4 pt-1 px-2 relative">
    <u-grid cols="5">
      <!-- HEADER 1 -->
      <u-card class="col-span-2 h-full min-h-[100px] space-y-4">
        <u-row>
          <u-icon name="layers" class="w-4 h-4" />
          <u-text class="font-bold">Informasi Penerimaan</u-text>
        </u-row>
        <u-row>
          <u-input-date type="date" v-model="form.tgl_penerimaan" :error="errorMessage('tgl_penerimaan')" />
        </u-row>
        <u-row>
          <u-input v-model="form.nopenerimaan" label="Nomor Penerimaan (Auto)" readonly :error="isError('nopenerimaan')"
            :error-message="errorMessage('nopenerimaan')" />
        </u-row>
        <u-row>
          <u-input v-model="form.nofaktur" label="Nomor Faktur" :error="isError('nofaktur')"
            :error-message="errorMessage('nofaktur')" />
        </u-row>
        <u-row>
          <u-input-date label="Tanggal Faktur" type="date" v-model="form.tgl_faktur"
            :error="errorMessage('tgl_faktur')" />
        </u-row>
      </u-card>

      <!-- HEADER 2 -->
      <u-card class="col-span-3 h-full space-y-4">
        <u-row>
          <u-icon name="users" class="w-4 h-4" />
          <u-text class="font-bold">Informasi Order</u-text>
        </u-row>
        <u-row>
          <div v-if="store?.orderSelected"
            class="bg-primary/10 border border-primary rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md w-full">
            <div class="flex flex-1 justify-between items-start">
              <u-row flex1 class="w-full">
                <u-icon name="file-search-2" class="w-5 h-5 text-primary" />
                <u-text>
                  {{ store.orderSelected?.nomor_order }}
                </u-text>
              </u-row>
              <button @click="clearSelectedOrder" class="text-primary hover:text-danger" aria-label="Hapus">
                <u-icon name="X" class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div v-else
            class="bg-danger/10 border border-danger rounded-xl shadow-sm px-4 py-2 transition-all duration-300 hover:shadow-md w-full">
            <u-grid cols="3">
              <u-row flex1 class="col-span-2">
                <u-icon name="file-search-2" class="w-4 h-4 text-primary" />
                <div class="w-full">
                  <u-text>
                    Silahkan cari dan pilih Nomer Order di tombol samping
                  </u-text>
                </div>
              </u-row>
              <div class="text-right">
                <u-btn label="Order" @click="modalOpendata = true" />
              </div>
            </u-grid>
          </div>
        </u-row>
        <u-row>
          <div v-if="store?.supplierSelected"
            class="bg-primary/10 border border-primary rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md w-full">
            <div class="flex flex-1 justify-between items-start">
              <u-row flex1 class="w-full">
                <u-icon name="user" class="w-5 h-5 text-primary" />
                <u-text>
                  {{ store.supplierSelected?.nama }}
                </u-text>
              </u-row>
            </div>
          </div>
          <div v-else
            class="bg-danger/10 border border-danger rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md w-full">
            <u-row class="items-start" padding="p-0">
              <u-icon name="user" class="w-4 h-4 text-primary" />
              <div>
                <u-text>
                  Nama Supplier
                </u-text>
              </div>
            </u-row>
          </div>
        </u-row>
        <u-grid cols="2">
          <u-select label="Jenis Pajak" v-model="form.jenispajak" :options="optionJenispajaks"
            :error="isError('jenispajak')" :error-message="errorMessage('jenispajak')" @update:modelValue="(val) => {
              form.pajak = val === 'Exclude' ? parseInt(11) : parseInt(0)
            }" />
          <u-input readonly class="col-span-1" v-model="form.pajak" label="Pajak" :error="isError('pajak')"
            type="number" :error-message="errorMessage('pajak')" />
        </u-grid>
        <u-grid cols="3" class="gap-2 mb-2" role="radiogroup" aria-label="Cara Bayar">
          <u-row class="">Pembayaran : </u-row>
          <u-radio class="bg-background" v-model="form.hutang" value="HUTANG" label="HUTANG" />
          <u-radio class="bg-background" v-model="form.hutang" value="CASH" label="CASH" />
        </u-grid>
      </u-card>
    </u-grid>

    <u-grid cols="12">
      <!-- List Items -->
      <u-card class="col-span-8 h-full space-y-4">
        <u-row>
          <u-icon name="baggage-claim" class="w-4 h-4" />
          <u-text class="font-bold">Informasi Item</u-text>
        </u-row>
        <u-row v-if="store.orderSelected && form.jenispajak">
          <u-list :items="listItems">
            <template #item="{ item }">
              <u-view flex1 class="w-full" padding="px-3 py-3">
                <u-grid>
                  <u-row>
                    <u-grid cols="12" gap="gap-4">
                      <div class="col-span-3">
                        <u-text class="font-bold">Nama Barang</u-text>
                        <u-text size="sm" class="font-medium">{{ item.nama || item.master?.nama || '-' }}</u-text>
                      </div>
                      <div class="col-span-3 text-center">
                        <u-text class="font-bold">Jumlah Pesan</u-text>
                        <u-text size="sm" class="font-medium">{{ item.jumlah_pesan || '-' }} {{ item.satuan_b || '-'
                          }}</u-text>
                      </div>
                      <div class="col-span-3 text-center">
                        <u-text class="font-bold">Satuan</u-text>
                        <u-text size="sm" class="font-medium">per {{ item.satuan_b || '-' }} isi {{ item.isi || '-' }}
                          {{
                          item.satuan_k || '-' }}</u-text>
                      </div>
                      <div class="col-span-3 text-right">
                        <u-text class="font-bold">Kode Obat</u-text>
                        <u-text size="sm" class="font-medium">{{ item.kode_barang || '-' }}</u-text>
                      </div>
                      <div class="col-span-12">
                        <u-separator spacing="-my-2"></u-separator>
                      </div>
                    </u-grid>
                  </u-row>
                  <u-row>
                    <u-grid cols="12">
                      <u-row class="col-span-4">
                        <u-input v-model="form.rincian[item.kode_barang].jumlah_b" label="Penerimaan (Besar)"
                          :error="isError(`rincian.${item.kode_barang}.jumlah_b`)"
                          :error-message="errorMessage(`rincian.${item.kode_barang}.jumlah_b`)" type="number" />
                      </u-row>
                      <u-row class="col-span-4">
                        <u-input v-model="form.rincian[item.kode_barang].harga_b" label="Harga"
                          :error="isError(`rincian.${item.kode_barang}.harga_b`)"
                          :error-message="errorMessage(`rincian.${item.kode_barang}.harga_b`)" type="number" />
                      </u-row>
                      <u-row class="col-span-4">
                        <u-input v-model="form.rincian[item.kode_barang].nobatch" label="Nobatch"
                          :error="isError(`rincian.${item.kode_barang}.nobatch`)"
                          :error-message="errorMessage(`rincian.${item.kode_barang}.nobatch`)" />
                      </u-row>
                    </u-grid>
                  </u-row>
                  <u-row>
                    <u-grid cols="12">
                      <u-row class="col-span-4">
                        <u-input v-model="form.rincian[item.kode_barang].diskon_persen" label="Disc(%)"
                          :error="isError(`rincian.${item.kode_barang}.diskon_persen`)" type="number"
                          :error-message="errorMessage(`rincian.${item.kode_barang}.diskon_persen`)" />
                      </u-row>
                      <u-row class="col-span-8">
                        <div
                          class="bg-background border border-light-primary rounded-full shadow-sm p-2.5 transition-all duration-300 hover:shadow-md w-full">
                          <u-row class="items-start" padding="p-0">
                            <!-- <u-icon name="close" class="w-4 h-4 text-primary" /> -->
                            <div>
                              <u-text>
                                Diskon Rp. {{ formatRupiah(
                                  ((Number(form.rincian[item.kode_barang]?.harga_b ?? 0) *
                                    Number(form.rincian[item.kode_barang]?.jumlah_b ?? 0)) *
                                    (Number(form.rincian[item.kode_barang]?.diskon_persen ?? 0) / 100))
                                ) }}
                                <!-- {{ nilaiDiskon }} -->
                              </u-text>
                            </div>
                          </u-row>
                        </div>
                      </u-row>
                    </u-grid>
                  </u-row>
                  <u-row>
                    <u-grid cols="12">
                      <u-row class="col-span-4">
                        <u-input-date label="Expired" type="date" v-model="form.rincian[item.kode_barang].tgl_exprd"
                          :error="errorMessage(`rincian.${item.kode_barang}.tgl_exprd`)" />
                      </u-row>
                      <u-row class="col-span-8">
                        <template v-if="!isSameRincian(item.nobatch, item.kode_barang)">
                          <u-btn variant="secondary" label="Batal" @click="handleBatal(item.kode_barang)" />
                          <u-btn :loading="item.loading" label="Simpan" @click.stop="handleSubmit($event, item)" />
                        </template>
                        <template v-else>
                          <u-btn :loading="item.loading" variant="secondary" label="Hapus"
                            @click.stop="handleHapusRinci($event, item)" />
                        </template>
                      </u-row>
                    </u-grid>
                  </u-row>
                </u-grid>
              </u-view>
            </template>
          </u-list>
        </u-row>
        <u-row v-else>
          <u-empty title="Belum Ada Items" icon="baggage-claim" />
        </u-row>
      </u-card>

      <u-col align="items-end" class="col-span-4">
        <u-text class="font-bold" size="sm">Ringkasan Penerimaan</u-text>
        <u-separator spacing="-my-2"></u-separator>
        <u-row>
          <u-text>Total Item Order : </u-text>
          <u-text class="font-bold" size="sm">{{ listItems.length || 0 }}</u-text>
        </u-row>
        <u-row>
          <u-text>Nilai Total Penerimaan : </u-text>
          <u-text class="font-bold" size="sm">{{ formatRupiah(TotalPenerimaan) || 0 }}</u-text>
        </u-row>
        <u-row>
          <u-badge v-if="store.form?.flag" variant="danger">Terkunci</u-badge>
          <u-badge v-else :variant="store.mode === 'add' ? 'success' : 'warning'">Mode {{ store.mode === 'add' ?
            'Tambah' : 'Edit' }}</u-badge>
        </u-row>
        <u-separator spacing="-my-1"></u-separator>
        <u-row class="z-50">
          <u-btn v-if="store.mode === 'edit'" variant="secondary" @click="initForm">Baru</u-btn>
          <u-btn v-if="store.form && store.form?.flag !== '1'" :loading="loadingLock" @click="handleKunci">{{ 'Kunci'
            }}</u-btn>
          <u-btn v-if="store.mode === 'edit' && store.form?.flag === '1'" @click="openModalCetak">Cetak</u-btn>
        </u-row>
      </u-col>
    </u-grid>

    <modal-data v-if="modalOpendata" v-model="modalOpendata" title="Data Order" :store="store"
      @close="modalOpendata = false" />


    <modal-cetak v-if="modalCetak" v-model="modalCetak" title="Penerimaan" :store="store" :form="form"
      @close="handleCloseModalNota" />
    <div v-if="store.form?.flag"
      class="absolute top-0 left-0 right-0 w-full h-full rounded-2xl flex items-center justify-center p-4 bg-light-primary/10"
      padding="p-0"></div>
  </u-col>
</template>

<script setup>
import { ref, computed, watch, defineAsyncComponent, onMounted } from 'vue'
import { useOrderStore } from '@/stores/template/register'
import { getYearStartDate, getYearEndDate } from '@/utils/dateHelper'
import { formatRupiah } from '@/utils/numberHelper'
import { useNotificationStore } from '@/stores/notification'
import { api } from '@/services/api'
import ModalCetak from './ModalNota.vue'

const ModalData = defineAsyncComponent(() => import('./ModalGetdata.vue'))
const props = defineProps({
  store: { type: Object, required: true },
  items: { type: Array, default: () => [] },
  title: { type: String, default: 'Data' },
  mode: { type: String, default: 'add' }
})
const storeorder = useOrderStore()
const notify = useNotificationStore().notify
const modalOpendata = ref(false)
const isSubmitting = ref(false)
const skipWatch = ref(false)
const loadingLock = ref(false)
const modalCetak = ref(false)
const loadingHapusItem = ref(true)

const form = ref({
  nopenerimaan: '',
  noorder: '',
  tgl_penerimaan: '',
  nofaktur: '',
  tgl_faktur: '',
  kode_suplier: '',
  jenispajak: '',
  pajak: '',
  flag: null,
  hutang: '',

  // rincian (object key by kode_barang)
  kode_barang: '',
  nobatch: '',
  jumlah_b: '',
  jumlah_k: '',
  harga_b: '',
  diskon_persen: '',
  isi: '',
  satuan_k: '',
  satuan_b: '',
  pajak_rupiah: '',
  diskon_rupiah: '',
  tgl_exprd: '',

  rincian: {},
})

const openModalCetak = () => {
  // if (!store.form?.nopenerimaan) {
  //   notify({ message: 'Penerimaan belum terkunci', type: 'error' })
  //   return
  // }
  modalCetak.value = true
}
const handleCloseModalNota = () => {
  modalCetak.value = false

  // initForm()
  window.location.reload()
}
const error = computed(() => {
  const err = props.store.error
  const status = err?.status === 422
  if (status) {
    return err?.response?.data?.errors
  }
  return null
})

function isError(field) {
  return !!error.value?.[field]
}

function errorMessage(field) {
  return error.value?.[field]?.[0] ?? null
}

const optionJenispajaks = computed(() => [
  { value: 'Exclude', label: 'Exclude' },
  { value: 'Include', label: 'Include' }
])

const params = computed(() => ({
  from: getYearStartDate(),
  to: getYearEndDate(),
  flag: '1'
}))

const listItems = computed(() => {
  const rincian = form.value.rincian || {}
  const orderRecords = props.store.orderSelected?.order_records || []
  // console.log('orderRecords', orderRecords)
  if (Object.keys(rincian).length > 0) {
    return Object.values(rincian)
  }

  return orderRecords.map(item => ({
    nopenerimaan: item.nopenerimaan,
    nama: item.master?.nama || item.nama || '',
    jumlah_pesan: item.jumlah_pesan || '',
    jumlah_b: item.jumlah_b || '',
    harga_b: item.harga_b || '',
    nobatch: item.nobatch || '',
    diskon_persen: item.diskon_persen || 0,
    satuan_b: item.satuan_b || item.master?.satuan_b || '',
    satuan_k: item.satuan_k || item.master?.satuan_k || '',
    isi: parseInt(item.isi || item.master?.isi) || 1,
    jumlah_k: (parseInt(item.jumlah_b) || 0) * (parseInt(item.isi || item.master?.isi) || 1),
    kode_barang: item.kode_barang,
    pajak_rupiah: parseInt(item.pajak_rupiah) || 0,
    diskon_rupiah: parseInt(item.diskon_rupiah) || 0,
    loading: false,
    master: item.master || null,
  }))
  
})

const handleKunci = async (e) => {
  e.preventDefault()
  e.stopPropagation()
  
  const flag = (props.store.form?.flag === '1' || props.store.form?.flag === 1)
  // console.log('handleKunci', flag)
  const nopenerimaan = props.store.form?.nopenerimaan
  const rincians = props.store.form?.rincian
  
  const payload = {
    nopenerimaan,
    payload: rincians.map(item => ({
      nopenerimaan: item.nopenerimaan,
      noorder: item.noorder,
      kode_barang: item.kode_barang,
      nobatch: item.nobatch,
      id_penerimaan_rinci: item.id,
      
      isi: item.isi,
      satuan_b: item.satuan_b,
      satuan_k: item.satuan_k,
      jumlah_b: parseInt(item.jumlah_b),
      jumlah_k: parseInt(item.jumlah_k),
      harga: parseFloat(item.harga),
      pajak_rupiah: parseFloat(item.pajak_rupiah),
      diskon_persen: parseFloat(item.diskon_persen),
      harga_total: parseFloat(item.harga_total),
      subtotal: parseFloat(item.subtotal),
      diskon_rupiah: parseFloat(item.diskon_rupiah),
      tgl_exprd: item.tgl_exprd,
      
    }))
  }
  // console.log('payload', payload)
  // console.log('rincians', rincians)
  loadingLock.value = true

  let resp
  try {
    if (!flag) {
      resp = await api.post(`api/v1/transactions/penerimaan/lock_penerimaan`, payload)
      props.store.initModeEdit(data)
    } 

    console.log('resp', resp);
  } catch (error) {
    console.log('error', error);

  } finally {
    loadingLock.value = false
  }

  const data = resp?.data?.data
  props.store.form.flag = data?.flag
  

}

onMounted(() => {
  initForm()
  props.store.dataorder = []
  storeorder.per_page = 20
  ambilOrder()
  
})

const ambilOrder = ()=> {
  storeorder.fetchAll(params.value).then(() => {
    const datasimpan = props.store.items.map(x => x.noorder)

    const hasil = storeorder.items.filter(
      item => !datasimpan.includes(item.nomor_order)
    )
    props.store.dataorder = hasil
  })
}
function initForm() {
  props.store.mode = 'add'
  const today = new Date().toISOString().split('T')[0]
  form.value = {
    tgl_penerimaan: today,
    tgl_faktur: today,
    noorder: '',
    nopenerimaan: '',
    nofaktur: '',
    kode_suplier: '',
    jenispajak: '',
    pajak: '',
    flag: null,
    kode_barang: '',
    nobatch: '',
    jumlah_b: '',
    jumlah_k: '',
    harga_b: '',
    diskon_persen: '',
    isi: '',
    satuan_k: '',
    satuan_b: '',
    pajak_rupiah: '',
    diskon_rupiah: '',
    rincian: {},
  }
  props.store.init()
  // if (props.store.mode === 'add') {
  props.store.orderSelected = null
  props.store.supplierSelected = null
  ambilOrder()
  // }
}

const clearSelectedOrder = () => {

  
  props.store.init()
  props.store.mode = 'add'
  form.value.noorder = ''
  form.value.nopenerimaan = ''
  form.value.nofaktur = ''
  form.value.jenispajak = ''
  form.value.pajak = ''
  form.value.kode_barang = ''
  form.value.nobatch = ''
  form.value.jumlah_b = ''
  form.value.jumlah_k = ''
  form.value.harga_b = ''
  form.value.diskon_persen = ''
  form.value.isi = ''
  form.value.satuan_k = ''
  form.value.satuan_b = ''
  form.value.pajak_rupiah = ''
  form.value.diskon_rupiah = ''
  form.value.rincian = {}
}

const initializeRincian = (orderRecords) => {
  // console.log('orderRecords', orderRecords)
  const today = new Date().toISOString().split('T')[0]
  const rincian = {}
  orderRecords.forEach(item => {
    rincian[item.kode_barang] = {
      nama: item.master?.nama || item.nama || '',
      jumlah_pesan: item.jumlah_pesan || 0,
      jumlah_b: item.jumlah_pesan || 0,
      harga_b: item.harga_b || 0,
      nobatch: item.nobatch || '',
      diskon_persen: item.diskon_persen || 0,
      satuan_b: item.satuan_b || item.master?.satuan_b || '',
      satuan_k: item.satuan_k || item.master?.satuan_k || '',
      isi: parseInt(item.isi || item.master?.isi) || 1,
      jumlah_k: (parseInt(item.jumlah_b) || 0) * (parseInt(item.isi || item.master?.isi) || 1),
      kode_barang: item.kode_barang,
      pajak_rupiah: parseInt(item.pajak_rupiah) || 0,
      diskon_rupiah: parseInt(item.diskon_rupiah) || 0,
      tgl_exprd: today,
      loading: false,
      master: item.master || null,
    }
  })
  form.value.rincian = { ...rincian, ...form.value.rincian }
}

const handleSubmit = async (e, item) => {
  e.preventDefault()
  e.stopPropagation()
 
  isSubmitting.value = true

  const kode_barang = item.kode_barang

  const rincianItem = form.value.rincian[kode_barang] || {}

  form.value.kode_barang = kode_barang
  form.value.nobatch = rincianItem.nobatch || ''
  form.value.jumlah_b = rincianItem.jumlah_b || ''
  form.value.jumlah_k = (parseInt(rincianItem.jumlah_b) || 0) * (parseInt(item.isi || item.master?.isi) || 1)
  form.value.harga_b = rincianItem.harga_b || ''
  form.value.diskon_persen = rincianItem.diskon_persen || 0
  form.value.isi = parseInt(item.isi || item.master?.isi) || 1
  form.value.satuan_k = item.satuan_k || item.master?.satuan_k || ''
  form.value.satuan_b = item.satuan_b || item.master?.satuan_b || ''
  form.value.pajak_rupiah = parseInt(rincianItem.pajak_rupiah) || 0
  form.value.diskon_rupiah = parseInt(rincianItem.diskon_rupiah) || 0
  form.value.tgl_exprd = rincianItem.tgl_exprd || ''
  form.value.kode_suplier = props.store.supplierSelected?.kode || ''
  form.value.noorder = props.store.orderSelected?.nomor_order || ''
  form.value.rincian[kode_barang] = {
    ...form.value.rincian[kode_barang],
    nama: item.barang?.nama || item.nama || '',
    jumlah_pesan: item.jumlah_pesan || '',
    jumlah_b: parseInt(rincianItem.jumlah_b) || '',
    harga_b: rincianItem.harga_b || '',
    nobatch: rincianItem.nobatch || '',
    diskon_persen: rincianItem.diskon_persen || 0,
    satuan_b: item.satuan_b || item.master?.satuan_b || '',
    satuan_k: item.satuan_k || item.master?.satuan_k || '',
    isi: parseInt(item.isi || item.master?.isi) || 1,
    jumlah_k: (parseInt(rincianItem.jumlah_b) || 0) * (parseInt(item.isi || item.master?.isi) || 1),
    kode_barang: kode_barang,
    pajak_rupiah: parseInt(rincianItem.pajak_rupiah) || 0,
    diskon_rupiah: parseInt(rincianItem.diskon_rupiah) || 0,
    tgl_exprd: rincianItem.tgl_exprd || '',
    loading: true
    
  }

  const rincian = form.value.rincian[kode_barang]
  if (!rincian) return
  try {
    
    const a = form.value.rincian[kode_barang].jumlah_pesan
    const b = form.value.rincian[kode_barang].jumlah_b
    
    if (parseInt(b) > parseInt(a)) {
      
      notify({ message: 'Penerimaan Lebih Besar Dari Jumlah Pesanan', type: 'error' })
    } 
    
    else {
      await props.store.create(form.value)
      ambilOrder()
    }
    form.value.rincian[kode_barang].loading = false
    
  } catch (err) {
    console.error('Error saat menyimpan:', err)
   
      form.value.rincian[kode_barang].loading = false
  
  } finally {
    skipWatch.value = false
    isSubmitting.value = false
  }
}

const handleBatal = (kode_barang) => {
  const today = new Date().toISOString().split('T')[0]
  if (form.value.rincian[kode_barang]) {
    form.value.rincian[kode_barang] = {
      nama: form.value.rincian[kode_barang].nama || '',
      jumlah_pesan: form.value.rincian[kode_barang].jumlah_pesan || '',
      jumlah_b: form.value.rincian[kode_barang].jumlah_pesan || '',
      harga_b: '',
      nobatch: '',
      diskon_persen: 0,
      satuan_b: form.value.rincian[kode_barang].satuan_b || '',
      satuan_k: form.value.rincian[kode_barang].satuan_k || '',
      isi: form.value.rincian[kode_barang].isi || 1,
      jumlah_k: 0,
      kode_barang: kode_barang,
      tgl_exprd: today,
      pajak_rupiah: 0,
      diskon_rupiah: 0,
      loading: false,
      master: form.value.rincian[kode_barang].master || null,
    }
  }
}

const isSameRincian = (nobatch, kode_barang) => {
  const local = form.value.rincian?.[kode_barang]
  const remote = props.store.form?.rincian?.find(r => r.kode_barang === kode_barang && r.nobatch === nobatch)

  if (!local || !remote) return false

  return (
    Number(local.jumlah_b) === Number(remote.jumlah_b) &&
    String(local.nobatch || '') === String(remote.nobatch || '') &&
    Number(local.harga_b) === Number(remote.harga_b) &&
    Number(local.diskon_persen) === Number(remote.diskon_persen) &&
    String(local.tgl_exprd || '') === String(remote.tgl_exprd || '')
  )
}


const handleHapusRinci = async (e, item) => {
  e.preventDefault()
  e.stopPropagation()
 
  const rincian = props.store.form.rincian.find(x => x.kode_barang === item.kode_barang)
  const id = rincian?.id || null

  const params = {
    nopenerimaan: props.store.form.nopenerimaan,
    id
  }
  rincian.loading = true
  try {
    const resp = await api.post(`api/v1/transactions/penerimaan/delete`, params)
    if (resp.data.success === true) {
      rincian.harga_b = null
      rincian.nobatch = null
      rincian.diskon_persen = 0
      rincian.jumlah_k = 0
      rincian.pajak_rupiah = 0
      rincian.diskon_rupiah = 0
      
      notify({ message: resp.data.message ?? 'Data Berhasil dihapus', type: 'success' })
    }
    props.store.fetchAll()
    TotalPenerimaan
    
    console.log('resp', resp);
  } catch (error) {
    console.log('error', error);
    notify({ message: error.message ?? 'Gagal Hapus data', type: 'error' })
  } finally {
    rincian.loading = false
  }


}

watch(() => props.store.orderSelected, (newOrderSelected) => {
  if (newOrderSelected?.order_records) {
    initializeRincian(newOrderSelected.order_records)
  } else {
    form.value.rincian = {}
  }
}, { deep: true })


 watch(
  () => ({ ...props.store.form }),
  (newForm, oldForm) => {
    if (!newForm) return

    for (const key in newForm) {
      if ((oldForm?.[key]) !== newForm[key]) {
        props.store.clearFieldError(key)
      }
      // console.log('form.value', form.value)
    }
    if (newForm) {
      const filteredOrders = storeorder.items
        ?.filter(o => o.nomor_order === newForm?.noorder)
        ?.flatMap(o => o.order_records) || []
      const today = new Date().toISOString().split('T')[0]

      const rincianObj = {}
      filteredOrders.forEach(orderItem => {
        const savedItem = newForm?.rincian?.find(r => r.kode_barang === orderItem.kode_barang)
        const existing = form.value?.rincian?.[orderItem.kode_barang]

        
        rincianObj[orderItem.kode_barang] = {
          nama: savedItem?.barang?.nama || orderItem?.master?.nama,
          jumlah_pesan: savedItem?.jumlah_pesan ?? orderItem?.jumlah_pesan ?? null,
          jumlah_b: savedItem?.jumlah_b ?? orderItem.jumlah_pesan,
          harga_b: savedItem?.harga_b ?? null,
          nobatch: savedItem?.nobatch ?? null,
          diskon_persen: savedItem?.diskon_persen ?? 0,
          satuan_b: savedItem?.satuan_b ?? orderItem?.satuan_b ?? null,
          satuan_k: savedItem?.satuan_k ?? orderItem?.satuan_k ?? null,
          isi: parseInt(savedItem?.isi ?? orderItem?.isi ?? 1),
          jumlah_k: parseInt(savedItem?.jumlah_b ?? 0) * parseInt(savedItem?.isi ?? orderItem?.isi ?? 1),
          kode_barang: orderItem.kode_barang,
          tgl_exprd: savedItem?.tgl_exprd ?? today,
          pajak_rupiah: parseInt(savedItem?.pajak_rupiah ?? 0),
          diskon_rupiah: parseInt(savedItem?.diskon_rupiah ?? 0),
          loading: existing?.loading ?? false
        }
      })

      form.value = {
        nopenerimaan: newForm?.nopenerimaan,
        noorder: newForm?.noorder,
        tgl_penerimaan: newForm?.tgl_penerimaan,
        nofaktur: newForm?.nofaktur,
        tgl_faktur: newForm?.tgl_faktur,
        kode_suplier: newForm?.kode_suplier,
        jenispajak: newForm?.jenispajak,
        pajak: newForm?.pajak,
        flag: newForm?.flag,
        hutang: newForm?.hutang,
        rincian: rincianObj
    }
      
    }

    if (!props.store.orderSelected && newForm?.noorder) {
      const order = storeorder.items?.find(o => o.nomor_order === newForm?.noorder)
      props.store.orderSelected = order || null
    }

    if (!props.store.supplierSelected && newForm?.suplier) {
      props.store.supplierSelected = newForm.suplier
    }
  },
  { deep: true }
)


const TotalPenerimaan = computed(() => {
  if (props.store.mode === 'add') {
    return 0
  } else {
  
    const items = props?.store?.form?.rincian ?? []
    return items.reduce((a, b) => {
      const subtotal = (Number(b?.jumlah_b ?? 0) * Number(b?.harga_b ?? 0)) - (Number(b?.jumlah_k ?? 0) * Number(b?.diskon_rupiah ?? 0)) + (Number(b?.jumlah_k ?? 0) * Number(b?.pajak_rupiah ?? 0))
      return a + subtotal
    }, 0)
  }
})



</script>
