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
          <u-text class="font-bold">Informasi Item Retur Penjualan</u-text>
        </u-row>
        <u-row>
          <u-autocomplete v-model="searchPenjualan" placeholder="Cari No Transaksi Penjualan" :debounce="300"
            :min-search-length="5" item-key="id" item-label="nama" not-found-text="Data Penjualan tidak ditemukan"
            not-found-subtext="Coba kata kunci lain" :show-add-button="false"
            api-url="/api/v1/transactions/returpenjualan/get-penjualan" api-response-path="data.data"
            :api-params="{ per_page: 10 }" search-key="q" :use-api="true" @select="handleSelectedPenjualan"
            @items-loaded="onItemsLoadedBarang">
            <template #item="{ item }">
              <u-col gap="gap-1">
                <u-text size="sm" class="font-medium">{{ item?.suplier?.nama }} ({{ item?.nopenjualan }})</u-text>
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
          <div v-if="store?.penerimaanSelected" ref="menuBarangRef"
            class="bg-background border-1 border-primary rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md w-full absolute z-10 -top-4">
            <u-grid cols="12" gap="gap-4">
              <div class="col-span-4">
                <u-text class="font-bold">Nomor Penjualan</u-text>
                <u-text>{{ store.penerimaanSelected?.nopenjualan || '-' }}</u-text>
              </div>
              <div class="col-span-4 text-center">
                <!-- <u-text class="font-bold">Satuan</u-text>
                  <u-text>{{ store.barangSelected?.satuan_k || '-' }} | {{ store.barangSelected?.satuan_b || '-' }}, {{ store.barangSelected?.isi || 0 }}</u-text> -->
              </div>
              <div class="col-span-4 text-right">
                <u-text class="font-bold">Tanggal Penjualan</u-text>
                <u-text>{{ formatDateIndo(store.penerimaanSelected?.tgl_penjualan) || '-' }}</u-text>
              </div>

              <div class="col-span-12">
                <u-separator spacing="-mt-1 mb-1"></u-separator>
                <u-col flex1 class="w-full" gap="gap-0">
                  <template v-if="store.penerimaanSelected?.rinci?.length">
                    <template v-for="(item) in store.penerimaanSelected?.rinci" :key="item.id">
                      <u-row flex1 class="w-full bg-secondary" gap="gap-2" padding="px-2 py-3">
                        <u-col flex1 class="w-full" gap="gap-1">
                          <u-row flex1 class="w-full items-start">
                            <u-text class="font-bold" :label="item.master?.nama || '-'" />
                          </u-row>
                          <u-row>
                            <u-text class="font-medium italic">
                              {{ item?.jumlah_k }}
                            </u-text>
                            <u-text class="font-medium italic">
                              ({{ item?.satuan_k }})
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
                          <div class="w-24"
                            :class="{ 'animate-shake': parseInt(item?.jumlah) > parseInt(item?.jumlah_k) }">
                            <u-input type="number" v-model.number="item.jumlah" label="Jumlah"
                              @focus="handleFocusJumlah" :error="parseInt(item?.jumlah) > parseInt(item?.jumlah_k)" />
                          </div>

                          <u-btn
                            :disabled="(parseInt(item?.jumlah) > parseInt(item?.jumlah_k)) || parseInt(item?.jumlah_k) === 0"
                            :loading="store.loadingSave" variant="secondary" size="sm"
                            @click.stop="handleRetur(item)">Rtr</u-btn>
                        </u-row>
                      </u-row>
                      <u-separator spacing=""></u-separator>
                    </template>

                  </template>
                  <u-row flex1 right class="w-full mt-2" gap="gap-2">
                    <u-btn @click="handleOk">Tutup</u-btn>
                  </u-row>
                </u-col>


              </div>


            </u-grid>
          </div>
        </u-row>
        <u-row>
          <u-empty v-if="!store.form?.retur_penjualan_r?.length" title="Belum Ada Items" icon="baggage-claim" />
          <u-list v-else :spaced="true" anim :items="store.form?.retur_penjualan_r">
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
            <u-text class="font-bold">Informasi Retur Penjualan</u-text>
          </u-row>
          <u-row>
            <u-input-date type="date" v-model="form.tgl_retur" :error="errorMessage('tgl_retur')" />
          </u-row>
          <u-row>
            <u-input v-model="form.noretur" label="Nomor Retur (Auto)" readonly :error="isError('no_order')"
              :error-message="errorMessage('no_order')" />
          </u-row>
        </u-card>


        <u-text class="font-bold" size="sm">Ringkasan Retur Penjualan</u-text>
        <u-separator spacing="-my-2"></u-separator>
        <u-row class="-mb-2">
          <u-text>No. Penjualan : {{ store.penerimaanSelected?.nopenjualan }}</u-text>
          <u-text class="font-bold" size="sm">{{ store.form?.nopenjualan || '-' }}</u-text>
        </u-row>
        <u-row>
          <u-text>Item Retur : </u-text>
          <u-text class="font-bold" size="sm">{{ store.form?.retur_penjualan_r?.length || 0 }}</u-text>
        </u-row>
        <u-row>
          <u-text>Total Nilai Retur : </u-text>
          <u-text class="font-bold" size="sm">{{ formatRupiah(totalRetur) }}</u-text>
        </u-row>
        <u-row>
          <u-badge v-if="store.form?.flag" variant="danger">Terkunci</u-badge>
          <u-badge v-else :variant="store.mode === 'add' ? 'success' : 'warning'">Mode {{ store.mode === 'add' ?
            'Tambah' : 'Edit' }}</u-badge>
        </u-row>
        <u-separator spacing="-my-1"></u-separator>
        <u-row class="z-9">
          <u-btn v-if="store.mode === 'edit'" variant="secondary" @click="initForm">Retur Baru</u-btn>
          <u-btn v-if="store.form" :loading="loadingLock" @click.stop="handleKunci">{{ store.form?.flag ? 'Cetak' :
            'Kunci' }}</u-btn>
        </u-row>
      </u-col>
    </u-grid>

    <div v-if="store.form?.flag"
      class="absolute top-0 left-0 right-0 w-full h-full rounded-2xl flex items-center justify-center p-4 bg-light-primary/10"
      padding="p-0"></div>


    <!-- Cetak -->
    <modal-cetak v-model="modalCetak" title="Retur Pembelian" :store="store" @close="modalCetak = false" />
  </u-col>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch, defineAsyncComponent } from 'vue'
