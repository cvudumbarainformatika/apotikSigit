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
                <u-empty :title="store.emptyTitle" subtitle="Belum Ada Data Order pada Periode Ini"
                    v-else-if="!store.loading && !store.items.length" />
            </template>
        </template>
    </base-transaksi>
</template>
<script setup>
import { computed, onMounted } from 'vue'
import { defineAsyncComponent } from 'vue'
import { usePenerimaanStore } from '@/stores/template/register'
import { useRoute } from 'vue-router'

const BaseTransaksi = defineAsyncComponent(() => import('@/components/templates/BaseTransaksi.vue'))
const FormPage = defineAsyncComponent(() => import('./FormPage.vue'))
const ListPage = defineAsyncComponent(() => import('./ListPage.vue'))



const store = usePenerimaanStore()
const route = useRoute()
const title = computed(() => route?.meta?.title)

onMounted(() => {
    // console.log('Mounted ', title.value);

    store.per_page = 20
    Promise.all([
        store.fetchAll(),
    ])
})

</script>