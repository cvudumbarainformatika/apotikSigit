<template>
  <u-modal persistent :title="`Tambah ${title}`" @close="emit('close')">
    <template #default>
      <u-col flex1 class="w-full p-4">
        <u-row flex1 class="w-full">
          <u-input v-model="form.nama" label="Nama" :error="isError('nama')" :error-message="errorMessage('nama')" />
        </u-row>
        <u-row flex1 class="w-full">
          <u-row flex1>
            <u-input v-model="form.username" label="Username" :error="isError('username')"
              :error-message="errorMessage('username')" />
          </u-row>
          <u-row flex1>
            <u-input v-model="form.email" label="Email" :error="isError('email')"
              :error-message="errorMessage('email')" />
          </u-row>
        </u-row>
        <u-row flex1 class="w-full">
          <u-row flex1>
            <u-input v-model="form.hp" label="No. Hp" :error="isError('hp')" :error-message="errorMessage('hp')" />
          </u-row>
          <u-row flex1>
            <u-select label="Jabatan" v-model="form.kode_jabatan" :options="optionJabatans"
              :error="isError('kode_jabatan')" :error-message="errorMessage('kode_jabatan')" @update:modelValue="(val) => {
                console.log('val', val);

              }" />

            <!-- <u-input v-model="form.email" label="Email" 
              :error="isError('email')"
              :error-message="errorMessage('email')" 
            /> -->
          </u-row>
        </u-row>
        <u-row flex1 class="w-full">
          <u-textarea v-model="form.alamat" label="alamat" :error="isError('alamat')"
            :error-message="errorMessage('alamat')" />
        </u-row>
        <u-row flex1 class="w-full">
          <u-row flex1>
            <u-input v-model="form.password" label="Buat Password" :error="isError('password')"
              :error-message="errorMessage('password')" />
          </u-row>
          <u-row flex1>
            <u-input v-model="form.password_confirmation" label="Password Confirmation"
              :error="isError('password_confirmation')" :error-message="errorMessage('password_confirmation')" />
          </u-row>
        </u-row>
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
import { useJabatanStore } from '@/stores/template/register'
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

const masterJabatan = useJabatanStore()
const optionJabatans = computed(() => masterJabatan?.items?.map(item => ({ label: item?.nama, value: item?.kode })) || [])


const form = ref({
  nama: '',
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
  hp: '',
  alamat: '',
  kode_jabatan: '',
})

function isError(field) {
  return !!error.value?.[field]
}

function errorMessage(field) {
  return error.value?.[field]?.[0] ?? null
}

function init() {
  const mode = props.mode
  const item = props.store.item || {}

  if (mode === 'add') {
    form.value = Object.fromEntries(
      Object.keys(form.value).map(k => [k, ''])
    )
  } else {
    form.value = {
      ...form.value,
      ...Object.fromEntries(
        Object.entries(item).filter(([key]) => !['created_at', 'updated_at'].includes(key))
      ),
      kode_jabatan: item.kode_jabatan
    }
  }
}

watch(
  () => ({ ...form.value }),
  (newForm, oldForm) => {
    for (const key in newForm) {
      if (newForm[key] !== oldForm[key]) {
        props.store.clearFieldError(key)
      }
    }
  },
  { deep: true }
)


function handleSubmit() {
  emit('save', form.value, props.mode)
}

onMounted(() => {
  init()
})

</script>