
<template>
  <u-page>
    <!-- Header Search & Action -->
    <u-view class="w-full" padding="pt-1 px-2">
      <u-row flex1>
        <div class="font-bold text-lg text-primary">Laporan Penjualan</div>
      </u-row>
    </u-view>

    <u-separator />

    <u-view>

      <u-row flex1 class="w-full justify-between">
        <u-row>
          <u-input-search v-model="store.params.q" @update:modelValue="" :debounce="500" />
          <PerPage :fields="store.perPages" v-model="store.params.per_page" @update:modelValue="store.setPerPage" />
        </u-row>

        <u-row>
          <u-btn-icon icon="print" tooltip="TPrint" v-print="printObj" />
        </u-row>
      </u-row>
      <u-row right justify-self-end class="gap-2">
        <u-date-range  v-model="store.range" @update:modelValue="store.setRange"
          default-period="today" />
        <!-- <order-by v-if="showOrder" 
          :fields="store.orders"
          v-model="store.order"
          label="Urut By"
          @update:model-value="onSortChange"
        /> -->
      </u-row>
    </u-view>

   

    <u-view id="printArea" ref="printArea" class="w-full relative print-a4" flex1 scrollY gap="gap-0" padding="p-0">
        <u-view v-if="store.loading" flex1 class="flex items-center justify-center w-full">
          <u-load-spinner />
        </u-view>

        <!-- Tabel -->
      <div v-else class=" bg-white rounded-lg">

        <!-- Header -->
      <div class="flex items-start justify-between gap-6 mb-1">
        <div class="flex items-center gap-4">
          <img src="/images/logo.svg" alt="logo" class="w-14 h-14 object-contain" />
          <div>
            <div class="text-xl font-semibold tracking-wide">{{ app?.form?.nama || 'Nama Apotik nya' }}</div>
            <p class="text-sm text-gray-600">
              {{ app?.form?.alamat || 'Alamat Apotik nya' }}<br />
              Telp: {{ app?.form?.telepon || '08123456789' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col p-2">
          <div class="pt-2 uppercase text-md font-bold text-right">
            LAPORAN PENJUALAN
          </div>
           <div class=" uppercase text-xs">
            Periode {{ formatDateIndo(store.params?.from) }} - {{ formatDateIndo(store.params?.to) }}
          </div>
           <div class="pt-2 uppercase text-sm font-bold text-right">
            TOTAL PENJUALAN : {{ formatRupiah(store?.total) }}
          </div>
        </div>
        
      </div>


        <table class="w-full border-collapse">
          <thead class=" text-gray-700 text-sm uppercase">
            <tr>
              <th class="th text-left sticky-header">DETAIL</th>
              <!-- <th class="th text-left sticky-header">Invoice</th> -->
              <th class="th text-right sticky-header">Total</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in store.items" :key="i">
              <tr
                class="border-b hover:bg-gray-50 transition"
              >
                <td class="td font-semibold">Tanggal : {{ formatDateIndo(item?.tgl_penjualan) }} ({{ item?.nopenjualan }})</td>
                <!-- <td class="td font-semibold">{{ item?.nopenjualan }}</td> -->
                <!-- <td class="td">{{ item.customer }}</td> -->
                <td class="td text-sm text-right font-semibold ">
                  Rp. {{ formatRupiah(getTotal(item)) }}
                </td>
              </tr>
              <!-- detail item -->
              <tr v-for="(rinci, i) in item?.rinci" :key="i" class="border-b last:border-0">
                <td class="td text-gray-600">• {{ rinci?.master?.nama }} ({{ rinci?.harga_jual }} x {{ rinci?.jumlah_k }})</td>
                <!-- <td class="px-4 py-2 text-sm text-gray-600">{{ rinci?.jumlah_k }}</td> -->
                <td class="td text-right text-gray-600">{{ formatRupiah(rinci?.subtotal) }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </u-view>
    
    <u-view>
      <Pagination
        v-if="store?.meta"
        :total-items="store?.meta?.total"
        :per-page="store.params.per_page"
        v-model:currentPage="store.params.page"
      />
    </u-view>

    
  </u-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { formatRupiah } from "@/utils/numberHelper"
import { formatDateIndo } from "@/utils/dateHelper"
import { useLaporanPenjualanStore } from "@/stores/laporan/penjualan"
import { useAppStore } from "@/stores/app"


import Pagination from "./Pagination.vue"
import PerPage from "./PerPage.vue"

const store = useLaporanPenjualanStore()
const app = useAppStore()


onMounted(store.fetchData)

function getTotal (item) {
  let subtotal = 0
  let subtotalRetur
  item.rinci.forEach((r) => {
    subtotal += parseInt(r?.subtotal)
  })


  return subtotal
}





const printObj = {
  id: '#printArea', // ref elemen yang mau diprint
  popTitle: 'Laporan Penjualan',
  preview: false,
  extraCss: '',
  extraHead: '',
  beforeOpenCallback (vue) {
    console.log('wait...')
  },
  openCallback (vue) {
    console.log('opened')
  },
  closeCallback (vue) {
    console.log('closePrint')
  }
}
</script>

<style scoped>

</style>
