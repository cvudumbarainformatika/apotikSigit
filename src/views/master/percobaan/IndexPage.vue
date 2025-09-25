<script setup>
import { defineAsyncComponent } from 'vue'
import { useBarangStore } from '@/stores/template/register'


// import BaseMaster from '@/components/templates/BaseMaster.vue'
const BaseMaster = defineAsyncComponent(() => import('@/components/templates/BaseMaster.vue'))
const ListComp = defineAsyncComponent(() => import('./ListComp.vue'))
const ModalForm = defineAsyncComponent(() => import('./ModalForm.vue'))

const store = useBarangStore()

function handleAdd() {
  console.log('Tambah Barang')
  store.modalFormOpen = true
}
function handleRefresh() {
  console.log('Refresh List')
}
</script>

<template>
  <base-master :store="store" :onAdd="handleAdd" showOrder :onRefresh="handleRefresh">
    <template #item="{ item }">
      <list-comp :item="item" />
    </template>
    <template #modal-form>
      <modal-form 
        v-model="store.modalFormOpen" 
        :store="store" 
        @close="store.modalFormOpen = false"
      />
    </template>

    <!-- <template #form>
        <u-grid cols="2" class="bg-background p-4  pb-20" >
          <u-input label="Kode" type="text"  />
          <u-input label="Kode" type="text"  />
          <u-input label="Kode" type="text"  />
        </u-grid>
    </template>

    <template #form-footer>
      <u-row flex1 class="w-full" right>
        <u-btn variant="secondary" label="Batal" @click="store.modalFormOpen = false" />
        <u-btn label="Simpan"  />
      </u-row>
    </template> -->
  </base-master>
</template>
