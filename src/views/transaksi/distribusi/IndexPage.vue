<template>
    <base-transaksi :title="title" :titleKanan="`Riwayat Permintaan Cabang`" :store="store">
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
</template>
<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { defineAsyncComponent } from 'vue'
import { useMutasiStore } from '@/stores/template/register'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getYearEndDate, getYearStartDate } from '@/utils/dateHelper'
import { api } from '@/services/api'

const BaseTransaksi = defineAsyncComponent(() => import('@/components/templates/BaseTransaksi.vue'))
const FormPage = defineAsyncComponent(() => import('./FormPage.vue'))
const ListPage = defineAsyncComponent(() => import('./ListPage.vue'))

const store = useMutasiStore()
const route = useRoute()
const title = computed(() => route?.meta?.title+(route.path.split('/')[2]=='gudang'?' Gudang':' Depo'))
const today = new Date().toISOString().split('T')[0]
const loading = ref(false)
const cabangList = ref([])
const app = useAppStore()

const company = computed(() => {
    return app?.form || null
})
const kodetoko = computed(() => {
    return company.value?.kode_toko || null
})

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
    store.form=null
    console.log('route berubah:', oldPath, '→', newPath, depo)
  }
)
async function gantiRoute() {
    const depoTar = allcabang.find( c => c.kodecabang === company.value?.kode_toko)
    const gudang=allcabang.find(c => c.kodecabang === 'APS0000')
    const target= depo == 'gudang' ? gudang.kodecabang : depoTar.kodecabang
    await nextTick()
    store.range.start_date = getYearStartDate()
    store.range.end_date = getYearEndDate()
    store.status = 'all'
    store.tujuan = [target]
    store.dari = ''
    await store.fetchAll()
}
async function loadCabang() {
    loading.value = true
    try {
        const response = await api.get('/api/v1/transactions/mutasi/get-cabang')
        if (response.status === 200) {
            allcabang = response.data?.data
            await gantiRoute()
            // const mainCabang = allcabang.find(
            //     c => c.kodecabang === company.value?.kode_toko
            // )
            // if (!mainCabang) {
            //     cabangList.value = []
            //     return
            // }
            // const targetUrl = mainCabang.url
            // cabangList.value = allcabang.filter(
            //     c => c.url === targetUrl
            // ).map(c => c.kodecabang)
            
            // await nextTick()
            // store.range.start_date = getYearStartDate()
            // store.range.end_date = getYearEndDate()
            // store.status = '1'
            // store.tujuan = cabangList.value
            // store.dari = ''
            // await store.fetchAll()
        }
    } catch (err) {
        console.error('Gagal load cabang:', err)
        err.message || 'Gagal memuat data cabang'
    } finally {
        loading.value = false
    }
}




</script>