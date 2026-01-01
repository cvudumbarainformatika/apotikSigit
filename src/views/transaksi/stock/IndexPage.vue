<script setup>
import { defineAsyncComponent, onMounted, computed, ref } from 'vue'
import { useStockStore } from '@/stores/template/register'
import { useRoute } from 'vue-router'
import { inject } from 'vue'
const $confirm = inject('confirm')
import BaseMaster from '@/components/templates/BaseMaster.vue'
import LoaderItem from './LoaderItem.vue'
import { useAppStore } from '@/stores/app'
const ListComp = defineAsyncComponent(() => import('./ListComp.vue'))
const CetakData = defineAsyncComponent(() => import('./CetakData.vue'))

const store = useStockStore()
const route = useRoute()
const title = computed(() => route.meta.title)
const app = useAppStore()
const loading = ref(false)

onMounted(async() => {
  await app.fetchData()
  console.log('Mounted company', company.value?.kode_toko);

  store.per_page = 100
  Promise.all([    
    handleRange(),
    store.fetchAll(),
    // console.log('Refresh List', store.items)
  ])
})
const company = computed(() => {
  return app?.form || null
})

const handleRange = async () => {
  
  const params = {
    bulan: store.range?.start_date,
    tahun: store.range?.end_date,
    q: store.q,
    page: store.page,
    per_page: store.per_page,
    depo: store.depo
  }
  store.fetchAll(params)
}

function handleRefresh() {
  const params = {
    bulan: store.range?.start_date,
    tahun: store.range?.end_date,
    q: store.q,
    page: store.page,
    per_page: store.per_page,
    depo: store.depo
  }
  // console.log('Refresh List')
  store.fetchAll(params)
  // console.log('Refr', store.items)
}

</script>

<template>
  <base-master :title="title" :store="store" :showPrintButton="true" :showAddButton="false" :showCabangButton="true" :onCabang="handleRange"
    :onRefresh="handleRefresh">
    <template #loading>
      <!-- <LoaderItem /> -->
    </template>
    <template #item="{ item }">
      <Suspense>
        <template #default>
          <list-comp :item="item" :store="store" />
        </template>
        <template #fallback>
          <LoaderItem />
        </template>
      </Suspense>
    </template>
    <template #print>
      <cetak-data :store="store" />
    </template>
  </base-master>
</template>
