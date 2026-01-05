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
          <u-text class="font-bold">Informasi Setoran</u-text>
        </u-row>
        <u-row v-if="!store.form?.nosetoran">
          <div class="flex items-center gap-2 mb-2 px-2"
            :class="{ 'animate-shake': selectAll }"
          >
             <input type="checkbox" :checked="selectAll" @change="toggleSelectAll($event.target.checked)" />
      <span>Select All</span>
            <u-text class="text-sm font-medium">Total Setoran: Rp. {{ formatRupiah(selectTotalJumlah || 0) }}</u-text>
          </div>
          
        </u-row>
        <u-row>
         <u-list
            v-if="!store.form?.nosetoran"
            :items="store.form?.rincinota"
          >
            
            <template #item="{ item, isHovered }">
              <ListRincian
                :item="item"
                :store="store"
                :isHovered="isHovered"
                :loadingrincian="loadingRincian"
                :checked="selectedIds.includes(item.id)"
                @toggle="handleToggle"
                :flag="1"
              />
            </template>
          </u-list>
          <u-list v-else :items="store.form?.rincian">
            <template #item="{ item, isHovered }">
              <ListRincian
                :item="item"
                :store="store"
                :isHovered="isHovered"
                :loadingrincian="loadingRincian"
                :flag="2"
              />
            </template>
          </u-list>
        </u-row>

      </u-card>

      <u-col align="items-end" class="col-span-4">

        <u-card class="w-full space-y-4">
          <u-row>
            <u-icon name="layers" class="w-4 h-4" />
            <u-text class="font-bold">Informasi Setoran</u-text>
          </u-row>
          <!-- <u-row>
            <u-input-date type="date" v-model="form.tgl_pelunasan" :error="errorMessage('tgl_pelunasan')" />
          </u-row> -->
          <u-row>
            <u-input v-model="form.nosetoran" label="Nomor Setoran (Auto)" readonly :error="isError('nosetoran')"
              :error-message="errorMessage('nosetoran')" />
          </u-row>
        </u-card>


        <u-text class="font-bold" size="sm">Ringkasan Setoran</u-text>
        <u-separator spacing="-my-2"></u-separator>
        
        <u-row>
          <u-text>Total Setoran : </u-text>
          <u-text class="font-bold" size="sm">Rp. {{ formatRupiah(store.form?.total_setoran) }}</u-text>
        </u-row>
        <!-- <u-row>
          <u-badge v-if="store.form?.flag" variant="danger">Terkunci</u-badge>
          <u-badge v-else :variant="store.mode === 'add' ? 'success' : 'warning'">Mode {{ store.mode === 'add' ?
            'Tambah' : 'Edit' }}</u-badge>
        </u-row> -->
        <u-separator spacing="-my-1"></u-separator>
        <u-row class="z-9">
           <u-btn v-if="store.form" @click="handleSimpan" :loading="loadingSimpan">{{ store.form?.nosetoran ? 'Edit Setoran' :
            'Simpan Setoran' }}</u-btn>
          <!-- <u-btn v-if="store.mode === 'edit'" variant="secondary" @click="initForm">Form Baru</u-btn> -->
          <!-- <u-btn v-if="store.form" :loading="loadingLock" @click.stop="handleKunci">{{ store.form?.flag ? 'Cetak' :
            'Kunci' }}</u-btn> -->
        </u-row>
      </u-col>
    </u-grid>

    <div v-if="store.form?.flag"
      class="absolute top-0 left-0 right-0 w-full h-full rounded-2xl flex items-center justify-center p-4 bg-light-primary/10"
      padding="p-0"></div>


    <!-- Cetak -->
    <!-- <modal-cetak v-model="modalCetak" title="Pembayaran Hutang" :store="store" @close="modalCetak = false" /> -->
  </u-col>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch, defineAsyncComponent } from 'vue'
import { formatRupiah } from '@/utils/numberHelper'
import { useNotificationStore } from '@/stores/notification'
const notify = useNotificationStore().notify

import { api } from '@/services/api'
import axios from 'axios'
// import ModalCetak from './ModalCetak.vue'

const ListRincian = defineAsyncComponent(() => import('./ListRincian.vue'))

