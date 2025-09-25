<template>
  <u-col gap="gap-1" class="w-full px-4 py-1">
    <u-view padding="0" flex1 class="w-full">
      <u-col flex1 class="w-full" gap="gap-1">
        <u-row flex1 class="w-full pt-1">
          <u-row flex1 class="w-full">
            <div class="font-bold">{{ item?.nama }}</div>
            <div class="italic text-light-primary/60 text-xs">Stok Saat ini:  {{ stokSekarang }} {{ item?.satuan_k }}</div>
          </u-row>
          <u-row class="">
            <div class="italic text-light-primary text-xs">{{ item?.kode }}</div>
            <!-- <div class="text-xs text-gray-400">{{ useWaktuLaluReactive(item?.created_at) }}</div> -->
          </u-row>
        </u-row>
        <u-separator></u-separator>
        <u-row flex1 class="w-full pt-0 pb-1">
          <u-row flex1 class="w-full">
            <div class="w-full">
              <u-grid cols="12">
                <u-row class="col-span-1">
                  <div>Saldo Awal </div>
                </u-row>
                <u-row class="col-span-1 text-xs">
                  <div class="font-bold">: {{ saldoAwal }} {{ item?.satuan_k }} </div>
                </u-row>

                <u-row class="col-span-1">
                  <div>Stok Masuk </div>
                </u-row>
                <u-row class="col-span-1 text-xs">
                  <div class="font-bold">: {{ totalMasuk }} {{ item?.satuan_k }}</div>
                </u-row>


                <u-row class="col-span-1">
                  <div>Stok Keluar </div>
                </u-row>
                <u-row class="col-span-1 text-xs">
                  <div class="font-bold">: {{ totalKeluar }} {{ item?.satuan_k }}</div>
                </u-row>

                <u-row class="col-span-1">
                  <div>Penyesuaian </div>
                </u-row>
                <u-row class="col-span-1 text-xs">
                  <div class="font-bold">: {{ totalPenyesuaian }} {{ item?.satuan_k }}</div>
                </u-row>

                <u-row class="col-span-1">
                  <div>Stok Akhir </div>
                </u-row>
                <u-row class="col-span-1 text-xs">
                  <div class="font-bold">: {{ stokAkhir }} {{ item?.satuan_k }}</div>
                </u-row>
              </u-grid>
            </div>
          </u-row>
          <u-row right class="">
            <u-btn label="Detail" @click="openDetail" />
          </u-row>
        </u-row>
      </u-col>
    </u-view>
  </u-col>
  <modal-detail v-if="openModalDetail" v-model="openModalDetail" title="Detail Kartu Stok" :store="store" 
    @close="handleCloseModalNota" />
</template>

<script setup>
import { api } from '@/services/api'
import { useWaktuLaluReactive } from '@/utils/dateHelper'
import { formatRupiah } from '@/utils/numberHelper'
import { defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { computed } from 'vue'
const props = defineProps({
  store: { type: Object, required: true },
  item: { type: Object, default: null },
  range: { type: Object, default: null },
})
const ModalDetail = defineAsyncComponent(() => import('./ModalDetail.vue'))
const openModalDetail = ref(false)
onMounted(() => {

  // if (props.range) {
  //   fetchDetail()
  // }
})  
// watch(() => props.range, (val) => {
//   if (val) {
//     console.log('range siap dipakai', val)
//     fetchDetail()
//   }
// })

// const fetchDetail = async () => {
//   const params = {
//     from: props.range.start_date,
//     to: props.range.end_date,
//     id: props.item.id
//   }
//   console.log('params ready', params)
// }

const openDetail = async () => {
  props.store.loading = true
  try {
    const params = {
      bulan: props.store.range.start_date,
      tahun: props.store.range.end_date,
      id: props.item.id
    }
    console.log('params', params)
    const response = await api.get(`api/v1/transactions/stok/get-rinci-kartu-stok`, { params })
    if (response) {
      
      props.store.item= response.data.data
      console.log('items cacac', props.store.item)
    }
  } catch (error) {
    console.error('Error fetching Kartu Stok:', error)
  } finally {
    props.store.loading = false
  }
  openModalDetail.value = true

}

const handleCloseModalNota = () => {
  openModalDetail.value = false

}

// saldo awal
const saldoAwal = computed(() => {
  return (props.item?.stok_awal ?? []).reduce((sum, it) => sum + Number(it.jumlah_k ?? 0), 0)
})

// stok masuk
const totalMasuk = computed(() => {
  return (props.item?.penerimaan_rinci ?? []).reduce((sum, it) => sum + Number(it.jumlah_k ?? 0), 0) + 
    (props.item?.retur_penjualan_rinci ?? []).reduce((sum, it) => sum + Number(it.jumlah_k ?? 0), 0)
})

// stok keluar
const totalKeluar = computed(() => {
  return (props.item?.penjualan_rinci ?? []).reduce((sum, it) => sum + Number(it.jumlah_k ?? 0), 0) +
    (props.item?.retur_pembelian_rinci ?? []).reduce((sum, it) => sum + Number(it.jumlah_k ?? 0), 0)
  
})

// retur penjualan (masuk)
// const returPenjualan = computed(() => {
//   return (props.item?.retur_penjualan_rinci ?? []).reduce((sum, it) => sum + Number(it.jumlah_k ?? 0), 0)
// })

// retur pembelian (keluar)
// const returPembelian = computed(() => {
//   return (props.item?.retur_pembelian_rinci ?? []).reduce((sum, it) => sum + Number(it.jumlah_k ?? 0), 0)
// })

// penyesuaian (bisa + atau -)
const totalPenyesuaian = computed(() => {
  return (props.item?.penyesuaian ?? []).reduce((sum, it) => sum + Number(it.jumlah_k ?? 0), 0)
})
// stok akhir
const stokAkhir = computed(() => {
  return saldoAwal.value + totalMasuk.value - totalKeluar.value + totalPenyesuaian.value
})
// stok akhir
const stokSekarang = computed(() => {
  return (props.item?.stok ?? []).reduce((sum, it) => sum + Number(it.jumlah_k ?? 0), 0) 
})

</script>