<template>
  <u-col class="w-full pb-4 pt-1 px-2 relative">
    <u-grid cols="5">

      <!-- HEADER 1 -->
      <!-- <u-card class="col-span-2 h-full min-h-[100px] space-y-4">
        <u-row>
          <u-icon name="layers" class="w-4 h-4" />
          <u-text class="font-bold">Informasi Beban Pengeluaran</u-text>
        </u-row>
        <u-row>
          <u-input-date type="date" v-model="form.tgl_beban" :error="errorMessage('tgl_beban')" />
        </u-row>
        <u-row>
          <u-input v-model="store.form.notransaksi" label="Nomor Transaksi" readonly :error="isError('notransaksi')"
            :error-message="errorMessage('notransaksi')" />
        </u-row>
      </u-card> -->

      <!-- HEADER 2 -->
      <u-card class="col-span-5 h-full space-y-4">
        <u-row>
          <u-icon name="users" class="w-4 h-4" />
          <u-text class="font-bold">Informasi Beban Pengeluaran</u-text>
        </u-row>
        <u-row flex1 class="w-full font-medium">
          <div
            class="bg-primary/10 border border-primary rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md w-full">
            <div class="flex flex-1 justify-between items-start">
              <u-row flex1 class="w-full">
                <u-text>Nomor Transaksi : </u-text>
                <u-text size="md" class="text-primary text-bold text[16px]">
                  {{ store.form?.notransaksi }}
                </u-text>
              </u-row>
            </div>
          </div>
        </u-row>
        <u-row>
          <u-input v-model="form.keterangan" label="Keterangan" :error="isError('keterangan')"
            :error-message="errorMessage('keterangan')" type="text" />
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
          <u-autocomplete v-model="searchBarang" placeholder="Cari Jenis Beban" :debounce="300" :min-search-length="2"
            item-key="id" item-label="nama_beban" not-found-text="Data tidak ditemukan"
            not-found-subtext="Coba kata kunci lain" :show-add-button="false" api-url="/api/v1/master/beban/get-list"
            api-response-path="data.data" :api-params="{ per_page: 10 }" :use-api="true" @select="handleSelectedBarang"
            @items-loaded="onItemsLoadedBarang">
            <template #item="{ item }">
              <u-col gap="gap-1">
                <u-text size="sm" class="font-medium">{{ item?.nama_beban }}</u-text>
                <!-- <u-row class="-mt-1" gap="gap-1">
                    <u-text class="">{{ item?.kode }}</u-text>, 
                    <u-text class="">{{ item?.satuan_k }}</u-text> | 
                    <u-text class="">{{ item?.satuan_b }}</u-text>
                    <u-text class="">Isi {{ item?.isi }}</u-text>
                  </u-row> -->
              </u-col>
            </template>
          </u-autocomplete>
        </u-row>

        <u-row class="relative -mt-4">
          <div v-if="store?.barangSelected" ref="menuBarangRef"
            class="bg-background border-1 border-primary rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md w-full absolute z-10 -top-4">
            <u-grid cols="12" gap="gap-4">
              <div class="col-span-6">
                <u-text class="font-bold">Nama Beban</u-text>
                <u-text>{{ store.barangSelected?.nama_beban || '-' }}</u-text>
              </div>
              <u-row class="col-span-6">
                <u-input ref="inpJumlahRef" v-model="form.subtotal" label="Nilai Pengeluaran" type="number"
                  :error="isError('subtotal')" :error-message="errorMessage('subtotal')" />
              </u-row>
              <div class="col-span-12">
                <u-separator spacing="-my-2"></u-separator>
              </div>


              <u-row right class="col-span-8 ">
                <u-btn variant="secondary" label="Batal" @click="handleBatal" />
                <u-btn :loading="store.loadingSave" label="Simpan" @click.stop="handleSubmit" />
              </u-row>
            </u-grid>
          </div>
        </u-row>
        <u-row>
          <u-empty v-if="!store.form?.rincian?.length" title="Belum Ada Items" icon="baggage-claim" />
          <u-list v-else :spaced="true" anim :items="store.form?.rincian">
            <template #item="{ item, isHovered }">
              <ListRincian :item="item" :store="store" :is-hovered="isHovered" />
            </template>
          </u-list>
        </u-row>

      </u-card>

      <u-col align="items-end" class="col-span-4">
        <u-text class="font-bold" size="sm">Ringkasan Beban Pengeluaran</u-text>
        <u-separator spacing="-my-2"></u-separator>
        <u-row>
          <u-text>Total Pengeluaran : </u-text>
          <u-text class="font-bold" size="sm">{{ formatRupiah(TotalPengeluaran) || 0 }}</u-text>
        </u-row>
        <u-row>
          <u-badge v-if="store.form?.flag" variant="danger">Terkunci</u-badge>
          <u-badge v-else :variant="store.mode === 'add' ? 'success' : 'warning'">Mode {{ store.mode === 'add' ?
            'Tambah' : 'Edit' }}</u-badge>
        </u-row>
        <u-separator spacing="-my-1"></u-separator>
        <u-row class="z-99">
          <u-btn v-if="store.mode === 'edit'" variant="secondary" @click="initForm">Trans Baru</u-btn>
          <!-- <u-btn v-if="store.form" :loading="loadingLock" @click="handleKunci">{{ store.form?.flag ? 'Buka Kunci' :
            'Kunci Order' }}</u-btn> -->
          <u-btn v-if="store.form && store.form?.flag !== '1'" :loading="loadingLock" @click="handleKunci">{{ 'Kunci'
            }}</u-btn>
        </u-row>
      </u-col>
    </u-grid>

    <div v-if="store.form?.flag"
      class="absolute top-0 left-0 right-0 w-full h-full rounded-2xl flex items-center justify-center p-4 bg-light-primary/10"
      padding="p-0"></div>

  </u-col>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch, defineAsyncComponent } from 'vue'

