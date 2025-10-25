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
              <button @click="initForm()" class="text-primary hover:text-danger" aria-label="Hapus">
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
        <u-row v-if="store.orderSelected && form.hutang">
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
import { ref, computed, watch, defineAsyncComponent, onMounted, onUnmounted } from 'vue'
import { useOrderStore } from '@/stores/template/register'
import { getYearStartDate, getYearEndDate } from '@/utils/dateHelper'
import { formatRupiah } from '@/utils/numberHelper'
import { useNotificationStore } from '@/stores/notification'
import { api } from '@/services/api'
import ModalCetak from './ModalNota.vue'
import { useAppStore } from '@/stores/app'

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
const app = useAppStore()
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

function rincianAsArray(r) {
  if (!r) return []
  if (Array.isArray(r)) return r
  return Object.values(r)
}

function arrayToRincianObject(arr = []) {
  const obj = {}
  arr.forEach(item => {
    if (item && item.kode_barang) obj[item.kode_barang] = item
  })
  return obj
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

// listItems used in template: prefer local form.rincian when present, otherwise build from orderSelected.order_records
// const listItems = computed(() => {
//   const rincianLocal = form.value.rincian || {}
//   const orderSelected = props.store.orderSelected || {}
//   const orderRecords = orderSelected.order_records || orderSelected.rincians || orderSelected.rincian || []

//  console.log('🔄 listItems recomputed', { rincianLocal, orderRecords })
//   if (Object.keys(rincianLocal).length > 0) {
//     return Object.values(rincianLocal)
//   }
//   console.log('orderRecords empty', orderRecords)
//   if (orderRecords.length > 0) {

    
//     return orderRecords.map(item => {
//       console.log('Mapping orderRecord item:', item)
//       const isiVal = parseInt(item.isi ?? item.barang?.isi, 1)
//       const jumlahPesan = parseInt(item.jumlah_k, 0)
//       const jumlahB = parseInt(item.jumlah_b)
//       const jumlahK = jumlahB * isiVal
//       return {
//         nopenerimaan: item.nopenerimaan,
//         nama: item.barang?.nama || item.nama || '',
//         jumlah_pesan: jumlahPesan,
//         jumlah_b: jumlahB,
//         harga_b: parseFloat(item.harga_b || 0),
//         nobatch: item.nobatch || '',
//         diskon_persen: parseFloat(item.diskon_persen || 0),
//         satuan_b: item.satuan_b || item.barang?.satuan_b || '',
//         satuan_k: item.satuan_k || item.barang?.satuan_k || '',
//         isi: isiVal,
//         jumlah_k: jumlahK,
//         kode_barang: item.kode_barang,
//         pajak_rupiah: parseFloat(item.pajak_rupiah || 0),
//         diskon_rupiah: parseFloat(item.diskon_rupiah || 0),
//         loading: false,
//         master: item.barang || null,
//       }
//     })
//   }
//   // fallback terakhir kalau semua kosong
//   return []
// })


const listItems = computed(() => {
  const rincianLocal = form.value.rincian || {}
  const orderSelected = props.store.orderSelected || {}
  const orderRecords = orderSelected.order_records || orderSelected.rincians || orderSelected.rincian || []
  // console.log('🔄 listItems rincianLocal', rincianLocal)
  // console.log('🔄 listItems orderSelected', orderSelected)
  if (Object.keys(rincianLocal).length > 0) {
    return Object.values(rincianLocal)
  }
  if (!form.value.rincian) {
    form.value.rincian = {}
  }

  orderRecords.forEach(item => {
  
    const key = item.kode_barang
    if (!form.value.rincian[key]) {
      form.value.rincian[key] = {
        kode_barang: key,
        nama: item.barang?.nama || item.master?.nama || item.nama || '',
        jumlah_pesan: parseInt(item.jumlah_b || item?.jumlah_pesan, 0),
        jumlah_b: item.jumlah_b || item.jumlah_pesan || 0,
        harga_b: parseFloat(item.harga_b || 0),
        nobatch: item.nobatch || '',
        diskon_persen: parseFloat(item.diskon_persen || 0),
        tgl_exprd: item.tgl_exprd || new Date().toISOString().split('T')[0],
        satuan_b: item.satuan_b || item.barang?.satuan_b || '',
        satuan_k: item.satuan_k || item.barang?.satuan_k || '',
        isi: item.isi || item.master?.isi || item.barang?.isi || 1,
        pajak_rupiah: parseFloat(item.pajak_rupiah || 0),
        diskon_rupiah: parseFloat(item.diskon_rupiah || 0),
        loading: false,
      }
    }
  })

  return Object.values(form.value.rincian)
})
const openModalCetak = () => {
  modalCetak.value = true
}
const handleCloseModalNota = () => {
  modalCetak.value = false
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


const ambilOrder = async () => {
  await storeorder.fetchAll(params.value)

  const datasimpan = props.store.items.map(x => x.noorder)
  const hasil = storeorder.items.filter(
    item => !datasimpan.includes(item.nomor_order)
  )
  props.store.dataorder = hasil

  // 🧠 jika sudah ada form.noorder, sinkronkan langsung
  if (props.store.form?.noorder) {
    const selected = storeorder.items.find(
      o => o.nomor_order === props.store.form.noorder
    )
    props.store.orderSelected = selected || null
  }
}

function initForm() {
  props.store.mode = 'add'
  props.store.init()
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
  // ambilOrder()
}


const initializeRincian = (orderRecords) => {
  const today = new Date().toISOString().split('T')[0]
  const rincian = {}
  orderRecords.forEach(item => {
    const isiVal = parseInt(item.isi || item.master?.isi)
    const jumlahPesan = parseInt(item.jumlah_pesan, 0)
    const jumlah_b_default = jumlahPesan
    rincian[item.kode_barang] = {
      nama: item.master?.nama || item.nama || '',
      jumlah_pesan: jumlahPesan,
      jumlah_b: jumlah_b_default,
      harga_b: parseFloat(item.harga_b || 0),
      nobatch: item.nobatch || '',
      diskon_persen: parseFloat(item.diskon_persen || 0),
      satuan_b: item.satuan_b || item.master?.satuan_b || '',
      satuan_k: item.satuan_k || item.master?.satuan_k || '',
      isi: isiVal,
      jumlah_k: jumlah_b_default * isiVal,
      kode_barang: item.kode_barang,
      pajak_rupiah: parseFloat(item.pajak_rupiah || 0),
      diskon_rupiah: parseFloat(item.diskon_rupiah || 0),
      tgl_exprd: today,
      loading: false,
      master: item.master || null,
    }
  })
  form.value.rincian = { ...rincian, ...form.value.rincian }
}


const handleKunci = async (e) => {
  e?.preventDefault?.()
  e?.stopPropagation?.()
  console.log('kode depo', app.form)
  const flag = (props.store.form?.flag === '1' || props.store.form?.flag === 1)
  const nopenerimaan = props.store.form?.nopenerimaan
  const rincians = rincianAsArray(props.store.form?.rincian)

  const payload = {
    nopenerimaan,
    kode_depo: app.form?.kode_toko || '',
    payload: rincians.map(item => ({
      kode_barang: item.kode_barang,
      satuan_k: item.satuan_k || '',
      jumlah_k: parseInt(item.jumlah_k, 0),
      kode_depo: app.form?.kode_toko || '',
    }))
  }
  console.log('Payload untuk kunci penerimaan:', payload)
  if (flag) {
    notify({ message: 'Penerimaan sudah terkunci', type: 'info' })
    return
  }

  loadingLock.value = true
  let resp = null
  try {
    resp = await api.post(`api/v1/transactions/penerimaan/lock_penerimaan`, payload)
    console.log('Data resp', resp)
    if (resp?.data?.success === true) {
      notify({ message: resp?.data?.message ?? 'Berhasil dikunci', type: 'success' })
    } else {
      notify({ message: resp?.data?.message ?? 'Gagal mengunci', type: 'error' })
    }
  } catch (error) {
    console.log('error', error)
    notify({ message: error?.message ?? 'Kunci tidak bisa dibuka', type: 'error' })
    return
  } finally {
    loadingLock.value = false
  }

  const data = resp?.data?.data
  
  if (data) {
    props.store.form.flag = data?.flag
    props.store.initModeEdit(data)
  }
}


const handleSubmit = async (e, item) => {
  e?.preventDefault?.()
  e?.stopPropagation?.()

  if ((form?.value?.hutang ?? '') === '') {
    notify({ message: 'Silahkan Pilih Cara Pembayaran', type: 'error' })
    return
  }
  isSubmitting.value = true

  const kode_barang = item.kode_barang
  const rincianItem = form.value.rincian[kode_barang] || {}
  console.log('Handling submit for kode_barang:', item)
  // sync beberapa field ke form utama (mirip logic sebelumnya)
  form.value.kode_barang = kode_barang
  form.value.nobatch = rincianItem.nobatch || ''
  form.value.jumlah_b = rincianItem.jumlah_b || 0
  form.value.jumlah_k = parseInt(rincianItem.jumlah_b, 0) * parseInt(item.isi || item.master?.isi)
  form.value.harga_b = rincianItem.harga_b || 0
  form.value.diskon_persen = parseFloat(rincianItem.diskon_persen || 0)
  form.value.isi = parseInt(item.isi || item.master?.isi)
  form.value.satuan_k = item.satuan_k || item.master?.satuan_k || ''
  form.value.satuan_b = item.satuan_b || item.master?.satuan_b || ''
  form.value.pajak_rupiah = parseFloat(rincianItem.pajak_rupiah)
  form.value.diskon_rupiah = parseFloat(rincianItem.diskon_rupiah)
  form.value.tgl_exprd = rincianItem.tgl_exprd || ''
  form.value.kode_suplier = props.store.supplierSelected?.kode || ''
  form.value.noorder = props.store.orderSelected?.nomor_order || ''
  console.log('Submitting rincian for kode_barang:', form.value)
  // ensure rincian entry exists and mark loading
  form.value.rincian[kode_barang] = {
    ...form.value.rincian[kode_barang],
    nama: item.barang?.nama || item.nama || '',
    jumlah_pesan: item.jumlah_pesan || form.value.rincian[kode_barang]?.jumlah_pesan || '',
    jumlah_b: parseInt(rincianItem.jumlah_b || 0),
    harga_b: rincianItem.harga_b || 0,
    nobatch: rincianItem.nobatch || '',
    diskon_persen: parseFloat(rincianItem.diskon_persen || 0),
    satuan_b: item.satuan_b || item.master?.satuan_b || '',
    satuan_k: item.satuan_k || item.master?.satuan_k || '',
    isi: parseInt(item.isi || item.master?.isi),
    jumlah_k: parseInt(rincianItem.jumlah_b || 0) * parseInt(item.isi || item.master?.isi),
    kode_barang: kode_barang,
    pajak_rupiah: parseFloat(rincianItem.pajak_rupiah || 0),
    diskon_rupiah: parseFloat(rincianItem.diskon_rupiah || 0),
    tgl_exprd: rincianItem.tgl_exprd || '',
    loading: true
  }

  const rincian = form.value.rincian[kode_barang]
  if (!rincian) {
    isSubmitting.value = false
    return
  }

  try {
    const a = parseInt(form.value.rincian[kode_barang].jumlah_pesan, 0)
    const b = parseInt(form.value.rincian[kode_barang].jumlah_b, 0)

    if (b > a) {
      notify({ message: 'Penerimaan Lebih Besar Dari Jumlah Pesanan', type: 'error' })
      form.value.rincian[kode_barang].loading = false
      return
    } else {
      // panggil proses buat/save ke store (sesuaikan create signature store)
      await props.store.create(form.value)
      ambilOrder()
    }
    form.value.rincian[kode_barang].loading = false
  } catch (err) {
    console.error('Error saat menyimpan:', err)
    form.value.rincian[kode_barang].loading = false
    notify({ message: err?.message ?? 'Gagal menyimpan data', type: 'error' })
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
  const remoteArr = rincianAsArray(props.store.form?.rincian)
  const remote = remoteArr.find(r => r.kode_barang === kode_barang && r.nobatch === nobatch)

  if (!local || !remote) return false

  // 🚀 Jika nilai dihapus (harga, batch, diskon, dll kosong), langsung anggap beda
  if (
    local.harga_b == null ||
    local.nobatch == null 
  ) {
    return false
  }

  return (
    Number(local.jumlah_b) === Number(remote.jumlah_b) &&
    String(local.nobatch || '') === String(remote.nobatch || '') &&
    Number(local.harga_b) === Number(remote.harga_b) &&
    Number(local.diskon_persen) === Number(remote.diskon_persen) &&
    String(local.tgl_exprd || '') === String(remote.tgl_exprd || '')
  )
}


const handleHapusRinci = async (e, item) => {
  e?.preventDefault?.()
  e?.stopPropagation?.()
  const remoteArr = rincianAsArray(props.store.form?.rincian)

  const rincian = remoteArr.find(x => x.kode_barang === item.kode_barang)

  if (!rincian) {
    notify({ message: 'Rincian tidak ditemukan', type: 'error' })
    return
  }

  const id = rincian?.id || null
  const params = {
    nopenerimaan: props.store.form.nopenerimaan,
    id
  }
  rincian.loading = true
  // set loading on local copy if possible
  form.value.rincian[item.kode_barang].loading = true
  try {
    const resp = await api.post(`api/v1/transactions/penerimaan/delete`, params)
    if (resp?.data?.success === true) {
        rincian.harga_b = null
        rincian.nobatch = null
        rincian.diskon_persen = 0
        rincian.jumlah_k = 0
        rincian.pajak_rupiah = 0
        rincian.diskon_rupiah = 0


      notify({ message: resp.data.message ?? 'Data Berhasil dihapus', type: 'success' })
      
    } 
      await props.store.fetchAll()
      TotalPenerimaan
  } catch (error) {
    console.log('error', error)
    notify({ message: error?.message ?? 'Gagal Hapus data', type: 'error' })
  } finally {
    rincian.loading = false
    form.value.rincian[item.kode_barang].loading = false
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
    }

    if (newForm) {
      const filteredOrders = storeorder.items
        ?.filter(o => o.nomor_order === newForm?.noorder)
        ?.flatMap(o => o.order_records) || []
      const today = new Date().toISOString().split('T')[0]
      const rincianObj = {}

      filteredOrders.forEach(orderItem => {
        const savedItem = (Array.isArray(newForm?.rincian) ? newForm?.rincian : rincianAsArray(newForm?.rincian))
          .find(r => r.kode_barang === orderItem.kode_barang)
        const existing = form.value?.rincian?.[orderItem.kode_barang]
        console.log('Merging order item:', { orderItem, savedItem, existing })
        const isiVal = parseInt(savedItem?.isi || orderItem?.isi)
        const jumlahSavedB = parseInt(savedItem?.jumlah_b || 0)
        const jumlahPesan = parseInt(orderItem?.jumlah_pesan || 0)

        rincianObj[orderItem.kode_barang] = {
          nama: savedItem?.barang?.nama || orderItem?.master?.nama,
          jumlah_pesan: savedItem?.jumlah_pesan || orderItem?.jumlah_pesan || null,
          jumlah_b: savedItem?.jumlah_b || orderItem.jumlah_pesan,
          harga_b: savedItem?.harga_b || null,
          nobatch: savedItem?.nobatch || null,
          diskon_persen: parseFloat(savedItem?.diskon_persen || 0),
          satuan_b: savedItem?.satuan_b || orderItem?.satuan_b || null,
          satuan_k: savedItem?.satuan_k || orderItem?.satuan_k || null,
          isi: isiVal,
          jumlah_k: (parseInt(savedItem?.jumlah_b || jumlahPesan)) * isiVal,
          kode_barang: orderItem.kode_barang,
          tgl_exprd: savedItem?.tgl_exprd || today,
          pajak_rupiah: parseFloat(savedItem?.pajak_rupiah || 0),
          diskon_rupiah: parseFloat(savedItem?.diskon_rupiah || 0),
          loading: existing?.loading || false
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

    if (newForm?.noorder) {
      let order = null

      if (storeorder.items && storeorder.items.length > 0) {
        order = storeorder.items.find(o => o.nomor_order === newForm.noorder)
      }

      // 🔥 Fallback: kalau gak ada di storeorder, ambil dari daftar penerimaan aktif
      if (!order && props.store.items?.length) {
        const penerimaan = props.store.items.find(p => p.noorder === newForm.noorder)
        if (penerimaan) {
          order = {
            nomor_order: penerimaan.noorder,
            tgl_order: penerimaan.tgl_order || penerimaan.tgl_penerimaan,
            supplier: penerimaan.suplier || penerimaan.supplier,
            rincian: penerimaan.rincian || [],
          }
        }
      }

      props.store.orderSelected = order || null
    } else {
      props.store.orderSelected = null
    }
  },
  { deep: true }
)


const TotalPenerimaan = computed(() => {
  if (props.store.mode === 'add') {
    return 0
  } else {
    const items = rincianAsArray(props.store.form?.rincian ?? [])
    return items.reduce((a, b) => {
      const jumlah_b = Number(b?.jumlah_b || 0)
      const harga_b = Number(b?.harga_b || 0)
      const diskon_rp = Number(b?.diskon_rupiah || 0)
      const pajak_rp = Number(b?.pajak_rupiah || 0)
      const jumlah_k = Number(b?.jumlah_k || (jumlah_b * Number(b?.isi || 1)))
      const subtotal = (jumlah_b * harga_b) - (jumlah_k * diskon_rp) + (jumlah_k * pajak_rp)
      return a + subtotal
    }, 0)
  }
})

const clearSelectedOrder = () => {
  console.log('Clearing selected order and supplier', form.value.rincian)
  if (form.value.rincian && Object.keys(form.value.rincian).length > 0) {
    const confirmClear = notify({
      message: 'Mengganti Order akan menghapus data penerimaan yang sudah diinput. Lanjutkan?',
      type: 'error',
      duration: 0
    })
    if (!confirmClear) {
      return
    }
  }
  props.store.orderSelected = null
  props.store.supplierSelected = null
}
/* ---------- lifecycle ---------- */

onMounted(async () => {
  // console.log('🟢 Form transaksi mounted')
  initForm()
  props.store.dataorder = []
  storeorder.per_page = 20
  await ambilOrder()
})

onUnmounted(() => {
  // console.log('🔴 Form transaksi unmounted')
})

watch(
  () => ({ ...form.value }),
  (newForm, oldForm) => {
    // console.log('🔥 watch form', newForm, oldForm);

    for (const key in newForm) {
      if (newForm[key] !== oldForm[key]) {
        props.store.clearFieldError(key)
      }
    }
  },
  { deep: true }
)
</script>

