<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from 'vue'
import { formatRupiah } from '@/utils/numberHelper'
import { useDashboardStore } from '@/stores/dashboard'

// const LineChart = defineAsyncComponent(() => import('@/components/templates/chart/LineChart.vue'))
const BaseChart = defineAsyncComponent(() => import('@/components/templates/chart/BaseChart.vue'))


const store = useDashboardStore()

onMounted(() => {
  // store.fetchAll()
  store.getDateMonth()
    .then(() => {
      Promise.all([
        store.fetchFastMoving(),
        store.fetchPbf(),
        store.fetchDataTahunIni(),
        store.fetchDataHariIni(),
      ])
    })

})

const stats = computed(() => {
  return [
    {
      label: 'Total Penjualan',
      jumlah: formatRupiah(store.harian?.penjualan?.total_penjualan?.hari_ini || 0) || formatRupiah(0),
      trend_persentase: store.harian?.penjualan?.total_penjualan?.status === 'naik' ? '+'
        : store.harian?.penjualan?.total_penjualan?.status === 'turun' ? '-' : '',
      persentase: store.harian?.penjualan?.total_penjualan?.persentase_perubahan || 0,
      trend: store.harian?.penjualan?.total_penjualan?.status === 'naik' ? '📉'
        : store.harian?.penjualan?.total_penjualan?.status === 'turun' ? '📈' : '-'
    },
    {
      label: 'Trans Penjualan',
      jumlah: formatRupiah(store.harian?.penjualan?.jumlah_transaksi?.hari_ini || 0) || formatRupiah(0),
      trend_persentase: store.harian?.penjualan?.jumlah_transaksi?.status === 'naik' ? '+'
        : store.harian?.penjualan?.jumlah_transaksi?.status === 'turun' ? '-' : '',
      persentase: store.harian?.penjualan?.jumlah_transaksi?.persentase_perubahan || 0,
      trend: store.harian?.penjualan?.jumlah_transaksi?.status === 'naik' ? '📉'
        : store.harian?.penjualan?.jumlah_transaksi?.status === 'turun' ? '📈' : '-'
    },
    {
      label: 'Total Pembelian',
      jumlah: formatRupiah(store.harian?.pembelian?.total_penerimaan?.hari_ini || 0) || formatRupiah(0),
      trend_persentase: store.harian?.pembelian?.total_penerimaan?.status === 'naik' ? '+'
        : store.harian?.pembelian?.total_penerimaan?.status === 'turun' ? '-' : '',
      persentase: store.harian?.pembelian?.total_penerimaan?.persentase_perubahan || 0,
      trend: store.harian?.pembelian?.total_penerimaan?.status === 'naik' ? '📉'
        : store.harian?.pembelian?.total_penerimaan?.status === 'turun' ? '📈' : '-'
    },
    {
      label: 'Trans Pembelian',
      jumlah: formatRupiah(store.harian?.pembelian?.jumlah_transaksi?.hari_ini || 0) || formatRupiah(0),
      trend_persentase: store.harian?.pembelian?.jumlah_transaksi?.status === 'naik' ? '+'
        : store.harian?.pembelian?.jumlah_transaksi?.status === 'turun' ? '-' : '',
      persentase: store.harian?.pembelian?.jumlah_transaksi?.persentase_perubahan || 0,
      trend: store.harian?.pembelian?.jumlah_transaksi?.status === 'naik' ? '📉'
        : store.harian?.pembelian?.jumlah_transaksi?.status === 'turun' ? '📈' : '-'
    },
  ]
})

</script>

