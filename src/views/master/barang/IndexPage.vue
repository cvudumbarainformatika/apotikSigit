<script setup>
import { defineAsyncComponent, onMounted, computed, ref, onBeforeMount } from 'vue'
import { useBarangStore, useKategoriStore, useMerkStore, useRakStore, useSatuanStore } from '@/stores/template/register'
import { useRoute } from 'vue-router'
import { inject } from 'vue'
const $confirm = inject('confirm')


import BaseMaster from '@/components/templates/BaseMaster.vue'
import LoaderItem from './LoaderItem.vue'
import { api } from '@/services/api'
// const LoaderItem = defineAsyncComponent(() => import('./LoaderItem.vue'))
const ListComp = defineAsyncComponent(() => import('./ListComp.vue'))
const ModalForm = defineAsyncComponent(() => import('./ModalForm.vue'))
const CetakData = defineAsyncComponent(() => import('./CetakData.vue'))

const store = useBarangStore()
const masterSatuan = useSatuanStore()
const masterMerk = useMerkStore()
const masterKategori = useKategoriStore()
const masterRak = useRakStore()

const route = useRoute()
const title = computed(() => route.meta.title)

onMounted(() => {
  // console.log('Mounted ', title.value);
  // loadMasterGagal()
  store.per_page = 100
  Promise.all([
    store.fetchAll(),
    masterSatuan.fetchAll(),
    masterMerk.fetchAll(),
    masterKategori.fetchAll(),
    masterRak.fetchAll(),
  ])
})

// onBeforeMount(() => {
//   console.log('Before Mounted ', title.value);
//   store.per_page = 100
//   Promise.all([
//     store.fetchAll(),
//     masterSatuan.fetchAll()
//   ])
// }),


function handleAdd() {
  store.item = null
  store.modalFormOpen = true
}
function handleRefresh() {
  // console.log('Refresh List')
  store.fetchAll()
}

function handleSave(form, mode) {
  console.log('handleSave', form, mode);
  store.create(form, mode)
}

function handleEdit(item) {
  console.log('handleEdit', item);
  store.item = item
  store.modalFormOpen = true
}


async function handleDelete(item) {
  console.log('handleDelete', item);
  const ok = await $confirm({
    message: 'Yakin ingin menghapus data ini?',
  })
  if (ok) {
    // console.log('Confirmed delete')
    store.remove(item?.id)
  }
  
}
// const masterGagal = ref([])
// const loading = ref(false)
// async function loadMasterGagal() {
//   loading.value = true
//   try {
//     const response = await api.get('/api/v1/master/curl/all-failed')
//     console.log('master gagal', response)
//     if (response.status === 200) {
//       masterGagal.value = response.data?.data
    
//     }
//   } catch (err) {
//     console.error('Gagal load:', err)
//     err.message || 'Gagal memuat data'
//   } finally {
//     loading.value = false
//   }
// }

async function handleKirimUlang() {
  const ok = await $confirm({
    message: 'Yakin ingin Simpan Ulang Data yang Gagal Kirim ?',
  })
  if (ok) {
    // console.log('Confirmed delete')
    try {
      store.loading = true
      const response = await api.post(`api/v1/master/curl/re-send-all`)
      if (response) {
        console.log('Kirim Ulang berhasil', response.data)
       
        notify({ message: response.data.message ?? 'Berhasil Simpan', type: 'success' })
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

<template>
  <base-master :title="title" :store="store" :showReport="true" :onTrigerReport="handleKirimUlang" :showPrintButton="true" showOrder :onAdd="handleAdd" :onRefresh="handleRefresh">
    <template #loading>
      <LoaderItem />
    </template>
    <template #item="{ item }">
      <Suspense>
        <template #default>
          <list-comp :item="item" @edit="handleEdit" @delete="handleDelete" />
        </template>
        <template #fallback>
          <LoaderItem />
        </template>
      </Suspense>
    </template>
    <template #modal-form>
      <modal-form v-if="store.modalFormOpen" v-model="store.modalFormOpen" :mode="store.item ? 'edit' : 'add'"
        :title="title" :store="store" @close="store.modalFormOpen = false" @save="handleSave" />
    </template>
   <template #print>
      <cetak-data />
    </template>



  </base-master>
</template>
