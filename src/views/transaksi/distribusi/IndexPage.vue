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
import { computed, nextTick, onMounted, ref } from 'vue'
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
const title = computed(() => route?.meta?.title)
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
async function loadCabang() {
    loading.value = true
    try {
        const response = await api.get('/api/v1/transactions/mutasi/get-cabang')
        if (response.status === 200) {
            const allcabang = response.data
            cabangList.value = allcabang.data.filter(a => a.kodecabang === kodetoko.value).map(c => c.kodecabang)
            console.log('cabangList', cabangList.value);
            await nextTick()
            const payload = {
                from: getYearStartDate(),
                to: getYearEndDate(),
                tujuan: cabangList.value,
                status: '1'
            }
            console.log('payload', payload);
            // Promise.all([
            await store.fetchAll(payload)
        }
    } catch (err) {
        console.error('Gagal load cabang:', err)
        err.message || 'Gagal memuat data cabang'
    } finally {
        loading.value = false
    }
}




</script>