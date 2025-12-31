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

onMounted(() => {
  console.log('Mounted ', title.value);

  store.per_page = 100
  Promise.all([    
    handleRange(),
    store.fetchAll(),
    // console.log('Refresh List', store.items)
  ])
})


const handleRange = async () => {
  // console.log('handleRange', store.range);
  loading.value = true
  const params = {
    bulan: store.range?.start_date,
    tahun: store.range?.end_date,
    q: store.q,
    page: store.page,
    per_page: store.per_page,
    depo: store.depo
  }
  console.log('params', params);
  store.loading = true
  store.items = []
  try {
    store.fetchAll(params)
    // const response = await api.get(`api/v1/transactions/stok/get-kartu-stok`, { params })
    // if (response) {
    //   store.items = response.data.data
    //   console.log('items params', store.items)
    // }
  } catch (error) {
    console.error('Error fetching Kartu Stok:', error)
  } finally {
    store.loading = false
    loading.value = true
  }
  // console.log('items', store.items);
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
      <LoaderItem />
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
