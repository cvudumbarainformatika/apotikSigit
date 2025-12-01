<script setup>
import { defineAsyncComponent, onMounted, computed, ref } from 'vue'
import { useStockStore } from '@/stores/template/register'
import { useRoute } from 'vue-router'
import { inject } from 'vue'
const $confirm = inject('confirm')
import BaseMaster from '@/components/templates/BaseMaster.vue'
import LoaderItem from './LoaderItem.vue'
const ListComp = defineAsyncComponent(() => import('./ListComp.vue'))
const CetakData = defineAsyncComponent(() => import('./CetakData.vue'))

const store = useStockStore()
const route = useRoute()
const title = computed(() => route.meta.title)

onMounted(() => {
  console.log('Mounted ', title.value);

  store.per_page = 100
  Promise.all([
    store.fetchAll(),
    // console.log('Refresh List', store.items)
  ])
})

function handleRefresh() {
  // console.log('Refresh List')
  store.fetchAll()
  // console.log('Refr', store.items)
}
</script>

<template>
  <base-master :title="title" :store="store" :showPrint="true" :showPrintButton="true" :showAddButton="false"
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
