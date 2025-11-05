<template>
  <base-transaksi :title="title" :titleKanan="`Riwayat ${title}`" showinfoButton :store="store" :onInfo="handleInfo">
    <template #kiri>
      <FormPage :store="store" :title="title" :mode="store.mode" />
    </template>
    <template #kanan>
      <template v-if="store.loading">
        <u-view flex1 class="flex items-center justify-center w-full">
          <u-load-spinner />
        </u-view>
      </template>
      <template v-else>
        <ListPage v-if="store.items.length" :store="store" :items="store.items" />
        <u-empty :title="store.emptyTitle" subtitle="Belum Ada Data Order pada Periode Ini"
          v-else-if="!store.loading && !store.items.length" />
      </template>
    </template>


  </base-transaksi>
  <modal-info v-model="showShortcutInfo" title="Cetak Order" @close="showShortcutInfo = false" />
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { defineAsyncComponent } from 'vue'
import { usePenjualanStore } from '@/stores/template/register'
import { useRoute } from 'vue-router'
import ModalInfo from './ModalInfo.vue'

const BaseTransaksi = defineAsyncComponent(() => import('@/components/templates/BaseTransaksi.vue'))
const FormPage = defineAsyncComponent(() => import('./FormPage.vue'))
const ListPage = defineAsyncComponent(() => import('./ListPage.vue'))


const showShortcutInfo = ref(false)
const store = usePenjualanStore()
const route = useRoute()
const title = computed(() => route?.meta?.title)
const today = new Date().toISOString().split('T')[0]
onMounted(() => {
  // console.log('Mounted ', title.value);
  
  store.per_page = 20
  store.range.start_date = today
  store.range.end_date = today
  // Promise.all([
    store.fetchAll()
  // ])
  window.addEventListener('keydown', handleGlobalShortcut)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalShortcut)
})

function handleGlobalShortcut(e) {
  if (e.ctrlKey && e.key.toLowerCase() === 'i') {
    e.preventDefault()
    handleInfo()
  }
}

function handleInfo() {
  showShortcutInfo.value = true
}

</script>