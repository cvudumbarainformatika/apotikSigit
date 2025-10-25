<template>
  <u-row class="relative">
    <div 
      ref="menuBarangRef"
      class="bg-background border-1 border-primary rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md w-full "
      :class="isEdited ? '': `absolute z-10 -top-4`">
      <u-grid cols="12" gap="gap-4">
        <div class="col-span-4">
          <u-text class="font-bold">Nama Barang</u-text>
          <u-text>{{ store.barangSelected?.nama || '-' }}</u-text>
        </div>
        <div class="col-span-4 text-center">
          <u-text class="font-bold">Satuan</u-text>
          <u-text>{{ store.barangSelected?.satuan_k || '-' }} | {{ store.barangSelected?.satuan_b || '-' }}, {{ store.barangSelected?.isi || 0 }}</u-text>
        </div>
        <div class="col-span-4 text-right">
          <u-text class="font-bold">Kode</u-text>
          <u-text>{{ store.barangSelected?.kode || '-' }}</u-text>
        </div>

        <div class="col-span-12">
          <u-separator spacing="-my-2"></u-separator>
        </div>
        
        <u-row class="col-span-4">
          <u-input ref="inpJumlahRef" v-model="form.jumlah_pesan" label="jumlah_pesan" type="number"
            :error="isError('jumlah_pesan')"
            :error-message="errorMessage('jumlah_pesan')" 
          />
        </u-row>
        <u-row right class="col-span-8 ">
          <u-btn variant="secondary" label="Batal"  @click="handleBatal"/>
          <u-btn :loading="store.loadingSave" label="Simpan" @click.stop="handleSubmit"  />
        </u-row>
      </u-grid>
    </div>
  </u-row>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
  form: {
    type: Object,
    default: null
  },
  store: {
    type: Object,
    default: null
  },
  isError: {
    type: Function,
    required: true
  },
  errorMessage: {
    type: Function,
    required: true
  },
  isEdited: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['handleSubmit', 'handleBatal'])
const inpJumlahRef = ref(null)

defineExpose({ focusInput })


const handleSubmit = (e) => {
  emits('handleSubmit', e)
}

const handleBatal = (e) => {
  emits('handleBatal', e)
}

async function focusInput() {
  await nextTick()
  const el = inpJumlahRef.value?.inputRef
  el?.focus()
  el?.select()
  // console.log('inpJumlahRef.value', inpJumlahRef.value)
  // console.log('inpJumlahRef.value.inputRef', inpJumlahRef.value?.inputRef)  

  console.log('focusInput', props.form);
  console.log('focusInput store', props.store.barangSelected);
  
}


</script>