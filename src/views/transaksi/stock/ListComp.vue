<template>
  <u-col gap="gap-1" class="w-full px-4 py-1">
    <u-view padding="0" flex1 class="w-full">
      <u-col flex1 class="w-full" gap="gap-1">
        <u-row flex1 class="w-full pt-1">
          <u-row flex1 class="w-full">
            <div class="font-bold uppercase">{{ item?.barang?.nama }}</div>
            <div class="italic text-light-primary text-xs">{{ item?.barang?.kode }}</div>
          </u-row>
          <u-row class="">
            <div class="">Stok : {{ formatStock(item) }}</div>
          </u-row>
        </u-row>
        <u-separator></u-separator>
        <u-grid cols="12" class="relative right-0">
          <u-row class="col-span-5 justify-self-end">
            <div v-if="openmodalData === true && item?.id" ref="menuBarangRef"
              class="justify-center bg-background border-1 border-primary rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md absolute z-10 -top-4">
              <u-grid cols="12" gap="gap-4">
                <div class="col-span-4">
                  <u-text class="font-bold">Nama Barang</u-text>
                  <u-text>{{ item.barang?.nama }}</u-text>
                </div>
                <div class="col-span-4 text-center">
                  <u-text class="font-bold">Jumlah Sekarang</u-text>
                  <u-text>{{ item.jumlah_k }} {{ item.satuan_k }} ( {{ item.jumlah_b }} {{ item.satuan_b }}
                    )</u-text>
                </div>
                <div class="col-span-4 text-right">
                  <u-text class="font-bold">Kode</u-text>
                  <u-text> {{ item.kode_barang }} </u-text>
                </div>

                <div class="col-span-12">
                  <u-separator spacing="-my-2"></u-separator>
                </div>

                <u-row class="col-span-3">
                  <u-input ref="inpJumlahRef" v-model="form.jumlah" label="Jml Penyesuaian" type="number"
                    :error="isError('jumlah')" :error-message="errorMessage('jumlah')" />
                </u-row>
                <u-row class="col-span-2">
                  <u-input v-model="form.satuan_k" label="Satuan K" :error="isError('satuan_k')"
                    :error-message="errorMessage('satuan_k')" readonly />
                </u-row>
                <u-row class="col-span-7">
                  <u-input v-model="form.keterangan" label="Keterangan" :error="isError('keterangan')"
                    :error-message="errorMessage('keterangan')" type="text" />
                </u-row>
                <u-row right class="col-span-12 ">
                  <u-btn variant="secondary" label="Batal" @click="handleBatal" />
                  <u-btn :loading="item.loadingSave" label="Simpan" @click.stop="handleSubmit" />
                </u-row>
              </u-grid>
            </div>
          </u-row>
        </u-grid>
        <u-row flex1 class="w-full pt-0 pb-1">
          <u-row flex1 class="w-full">
            <div class="w-full">
              <u-grid cols="8">
                <u-row class="col-span-1">
                  <span class="font-medium">No Penerimaan</span>
                </u-row>
                <u-row class="col-span-7">
                  <span>: {{ item?.nopenerimaan }}</span>
                </u-row>
              </u-grid>


              <u-grid cols="8">
                <u-row class="col-span-1">
                  <span class="font-medium">No Batch</span>
                </u-row>
                <u-row class="col-span-7">
                  <span>: {{ item?.nobatch }}</span>
                </u-row>
              </u-grid>

              <u-grid cols="10">
                <u-row class="col-span-5">
                  <u-grid cols="4">
                    <u-row class="col-span-2">
                      <span class="font-medium">Satuan Besar</span>
                    </u-row>
                    <u-row class="col-span-2">
                      <span>: {{ item?.satuan_b }}</span>
                    </u-row>
                  </u-grid>
                  <u-grid cols="4">
                    <u-row class="col-span-2">
                      <span class="font-medium">Satuan Kecil</span>
                    </u-row>
                    <u-row class="col-span-2">
                      <span>: {{ item?.satuan_k }}</span>
                    </u-row>
                  </u-grid>
                </u-row>
                <u-row class="col-span-5">
                </u-row>
              </u-grid>

              <u-grid cols="8">
                <u-row class="col-span-1">
                  <span class="font-medium">Isi Satuan Besar</span>
                </u-row>
                <u-row class="col-span-7">
                  <span>: {{ item?.isi }}</span>
                </u-row>
              </u-grid>

              <u-grid cols="10">
                <u-row class="col-span-5">
                  <u-grid cols="4">
                    <u-row class="col-span-2">
                      <span class="font-medium">Harga Resep</span>
                    </u-row>
                    <u-row class="col-span-2">
                      <span>: {{ item?.barang?.harga_jual_resep_k }}</span>
                    </u-row>
                  </u-grid>
                  <u-grid cols="4">
                    <u-row class="col-span-2">
                      <span class="font-medium">Harga Biasa</span>
                    </u-row>
                    <u-row class="col-span-2">
                      <span>: {{ item?.barang?.harga_jual_biasa_k }}</span>
                    </u-row>
                  </u-grid>
                </u-row>
                <u-row class="col-span-5">

                </u-row>
              </u-grid>

              <u-grid cols="8">
                <u-row class="col-span-1">
                  <span class="font-medium">Kandungan</span>
                </u-row>
                <u-row class="col-span-7">
                  <span>: {{ item?.barang?.kandungan }}</span>
                </u-row>
              </u-grid>

              <u-grid cols="8" class="mb-3">
                <u-row class="col-span-1">
                  <span class="font-medium">Tgl Expired</span>
                </u-row>
                <u-row class="col-span-7">
                  <span>: {{ item?.tgl_exprd }}</span>
                </u-row>
              </u-grid>
            </div>

          </u-row>
          <u-row right class="">
            <u-grid cols="12">
              <u-row class="col-span-12 justify-self-end">
                <u-btn-icon variant="secondary" @click="openModalMinus" icon="minus" tooltip="Kurangi Stock" />
                <u-btn-icon @click="openModalTambah" icon="plus" tooltip="Tambah Stock" />
              </u-row>
            </u-grid>
          </u-row>
        </u-row>
      </u-col>
    </u-view>
  </u-col>
