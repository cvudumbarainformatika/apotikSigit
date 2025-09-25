<template>
  <u-modal persistent :title="`Tambah ${title}`" @close="emit('close')">
    <template #default>
      <u-col flex1 class="w-full p-4">
        <u-row flex1 class="w-full">
          <u-input v-model="form.nama" label="Nama" :error="isError('nama')" :error-message="errorMessage('nama')" />
        </u-row>
        <u-row flex1 class="w-full">
          <u-row>
            <u-select label="Satuan Kecil" v-model="form.satuan_k" :options="optionSatuans" :error="isError('satuan_k')"
              :error-message="errorMessage('satuan_k')" @update:modelValue="(val)=> {
                  console.log('val',val);
                  
                }" />
          </u-row>
          <u-row>
            <u-select label="Satuan Besar" v-model="form.satuan_b" :options="optionSatuans" :error="isError('satuan_b')"
              :error-message="errorMessage('satuan_b')" @update:modelValue="(val)=> {
                  console.log('val',val);
                  
                }" />
          </u-row>
          <u-row class="w-36">
            <u-input v-model="form.isi" type="number" label="Isi sat Bsr" :error="isError('isi')"
              :error-message="errorMessage('isi')" />
          </u-row>
        </u-row>
        <u-row flex1 class="w-full">
          <u-input v-model="form.kandungan" label="Kandungan" :error="isError('kandungan')"
            :error-message="errorMessage('kandungan')" />
        </u-row>
        <u-row flex1 class="w-full">
          <!-- <u-row>
            <u-input type="number" v-model="form.harga_jual_resep_k" label="Harga jual Resep"
              :error="isError('harga_jual_resep_k')" :error-message="errorMessage('harga_jual_resep_k')" />
          </u-row> -->
          <u-row>
            <u-input type="number" v-model="form.persen_resep" label="Margin Resep (%)" :error="isError('persen_resep')"
              :error-message="errorMessage('persen_resep')" />
          </u-row>
          <u-row>
            <u-input type="number" v-model="form.persen_biasa" label="Margin Biasa (%)" :error="isError('persen_biasa')"
              :error-message="errorMessage('persen_biasa')" />
          </u-row>
        </u-row>
        <!-- <u-row flex1 class="w-full">
          <u-row>
            <u-input type="number" v-model="form.harga_jual_biasa_k" label="Harga Jual Biasa"
              :error="isError('harga_jual_biasa_k')" :error-message="errorMessage('harga_jual_biasa_k')" />
          </u-row>
          <u-row>
            <u-input type="number" v-model="form.persen_biasa" label="Margin Biasa (%)" :error="isError('persen_biasa')"
              :error-message="errorMessage('persen_biasa')" />
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
  satuan_k: '',
  satuan_b: '',
  isi: '',
  kandungan: '',
  harga_jual_resep_k: '',
  harga_jual_biasa_k: '',
  persen_resep: '',
  persen_biasa: ''
})

function isError(field){
  return !!error.value?.[field]
}

function errorMessage(field){
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
  },
  { deep: true }
)




function handleSubmit() {
  emit('save' , form.value, props.mode)
}

function init(){
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

import { useSatuanStore } from '@/stores/template/register'
const masterSatuan = useSatuanStore()
const optionSatuans = computed(() => masterSatuan?.items?.map(item => ({ label: item?.nama, value: item?.nama })) || [])

onMounted(() => {
  console.log('Mounted Form', masterSatuan.items);
  init()

  // ini tambahan
})

</script>