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
            <u-input-search v-model="store.q" @update:modelValue="setSearch" :debounce="500" />
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
          <u-btn-icon v-if="showPrintButton" icon="print" tooltip="Print" v-print="printObj" />
        </u-row>

        <u-row>
          <u-btn-icon v-if="showReport && masterGagal.length" icon="warning" tooltip="Simpan Ulang" @click="onTrigerReport" />
        </u-row>
        <u-row>
          <u-select v-if="showMonthButton" label="Pilih Bulan" v-model="store.range.start_date" :options="bulans"
            @update:modelValue="onRange" />
        </u-row>
        <u-row>
          <u-select v-if="showMonthButton" label="Pilih Tahun" v-model="store.range.end_date" :options="generateTahuns"
            @update:modelValue="onRange" />
        </u-row>
        <u-row>
          <u-btn-icon v-if="showOpnameButton && auth.user?.username === 'sa'" icon="download" tooltip="Opname"
            @click="onTriger" />
        </u-row>
      </u-row>
      <u-row right justify-self-end class="gap-2">
        <u-row>
          <u-select v-if="showCabangButton" label="Pilih Cabang" v-model="store.depo" :options="optionCabang" @update:modelValue="onCabang" />
        </u-row>
        <u-date-range v-if="showDateButton" v-model="store.range" @update:modelValue="onRange" default-period="month" />
        <order-by v-if="showOrder" :fields="store.orders" v-model="store.order" label="Urut By"
          @update:model-value="onSortChange" />
      </u-row>
    </u-view>

    <!-- Content -->

    <u-view ref="uViewRef" class="w-full relative" flex1 scrollY>

      <!-- <div class="absolute inset-0 top-12">
        <u-load-spinner></u-load-spinner>
      </div> -->
      <div v-if="store.loading" class="w-full">
        <slot name="loading">
          <u-load-spinner></u-load-spinner>
        </slot>
      </div>
      <u-list v-else-if="store.items.length" :items="store.items" :loadingDeletes="store.loadingDeletes">
        <template #item="{ item }">
          <slot name="item" :item="item" />
        </template>
      </u-list>
      <u-empty :title="store.emptyTitle" :subtitle="store.emptySubtitle"
        v-else-if="!store.loading && !store.items.length" />
      <!-- ⬇️ Loading indicator ketika fetchMore aktif dan ketika mode loadMore -->
      <u-load-spinner v-if="store.loadingMore && isLoadMore" />

    </u-view>
    <div id="printArea" class="print-only">
      <slot name="print" />
    </div>
    <div id="printAreax" v-if="printContent" v-html="printContent" class="print-only"></div>
    <!-- modal form -->
    <slot name="modal-form" />
  </u-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useScroll } from '@vueuse/core'
import OrderBy from './OrderBy.vue'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { api } from '@/services/api'


const auth = useAuthStore()
const printContent = ref('')
const props = defineProps({
  store: { type: Object, required: true },
  title: { type: String, default: 'Data' },
  isLoadMore: { type: Boolean, default: true },
  showAddButton: { type: Boolean, default: true }, // baris ini Tambahkan agar bisa memilih false/true
  showDateButton: { type: Boolean, default: false },
  showMonthButton: { type: Boolean, default: false },
  showCabangButton: { type: Boolean, default: false },
  showOrder: { type: Boolean, default: false },
  showOpnameButton: { type: Boolean, default: false },
  showPrintButton: { type: Boolean, default: false },
  showReport: { type: Boolean, default: false },
  onAdd: Function, // ✅ supaya tidak error saat dipanggil
  onRefresh: Function, // ✅ hanya dipanggil kalau diberikan
  onRange: Function, // ✅ hanya dipanggil kalau diberikan
  onCabang: Function, // ✅ hanya dipanggil kalau diberikan
  onTriger: Function, // ✅ hanya dipanggil kalau diberikan
  onTrigerReport: Function, // ✅ hanya dipanggil kalau diberikan
})

