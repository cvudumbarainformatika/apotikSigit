<script setup>
import { defineAsyncComponent, onMounted, computed, ref } from 'vue'
import { useSupplierStore } from '@/stores/template/register'
import { useRoute } from 'vue-router'
import { inject } from 'vue'
const $confirm = inject('confirm')


import BaseMaster from '@/components/templates/BaseMaster.vue'
import LoaderItem from './LoaderItem.vue'
// const BaseMaster = defineAsyncComponent(() => import('@/components/templates/BaseMaster.vue'))
const ListComp = defineAsyncComponent(() => import('./ListComp.vue'))
const ModalForm = defineAsyncComponent(() => import('./ModalForm.vue'))


const store = useSupplierStore()


const route = useRoute()
const title = computed(() => route.meta.title)

onMounted(() => {
  console.log('Mounted ', title.value);
  
  store.per_page = 10
  Promise.all([
    store.fetchAll()
  ])
})
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
</script>

<template>
  <base-master :title="title" :store="store" showOrder :onAdd="handleAdd" :onRefresh="handleRefresh">
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




  </base-master>
</template>
