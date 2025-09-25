<template>
  <u-col class="w-full pb-4 pt-1 px-2 relative">
    <u-grid cols="5">

      <!-- HEADER 1 -->
      
      <!-- HEADER 2 -->
      <!-- <u-card class="col-span-3 h-full space-y-4">
        <u-row>
          <u-icon name="users" class="w-4 h-4" />
          <u-text class="font-bold">Informasi Supplier</u-text>
        </u-row>
        <u-row>
          <u-autocomplete v-model="searchSupplier" placeholder="Cari Supplier" 
            :debounce="300" :min-search-length="2" 
            item-key="id" 
            item-label="nama"
            not-found-text="Data Supplier tidak ditemukan" 
            not-found-subtext="Coba kata kunci lain" 
            :show-add-button="false"
            api-url="/api/v1/master/supplier/get-list" api-response-path="data.data" :api-params="{ per_page: 10 }"
            :use-api="true" @select="handleSelected" @items-loaded="onItemsLoaded"
          ></u-autocomplete>
        </u-row>
        <u-row>
          <div v-if="store?.supplierSelected"
            class="bg-primary/10 border border-primary rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md w-full">
            <div class="flex flex-1 justify-between items-start">
              <u-row flex1 class="w-full">
                <u-icon name="UserSearch" class="w-5 h-5 text-primary" />
                <u-text>
                  {{ store.supplierSelected?.nama }}
                </u-text>
              </u-row>
              <button @click="clearSelectedSupplier"
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
                  Silahkan cari dan pilih supplier di atas untuk melanjutkan order 
                </u-text>
              </div>
            </u-row>
          </div>
          
        </u-row>
      </u-card> -->

      
      
    </u-grid>
  
    <!-- CONTENT -->
    <u-grid cols="12">

      <!-- List Items -->
        <u-card class="col-span-8 h-full space-y-4">
          <u-row>
            <u-icon name="baggage-claim" class="w-4 h-4" />
            <u-text class="font-bold">Informasi Item Retur PBF</u-text>
          </u-row>
          <u-row>
            <u-autocomplete v-model="searchPenerimaan" placeholder="Cari No Transaksi Penerimaan" 
              :debounce="300" :min-search-length="5" 
              item-key="id" 
              item-label="nama"
              not-found-text="Data Penerimaan tidak ditemukan" 
              not-found-subtext="Coba kata kunci lain" 
              :show-add-button="false"
              api-url="/api/v1/transactions/returpembelian/get-pembelian" api-response-path="data.data" :api-params="{ per_page: 10 }" search-key="nopenerimaan"
              :use-api="true" @select="handleSelectedPenerimaan" @items-loaded="onItemsLoadedBarang"
            >
              <template #item="{ item }">
                <u-col gap="gap-1">
                  <u-text size="sm" class="font-medium">{{ item?.suplier?.nama }} ({{ item?.nopenerimaan }})</u-text>
                  <u-row class="-mt-1" gap="gap-1">
                    <u-icon name="box" class="w-4 h-4" />
                    <u-text class="">{{ item?.rincian?.length }}</u-text>
                    <u-text>items</u-text>
                  </u-row>
                </u-col>
              </template>
            </u-autocomplete>
          </u-row>

          <u-row class="relative -mt-4">
            <div v-if="store?.penerimaanSelected"
              ref="menuBarangRef"
              class="bg-background border-1 border-primary rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md w-full absolute z-10 -top-4">
              <u-grid cols="12" gap="gap-4">
                <div class="col-span-4">
                  <u-text class="font-bold">Nama Supplier (PBF)</u-text>
                  <u-text>{{ store.penerimaanSelected?.suplier?.nama || '-' }}</u-text>
                </div>
                <div class="col-span-4 text-center">
                  <!-- <u-text class="font-bold">Satuan</u-text>
                  <u-text>{{ store.barangSelected?.satuan_k || '-' }} | {{ store.barangSelected?.satuan_b || '-' }}, {{ store.barangSelected?.isi || 0 }}</u-text> -->
                </div>
                <div class="col-span-4 text-right">
                  <u-text class="font-bold">No Penerimaan</u-text>
                  <u-text>{{ store.penerimaanSelected?.nopenerimaan || '-' }}</u-text>
                </div>

                <div class="col-span-12">
                  <u-separator spacing="-mt-1 mb-1"></u-separator>
                  <u-col flex1 class="w-full" gap="gap-0">
                    <template v-if="store.penerimaanSelected?.rincian?.length">
                      <template v-for="(item, index) in store.penerimaanSelected?.rincian" :key="item.id">
                        <u-row flex1 class="w-full bg-secondary"gap="gap-2" padding="px-2 py-3">
                          <u-col flex1 class="w-full" gap="gap-1">
                            <u-row flex1 class="w-full items-start">
                              <u-text class="font-bold" :label="item.barang?.nama || '-'" />
                            </u-row>
                            <u-row>
                                <u-text class="font-medium italic">
                                  {{ item?.jumlah_b }}
                                </u-text>
                                <u-text class="font-medium italic">
                                  ({{ item?.satuan_b }})
                                </u-text>
                              </u-row>
                          </u-col>
                          <u-row gap="gap-3">
                            <div class="flex flex-col">
                              <!-- <div class="text-right">
                                <div>
                                  <div class="text-xs">Harga : <b class="font-bold text-sm">Rp. {{ formatRupiah(item?.harga) }} </b></div>
                                </div>
                                <div>
                                  <div class="text-xs">Sisa Stok : <b class="font-bold text-md">{{  item?.jumlah_k }}</b></div>
                                </div>
                              </div> -->
                            </div>
                            <div class="w-24" :class="{ 'animate-shake': parseInt(item?.jumlah) > parseInt(item?.jumlah_b) }">
                              <u-input type="number" v-model.number="item.jumlah" label="Jumlah" @focus="handleFocusJumlah" 
                                :error="parseInt(item?.jumlah) > parseInt(item?.jumlah_b)"
                              />
                            </div>

                            <u-btn :disabled="(parseInt(item?.jumlah) > parseInt(item?.jumlah_b)) || parseInt(item?.jumlah_b) === 0" 
                              :loading="store.loadingSave"
                              variant="secondary" size="sm" @click.stop="handleRetur(item)">Rtr</u-btn>
                          </u-row>
                        </u-row>
                      <u-separator spacing=""></u-separator>
                      </template>

                    </template>
                     <u-row flex1 right class="w-full mt-2"  gap="gap-2">
                        <u-btn  @click="handleOk">Tutup</u-btn>
                      </u-row>
                  </u-col>


                </div>
                
                
              </u-grid>
            </div>
          </u-row>
          <u-row>
            <u-empty v-if="!store.form?.rincian?.length" title="Belum Ada Items" icon="baggage-claim" />
            <u-list v-else :spaced="true" anim :items="store.form?.rincian">
              <template #item="{ item, index, isHovered }">
                <ListRincian :item="item" :store="store" :is-hovered="isHovered" />
              </template>
            </u-list>
          </u-row>

        </u-card>



        


        <u-col align="items-end" class="col-span-4">

          <u-card class="w-full space-y-4">
            <u-row>
              <u-icon name="layers" class="w-4 h-4" />
              <u-text class="font-bold">Informasi Retur PBF</u-text>
            </u-row>
            <u-row >
              <u-input-date type="date" v-model="form.tglretur" :error="errorMessage('tglretur')"  />
            </u-row>
            <u-row >
              <u-input v-model="form.noretur" label="Nomor Retur (Auto)" 
                readonly
                :error="isError('no_order')"
                :error-message="errorMessage('no_order')" 
              />
            </u-row>
        </u-card>


          <u-text class="font-bold" size="sm">Ringkasan Retur Pembelian</u-text>
          <u-separator spacing="-my-2"></u-separator>
          <u-row class="-mb-2">
            <u-text>No. Penerimaan : {{ store.penerimaanSelected?.nopenerimaan }}</u-text>
            <u-text class="font-bold" size="sm">{{ store.form?.nopenerimaan || '-' }}</u-text>
          </u-row>
          <u-row>
            <u-text>Total Item Retur : </u-text>
            <u-text class="font-bold" size="sm">{{ store.form?.rincian?.length || 0 }}</u-text>
          </u-row>
          <u-row>
            <u-badge v-if="store.form?.flag" variant="danger">Terkunci</u-badge>
            <u-badge v-else :variant="store.mode === 'add' ? 'success' : 'warning'">Mode {{ store.mode === 'add' ? 'Tambah' : 'Edit' }}</u-badge>
          </u-row>
          <u-separator spacing="-my-1"></u-separator>
          <u-row class="z-9">
            <u-btn v-if="store.mode === 'edit'" variant="secondary" @click="initForm">Retur Baru</u-btn>
            <u-btn v-if="store.form" :loading="loadingLock" @click.stop="handleKunci">{{ store.form?.flag ? 'Cetak' : 'Kunci' }}</u-btn>
          </u-row>
        </u-col>
    </u-grid>

    <div v-if="store.form?.flag" class="absolute top-0 left-0 right-0 w-full h-full rounded-2xl flex items-center justify-center p-4 bg-light-primary/10" padding="p-0"></div>
    

    <!-- Cetak -->
    <modal-cetak v-model="modalCetak" title="Retur Pembelian" :store="store"
      @close="modalCetak = false" />
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
  noretur: null,
  nopenerimaan: null,
  nofaktur: null,
  tglretur: null,
  kode_supplier: null,
  kode_barang: null,
  nobatch: null,
  id_penerimaan_rinci: null,
  isi: null,
  satuan_k: null,
  satuan_b: null,
  jumlah_b: 0,
  jumlah_k: 0,
  harga: 0,
  harga_b: 0,
  pajak_rupiah: 0,
  diskon_persen: 0,
  diskon_rupiah: 0,
  tgl_exprd: null,
  harga_total: 0,
  subtotal: 0,
  jenispajak: null,
  pajak: 0,
  jumlahretur_b: 0,
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
  props.store.supplierSelected = item
  form.value.kode_supplier = item?.kode ?? null
  searchSupplier.value = ''
  
}
const handleSelectedPenerimaan = (item) => {


  const stok = item?.rincian
  if (stok?.length) {
    for (let i = 0; i < stok?.length; i++) {
      const el = stok[i];
      el.jumlah = 0 // ini menambah elemen jumlah

      // const idStok = el?.id ?? null
      // if (idStok) {
      //   const keeping = item?.penjualan_rinci.filter(el => el.id_stok === idStok)
      //   const totalKeeping = keeping?.reduce((a, b) => parseInt(a) + parseInt(b.jumlah_k), 0)
      //   console.log('keeping', totalKeeping);
        
      // }

    }
  }


  
  props.store.penerimaanSelected = item
  // form.value.kode_barang = item?.kode ?? null
  // form.value.satuan_k = item?.satuan_k ?? null
  // form.value.satuan_b = item?.satuan_b ?? null
  // form.value.isi = item?.isi ?? null
  searchPenerimaan.value = ''
  // console.log('handleSelectedBarang', form.value);

  // await nextTick()
  // console.log('ref', inpJumlahRef.value);
  // const el 
  // inpJumlahRef.value?.inputRef?.focus()
  handleFocus(inpJumlahRef)
  
}

