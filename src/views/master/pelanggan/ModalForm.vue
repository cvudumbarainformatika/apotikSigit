<template>
  <u-modal persistent :title="`Tambah ${title}`" @close="emit('close')" >
    <template #default>
      <u-col flex1 class="w-full p-4">
        <u-row flex1 class="w-full">
          <u-input v-model="form.nama" label="Nama" 
            :error="isError('nama')"
            :error-message="errorMessage('nama')" 
          />
        </u-row>
        <u-row flex1 class="w-full">
          <u-row>
            <u-input v-model="form.tlp" label="Telepon" 
              :error="isError('tlp')"
              :error-message="errorMessage('tlp')" 
            />
          </u-row>
          <!-- <u-row flex1>
            <u-input v-model="form.rekening" label="Rekening" 
              :error="isError('rekening')"
              :error-message="errorMessage('rekening')" 
            />
          </u-row> -->
        </u-row>
        <u-row flex1 class="w-full">
          <u-textarea
            v-model="form.alamat"
            label="alamat"
            :error="isError('alamat')"
            :error-message="errorMessage('alamat')"
          />
        </u-row>
      </u-col>
    </template>
    <template #footer>
      <u-row flex1 class="w-full" right>
        <u-btn variant="secondary" label="Batal" @click="$emit('close')" />
        <u-btn :loading="store.loadingSave" label="Simpan" type="button" @click.stop="handleSubmit"  />
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
  tlp: '',
  alamat: '',
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

onMounted(() => {
  // console.log('Mounted Form', props.mode);
  init()
})

</script>