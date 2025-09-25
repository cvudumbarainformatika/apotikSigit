<template>
  <div class="w-full rounded-xl p-4">
    <!-- pakai class Tailwind untuk height -->
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
  CategoryScale,
  LinearScale,
  LineController
} from 'chart.js'

// Registrasi Chart.js modules
Chart.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, LineController)

const props = defineProps({
  labels: {
    type: Array,
    default: () => ['Jan', 'Feb', 'Mar', 'Apr']
  },
  datasets: {
    type: Array,
    default: () => [
      {
        label: 'Sample',
        data: [10, 20, 30],
        borderColor: '#3B82F6',      // default: blue-500
        backgroundColor: '#3B82F680',
        tension: 0.3
      }
    ]
  },
  heightClass: {
    type: String,
    default: 'h-64'   // default tinggi 16rem
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
    type: 'line',
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

// Re-render chart saat props berubah
watch(() => [props.labels, props.datasets, props.options], () => {
  renderChart()
}, { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>
