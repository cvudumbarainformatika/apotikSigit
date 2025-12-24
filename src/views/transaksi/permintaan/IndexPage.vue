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
import { computed, nextTick, onMounted } from 'vue'
import { defineAsyncComponent } from 'vue'
import { useMutasiStore } from '@/stores/template/register'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { ref } from 'vue'
import { api } from '@/services/api'
import { getYearEndDate, getYearStartDate } from '@/utils/dateHelper'
const BaseTransaksi = defineAsyncComponent(() => import('@/components/templates/BaseTransaksi.vue'))
const FormPage = defineAsyncComponent(() => import('./FormPage.vue'))
const ListPage = defineAsyncComponent(() => import('./ListPage.vue'))


const app = useAppStore()
const store = useMutasiStore()
const route = useRoute()
const title = computed(() => route?.meta?.title)
const loading = ref(false)
const company = computed(() => {
  return app?.form || null
})
const cabangList = ref([])
// onMounted(() => {
//   // console.log('Mounted ', title.value);
//   store.status = null
//   store.per_page = 20
//   store.tujuan = ''
//   store.dari = ''
//   Promise.all([
//     store.fetchAll(),
//     // console.log('store', store.items)
//   ])
// })
onMounted(async () => {
  store.items = []
  await app.fetchData()
  await loadCabang()
})
async function loadCabang() {
  loading.value = true
  try {
    const response = await api.get('/api/v1/transactions/mutasi/get-cabang')
    if (response.status === 200) {
      // const allcabang = response.data
      // cabangList.value = allcabang.data.filter(a => a.kodecabang === kodetoko.value).map(c => c.kodecabang)
      // console.log('cabangList', cabangList.value);
      // await nextTick()
      // const payload = {
      //     from: getYearStartDate(),
      //     to: getYearEndDate(),
      //     dari: cabangList.value,
      //     status: '2'
      // }
      // Promise.all([
      const allcabang = response.data?.data
      const mainCabang = allcabang.find(
        c => c.kodecabang === company.value?.kode_toko
      )

      if (!mainCabang) {
        cabangList.value = []
        return
      }
      const targetUrl = mainCabang.url
      cabangList.value = allcabang.filter(
        c => c.url === targetUrl
      ).map(c => c.kodecabang)
      // const allcabang = response.data
      // cabangList.value = allcabang.data.filter(a => a.kodecabang === kodetoko.value).map(c => c.kodecabang)
      console.log('cabangList', cabangList.value);
      await nextTick()
      store.range.start_date = getYearStartDate()
      store.range.end_date = getYearEndDate()
      store.status = null
      store.dari = [company.value?.kode_toko]
      store.tujuan = ''
      await store.fetchAll()
    }
  } catch (err) {
    console.error('Gagal load cabang:', err)
    err.message || 'Gagal memuat data cabang'
  } finally {
    loading.value = false
  }
}

</script>