<template>
  <u-page>

    <u-view flex1 scrollY>
      <u-col flex1 class="">
        <!-- <div class="font-medium">Color Palette</div> -->
        <u-title class="text-lg" label="Dashboard" />

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 w-full">
          <u-card v-for="(stat, i) in stats" :key="i">
            <u-text size="xs" class="font-normal">{{ stat?.label }}</u-text>
            <u-row>
              <u-text size="xs" class="font-normal"></u-text>
              <u-text size="xl" class="font-bold">{{ stat?.jumlah }} </u-text>
            </u-row>
            <u-row>
              <u-text size="md" class="font-bold"> {{ stat?.persentase || '' }} % </u-text>
              <u-text size="xl" class="font-bold"> {{ stat?.trend || '' }}</u-text>
            </u-row>
          </u-card>
        </div>


        <!-- Charts Section -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">

          <u-card padding="p-0" class="col-span-1 md:col-span-7 w-full">

            <u-row class="px-4 pt-4">
              <u-text size="md" class="font-light" color="text-gray-500">Grafik Penjualan & Pembelian Perbulan</u-text>
            </u-row>

            <div class="">
              <base-chart type="bar"
                :labels="store.penjPblTahunIni?.label || ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des']"
                :datasets="[
                  {
                    data: store.penjPblTahunIni?.penjualan || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    label: 'Penjualan',
                    borderColor: '#0044B8',
                    backgroundColor: '#0044B880',
                    borderRadius: 5,
                    borderWidth: 1,
                    tension: 0.4
                  },
                  {
                    data: store.penjPblTahunIni?.pembelian || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    label: 'Pembelian',
                    borderColor: '#E9053E',
                    backgroundColor: '#E9053E80',
                    borderRadius: 5,
                    borderWidth: 1,
                    tension: 0.4
                  }
                ]" height-class="h-80" />
              <!-- <div v-if="chartData?.labels?.length">
                <LineCart :chart-data="chartData" :chart-options="chartOptions" />
              </div>
              <div v-else class="text-center text-gray-400 text-sm py-8">
                Belum ada data grafik untuk ditampilkan
              </div> -->
            </div>
          </u-card>


          <u-card padding="p-0" class="col-span-1 md:col-span-5 w-full">
            <u-row class="px-4 pt-4">
              <u-text size="md" class="font-light" color="text-gray-500">Grafik Penjualan & Pembelian</u-text>
            </u-row>

            <div class="">
              <BaseChart type="line"
                :labels="store.penjPblTahunIni?.label || ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des']"
                :datasets="[
                  {
                    data: store.penjPblTahunIni?.penjualan || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    label: 'Penjualan',
                    borderColor: '#0044B8',
                    tension: 0.4
                  },
                  {
                    data: store.penjPblTahunIni?.pembelian || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    label: 'Pembelian',
                    borderColor: '#E9053E',
                    tension: 0.4
                  }
                ]" height-class="h-80" />
              <!-- <div v-if="chartData?.labels?.length">
                <LineCart :chart-data="chartData" :chart-options="chartOptions" />
              </div>
              <div v-else class="text-center text-gray-400 text-sm py-8">
                Belum ada data grafik untuk ditampilkan
              </div> -->
            </div>

          </u-card>

          <u-card padding="p-0" class="col-span-1 md:col-span-6 w-full">
            <u-row class="px-4 pt-4">
              <u-text size="md" class="font-light" color="text-gray-500">Top 5 Fast Move Product (Obat) Bulan
                Ini</u-text>
            </u-row>

            <div class="">
              <BaseChart type="polarArea" :labels="store?.top5Products?.label" :datasets="[
                  {
                    label: 'Top Product',
                    data: store.top5Products?.data,
                    backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
                  }
                ]" height-class="h-80" />
            </div>
          </u-card>

          <!-- <u-card padding="p-0" class="col-span-1 md:col-span-4 w-full">
            <u-row class="px-4 pt-4">
              <u-text size="md" class="font-light" color="text-gray-500">Top 3 Dokter (Transaksi Resep) Bulan Ini</u-text>
            </u-row>

            <div class="">
              <BaseChart
                type="pie"
                :labels="['dr. Adi', 'dr. Budi', 'dr. Caca Handika']"
                :datasets="
                [
                  {
                    label: 'Top 3 Dokter',
                    data: [100, 60, 5],
                    backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
                  }
                ]"
                height-class="h-80"
              />
            </div>
          </u-card> -->

          <u-card padding="p-0" class="col-span-1 md:col-span-6 w-full">
            <u-row class="px-4 pt-4">
              <u-text size="md" class="font-light" color="text-gray-500">Top 5 PBF (Bulan Ini)</u-text>
            </u-row>

            <div class="">
              <BaseChart type="bar" :labels="store?.topPbf?.label" :datasets="[
                  {
                    label: 'Top 5 PBF',
                    data: store?.topPbf?.data,
                    backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
                  }
                ]" height-class="h-80" />
            </div>
          </u-card>
        </div>

      </u-col>




    </u-view>



  </u-page>
</template>

<style scoped></style>
