<template>
  <base-laporan :title="title" :store="store" :showDateButton="true" :showAddButton="false" :onRange="handleRange"
    :onRefresh="handleRefresh">
    <!-- <template #loading>
      <LoaderItem />
    </template> -->
    <template #item="{ item }">
      <Suspense>
        <template #default>
          <list-comp :item="item" :store="store" :range="dateRange" />
        </template>
        <template #fallback>
          <LoaderItem />
        </template>
      </Suspense>
    </template>
    <!-- <template #modal-form>
      <modal-form v-if="store.modalFormOpen" v-model="store.modalFormOpen" :mode="store.item ? 'edit' : 'add'"
        :title="title" :store="store" @close="store.modalFormOpen = false" @save="handleSave" />
    </template> -->

  </base-laporan>
</template>

<script setup>
import { defineAsyncComponent, onMounted, computed, ref, onBeforeMount } from 'vue'
import { useLaporanHutangStore } from '@/stores/template/register'
import { useRoute } from 'vue-router'
import { inject } from 'vue'
import BaseLaporan from '@/components/templates/BaseLaporan.vue'
import LoaderItem from './LoaderItem.vue'
import { api } from '@/services/api'
const $confirm = inject('confirm')


const ListComp = defineAsyncComponent(() => import('./ListComp.vue'))
// const ModalForm = defineAsyncComponent(() => import('./ModalDetail.vue'))
const store = useLaporanHutangStore()
const route = useRoute()
const title = computed(() => route.meta.title)
const dateRange = ref({})
onMounted( () => {
 
  store.per_page = 100
  Promise.all([

    // store.fetchAll(),
    getCurrentDate(),
    handleRange(),
  ])
})
function toLocalDateString(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
const getCurrentDate = () => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // console.log('start', start)
  // console.log('end', end)
  store.range = {
    start_date: toLocalDateString(start),
    end_date: toLocalDateString(end),
  }
  // console.log('dateRange', store.range)
}
const handleRange = () => {
 
  const params = {
    from: store.range?.start_date,
    to: store.range?.end_date,
  }
  store.fetchAll(params)
  // console.log('handleRange', params);
  // console.log('items', store.items);
}
function handleRefresh() {
  // console.log('Refresh List')
  handleRange()
}

</script>

