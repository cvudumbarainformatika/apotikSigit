<template>
    <u-view padding="0" flex1 class="w-full flex-wrap">
        <div class="flex w-full items-start justify-between gap-6 mb-3">
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
                    REKAP KARTU STOK
                </div>
                <div class="pt-1 text-sm text-right">Berdasarkan Data Obat</div>
                <div class="pt-1 text-sm text-right">Periode {{ periode }} </div>
            </div>
        </div>
        <table flex1 class="w-full text-sm border-separate [border-spacing:0]">
            <thead>
                <tr>
                    <td class="td text-left p-1 font-bold">Nama Obat</td>
                    <td class="td text-left p-1 font-bold">Saldo Awal</td>
                    <td class="td text-left p-1 font-bold">Stok Masuk</td>
                    <td class="td text-left p-1 font-bold">Stok Keluar</td>
                    <td class="td text-left p-1 font-bold">Penyesuaian</td>
                    <td class="td text-left p-1 font-bold">Stok Akhir</td>
                </tr>
            </thead>
            <tbody>
                <template v-for="(it, index) in mapItems" :key="index">
                    <tr>
                        <td class="td p-1 align-top text-left font-semibold">({{ it?.kode }}) - {{
                            it?.nama }}</td>
                        <td class="td p-1 align-top text-left">{{ formatRupiah(it?.saldoawal) }} {{ it?.satuan_k }}
                        </td>
                        <td class="td p-1 align-top text-left">{{ formatRupiah(it?.stokmasuk) }} {{ it?.satuan_k }}
                        </td>
                        <td class="td p-1 align-top text-left">{{ formatRupiah(it?.stokkeluar) }} {{ it?.satuan_k }}
                        </td>
                        <td class="td p-1 align-top text-left">{{ formatRupiah(it?.penyesuaian) }} {{ it?.satuan_k }}
                        </td>
                        <td class="td p-1 align-top text-left">{{ formatRupiah(it?.stokakhir) }} {{ it?.satuan_k }}
                        </td>
                    </tr>

                </template>
            </tbody>
        </table>
    </u-view>
</template>

<script setup>
import { api } from '@/services/api'
import { useAppStore } from '@/stores/app'
import { formatDateIndo, useWaktuLaluReactive } from '@/utils/dateHelper'
import { formatRpkoma, formatRupiah, formatTeleponID } from '@/utils/numberHelper'
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
    const items = props.store.items
    console.log('items props', items)
    // if (props.range) {
    //   fetchDetail()
    // }
})
const app = useAppStore()
const company = computed(() => {
    return app?.form || null
})

const bulans = computed(() => [
    { label: 'Januari', value: '01' },
    { label: 'Februari', value: '02' },
    { label: 'Maret', value: '03' },
    { label: 'April', value: '04' },
    { label: 'Mei', value: '05' },
    { label: 'Juni', value: '06' },
    { label: 'Juli', value: '07' },
    { label: 'Agustus', value: '08' },
    { label: 'September', value: '09' },
    { label: 'Oktober', value: '10' },
    { label: 'November', value: '11' },
    { label: 'Desember', value: '12' },
])
const periode = computed(() => {
    const bulanObj = bulans.value.find(b => b.value === props.store.range.start_date)
    const namaBulan = bulanObj ? bulanObj.label : ''
    const tahun = props.store.range.end_date || ''
    return `${namaBulan} ${tahun}`
})
const mapItems = computed(() => {
    const map = new Map()
    const items = props.store.items
    items.forEach(it => {
        const key = it?.kode
        map.set(key, {
            kode: it?.kode,
            nama: it?.nama,
            satuan_k: it?.satuan_k,
            satuan_b: it?.satuan_b,
            isi: it?.isi,
            saldoawal: it?.stok_awal?.map((x) => parseInt(x.jumlah_k)).reduce((a,b) => a+b,0),
            stokmasuk: it?.penerimaan_rinci?.map((x) => parseInt(x.jumlah_k)).reduce((a, b) => a + b, 0) - 
                it?.retur_pembelian_rinci?.map((x) => parseInt(x.jumlah_k)).reduce((a, b) => a + b, 0),
            stokkeluar: it?.penjualan_rinci?.map((x) => parseInt(x.jumlah_k)).reduce((a, b) => a + b, 0) -
                it?.retur_penjualan_rinci?.map((x) => parseInt(x.jumlah_k)).reduce((a, b) => a + b, 0),
            penyesuaian: it?.penyesuaian?.map((x) => parseInt(x.jumlah_k)).reduce((a, b) => a + b, 0),
            stokakhir: it?.stok_awal?.map((x) => parseInt(x.jumlah_k)).reduce((a, b) => a + b, 0) +
                (it?.penerimaan_rinci?.map((x) => parseInt(x.jumlah_k)).reduce((a, b) => a + b, 0) -
                    it?.retur_pembelian_rinci?.map((x) => parseInt(x.jumlah_k)).reduce((a, b) => a + b, 0)) -
                (it?.penjualan_rinci?.map((x) => parseInt(x.jumlah_k)).reduce((a, b) => a + b, 0) -
                    it?.retur_penjualan_rinci?.map((x) => parseInt(x.jumlah_k)).reduce((a, b) => a + b, 0)) +
                it?.penyesuaian?.map((x) => parseInt(x.jumlah_k)).reduce((a, b) => a + b, 0),
            stoksekarang: it?.stok?.map((x) => parseInt(x.jumlah_k)).reduce((a, b) => a + b, 0),
        })
    })

    console.log('itms barang xxxx', map)
    return Array.from(map.values())
})

</script>