<template>
  <u-modal persistent :title="`Tambah ${title}`" @close="emit('close')">
    <template #default>
      <u-col flex1 class="w-full p-4">
        <u-row flex1 class="w-full">
          <u-input v-model="form.nama" label="Nama" :error="isError('nama')" :error-message="errorMessage('nama')" />
        </u-row>
        <u-row flex1 class="w-full">
          <u-input v-model="form.barcode" label="Kode Barcode" :error="isError('barcode')" :error-message="errorMessage('barcode')" />
        </u-row>
        <u-row flex1 class="w-full">
          <u-row>
            <u-select label="Satuan Kecil" v-model="form.satuan_k" :options="optionSatuanK" :error="isError('satuan_k')"
              :error-message="errorMessage('satuan_k')" @inputval="cariSatuanK" @update:modelValue="(val) => {
                console.log('val', val);
              }" />
          </u-row>
          <u-row>
            <u-select label="Satuan Besar" v-model="form.satuan_b" :options="optionSatuanB" :error="isError('satuan_b')"
              :error-message="errorMessage('satuan_b')" @inputval="cariSatuanB" @update:modelValue="(val) => {
                console.log('val', val);
              }" />
          </u-row>
          <u-row class="w-36">
            <u-input v-model="form.isi" type="number" label="Isi sat Bsr" :error="isError('isi')"
              :error-message="errorMessage('isi')" />
          </u-row>
        </u-row>
        <u-row flex1 class="w-full">
          <u-row>
            <u-select label="Kategori" v-model="form.kategori" :options="optionKategori" :error="isError('kategori')"
              :error-message="errorMessage('kategori')" @inputval="cariKategori" @update:modelValue="(val) => {
                console.log('val', val);

              }" />
          </u-row>
          <u-row>
            <u-select label="Rak" v-model="form.rak" :options="optionRak" @inputval="cariRak" :error="isError('rak')"
              :error-message="errorMessage('rak')" @update:modelValue="(val) => {
                console.log('val', val);

              }" />
          </u-row>
          <u-row>
            <u-select label="Merk" v-model="form.merk" :options="optionMerk" @inputval="cariMerk"  :error="isError('merk')"
              :error-message="errorMessage('merk')" @update:modelValue="(val) => {
                console.log('val', val);

              }" />
          </u-row>
        </u-row>
        <u-row flex1 class="w-full">
          <u-input v-model="form.kandungan" label="Kandungan" :error="isError('kandungan')"
            :error-message="errorMessage('kandungan')" />
        </u-row>
        <u-row flex1 class="w-full">
          <u-input type="number" v-model="form.harga_beli" label="Harga Beli" :error="isError('harga_beli')"
            :error-message="errorMessage('harga_beli')" />
          <u-input type="number" v-model="form.limit_stok" label="Limit Stok" :error="isError('limit_stok')"
            :error-message="errorMessage('limit_stok')" />
        </u-row>
        <div flex1 class="w-full row justify-center items-center mt-1 mb-1">
          <div class="text-center text-xs text-gray-500">---- Harga Jual ----</div>
        </div>
        <u-row flex1 class="w-full grid grid-cols-2 gap-4">
          <u-row class="items-center gap-1">
            <u-input type="number" v-model="form.harga_jual_resep" label="Harga jual Resep"
              :error="isError('harga_jual_resep')" :error-message="errorMessage('harga_jual_resep')" />
            <div class="text-xs text-primary whitespace-nowrap">
              {{ persen(form.harga_jual_resep) }}%
            </div>
          </u-row>
          <u-row class="items-center gap-1">
            <u-input type="number" v-model="form.harga_jual_umum" label="Harga Jual Umum"
              :error="isError('harga_jual_umum')" :error-message="errorMessage('harga_jual_umum')" />
            <div class="text-xs text-primary whitespace-nowrap">
              {{ persen(form.harga_jual_umum) }}%
            </div>
          </u-row>
        </u-row>
        <u-row flex1 class="w-full grid grid-cols-2 gap-4">
        <u-row class="items-center gap-1">
           <u-input type="number" v-model="form.harga_jual_cust" label="Harga jual Customer"
              :error="isError('harga_jual_cust')" :error-message="errorMessage('harga_jual_cust')" />
            <div class="text-xs text-primary whitespace-nowrap">
              {{ persen(form.harga_jual_cust) }}%
            </div>
          </u-row>
          <u-row class="items-center gap-1">
            <u-input type="number" v-model="form.harga_jual_prem" label="Harga Jual Premium"
              :error="isError('harga_jual_prem')" :error-message="errorMessage('harga_jual_prem')" />
            <div class="text-xs text-primary whitespace-nowrap">
              {{ persen(form.harga_jual_prem) }}%
            </div>
          </u-row>
        </u-row>
        <!-- <u-row flex1 class="w-full">
          <u-row>
            <u-input type="number" v-model="form.harga_jual_umum" label="Harga Jual Biasa"
              :error="isError('harga_jual_umum')" :error-message="errorMessage('harga_jual_umum')" />
          </u-row>
        </u-row> -->
      </u-col>
    </template>
    <template #footer>
      <u-row flex1 class="w-full" right>
        <u-btn variant="secondary" label="Batal" @click="$emit('close')" />
        <u-btn :loading="store.loadingSave" label="Simpan" type="button" @click.stop="handleSubmit" />
      </u-row>
    </template>
  </u-modal>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'

import { useKategoriStore, useMerkStore, useRakStore, useSatuanStore } from '@/stores/template/register'
const props = defineProps({
  store: { type: Object, required: true },
  title: { type: String, default: 'Data' },
  mode: { type: String, default: 'add' }
})
const emit = defineEmits(['close', 'save'])

