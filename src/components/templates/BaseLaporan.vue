<template>
    <u-page>
        <!-- Header Search & Action -->
        <u-view class="w-full" padding="pt-1 px-4">
            <u-row flex1>
                <div class="font-bold text-lg text-primary">{{ title }}</div>
            </u-row>
        </u-view>
        <u-separator />
        <u-view>

            <u-row flex1 class="w-full justify-between">
                <u-row>
                    <slot name="search">
                        <u-input-search v-model="store.q" @update:modelValue="store.setSearch" :debounce="500" />
                    </slot>
                </u-row>

                <u-row>
                    <slot name="actions">
                        <!-- <u-btn-icon tooltip="Tambah Data" @click="onAdd" /> -->
                        <u-btn-icon v-if="showAddButton" tooltip="Tambah Data" @click="onAdd" />
                        <u-btn-icon icon="rotate-cw" tooltip="Refresh" @click="onRefresh" />
                    </slot>
                </u-row>
                <u-row>
                    <u-btn-icon icon="print" tooltip="Print" v-print="printObj" />
                </u-row>
            </u-row>
            <u-row right justify-self-end class="gap-2">
                <u-date-range v-if="showDateButton" v-model="store.range" @update:modelValue="onRange"
                    default-period="month" />
            </u-row>
        </u-view>

        <!-- Content -->

        <u-view id="printArea" ref="uViewRef" class="w-full relative" flex1 scrollY>
            <!-- <div class="absolute inset-0 top-12">
        <u-load-spinner></u-load-spinner>
      </div> -->
            <div v-if="store.loading && !store.items.length" class="w-full">
                <slot name="loading">
                    <u-load-spinner></u-load-spinner>
                </slot>
            </div>
            <u-view v-else-if="store.items.length" :items="store.items" :loadingDeletes="store.loadingDeletes">
                <!-- <template #item="{ item }"> -->
                <slot name="item" />
                <!-- </template> -->
            </u-view>
            <u-empty :title="store.emptyTitle" :subtitle="store.emptySubtitle"
                v-else-if="!store.loading && !store.items.length" />
            <!-- ⬇️ Loading indicator ketika fetchMore aktif dan ketika mode loadMore -->
            <u-load-spinner v-if="store.loadingMore && isLoadMore" />
        </u-view>

        <!-- modal form -->
        <slot name="modal-form" />
    </u-page>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useScroll } from '@vueuse/core'
import { useAppStore } from '@/stores/app'

const props = defineProps({
    store: { type: Object, required: true },
    title: { type: String, default: 'Data' },
    isLoadMore: { type: Boolean, default: true },
    showAddButton: { type: Boolean, default: true }, // baris ini Tambahkan agar bisa memilih false/true
    showDateButton: { type: Boolean, default: false },
    onAdd: Function, // ✅ supaya tidak error saat dipanggil
    onRefresh: Function, // ✅ hanya dipanggil kalau diberikan
    onRange: Function, // ✅ hanya dipanggil kalau diberikan
})

const emit = defineEmits(['close', 'save'])

// Ref ke u-view
const uViewRef = ref()

// Scroll bottom watcher
watch(
    () => uViewRef.value?.arrivedState?.bottom,
    (val) => {
        // console.log('on bottom', val);
        if (val && !props.store.loadingMore && props.store?.page < props.store?.meta?.last_page) {
            props.store?.fetchMore()

        }
    }
)

const app = useAppStore()
const company = computed(() => {
    return app?.form || null
})
const printObj = {
    id: '#printArea', // ref elemen yang mau diprint
    popTitle: `${props.title} ${company.value?.nama}`,
    preview: false,
    extraCss: '',
    extraHead: '',
    beforeOpenCallback(vue) {
        console.log('wait...')
    },
    openCallback(vue) {
        console.log('opened')
    },
    closeCallback(vue) {
        console.log('closePrint')
    }
}
</script>