</template>

<script setup>
import { useStockStore } from '@/stores/template/register'
import { useWaktuLaluReactive } from '@/utils/dateHelper'
import { computed, defineAsyncComponent, ref } from 'vue'

const props = defineProps({
  item: { type: Object, default: null },
  store: { type: Object, required: true }
})

// const store = useStockStore()
const emit = defineEmits(['show-detail'])
const menuBarangRef = ref(null)
const openmodalData = ref(false)
const inpJumlahRef = ref(null)
const isModalTambah = ref(false)
const isModalMinus = ref(false)
const modalOpendata = ref(false)
const viewKartustock = ref(false)

const form = ref({
  id_stok: null,
  kode_barang: '',
  jumlah: 0,
  satuan_k: '',
  keterangan: ''

})
function showDetail() {
  emit('show-detail', props.item)
}
function formatStock(item) {
  if (!item) return '-'
  const jumlah = item.jumlah_k || 0
  const satuan = item.satuan_k || ''
  return `${jumlah} ${satuan}`.trim() || '-'
}
const error = computed(() => {
  const err = props.item.error
  const status = err?.status === 422
  if (status) {
    return err?.response?.data?.errors
  }
  return null
})

function isError(field) {
  return !!error.value?.[field]
}

function errorMessage(field) {
  return error.value?.[field]?.[0] ?? null
}

const clearSelectedBarang = () => {
  form.value.jumlah = 0
  form.value.keterangan = ''
}
const openModalTambah = () => {
  console.log('itemscacac', props.store?.items)
  openmodalData.value = true
  isModalTambah.value = true
  isModalMinus.value = false
  form.value.jumlah = 0
  form.value.satuan_k = props.item?.satuan_k
  form.value.id_stok = props.item?.id
  form.value.kode_barang = props.item?.kode_barang
  clearSelectedBarang()
}

const openModalMinus = () => {
  openmodalData.value = true
  isModalMinus.value = true
  isModalTambah.value = false
  form.value.jumlah = 0
  form.value.satuan_k = props.item?.satuan_k
  form.value.id_stok = props.item?.id
  form.value.kode_barang = props.item?.kode_barang
  clearSelectedBarang()
}

const handleSubmit = async (e) =>  {
  e.preventDefault()
  e.stopPropagation()
  if (isModalTambah.value) {
    form.value.jumlah = Math.abs(form.value.jumlah)
    // console.log('form tambah', form.value)
  } else if (isModalMinus.value) {
    form.value.jumlah = -Math.abs(form.value.jumlah)
    // console.log('form minus', form.value)
  }
  // console.log('form', form.value);
  try {
    props.store.create(form.value)
      .then(() => {
        clearSelectedBarang()
        !props.store?.fetchAll()

        console.log('Data saved successfully:', props.store.items)
      })
    openmodalData.value = false
  }  catch (err) {
    props.store.error = err
  } finally {
    props.store.loading = false
  }

  
  // store.fetchAll()
}

const handleBatal = () => {
  clearSelectedBarang()
  openmodalData.value = false
}
</script>