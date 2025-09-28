<template>
  <base-master :title="title" :store="store" :showOpnameButton="true" :showMonthButton="true" :showAddButton="false"
    :onRange="handleRange" :onRefresh="handleRefresh" :onTriger="handleOpname">
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

  </base-master>
</template>

<script setup>
import { defineAsyncComponent, onMounted, computed, ref, onBeforeMount } from 'vue'
import { useKartuStokStore } from '@/stores/template/register'
import { useRoute } from 'vue-router'
import { inject } from 'vue'
import BaseMaster from '@/components/templates/BaseMaster.vue'
import LoaderItem from './LoaderItem.vue'
import { api } from '@/services/api'
import { useNotificationStore } from '@/stores/notification'
const $confirm = inject('confirm')

const notify = useNotificationStore().notify
const ListComp = defineAsyncComponent(() => import('./ListComp.vue'))
const ModalForm = defineAsyncComponent(() => import('./ModalDetail.vue'))
const store = useKartuStokStore()
const route = useRoute()
const title = computed(() => route.meta.title)
const dateRange = ref({})
onMounted(async () => {
  store.per_page = 100
  Promise.all([
    handleRange(),
    getCurrentDate()
  ])
})
// function toLocalDateString(date) {
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
// }
const getCurrentDate = () => {
  const now = new Date()
  // const start = new Date(now.getFullYear(), now.getMonth(), 1)
  // const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  // store.range = {
  //   start_date: toLocalDateString(bulan),
  //   end_date: toLocalDateString(tahun),
  // }
  const bulan = String(now.getMonth() + 1).padStart(2, '0')
  const tahun = now.getFullYear()
  // console.log('start', start)
  // console.log('end', end)
  store.range = {
    start_date: bulan,
    end_date: tahun,
  }
}
const handleRange = async () => {
  // console.log('handleRange', store.range);
  const params = {
    bulan: store.range?.start_date,
    tahun: store.range?.end_date,
    q: store.q,
    page: store.page,
    per_page: store.per_page,
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
  }
  // console.log('items', store.items);
}
function handleRefresh() {
  // console.log('Refresh List')
  handleRange()
}

async function handleOpname() {
  const ok = await $confirm({
    message: 'Yakin ingin membuat data opname stok?',
  })
  if (ok) {
    // console.log('Confirmed delete')
    try {
      store.loading = true
      const response = await api.post(`api/v1/transactions/opname/simpan`, {
        bulan: store.range?.start_date,
        tahun: store.range?.end_date,
      })
      if (response) {
        console.log('Opname berhasil', response.data)
        handleRange()
        notify({ message: response.data.message ?? 'Berhasil Opname', type: 'success' })
      }
    } catch (error) {
      console.error('Error membuat opname stok:', error)
      notify({ message: error.message ?? 'Gagal Opname', type: 'error' })
    } finally {
      store.loading = false
    }
  }

}
</script>
