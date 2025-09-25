<template>
  <u-view padding="0" flex1 class="w-full flex-wrap">
    <div class="flex w-full items-start justify-between gap-6 mb-1">
      <div class="flex items-center gap-4">
        <img src="/images/logo.svg" alt="logo" class="w-14 h-14 object-contain" />
        <div>
          <div class="text-xl font-semibold tracking-wide">{{ company?.nama || 'Nama Apotik nya' }}</div>
          <p class="text-sm text-gray-600">
            {{ company?.alamat || 'Alamat Apotik nya' }}<br />
            • Telp: {{ formatTeleponID(company?.telepon) }}
          </p>
        </div>
      </div>
      <div class="flex flex-col p-2">
        <div class="pt-2 uppercase text-md font-bold text-right">
          LAPORAN PEMBELIAN
        </div>
        <div class="text-right uppercase text-xs">
          Periode {{ formatDateIndo(store.range?.start_date,) }} - {{ formatDateIndo(store.range?.end_date,) }}
        </div>
        <div class="pt-2 uppercase text-sm font-bold text-right">
          TOTAL PEMBELIAN : Rp. {{ formatRupiah(totalPembelian) }}
        </div>
      </div>
    </div>
    <table flex1 class="w-full text-sm border-separate [border-spacing:0]">
      <thead>
        <tr>
          <td class="td text-left p-1 font-bold">Tanggal Penerimaan</td>
          <td class="td text-left p-1 font-bold">Nomor Penerimaan</td>
          <td class="td text-left p-1 font-bold">Supplier</td>
          <td class="td text-left p-1 font-bold">Penerimaan</td>
          <td class="td text-left p-1 font-bold">Retur</td>
          <td class="td text-right p-1 font-bold">Saldo</td>
        </tr>
      </thead>
      <tbody>
        <template v-for="(it, index) in mapItems" :key="index">
          <tr>
            <td class="td p-1 align-top text-left font-semibold">{{ formatDateIndo(it.tanggal) }}</td>
            <td class="td p-1 align-top text-left font-semibold">{{ it?.nopenerimaan || '-' }}</td>
            <td class="td p-1 align-top text-left font-semibold">{{ it?.suplier || '-' }}</td>
            <td class="td p-1 align-top text-left font-semibold">Rp. {{ formatRupiah(it?.totalpenerimaan) || '-' }}
            </td>
            <td class="td p-1 align-top text-left font-semibold">Rp. {{ formatRupiah(it?.totalretur)|| '-' }}</td>
            <td class="td p-1 align-top text-right font-semibold">Rp. {{ formatRupiah(it?.subtotal) || '-' }}</td>
          </tr>
          <template v-for="el in it.rincian" :key="el">
            <tr>
              <td colspan="3" class="td p-1 align-top text-left"></td>
              <td class="td p-1 align-top text-left">
                <div> {{ el?.rinci_nama }},
                  <span>Nilai: Rp. {{formatRupiah(el?.rinci_subtotal)}}</span>
                </div>
                <div>Jumlah Item {{ el?.rinci_jumlah_b }} {{ el?.rinci_satuan_b }} </div>
              </td>
              <td class="td p-1 align-top text-left">
                <div v-if="el?.retur_nama"> {{ el?.retur_nama }},
                  <span>Nilai: Rp. {{ formatRupiah(el?.retur_subtotal) }}</span>
                </div>
                <div v-if="el?.retur_jumlah_b && el?.retur_satuan_b">Jumlah Item {{ el?.retur_jumlah_b }} {{
                  el?.retur_satuan_b }} </div>
              </td>
              <td class="td p-1 align-top text-left"></td>
            </tr>
          </template>

        </template>
      </tbody>
    </table>
  </u-view>
</template>

<script setup>
import { api } from '@/services/api'
import { useAppStore } from '@/stores/app'
import { formatDateIndo, useWaktuLaluReactive } from '@/utils/dateHelper'
import { formatRupiah, formatTeleponID } from '@/utils/numberHelper'
import { defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { computed } from 'vue'
const props = defineProps({
  store: { type: Object, required: true },
  item: { type: Object, default: null },
  range: { type: Object, default: null },
})
// const ModalDetail = defineAsyncComponent(() => import('./ModalDetail.vue'))
// const openModalDetail = ref(false)
onMounted(() => {

  // if (props.range) {
  //   fetchDetail()
  // }
})
const app = useAppStore()
const company = computed(() => {
  return app?.form || null
})
const mapItems = computed(() => {
  const map = new Map()
  const items = props.store.items
  items.forEach(item => {
    const key = item.nopenerimaan
    const rinci = item.rincian
    const retur = item.retur
    const rinciretur = retur.flatMap(r => r.rincian || [])

    console.log('key', rinciretur)
    if (!map.has(key)) {
      const rincianGabung = rinci.map((s, i) => {
        const ret = rinciretur[i] || null
        return {
          rinci_nama: s.barang?.nama,
          rinci_jumlah_b: s?.jumlah_b,
          rinci_satuan_b: s?.satuan_b,
          rinci_subtotal: s?.subtotal,
          retur_nama: ret?.barang?.nama || '',
          retur_jumlah_b: ret?.jumlahretur_b || '',
          retur_satuan_b: ret?.satuan_b || '',
          retur_subtotal: ret?.subtotalretur || ''
        }
      })
      map.set(key, {
        nopenerimaan: item.nopenerimaan,
        tanggal: item.tgl_penerimaan,
        suplier: item.suplier,
        totalpenerimaan: rinci.map((x) => parseInt(x.subtotal)).reduce((a, b) => a + b, 0),
        totalretur: rinciretur.map((x) => parseInt(x.subtotalretur)).reduce((a, b) => a + b, 0),
        subtotal: rinci.map((x) => parseInt(x.subtotal)).reduce((a, b) => a + b, 0) - rinciretur.map((x) => parseInt(x.subtotalretur)).reduce((a, b) => a + b, 0),
        // rincian: rinci,
        rincian: rincianGabung
        
      })
    }
  })
  console.log('map', map)
  return Array.from(map.values())
})

const totalPembelian = computed(() =>{
  return mapItems.value.map((x) => parseInt(x.subtotal)).reduce((a,b) => a+b, 0)
})

</script>