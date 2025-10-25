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
                    LIST DATA STOK OBAT
                </div>
                <div class="pt-1 text-sm text-right">Berdasarkan Penerimaan Obat</div>
            </div>
        </div>
        <table flex1 class="w-full text-sm border-separate [border-spacing:0]">
            <thead>
                <tr>
                    <td class="td text-left p-1 font-bold">Nomor Penerimaan</td>
                    <td class="td text-left p-1 font-bold">Nama Obat</td>
                    <td class="td text-left p-1 font-bold">Nobatch</td>
                    <td class="td text-left p-1 font-bold">Satuan</td>
                    <td class="td text-right p-1 font-bold">Harga Resep</td>
                    <td class="td text-right p-1 font-bold">Harga Biasa</td>
                    <td class="td text-left p-1 font-bold">Tgl Expired</td>
                    <td class="td text-right p-1 font-bold">Stok</td>
                </tr>
            </thead>
            <tbody>
                <template v-for="(it, index) in store.items" :key="index">
                    <tr>
                        <td class="td p-1 align-top text-left">{{ it?.nopenerimaan }}</td>
                        <td class="td p-1 align-top text-left font-semibold">({{ it?.barang?.kode }}) - {{
                            it?.barang?.nama }}</td>
                        <td class="td p-1 align-top text-left">{{ it?.nobatch || '-' }}</td>
                        <td class="td p-1 align-top text-left">1 {{ it?.satuan_b }} isi {{ it?.isi }} {{ it?.satuan_k }}
                        </td>
                        <td class="td p-1 align-top text-right"> {{
                            formatRpkoma(it?.barang?.harga_jual_resep_k) }}
                        </td>
                        <td class="td p-1 align-top text-right"> {{
                            formatRpkoma(it?.barang?.harga_jual_biasa_k) }}
                        </td>
                        <td class="td p-1 align-top text-left"> {{ formatDateIndo(it?.tgl_exprd) }} </td>
                        <td class="td p-1 align-top text-right font-semibold"> {{ formatRupiah(it?.jumlah_k) }} {{
                            it?.satuan_k }} </td>
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

    // if (props.range) {
    //   fetchDetail()
    // }
})
const app = useAppStore()
const company = computed(() => {
    return app?.form || null
})

</script>