import { formatRupiah } from '@/utils/numberHelper'
import { useNotificationStore } from '@/stores/notification'
const notify = useNotificationStore().notify

import { api } from '@/services/api'
import ModalCetak from './ModalCetak.vue'
import { formatDateIndo } from '@/utils/dateHelper'

const ListRincian = defineAsyncComponent(() => import('./ListRincian.vue'))

const props = defineProps({
  store: { type: Object, required: true },
  title: { type: String, default: 'Data' },
  mode: { type: String, default: 'add' }
})

const searchSupplier = ref('')
const searchPenjualan = ref('')
const menuBarangRef = ref(null)
const inpJumlahRef = ref(null)
const loadingLock = ref(false)
const modalCetak = ref(false)

const form = ref({
  noretur: null,
  nopenjualan: null,
  nopenerimaan: null,
  tgl_retur: null,
  kode_barang: null,
  nobatch: null,
  satuan_k: null,
  jumlah_k: 0,
  harga: 0,
  harga_beli: 0,
  hpp: null,
  id_stok: null,
  id_penerimaan_rinci: null,
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
const handleSelectedPenjualan = (item) => {


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
  searchPenjualan.value = ''
  // console.log('handleSelectedBarang', form.value);

  // await nextTick()
  // console.log('ref', inpJumlahRef.value);
  // const el 
  // inpJumlahRef.value?.inputRef?.focus()
  handleFocus(inpJumlahRef)
  
}

const handleOk = () => {
  // console.log('handleOk');
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
  // console.log('handleRetur', e);
  
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

  form.value.id_penerimaan_rinci = e?.id_penerimaan_rinci ?? null
  form.value.jumlah_k = e.jumlah ?? null
  form.value.harga = e.harga_jual ?? null
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
  // console.log('store', props.store.items);
  // console.log('store form', props.store.form);


  

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
    resp = await api.post(`api/v1/transactions/returpenjualan/lock-retur-penjualan`, payload)
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

const totalRetur = computed(() => {
  let total = 0
  const rincian = props.store.form?.retur_penjualan_r ?? []
  if (rincian.length) {
    for (let i = 0; i < rincian.length; i++) {
      const el = rincian[i];
      const subTotal = (parseInt(el?.jumlah_k) || 0) * (parseInt(el?.harga) || 0)
      total += subTotal
    }
  }
  return total
})



onMounted(() => {
  // document.addEventListener('click', handleClickOutside)
  initForm()
})

function initForm(){
  const today = new Date().toISOString().split('T')[0];
  form.value.tgl_retur = today
  form.value.noretur = ''
  form.value.nopenerimaan = ''
  form.value.nopenjualan = ''
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


    const onlyDate = newForm?.tgl_retur?.split(" ")[0] 
    form.value.tgl_retur = onlyDate


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