const emit = defineEmits(['close', 'save'])
const loading = ref(false)
const cabangList = ref([])
const uViewRef = ref()
const app = useAppStore()
const company = computed(() => {
  return app?.form || null
})
onMounted(async () => {
  await app.fetchData()
  await loadMasterGagal()
  await loadCabang()
  if (props?.onRange) {
    if (!props.store.range.start_date) {
      props.store.range.start_date = bulanSekarang
    }
    if (!props.store.range.end_date) {
      props.store.range.end_date = tahunSekarang.toString()
    }
  }
})
watch(
  () => uViewRef.value?.arrivedState?.bottom,
  (val) => {
    // console.log('on bottom', val);
    if (val && !props.store.loadingMore && props.store?.page < props.store?.meta?.last_page) {
      props.store?.fetchMore()

    }
  }
)


const now = new Date()
const bulanSekarang = String(now.getMonth() + 1).padStart(2, '0')
const tahunSekarang = now.getFullYear()
const bulans = computed(() => [
  { label: 'Januari', value: '01' },
  { label: 'Februari', value: '02' },
  { label: 'Maret', value: '03' },
  { label: 'April', value: '04' },
  { label: 'Mei', value: '05' },
  { label: 'Juni', value: '06' },
  { label: 'Juli', value: '07' },
  { label: 'Agustus', value: '08' },
  { label: 'September', value: '09' },
  { label: 'Oktober', value: '10' },
  { label: 'November', value: '11' },
  { label: 'Desember', value: '12' },
])

const generateTahuns = computed(() => {
  const tahuns = []
  for (let i = tahunSekarang - 2; i <= tahunSekarang + 2; i++) {
    tahuns.push({ label: i.toString(), value: i })
  }
  return tahuns
})


const optionCabang = computed(() => {
  return cabangList.value.map(c => ({
    value: c.kodecabang,
    label: c.namacabang
  }))
})


watch(
  () => company.value?.kode_toko,
  (kodeToko) => {
    if (!kodeToko) return

    if (!props.store.depo) {
      props.store.depo = kodeToko
    }
  },
  { immediate: true }
)

function onSortChange(qs) {
  // console.log('onSortChange', qs);
  props.store.setOrder(qs)

}
function setSearch(){
  props.store.page = 1
  const params = {
    depo: props.store.depo,
    
  }
  props.store.fetchAll(params)
}


async function loadCabang() {
  loading.value = true
  try {
    const response = await api.get('/api/v1/transactions/mutasi/get-cabang')
    if (response.status === 200) {
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
      )

    }
  } catch (err) {
    console.error('Gagal load cabang:', err)
    err.message || 'Gagal memuat data cabang'
  } finally {
    loading.value = false
  }
}
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


const masterGagal = ref([])
async function loadMasterGagal() {
  loading.value = true
  try {
    const response = await api.get('/api/v1/master/curl/all-failed')
    if (response.status === 200) {
      masterGagal.value = response.data?.data

    }
  } catch (err) {
    console.error('Gagal load:', err)
    err.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

</script>
<style>
/* ✅ Sembunyikan area print saat tampilan biasa */
.print-only {
  display: none;
}

/* ✅ Tampilkan area print hanya saat print */
@media print {

  .print-only,
  #printAreax {
    display: block !important;
  }

  /* ✅ Sembunyikan semua elemen lain kecuali area print utama DAN area print modal */
  body *:not(.print-only):not(.print-only *):not(#printAreax):not(#printAreax *) {
    display: none !important;
  }

  /* ✅ Pastikan area cetak tampil normal */
  #printAreax {
    position: relative !important;
    visibility: visible !important;
    background: white !important;
    color: black !important;
    z-index: 999999 !important;
  }

  /* ✅ Biar hasil print bersih */
  body {
    background: white !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>