const error = computed(() => {
  const err = props.store.error
  const status = err?.status === 422
  if (status) {
    return err?.response?.data?.errors
  }
  return null
})

const form = ref({
  nama: '',
  barcode: '',
  satuan_k: '',
  satuan_b: '',
  isi: '',
  kandungan: '',
  merk: '',
  rak: '',
  kategori: '',
  harga_beli: '',
  harga_jual_resep: '',
  harga_jual_umum: '',
  harga_jual_cust: '',
  harga_jual_prem: '',
  limit_stok: 1,
  margin_jual_umum: 0,
  margin_jual_resep: 0,
  margin_jual_cust: 0,
  margin_jual_prem: 0,
})

function isError(field) {
  return !!error.value?.[field]
}

function errorMessage(field) {
  return error.value?.[field]?.[0] ?? null
}



watch(
  () => ({ ...form.value }),
  (newForm, oldForm) => {
    // console.log('🔥 watch form', newForm, oldForm);

    for (const key in newForm) {
      if (newForm[key] !== oldForm[key]) {
        props.store.clearFieldError(key)
      }
    }
    form.value.margin_jual_umum= 0
    form.value.margin_jual_resep= 0
    form.value.margin_jual_cust= 0
    form.value.margin_jual_prem= 0
  },
  { deep: true }
)




function handleSubmit() {
  emit('save', form.value, props.mode)
}

function init() {
  const mode = props.mode

  const exclude = mode === 'add'
    ? ['kode', 'created_at', 'updated_at']
    : ['created_at', 'updated_at']


  if (mode === 'add') {
    form.value = Object.fromEntries(
      Object.keys(form.value)
        .filter(k => !['kode', 'created_at', 'updated_at'].includes(k))
        .map(k => [k, ''])
    )
  } else {
    const item = props.store.item || {}
    form.value = Object.fromEntries(
      Object.entries(item)
        .filter(([key]) => !['created_at', 'updated_at'].includes(key))
    )
  }

  console.log('init form', form.value);

}

const masterSatuan = useSatuanStore()
const valSatuanK = ref(null)
const valSatuanB = ref(null)

const optionSatuanK = ref([])
const optionSatuanB = ref([])
function cariSatuanK(val) {
  valSatuanK.value = val

  const match = masterSatuan.items.filter(o =>
    o.nama?.toLowerCase().includes(val?.toLowerCase())
  )

  optionSatuanK.value = match.length
    ? match.map(i => ({ label: i.nama, value: i.nama }))
    : masterSatuan.items.map(i => ({ label: i.nama, value: i.nama }))
}

function cariSatuanB(val) {
  valSatuanB.value = val

  const match = masterSatuan.items.filter(o =>
    o.nama?.toLowerCase().includes(val?.toLowerCase())
  )

  optionSatuanB.value = match.length
    ? match.map(i => ({ label: i.nama, value: i.nama }))
    : masterSatuan.items.map(i => ({ label: i.nama, value: i.nama }))
}


watch(
  () => masterSatuan.items,
  (items) => {
    const mapped = items.map(i => ({ label: i.nama, value: i.nama }))
    optionSatuanK.value = mapped
    optionSatuanB.value = mapped
  },
  { immediate: true }
)

const masterMerk = useMerkStore()
const valMerk = ref(null)
const optionMerk = ref([])
function cariMerk(val) {
  valMerk.value = val

  const match = masterMerk.items.filter(o =>
    o.nama?.toLowerCase().includes(val?.toLowerCase())
  )

  optionMerk.value = match.length
    ? match.map(i => ({ label: i.nama, value: i.nama }))
    : masterMerk.items.map(i => ({ label: i.nama, value: i.nama }))
}
watch(
  () => masterMerk.items,
  (items) => {
    const mapped = items.map(i => ({ label: i.nama, value: i.nama }))
    optionMerk.value = mapped
  },
  { immediate: true }
)

const masterKategori = useKategoriStore()
const valKategori = ref(null)
const optionKategori = ref([])
function cariKategori(val) {
  valKategori.value = val

  const match = masterKategori.items.filter(o =>
    o.nama?.toLowerCase().includes(val?.toLowerCase())
  )

  optionKategori.value = match.length
    ? match.map(i => ({ label: i.nama, value: i.nama }))
    : masterKategori.items.map(i => ({ label: i.nama, value: i.nama }))
}
watch(
  () => masterKategori.items,
  (items) => {
    const mapped = items.map(i => ({ label: i.nama, value: i.nama }))
    optionKategori.value = mapped
  },
  { immediate: true }
)


const masterRak = useRakStore()
const valRak = ref(null)
const optionRak = ref([])
function cariRak(val) {
  valRak.value = val

  const match = masterRak.items.filter(o =>
    o.nama?.toLowerCase().includes(val?.toLowerCase())
  )

  optionRak.value = match.length
    ? match.map(i => ({ label: i.nama, value: i.nama }))
    : masterRak.items.map(i => ({ label: i.nama, value: i.nama }))
}
watch(
  () => masterRak.items,
  (items) => {
    const mapped = items.map(i => ({ label: i.nama, value: i.nama }))
    optionRak.value = mapped
  },
  { immediate: true }
)
onMounted(() => {
  console.log('Mounted Form', masterRak.items);
  console.log('masterMerk', masterMerk.items);
  init()

  // ini tambahan
})
const persen = (hargaJual) => {
  const beli = Number(form.value.harga_beli)
  const jual = Number(hargaJual)

  if (!beli || !jual) return 0

  return ((jual - beli) / beli * 100).toFixed(0)
}
</script>