const props = defineProps({
  store: { type: Object, required: true },
  title: { type: String, default: 'Data' },
  mode: { type: String, default: 'add' },
})


const loadingRincian = ref(false)
const selectedIds = ref([])
const selectAll = ref(false)
const loadingSimpan = ref(false)

// computed array data lengkap yang dipilih
const selectedItemsValue = computed(() => {
  return props.store.form?.rincinota?.filter(item =>
    selectedIds.value.includes(item.id)
  ) ?? []
})

// computed total otomatis
const selectTotalJumlah = computed(() => {
  let total = selectedItemsValue.value.reduce(
    (acc, item) => acc + Number(item.nominal_transaksi || 0),
    0
  )
  return total
})
// toggle per item
const handleToggle = ({ item, checked }) => {
  if (!item?.id) return

  if (checked) {
    if (!selectedIds.value.includes(item.id)) selectedIds.value.push(item.id)
  } else {
    selectedIds.value = selectedIds.value.filter(id => id !== item.id)
  }

  // update selectAll hanya jika semua item dipilih
  selectAll.value = selectedIds.value.length === (props.store.form?.rincinota?.length ?? 0)
}

// toggle select all
const toggleSelectAll = (checked) => {
  selectAll.value = checked
  selectedIds.value = checked 
    ? (props.store.form?.rincinota?.map(i => i.id) ?? []) 
    : []
}

const form = ref({
  nosetoran: '',
  total_setoran: 0,
  rincinota: [],
  rincian: [],
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

onMounted(() => {

  getPenjulana()
})

const getPenjulana = async () => {
  loadingRincian.value = true
  selectedItemsValue.value = []
  selectedIds.value = []
  selectTotalJumlah.value = 0
  try {
    const resp = await api.get(`api/v1/transactions/pembayaran-setoran/get-panjualan`)
    if (!props.store.form) {
      props.store.form = {
        nosetoran: '',
        total_setoran: 0,
        rincinota: [],
      }
    }

    props.store.form.rincinota = resp.data.data ?? []

  } catch (error) {
    console.log('error', error);
    // notify({ message: error.response.data.message ?? 'Data Gagal dihapus', type: 'error' })
  } finally {
    loadingRincian.value = false
  }
  
}

watch(
  () => props.store.form,
  (newForm, oldForm) => {
    if (!newForm) return

    for (const key in newForm) {
      if (newForm[key] !== oldForm?.[key]) {
        props.store.clearFieldError(key)
      }

      if (key in form.value) {
        form.value[key] = newForm[key]
      }
    }

    if (newForm.tgl_pelunasan) {
      form.value.tgl_pelunasan = newForm.tgl_pelunasan.split(' ')[0]
    }

    // if (props.store.mode === 'add' && !oldForm) {
    //   initForm()
    // }
  },
  { deep: true }
)

const handleSimpan = async (e) => {
  e.preventDefault()
  e.stopPropagation()

  const notransaksi = props.store.form?.nosetoran
  const nominal_setoran = selectTotalJumlah.value
  const penjualan = selectedItemsValue.value
  console.log('total_setoran', nominal_setoran);
  const payload = {
    notransaksi,
    nominal_setoran,
    penjualan,
  }

  loadingSimpan.value = true

  let resp
  try {
    // if (!flag) {
      resp = await api.post(`api/v1/transactions/pembayaran-setoran/simpan`, payload)
    // } else {
    //   resp = await api.post(`api/v1/transactions/order/unlock-order`, payload)
    // }
    // if (!props.store.form) {
     
      props.store.form.nosetoran = resp?.data?.data?.nosetoran
      props.store.form.total_setoran = resp?.data?.data?.total_setoran
      props.store.form.rincinota = resp?.data?.data?.rincinota

      getPenjulana()
      props.store.fetchAll()
    // }
    notify({ message: resp?.data?.message, type: 'success' })
    console.log('resp kunci', resp);
    // return
  } catch (error) {
    console.log('error', error);
    notify({ message: error?.message ?? 'Kunci tidak bisa dibuka', type: 'error' })
    return
  } finally {
    loadingSimpan.value = false
  }
  

  // const data = resp?.data?.data
  // props.store.form.flag = data?.flag
  // props.store.initModeEdit(data)

}
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