import { api } from '@/services/api'
import { formatRupiah } from '@/utils/numberHelper'


const ListRincian = defineAsyncComponent(() => import('./ListRincian.vue'))

const props = defineProps({
  store: { type: Object, required: true },
  title: { type: String, default: 'Data' },
  mode: { type: String, default: 'add' }
})

const searchBarang = ref('')
const menuBarangRef = ref(null)
const inpJumlahRef = ref(null)
const loadingLock = ref(false)

const form = ref({
  // notransaksi: '',
  keterangan: '',
  kode_beban: '',
  subtotal: '',
  
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

const handleSelectedBarang = (item) => {
  
  props.store.barangSelected = item
  form.value.kode_beban = item?.id ?? null
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

function handleClickOutside(event) {
  if (menuBarangRef.value && !menuBarangRef.value.contains(event.target)) {
    clearSelectedBarang()
  }
}

const onItemsLoaded = (items) => {
  // console.log('items', items);
  
}
const onItemsLoadedBarang = (items) => {
  console.log('items Load', items);
  
}

const clearSelectedBarang = () => {
  props.store.barangSelected = null
  form.value.kode_beban = ''
  form.value.subtotal = 0
}


// const generateNoTransaksi = () => {
//   const now = new Date()
//   const formatted =
//     now.getFullYear().toString() +
//     String(now.getMonth() + 1).padStart(2, '0') +
//     String(now.getDate()).padStart(2, '0') +
//     String(now.getHours()).padStart(2, '0') +
//     String(now.getMinutes()).padStart(2, '0') +
//     String(now.getSeconds()).padStart(2, '0')

//   return form.value.notransaksi = formatted + 'BB'
// }
const handleSubmit = (e) => {
  e.preventDefault()
  e.stopPropagation()
  // if (props.mode === 'add' && !form.value.notransaksi) {
  //   generateNoTransaksi()
  // }
  // console.log('form', form.value);
  props.store.create(form.value)
  .then(() => {
    clearSelectedBarang()
  })
}

const handleBatal = () => {
  clearSelectedBarang()
}

const handleKunci = async (e) => {
  e.preventDefault()
  e.stopPropagation()
  console.log('store', e);
  console.log('store form', props.store.form);

  const flag = (props.store.form?.flag === '1' || props.store.form?.flag === 1)
  const notransaksi = props.store.form?.notransaksi
  const payload = {
    notransaksi
  }

  loadingLock.value = true

  let resp
  try {
    if (!flag) {
      resp = await api.post(`api/v1/transactions/beban/lock_beban`, payload)
    } 
    // else {
    //   resp = await api.post(`api/v1/transactions/beban/unlock-beban`, payload)
    // }

    // console.log('resp', resp);
  } catch (error) {
    console.log('error', error);
    
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
  // form.value.tgl_beban = today
  // form.value.notransaksi = ''
  props.store.init()
  clearSelectedBarang()
} 

onUnmounted(() => {
  // document.removeEventListener('click', handleClickOutside)
})

watch(() => ({ ...props.store.form }), (newForm, oldForm) => {
  console.log('🔥 watch form', props.store.form);
  
  for (const key in newForm) {
    if (newForm[key] !== oldForm[key]) {
      props.store.clearFieldError(key)
    }
  }

  if (newForm) {
    form.value = {
      notransaksi: newForm?.notransaksi ?? '',
      // tgl_beban: newForm?.tgl_beban ?? '',
      keterangan: newForm?.keterangan ?? '',
      // kode_user: newForm?.kode_user,
      // kode_supplier: newForm?.kode_supplier ?? '',
      
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

const TotalPengeluaran = computed(() => {
  if (props.store.mode === 'add') {
    return 0
  } else {
    console.log('TotalPengeluaran', props?.store?.form);
    // const items = Object.values(form.value?.rincian ?? {})
    // return items.reduce((a, b) => {
    //   const subtotal = Number(b?.jumlah_b ?? 0) * Number(b?.harga_b ?? 0)
    //   return a + subtotal
    // }, 0)
    // const items = Object.values(form.value?.rincian ?? {})
    // return items.reduce((a, b) => a + Number(b?.subtotal ?? 0), 0)
    const items = props?.store?.form?.rincian ?? []
    return items.reduce((a, b) => a + Number(b?.subtotal), 0)
  }
})

</script>