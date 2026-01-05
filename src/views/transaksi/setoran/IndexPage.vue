<template>
   <base-transaksi :title="title" :titleKanan="`Riwayat ${title}`" :store="store">
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
        <u-empty :title="store.emptyTitle" subtitle="Belum Ada Data Order pada Periode Ini" v-else-if="!store.loading && !store.items.length" />
      </template>
    </template>
  </base-transaksi>
</template>
<script setup>
  import { computed, defineAsyncComponent, onMounted } from 'vue';
  import { useRoute } from 'vue-router'
import ListPage from './ListPage.vue';
import FormPage from './FormPage.vue';
import { useSetoranStore } from '@/stores/template/register';
const BaseTransaksi = defineAsyncComponent(() => import('@/components/templates/BaseTransaksi.vue'))
  
  const store = useSetoranStore()
  const route = useRoute()
  const title = computed(() => route?.meta?.title)
  const today = new Date().toISOString().split('T')[0]
  onMounted(() => {
 
  store.per_page = 20
  store.range.start_date = today
  store.range.end_date = today
  // Promise.all([
    store.fetchAll()
  // ])
  
})
</script>