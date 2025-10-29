<template>
  <u-col class="w-full pb-4 pt-1 px-2 relative">
    <u-grid cols="5">
      <!-- HEADER 1 -->
      <u-card class="col-span-2 h-full min-h-[100px] space-y-4">
        <u-row>
          <u-icon name="layers" class="w-4 h-4" />
          <u-text class="font-bold">Informasi Pendapatan Lain</u-text>
        </u-row>
        <u-row>
          <u-input-date type="date" v-model="form.tgl" :error="errorMessage('tgl')" />
        </u-row>
        <u-row>
          <u-input v-model="form.notransaksi" label="Nomor Transaksi (Auto)" readonly :error="isError('notransaksi')"
            :error-message="errorMessage('notransaksi')" />
        </u-row>
      </u-card>

      <!-- HEADER -->
      <u-card class="col-span-3 h-full space-y-4">
        <u-row>
          <u-icon name="users" class="w-4 h-4" />
          <u-text class="font-bold">Informasi Asal Penerimaan</u-text>
        </u-row>
        <!-- <u-row flex1 class="w-full font-medium">
          <u-textarea v-model="form.keterangan" label="Keterangan" :error="isError('keterangan')"
            :error-message="errorMessage('keterangan')" />
        </u-row> -->
        <u-row>
          <u-input v-model="form.dari" label="Pendapatan berasal dari?" :error="isError('dari')"
            :error-message="errorMessage('dari')" type="text" />
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
          <u-grid cols="12" gap="gap-4">
            <u-row class="col-span-8">
              <u-textarea v-model="form.keterangan" label="Keterangan" :error="isError('keterangan')"
                :error-message="errorMessage('keterangan')" />
            </u-row>
            <u-row class="col-span-4">
              <u-input ref="inpJumlahRef" v-model="form.nilai" label="Nilai Pendapatan" type="number"
                :error="isError('nilai')" :error-message="errorMessage('nilai')" />
            </u-row>
            <div class="col-span-12">
              <u-separator spacing="-my-2"></u-separator>
            </div>


            <u-row right class="col-span-8 ">
              <u-btn variant="secondary" label="Batal" @click="handleBatal" />
              <u-btn :loading="store.loadingSave" label="Simpan" @click.stop="handleSubmit" />
            </u-row>
          </u-grid>
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
        <u-text class="font-bold" size="sm">Ringkasan Pendapatan Lain</u-text>
        <u-separator spacing="-my-2"></u-separator>
        <u-row>
          <u-text>Total Pendapatan : </u-text>
          <u-text class="font-bold" size="sm">{{ formatRupiah(TotalPendapatan) || 0 }}</u-text>
        </u-row>
        <u-row>
          <u-badge v-if="store.form?.kunci" variant="danger">Terkunci</u-badge>
          <u-badge v-else :variant="store.mode === 'add' ? 'success' : 'warning'">Mode {{ store.mode === 'add' ?
            'Tambah' : 'Edit' }}</u-badge>
        </u-row>
        <u-separator spacing="-my-1"></u-separator>
        <u-row class="z-99">
          <u-btn v-if="store.mode === 'edit'" variant="secondary" @click="initForm">Trans Baru</u-btn>
          <!-- <u-btn v-if="store.form" :loading="loadingLock" @click="handleKunci">{{ store.form?.flag ? 'Buka Kunci' :
            'Kunci Order' }}</u-btn> -->
          <u-btn v-if="store.form && store.form?.kunci !== '1'" :loading="loadingLock" @click="handleKunci">{{ 'Kunci'
            }}</u-btn>
        </u-row>
      </u-col>
    </u-grid>

    <div v-if="store.form?.kunci"
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

const inpJumlahRef = ref(null)
const loadingLock = ref(false)

const form = ref({
  notransaksi: '',
  keterangan: '',
  dari: '',
  tgl: '',
  nilai: 0
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


const clearSelectedBarang = () => {
  props.store.barangSelected = null
  form.value.nilai = 0
}

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

  const flag = (props.store.form?.kunci === '1' || props.store.form?.kunci === 1)
  const notransaksi = props.store.form?.notrans
  const payload = {
    notransaksi
  }

  loadingLock.value = true

  let resp
  try {
    if (!flag) {
      resp = await api.post(`api/v1/transactions/pendapatanlain/kunci`, payload)
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
  props.store.form.kunci = data?.kunci
  props.store.initModeEdit(data)

  

  
}

onMounted(() => {
  // document.addEventListener('click', handleClickOutside)
  initForm()
})

function initForm(){
  const today = new Date().toISOString().split('T')[0];
  form.value.tgl = today
  // form.value.notransaksi = ''
  props.store.init()
  clearSelectedBarang()
} 

onUnmounted(() => {
  // document.removeEventListener('click', handleClickOutside)
})

watch(() => ({ ...form.value }), (newForm, oldForm) => {

  for (const key in newForm) {
    if (newForm[key] !== oldForm[key]) {
      props.store.clearFieldError(key)
    }
  }

}, { deep: true })

watch(() => ({ ...props.store.form }), (newForm, oldForm) => {
  
  for (const key in newForm) {
    if (newForm[key] !== oldForm[key]) {
      props.store.clearFieldError(key)
    }
  }
  if (newForm) {
  
      form.value = {
        notransaksi: newForm?.notrans,
        dari: newForm?.dari,
        tgl: newForm?.tgl,
        
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

const TotalPendapatan = computed(() => {
  if (props.store.mode === 'add') {
    return 0
  } else {
    // const items = Object.values(form.value?.rincian ?? {})
    // return items.reduce((a, b) => {
    //   const subtotal = Number(b?.jumlah_b ?? 0) * Number(b?.harga_b ?? 0)
    //   return a + subtotal
    // }, 0)
    // const items = Object.values(form.value?.rincian ?? {})
    // return items.reduce((a, b) => a + Number(b?.subtotal ?? 0), 0)
    const items = props?.store?.form?.rincian ?? []
    return items.reduce((a, b) => a + Number(b?.nilai), 0)
  }
})

</script>