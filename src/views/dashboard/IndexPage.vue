<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from 'vue'
import { formatRupiah } from '@/utils/numberHelper'

// const LineChart = defineAsyncComponent(() => import('@/components/templates/chart/LineChart.vue'))
const BaseChart = defineAsyncComponent(() => import('@/components/templates/chart/BaseChart.vue'))

onMounted(() => {
  // store.fetchAll()
})

const stats = computed(() => {
  return [
    { 
      label: 'Total Penjualan', 
      jumlah: formatRupiah(9000000), 
      persentase: '+' + '%',
      trend: '📈 📉' 
    },
    { 
      label: 'Trans Penjualan', 
      jumlah: formatRupiah(256), 
      persentase: '+' + '%',
      trend: '📈 📉' 
    },
    { 
      label: 'Total Pembelian', 
      jumlah: formatRupiah(6000000), 
      persentase: '+' + '%',
      trend: '📈 📉' 
    },
    { 
      label: 'Trans Pembelian', 
      jumlah: formatRupiah(50), 
      persentase: '+' + '%',
      trend: '📈 📉' 
    },
  ]
})

</script>

<template>
  <u-page>
    
    <u-view flex1 scrollY>
      <u-col flex1  class="">
        <!-- <div class="font-medium">Color Palette</div> -->
        <u-title class="text-lg" label="Dashboard" />

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 w-full">
          <u-card v-for="(stat, i) in stats" :key="i" >
            <u-text size="xs" class="font-normal">{{ stat?.label }}</u-text>
            <u-row>
              <u-text size="xs" class="font-normal">Rp. </u-text>
              <u-text size="xl" class="font-bold">{{ stat?.jumlah }} </u-text>
            </u-row>
            <u-row>
              <u-text size="md" class="font-bold"> + 10% </u-text>
              <u-text size="xl" class="font-bold"> 📈 📉</u-text>
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
              <base-chart 
                type="bar" 
                :labels="['Jn', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des']"
                :datasets="[
                  { 
                    data: [10000000, 2000000, 3000000, 12000000, 5000000, 6000000, 7000000, 8000000, 9000000, 10000000, 11000000, 2000000],
                    label: 'Penjualan',
                    borderColor: '#0044B8',
                    backgroundColor: '#0044B880',
                    borderRadius: 5,
                    borderWidth: 1,
                    tension: 0.4
                  },
                  { 
                    data: [11000000, 12000000, 1000000, 2000000, 5000000, 8000000, 3000000, 5000000, 6000000, 2000000, 1000000, 200000],
                    label: 'Pembelian',
                    borderColor: '#E9053E',
                    backgroundColor: '#E9053E80',
                    borderRadius: 5,
                    borderWidth: 1,
                    tension: 0.4
                  }
                ]"
                height-class="h-80"
              />
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
              <u-text size="md" class="font-light" color="text-gray-500">Grafik Penjualan & Pembelian (5 Hari Terakhir)</u-text>
            </u-row>

            <div class="">
              <BaseChart 
                type="line" 
                :labels="['2025-01-01', '2025-01-02', '2025-01-03', '2025-01-04', '2025-01-05']"
                :datasets="[
                  { 
                    data: [2000000, 3000000, 9000000, 10000000, 11000000],
                    label: 'Penjualan',
                    borderColor: '#0044B8',
                    tension: 0.4
                  },
                  { 
                    data: [5000000, 200000, 1000000, 600000, 1000],
                    label: 'Pembelian',
                    borderColor: '#E9053E',
                    tension: 0.4
                  }
                ]"
                height-class="h-80"
              />
              <!-- <div v-if="chartData?.labels?.length">
                <LineCart :chart-data="chartData" :chart-options="chartOptions" />
              </div>
              <div v-else class="text-center text-gray-400 text-sm py-8">
                Belum ada data grafik untuk ditampilkan
              </div> -->
            </div>
          
          </u-card>

          <u-card padding="p-0" class="col-span-1 md:col-span-4 w-full">
            <u-row class="px-4 pt-4">
              <u-text size="md" class="font-light" color="text-gray-500">Top 5 Fast Move Product (Obat) Bulan Ini</u-text>
            </u-row>

            <div class="">
              <BaseChart
                type="polarArea"
                :labels="['Paracetamol', 'Antibody', 'Dextamin', 'Caroutine', 'Aspirin']"
                :datasets="
                [
                  {
                    label: 'Top Product',
                    data: [100, 88, 60, 40, 80],
                    backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
                  }
                ]"
                height-class="h-80"
              />
            </div>
          </u-card>

          <u-card padding="p-0" class="col-span-1 md:col-span-4 w-full">
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
          </u-card>

          <u-card padding="p-0" class="col-span-1 md:col-span-4 w-full">
            <u-row class="px-4 pt-4">
              <u-text size="md" class="font-light" color="text-gray-500">Top 5 PBF (Bulan Ini)</u-text>
            </u-row>

            <div class="">
              <BaseChart
                type="bar"
                :labels="['PT. Aaaa', 'PT. Bbbb', 'PT. Cccc', 'PT. Dddd', 'PT. Eeee']"
                :datasets="
                [
                  {
                    label: 'Top 5 PBF',
                    data: [600, 800, 300, 2, 100],
                    backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
                  }
                ]"
                height-class="h-80"
              />
            </div>
          </u-card>
        </div>
          
      </u-col>


     

    </u-view>
    
   

  </u-page>
</template>

<style scoped>


</style>