const handleOk = () => {
  console.log('handleOk');
  clearSelectedBarang()
  
}

const handleFocus = async (e) => {
  
  await nextTick()
  const el = e?.value
  // console.log('handleFocus', el);
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

const handleRetur = (e) => {
  // e.preventDefault()
  // e.stopPropagation()
  // console.log('form', form.value);
  // props.store.create(form.value)
  // .then(() => {
  //   clearSelectedBarang()
  // })
  for (const key in form.value) {
    if (key in e) {
      form.value[key] = e[key]
    }
  }

  form.value.id_penerimaan_rinci = e?.id ?? null
  form.value.jenispajak = props.store.penerimaanSelected?.jenispajak ?? null
  form.value.pajak = props.store.penerimaanSelected?.pajak ?? null
  form.value.kode_supplier = props.store.penerimaanSelected?.kode_suplier ?? null
  form.value.nofaktur = props.store.penerimaanSelected?.nofaktur ?? null
  form.value.jumlahretur_b = e.jumlah ?? null

  // console.log('form', form.value);
  // console.log('handleRetur', e);
  // console.log('store', props.store.penerimaanSelected);

  props.store.create(form.value)
  .then(() => {
    // clearSelectedBarang()
  })
  
  // console.log('handleRetur', form.value);
  

}



const handleFocusJumlah = async (e) => {
  // console.log('handleFocusJumlah', e);
}

const handleBatal = () => {
  clearSelectedBarang()
}

const handleKunci = async (e) => {
  e.preventDefault()
  e.stopPropagation()
  console.log('store', props.store.items);
  console.log('store form', props.store.form);


  

  const flag = (props.store.form?.flag === '1' || props.store.form?.flag === 1)
  
  if (flag) {
    modalCetak.value = true
    return 
  }


  const noretur = props.store.form?.noretur
  const payload = {
    noretur
  }

  loadingLock.value = true

  let resp
  try {
    // if (!flag) {
    //   resp = await api.post(`api/v1/transactions/returpembelian/lock-retur-pembelian`, payload)
    // } else {
    //   resp = await api.post(`api/v1/transactions/returpembelian/unlock-order`, payload)
    // }
    resp = await api.post(`api/v1/transactions/returpembelian/lock-retur-lock_retur_pembelian`, payload)
    console.log('resp', resp);
  } catch (error) {
    console.log('error', error);
    notify({
      type: 'error',
      message: error?.response?.data?.message
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
  form.value.tglretur = today
  form.value.noretur = ''
  form.value.nopenerimaan = ''
  props.store.init()
  clearSelectedBarang()
  clearSelectedSupplier()
} 

onUnmounted(() => {
  // document.removeEventListener('click', handleClickOutside)
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


    const onlyDate = newForm?.tglretur?.split(" ")[0] 
    form.value.tglretur = onlyDate


    if (props.store.mode === 'add') {
      initForm()
    }

   

    // console.log('🔥 watch form', form.value, newForm);


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