<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Belum Ada Data'
  },
  
  subtitle: {
    type: String,
    default: 'Silahkan tambahkan data terlebih dahulu / Lakukan Pencarian Data dengan Kata Kunci yang Sesuai'
  },
  icon: {
    type: String,
    default: 'layers'
  },
})

const iconSize = computed(() => {
  return window.innerWidth < 640 ? 'w-16 h-16' : 'w-20 h-20'
})
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full h-full min-h-[400px] p-4 relative overflow-hidden rounded-2xl">
    <!-- Animated background gradient -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-gray-500 via-secondary to-gray-100/50 animate-gradient">
    </div>

    <!-- Decorative circles -->
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-30 dark:opacity-20">
      <div class="absolute inset-0 border-2 border-background rounded-full animate-pulse">
      </div>
      <div class="absolute inset-8 border border-white rounded-full animate-ping"></div>
    </div>

    <!-- Content container -->
    <div class="relative z-5 flex flex-col items-center space-y-6 text-center max-w-lg mx-auto">
      <!-- Icon with glowing effect -->
      <div class="relative">
        <div class="absolute inset-0 bg-background opacity-20 blur-xl rounded-full animate-pulse"></div>
        <u-icon :name="icon" stroke-width="1"
          :class="[iconSize, 'text-light-primary transform transition-all duration-700 hover:scale-110 hover:text-primary-hover ']" />
      </div>

      <!-- Message -->
      <div class="text-md sm:text-lg font-medium text-light-primary opacity-70 dark:text-gray-200 tracking-wide">
        {{ title }}
      </div>

      <!-- Optional description -->
      <p v-if="subtitle" class="text-xs sm:text-xs opacity-70 text-primary dark:text-gray-400">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.animate-gradient {
  background-size: 400% 400%;
  animation: gradient 8s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>
