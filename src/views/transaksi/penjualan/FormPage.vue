<template>
  <u-col class="w-full pb-4 pt-1 px-2 relative">
    <u-grid cols="6">

      <!-- HEADER 1 -->
      <u-card class="col-span-2 h-full min-h-[100px] space-y-2">
        <u-row>
          <u-icon name="layers" class="w-4 h-4" />
          <u-text class="font-bold">Informasi Penjualan</u-text>
        </u-row>
        <u-row >
          <div 
            class="bg-primary/10 border border-primary rounded-xl shadow-sm p-2 transition-all duration-300 hover:shadow-md w-full">
            <div class="flex flex-1 justify-between items-start">
              <u-row flex1 class="w-full">
                <u-avatar icon="users" size="w-10 h-10" ></u-avatar>
                <u-col gap="gap-0">
                  <u-text class="font-bold">
                    Petugas Saat ini
                  </u-text>
                  <u-text>
                    {{ auth?.user?.nama }}
                  </u-text>
                </u-col>
              </u-row>
             
            </div>
          </div>
        </u-row>
        <u-row >
          <!-- <div 
            class="bg-primary/10 border border-primary rounded-xl shadow-sm p-2 transition-all duration-300 hover:shadow-md w-full">
            <div class="flex flex-1 justify-center items-center">
              <u-text class="font-medium" size="md" color="text-light-primary">{{ currentTime }}</u-text>
             
            </div>
          </div> -->

          <div
            class="inline-flex rounded-lg overflow-hidden border border-light-primary bg-grady-primary w-full justify-center">
            <u-grid cols="2" gap="gap-0">
              <label
              :class="['text-sm w-full font-medium text-center px-4 py-2 select-none transition-colors', jenis === 'umum' ? 'bg-grady-primary text-background ' : 'bg-secondary text-primary font-semibold shadow']">
              Umum
            </label>
            <label
              :class="['text-sm w-full font-medium text-center px-2 py-2 select-none transition-colors', jenis === 'resep' ? 'bg-grady-primary text-background ' : 'bg-secondary text-primary font-semibold shadow']">
              Resep
            </label>
            </u-grid>
          </div>
        </u-row>
        
      </u-card>

      <!-- HEADER 2 -->
      <u-card class="col-span-2 h-full space-y-2">
        <u-row>
          <u-icon name="users" class="w-4 h-4" />
          <u-text class="font-bold">Data Pelanggan</u-text>
        </u-row>
        <u-row>
          <u-autocomplete v-model="searchPelanggan" placeholder="Cari Pelanggan" 
            :debounce="300" :min-search-length="2" 
            item-key="id" 
            item-label="nama"
            not-found-text="Data Pelanggan tidak ditemukan" 
            not-found-subtext="Coba kata kunci lain" 
            :show-add-button="false"
            api-url="/api/v1/master/pelanggan/get-list" api-response-path="data.data" :api-params="{ per_page: 5 }"
            :use-api="true" @select="handleSelectedPelanggan"
          ></u-autocomplete>
        </u-row>
        <u-row>
          <div v-if="store?.pelangganSelected"
            class="bg-primary/10 border border-primary rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md w-full">
            <div class="flex flex-1 justify-between items-start">
              <u-row flex1 class="w-full">
                <u-icon name="UserSearch" class="w-5 h-5 text-primary" />
                <u-text>
                  {{ store.pelangganSelected?.nama }}
                </u-text>
              </u-row>
              <button @click="clearSelectedPelanggan"
                class="text-primary hover:text-danger " aria-label="Hapus">
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
                  Silahkan cari Pelanggan
                </u-text>
              </div>
            </u-row>
          </div>
          
        </u-row>
      </u-card>
      <!-- HEADER 3 -->
      <u-card class="col-span-2 h-full space-y-2">
        <u-row>
          <u-icon name="users" class="w-4 h-4" />
          <u-text class="font-bold">Data Dokter</u-text>
        </u-row>
        <u-row>
          <u-autocomplete v-model="searchDokter" placeholder="Cari Dokter" 
            :debounce="300" :min-search-length="2" 
            item-key="id" 
            item-label="nama_dokter"
            not-found-text="Data Dokter tidak ditemukan" 
            not-found-subtext="Coba kata kunci lain" 
            :show-add-button="false"
            api-url="/api/v1/master/dokter/get-list" api-response-path="data.data" :api-params="{ per_page: 5 }"
            :use-api="true" @select="handleSelectedDokter"
          ></u-autocomplete>
        </u-row>
        <u-row>
          <div v-if="store?.dokterSelected"
            class="bg-primary/10 border border-primary rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md w-full">
            <div class="flex flex-1 justify-between items-start">
              <u-row flex1 class="w-full">
                <u-icon name="UserSearch" class="w-5 h-5 text-primary" />
                <u-text>
                  {{ store.dokterSelected?.nama_dokter }}
                </u-text>
              </u-row>
              <button @click="clearSelectedDokter"
                class="text-primary hover:text-danger " aria-label="Hapus">
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
                  Silahkan cari data dokter
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
            <u-autocomplete v-model="searchBarang" placeholder="Cari Barang" 
              :debounce="300" :min-search-length="2" 
              item-key="id" 
              item-label="nama"
              not-found-text="Data Barang tidak ditemukan" 
              not-found-subtext="Coba kata kunci lain" 
              :show-add-button="false"
              api-url="/api/v1/transactions/penjualan/get-list-obat" api-response-path="data.data" :api-params="{ per_page: 5 }"
              :use-api="true" @select="handleSelectedBarang" 
            >
              <template #item="{ item }">

                <u-row flex1 class="w-full" gap="gap-2">
                  <u-row flex1 class="w-full">
                    <u-col gap="gap-1">
                      <u-text size="sm" class="font-medium">{{ item?.nama }}</u-text>
                      <u-row class="-mt-1" gap="gap-1">
                        <u-text class="">{{ item?.kode }}</u-text>
                      </u-row>
                    </u-col>
                  </u-row>
                  <u-row>
                    <u-col align="items-end" gap="gap-1">
                      <u-text class="-mb-1">Total Stok</u-text>
                      <u-text size="lg" class="font-medium">
                        {{ lihatStokAll(item) }}
                      </u-text>
                    </u-col>
                  </u-row>
                </u-row>

                
              </template>
            </u-autocomplete>
          </u-row>

          <u-row class="relative -mt-4">
            <div v-if="store?.barangSelected"
              ref="menuBarangRef"
              class="bg-background border-1 border-primary rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md w-full absolute z-10 -top-4">
              <u-grid cols="12" gap="gap-4">
                <div class="col-span-6">
                  <u-text class="font-medium" size="md">{{ store.barangSelected?.nama }}</u-text>
                </div>

                <div class="col-span-6 flex items-center justify-end gap-2">
                  <u-text>Total Stok : </u-text> <u-text class="font-bold" size="lg">  {{ lihatStokAll(store.barangSelected) }}</u-text>
                </div>

                <!-- <div class="col-span-12">
                  <u-separator spacing="-my-2"></u-separator>
                </div> -->
              </u-grid>
              <u-col flex1 class="w-full" gap="gap-0">
                <template v-for="(item, index) in store.barangSelected?.stok" :key="item?.id">
                  <u-row flex1 class="w-full bg-secondary"gap="gap-2" padding="px-2 py-3">
                    <u-row flex1 class="w-full items-start">
                      <u-text class="italic" label="Expired di : " />
                      <div>
                        <u-text class="font-medium italic">
                          {{ item?.tgl_exprd }}
                        </u-text>
                        <u-text color="text-gray-500 italic">
                          {{ formatWaktuSisa(item?.tgl_exprd) }}
                        </u-text>
                      </div>
                    </u-row>
                    <u-row gap="gap-3">
                      <div class="flex flex-col">
                        <div class="text-right">
                          <div>
                            <div class="text-xs">Harga : <b class="font-bold text-sm">Rp. {{ formatRupiah(getHargaJual()) }} </b></div>
                          </div>
                          <div>
                            <div class="text-xs">Sisa Stok : <b class="font-bold text-md">{{  item?.jumlah_k }}</b></div>
                          </div>
                        </div>
                      </div>
                      <div class="w-20" :class="{ 'animate-shake': parseInt(item?.jumlah) > parseInt(item?.jumlah_k) }">
                        <u-input type="number" v-model.number="item.jumlah" label="Jumlah" @focus="handleFocusJumlah" 
                          :error="parseInt(item?.jumlah) > parseInt(item?.jumlah_k)"
                        />
                      </div>

                      <u-btn :disabled="(parseInt(item?.jumlah) > parseInt(item?.jumlah_k)) || parseInt(item?.jumlah) === 0" 
                        :loading="store.loadingSave"
                        variant="secondary" size="sm" @click.stop="handleAdd(item)">Add</u-btn>
                    </u-row>
                  </u-row>
                  <u-separator spacing=""></u-separator>
                </template>
                <u-row flex1 right class="w-full mt-2"  gap="gap-2">
                  <u-btn  @click="handleOk">Tutup</u-btn>
                </u-row>
              </u-col>

            </div>
          </u-row>
          <u-row>
            <u-empty v-if="!store.form?.rinci?.length" title="Belum Ada Items" icon="baggage-claim" />
            <u-list v-else :spaced="true" anim :items="groupedItems">
              <template #item="{ item, index, isHovered }">
                <ListRincian :item="item" :store="store" :is-hovered="isHovered" />
              </template>
            </u-list>
          </u-row>

        </u-card>

        <u-col align="items-end" class="col-span-4" gap="gap-1">
          <u-text class="font-bold" size="sm">Ringkasan Penjualan</u-text>
          <u-separator spacing="my-1"></u-separator>
          <u-row>
            <u-text>Total Penjualan : </u-text>
            <u-text class="font-bold" size="lg" color="text-light-primary">{{ formatRupiah(totalPenjualan) || 0 }}</u-text>
          </u-row>
          <u-row class="-mt-2">
            <u-text>Total Item : </u-text>
            <u-text class="font-bold" size="lg">{{ groupedItems?.length || 0 }}</u-text>
          </u-row>
          <u-row class="">
            <u-badge v-if="store.form?.flag" :variant="store.form?.flag ? 'success' : 'warning'">Complete</u-badge>
            <u-badge v-else :variant="store.mode === 'add' ? 'success' : 'warning'"> {{ store.mode === 'add' ? 'Baru' : 'Draft' }}</u-badge>
          </u-row>
          <u-separator v-if="store.mode === 'edit'" spacing="my-2"></u-separator>


          <!-- Radiogroup container -->
          <div
            v-if="store.mode === 'edit'"
            class="grid grid-cols-2 gap-2 mb-2"
            role="radiogroup"
            aria-label="Cara Bayar"
          >
            <u-radio v-model="formBayar.cara_bayar" value="TUNAI" label="TUNAI" />
            <u-radio v-model="formBayar.cara_bayar" value="TRANSFER" label="TRANSFER" />
          </div>




          <u-row v-if="store.mode === 'edit'" class="w-full">
            <u-input v-model.number="formBayar.jumlah_bayar" label="Pembayaran" :error="errorPembayaran"/>
          </u-row>
          <u-row>
            <u-text>Kembali : Rp. </u-text>
            <u-text class="font-bold" size="lg" color="text-danger">{{ formatRupiah(kembali) || 0 }}</u-text>
          </u-row>
          <u-separator spacing="my-2"></u-separator>
          <u-row class="z-9">
            <u-btn v-if="store.mode === 'edit'" variant="secondary" @click="initForm">Baru</u-btn>
            <u-btn v-if="store.form && !errorPembayaran && !store.form?.flag" variant="primary" @click="simpanPenjualan">Simpan</u-btn>
          </u-row>
          <u-row class="z-9">
            <u-btn v-if="store.form?.flag" variant="secondary" @click="modalNota = true">Cetak</u-btn>
          </u-row>
        </u-col>
    </u-grid>

    <div v-if="store.form?.flag" class="absolute top-0 left-0 right-0 w-full h-full rounded-2xl flex items-center justify-center p-4 bg-light-primary/10" padding="p-0"></div>
    <!-- MODAL NOTA PENJUALAN -->
    <modal-nota v-if="modalNota" v-model="modalNota" title="Nota Penjualan" :store="store" :form-bayar="formBayar" :form="form"
      @close="handleCloseModalNota" />
  </u-col>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch, defineAsyncComponent } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'
