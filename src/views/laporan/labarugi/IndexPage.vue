
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
      <div v-else class=" bg-white  rounded-lg">

        <!-- Header -->
      <div class="flex items-start justify-between gap-6">
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
          <div class="inline-block px-3 py-1 rounded-full text-center border text-xs uppercase tracking-wider">
            LAPORAN LABARUGI
          </div>
           <div class="pt-2 uppercase text-xs">
            Periode {{ formatDateIndo(store.params?.from) }} - {{ formatDateIndo(store.params?.to) }}
          </div>
        </div>
        
      </div>


      <div class="overflow-x-auto">
        <table class="w-full border border-gray-200 rounded-lg text-sm">
          <tbody class="divide-y divide-gray-200">

            <!-- Penjualan -->
            <tr class="bg-gray-50 font-semibold">
              <td class="px-4 py-2">Penjualan</td>
              <td class="px-4 py-2 text-right">  </td>
              <td class="px-4 py-2 text-right"> Rp. {{ formatRupiah(store?.items?.totalPenjualan) || 0 }} </td>
            </tr>

            <!-- Potongan / retur penjualan -->
            <tr>
              <td class="px-4 py-2 pl-8">Retur Penjualan</td>
              <td class="px-4 py-2 text-right">
                Rp. ({{ formatRupiah(store?.items?.totalReturPenjualan) || 0 }})
              </td>
              <td class="px-4 py-2 text-right">
                
              </td>
            </tr>

            <!-- Penjualan Bersih -->
            <tr class="bg-gray-100 font-semibold">
              <td class="px-4 py-2">Penjualan Bersih</td>
              <td class="px-4 py-2 text-right"></td>
              <td class="px-4 py-2 text-right font-bold">Rp. {{ formatRupiah(store?.items?.totalPenjualan) || 0 }}</td>
            </tr>

            <!-- Harga Pokok Penjualan -->
            <tr class="bg-gray-50 font-semibold">
              <td class="px-4 py-2">Harga Pokok Penjualan</td>
              <td class="px-4 py-2 text-right">
                Rp. ({{ formatRupiah(store?.items?.hppPenjualanBersih) || 0 }})
              </td>
            </tr>

            <!-- Laba Kotor -->
            <tr class="bg-gray-100 font-bold">
              <td class="px-4 py-2">Laba Kotor</td>
              <td class="px-4 py-2"></td>
              <td class="px-4 py-2 text-right">Rp. {{ formatRupiah(store?.items?.labaKotor) || 0 }}</td>
            </tr>

            <!-- Biaya Operasional -->
            <tr class="bg-gray-50 font-semibold">
              <td class="px-4 py-2">Beban & Biaya</td>
              <td class="px-4 py-2 text-right">
                
              </td>
              <td class="px-4 py-2 text-right ">
                
              </td>
            </tr>
            <tr v-for="(it, idx) in store.items?.rincianbeban" :key="idx">
              <td class="px-4 py-2 pl-8">- {{ it?.nama_beban }}</td>
              <td class="px-4 py-2 text-right">
                Rp. {{ formatRupiah(it?.subtotal) || 0 }}
              </td>
              <td class="px-4 py-2 text-right">
                
              </td>
            </tr>

            <tr class="bg-gray-50 font-semibold">
              <td class="px-4 py-2">TotalBeban & Biaya</td>
              <td class="px-4 py-2 text-right">
                
              </td>
              <td class="px-4 py-2 text-right ">
                Rp. ({{ formatRupiah(store?.items?.totalbeban) || 0 }})
              </td>
            </tr>


            <!-- Laba Usaha -->
            <tr class="bg-gray-100 font-bold">
              <td class="px-4 py-2">Laba Usaha</td>
              <td class="px-4 py-2 text-right"></td>
              <td class="px-4 py-2 text-right"></td>
            </tr>

            <!-- Pendapatan Lain-lain -->
            <tr>
              <td class="px-4 py-2 pl-8">Pendapatan Lain-lain</td>
              <td class="px-4 py-2 text-right">Rp. 0</td>
              <td class="px-4 py-2 text-right"></td>
            </tr>

            <!-- Biaya Lain-lain -->
            <!-- <tr>
              <td class="px-4 py-2 pl-8">Biaya Lain-lain</td>
              <td class="px-4 py-2 text-right text-red-600">
                (dddd)
              </td>
            </tr> -->

            <!-- Laba Bersih -->
            <tr class="bg-green-100 font-bold">
              <td class="px-4 py-2">Laba Bersih</td>
              <td class="px-4 py-2 text-right"></td>
              <td class="px-4 py-2 text-right">Rp. {{ formatRupiah(store?.items?.labaBersih) || 0 }}</td>
            </tr>

          </tbody>
        </table>
      </div>  




      
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
import { useLaporanLabarugiStore } from "@/stores/laporan/labarugi"
import { useAppStore } from "@/stores/app"


import Pagination from "./Pagination.vue"
import PerPage from "./PerPage.vue"

const store = useLaporanLabarugiStore()
const app = useAppStore()


onMounted(store.fetchData)




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
