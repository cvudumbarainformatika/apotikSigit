<template>
  <base-transaksi :title="title" :titleKanan="`Riwayat ${title}`" :store="store">
    <template #kiri>
      <FormPage :store="store" :title="title" :mode="store.mode" :filteredCabang="ListCabang"/>
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
import { computed, nextTick, onMounted, watch } from 'vue'
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
const title = computed(() => route?.meta?.title+(route.path.split('/')[2]=='gudang'?' Gudang':' Depo'))
const loading = ref(false)
const company = computed(() => {
  return app?.form || null
})
const cabangList = ref([])
const ListCabang = ref([])

onMounted(async () => {
  store.items = []
  await app.fetchData()
  await loadCabang()  
})
let depo=route.path.split('/')[2]
let allcabang =null
watch(
  () => route.path,
  (newPath, oldPath) => {
    // aksi di sini
    depo=route.path.split('/')[2]
    gantiRoute()
    console.log('route berubah:', oldPath, '→', newPath, depo)
  }
)
async function gantiRoute(val){
  const mainCabang = allcabang.find(
        c => c.kodecabang === company.value?.kode_toko
      )
      if (!mainCabang) {
        cabangList.value = []
        return
      }
      const gudang=allcabang.find(c => c.kodecabang === 'APS0000')
      const targetUrl = depo == 'gudang' ? gudang.url : mainCabang.url
      const dari = depo == 'gudang' ? 'APS0000' : company.value?.kode_toko
      ListCabang.value=allcabang.filter( c => c.kodecabang !== dari)
      cabangList.value = allcabang.filter(
        c => c.url === targetUrl
      ).map(c => c.kodecabang)
      console.log('cabangList', cabangList.value,targetUrl);
      await nextTick()
      store.range.start_date = getYearStartDate()
      store.range.end_date = getYearEndDate()
      store.status = 'all'
      store.dari = [dari]
      store.tujuan = ''

      if(!val)store.fetchAll()
}
async function loadCabang() {
  loading.value = true
  try {
    const response = await api.get('/api/v1/transactions/mutasi/get-cabang')
    if (response.status === 200) {
      allcabang = response.data?.data
      await gantiRoute('load')
      // console.log('cabangList', cabangList.value,targetUrl);
      // 
      // store.range.start_date = getYearStartDate()
      // store.range.end_date = getYearEndDate()
      // store.status = 'all'
      // store.tujuan = ''
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