import { formatWaktuSisa } from '@/utils/dateHelper'
import { formatRupiah } from '@/utils/numberHelper'
import ModalNota from './ModalNota.vue'


const ListRincian = defineAsyncComponent(() => import('./ListRincian.vue'))

const props = defineProps({
  store: { type: Object, required: true },
  title: { type: String, default: 'Data' },
  mode: { type: String, default: 'add' }
})

function lihatStokAll(item) {
  // console.log('lihatStokAll', item);
  const stocks = item?.stok

  if (!stocks?.length) return 0

  return stocks?.reduce((a, b) => parseInt(a) + parseInt(b.jumlah_k), 0)
  
}

const auth = useAuthStore()

const searchPelanggan = ref('')
const searchDokter = ref('')
const searchBarang = ref('')
const menuBarangRef = ref(null)
const inpJumlahRef = ref(null)
const loadingLock = ref(false)
const modalNota = ref(false)

const jenis = computed(() => {
  return (form?.value?.kode_dokter !== null && form?.value?.kode_dokter !== '') ? 'resep' : 'umum'
})


const currentTime = ref('')
let timer = null

const updateClock = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}:${seconds}`
}

onMounted(() => {
  updateClock()
  timer = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const form = ref({
  nopenjualan: '',
  tgl_penjualan: null,
  kode_pelanggan: '',
  kode_dokter: '',
  kode_barang: '',
  jumlah_k: 1,
  satuan_k: '',
  satuan_b: '',
  isi: '',
  harga_jual: 0,
  harga_beli: 0,
  id_penerimaan_rinci: null,
  nopenerimaan: null,
  nobatch: null,
  tgl_exprd: null,
  id_stok: null,
  hpp: ''

})

const formBayar = ref({
    diskon: 0,
    jumlah_bayar: 0,
    cara_bayar: 'TUNAI'
})

watch(() => ({ ...props.store.form }), (newForm, oldForm) => {
  // console.log('🔥 watch form', newForm, oldForm);
  
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

    
    if (props.store.mode === 'add') {
      form.value.nopenjualan = null
    }

    formBayar.value.diskon = newForm?.diskon || 0
    formBayar.value.jumlah_bayar = newForm?.jumlah_bayar || 0
    formBayar.value.cara_bayar = newForm?.cara_bayar || 'TUNAI'

    // console.log('🔥 watch form', form.value, newForm);


  }

}, { deep: true })

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


const totalPenjualan = computed(() => {
  const items = props?.store?.form?.rinci ?? []
  return items.reduce((a, b) => a + Number(b?.subtotal), 0)
})

const kembali = computed(() => {
  if (formBayar.value.jumlah_bayar < totalPenjualan.value) {
    return 0
  } 
  return formBayar.value.jumlah_bayar - totalPenjualan.value
})

const errorPembayaran = computed(() => {
  return formBayar.value.jumlah_bayar < totalPenjualan.value
})

const groupedItems = computed(() => {
  const map = new Map()

  const items = props?.store?.form?.rinci ?? []
  console.log('groupedItems', items);
  items.forEach(item => {
    const key = item.kode_barang
    if (!map.has(key)) {
      map.set(key, {
        kode_barang: item?.kode_barang,
        nama: item?.master?.nama,
        satuan_k: item?.satuan_k,
        jumlah_k: Number(item?.jumlah_k),
        harga_jual: Number(item?.harga_jual),
        subtotal: Number(item?.subtotal),
        created_at: item?.created_at
      })
    } else {
      const existing = map.get(key)
      existing.jumlah_k += Number(item.jumlah_k)
      existing.subtotal += Number(item.subtotal)
      // update created_at jika lebih baru
      if (new Date(item.created_at) > new Date(existing.created_at)) {
        existing.created_at = item.created_at
      }
    }
  })

  return Array.from(map.values())
})


const handleOk = () => {
  console.log('handleOk');
  clearSelectedBarang()
  
}
const handleAdd = async(item) => {
  // console.log('handleAdd', item);
  // console.log('handleAdd', props.store.barangSelected);

  const selected = props?.store?.barangSelected ?? null
  console.log('handleAdd', selected);
  form.value.kode_barang = item?.kode_barang ?? null
  form.value.jumlah_k = item?.jumlah ?? 0
  form.value.satuan_k = item?.satuan_k ?? null
  form.value.satuan_b = item?.satuan_b ?? null
  form.value.isi = parseInt(item?.isi ?? 1)
  form.value.harga_jual = getHargaJual()
  form.value.harga_beli = parseInt(item?.harga_total ?? 0)
  form.value.id_penerimaan_rinci = parseInt(item?.id_penerimaan_rinci)
  form.value.nopenerimaan = item?.nopenerimaan ?? null
  form.value.nobatch = item?.nobatch ?? null
  form.value.tgl_exprd = item?.tgl_exprd ?? null
  form.value.id_stok = item?.id ?? null
  form.value.hpp = parseFloat(selected?.hpp)


  console.log('form', form.value);
  props.store.create(form.value)
  
}

function getHargaJual() {
  const selected = props?.store?.barangSelected ?? null
  const resep = parseFloat(selected?.hpp ?? 0) + (parseFloat(selected?.hpp ?? 0) * parseInt(selected?.persen_resep ?? 0) / 100)
  const biasa = parseFloat(selected?.hpp ?? 0) + (parseFloat(selected?.hpp ?? 0) * parseInt(selected?.persen_biasa ?? 0) / 100)
  // return form.value.kode_dokter ? parseInt(selected?.harga_jual_resep_k ?? 0) : parseInt(selected?.harga_jual_biasa_k ?? 0)
  return form.value.kode_dokter ? Math.ceil(resep) : Math.ceil(biasa)
}

const handleSelectedPelanggan = (item) => {
  // console.log('pelanggan', item);

  
  props.store.pelangganSelected = item
  form.value.kode_pelanggan = item?.kode ?? null
  searchPelanggan.value = ''
  
}
const handleSelectedDokter = (item) => {
  console.log('dokter', item);
  
  
  props.store.dokterSelected = item
  form.value.kode_dokter = item?.kode ?? null
  searchDokter.value = ''
  
}
const handleSelectedBarang = (item) => {

  const stok = item?.stok
  if (stok?.length) {
    for (let i = 0; i < stok?.length; i++) {
      const el = stok[i];
      el.jumlah = 0 // ini menambah elemen jumlah

      const idStok = el?.id ?? null
      if (idStok) {
        const keeping = item?.penjualan_rinci.filter(el => el.id_stok === idStok)
        const totalKeeping = keeping?.reduce((a, b) => parseInt(a) + parseInt(b.jumlah_k), 0)
        console.log('keeping', totalKeeping);
        
      }

    }
  }

  props.store.barangSelected = item
  console.log('handleSelectedBarang form', item);
  searchBarang.value = ''
  handleFocus(inpJumlahRef)
  
}

const handleFocus = async (e) => {
  
  await nextTick()
  const el = e?.value
  // console.log('handleFocus', el);
  el?.inputRef?.focus()
  el?.inputRef?.select()
  
}

const handleFocusJumlah = async (e) => {
  // console.log('handleFocusJumlah', e);
}


function handleClickOutside(event) {
  if (menuBarangRef.value && !menuBarangRef.value.contains(event.target)) {
    clearSelectedBarang()
  }
}

// const onItemsLoaded = (items) => {
//   // console.log('items', items);
  
// }
// const onItemsLoadedBarang = (items) => {
//   // console.log('items', items);
  
// }

const clearSelectedPelanggan = () => {
  props.store.pelangganSelected = null
  // form.value.kode_supplier = ''
}
const clearSelectedDokter = () => {
  props.store.dokterSelected = null
  form.value.kode_dokter = ''
}
const clearSelectedBarang = () => {
  props.store.barangSelected = null
  form.value.kode_barang = ''
  form.value.satuan_k = ''
  form.value.satuan_b = ''
  form.value.isi = 0
  form.value.jumlah_pesan = 1
}



const simpanPenjualan = async (e) => {
  e.preventDefault()
  e.stopPropagation()
  // console.log('store', props.store.items);

  const payload = {
    id: props.store.form?.id,
    diskon: formBayar.value.diskon ?? 0,
    jumlah_bayar: formBayar.value.jumlah_bayar ?? 0,
    kembali: kembali.value ?? 0,
    cara_bayar: formBayar.value.cara_bayar ?? null,
  }
  // console.log('store form', payload);

  
  // modalNota.value = true
  loadingLock.value = true

  let resp
  try {
    // if (!flag) {
    resp = await api.post(`api/v1/transactions/penjualan/bayar`, payload)
    // } else {
    //   resp = await api.post(`api/v1/transactions/order/unlock-order`, payload)
    // }

    console.log('resp bayar', resp);
    modalNota.value = true
  } catch (error) {
    console.log('error', error);
    modalNota.value = false
  } finally {
    loadingLock.value = false
  }
  

  const data = resp?.data?.data
  props.store.form.flag = data?.flag
  props.store.initModeEdit(data)

  

  
}

const handleCloseModalNota = () => {
  modalNota.value = false

  // initForm()
  window.location.reload()
}

onMounted(() => {
  // document.addEventListener('click', handleClickOutside)
  initForm()
})

function initForm(){
  const today = new Date().toISOString().split('T')[0];
  form.value.tgl_order = today
  form.value.nomor_order = ''
  props.store.init()
  clearSelectedBarang()
  clearSelectedPelanggan()
  clearSelectedDokter()
  formBayar.value.diskon = 0
  formBayar.value.jumlah_bayar = 0
  formBayar.value.cara_bayar = 'TUNAI'
} 

onUnmounted(() => {
  // document.removeEventListener('click', handleClickOutside)
})



watch(() => props.store.maxRight, (newMax, oldMax) => {
  // if (!newMax) {
  //   initForm()
  // }
  console.log('newMax', newMax);
  console.log('form', form.value);
  
}, { deep: true })

</script>

<style scoped>
@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
  100% { transform: translateX(0); }
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}
</style>