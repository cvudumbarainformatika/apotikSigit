<template>
  <div class="w-full rounded-xl shadow p-4">
    <canvas ref="canvas" :class="heightClass"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  LineController,
  BarController,
  PieController,
  DoughnutController,
  RadarController,
  PolarAreaController
} from 'chart.js'

// ✅ Daftarkan semua controller & elemen sekali saja
Chart.register(
  Title,
  Tooltip,
  Legend,
  // Line
  LineElement,
  PointElement,
  LineController,
  // Bar
  BarElement,
  BarController,
  // Pie & Doughnut
  ArcElement,
  PieController,
  DoughnutController,
  PolarAreaController,
  // Radar
  RadialLinearScale,
  RadarController,
  // Skala umum
  CategoryScale,
  LinearScale
)

const props = defineProps({
  type: {
    type: String,
    default: 'line' // line | bar | pie | doughnut | radar | polarArea
  },
  labels: {
    type: Array,
    default: () => []
  },
  datasets: {
    type: Array,
    default: () => [
      {
        label: 'Sample',
        data: [10, 20, 30],
        borderColor: '#3B82F6',      // Tailwind blue-500
        backgroundColor: '#3B82F680',
        tension: 0.3
      }
    ]
  },
  heightClass: {
    type: String,
    default: 'h-64'
  },
  options: {
    type: Object,
    default: () => ({
      responsive: true,
      maintainAspectRatio: false
    })
  }
})

const canvas = ref(null)
let chartInstance = null

const renderChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(canvas.value, {
    type: props.type,
    data: {
      labels: props.labels,
      datasets: props.datasets
    },
    options: props.options
  })
}

onMounted(() => {
  renderChart()
})

watch(() => [props.type, props.labels, props.datasets, props.options], () => {
  renderChart()
}, { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>
