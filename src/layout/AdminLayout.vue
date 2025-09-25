<script setup>
import { ref, defineAsyncComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInactivityLogout } from './useInactivityLogout'

import { useSatuanStore, useJabatanStore } from '@/stores/template/register'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const HeaderMenu = defineAsyncComponent(() => import('./HeaderMenu.vue'))

const storeSatuan = useSatuanStore()
const storeJabatan = useJabatanStore()
const app = useAppStore()


useInactivityLogout()

onMounted(() => {
  storeSatuan.per_page = 100
  storeJabatan.per_page = 100

  Promise.all([
    app.fetchData(),
    storeSatuan.fetchAll(),
    storeJabatan.fetchAll()
  ])
})

</script>

<template>
  <div class="flex h-screen overflow-hidden text-sm">
    
    <!-- Main Content -->
    <main class="flex-1 px-2 pt-[65px] pb-2 overflow-hidden flex justify-center bg-secondary dark:bg-gray-900" >
      <HeaderMenu v-once />
      <div class="flex-1 overflow-hidden flex mx-auto bg-background text-gray-800 dark:text-gray-100 rounded-3xl"
        style="box-shadow: inset 0 5px 5px rgba(0,0,0,0.3), inset 0 -5px 5px rgba(0,0,0,0.2)"
      >
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Custom Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 4px;
  transition: background-color 0.2s;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}

.dark ::-webkit-scrollbar-thumb {
  background-color: rgba(75, 85, 99, 0.5);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background-color: rgba(75, 85, 99, 0.7);
}


</style>
