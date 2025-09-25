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
          <u-row flex1>
            <u-input v-model="form.username" label="Username" 
              :error="isError('username')"
              :error-message="errorMessage('username')" 
            />
          </u-row>
          <u-row flex1>
            <u-input v-model="form.email" label="Email" 
              :error="isError('email')"
              :error-message="errorMessage('email')" 
            />
          </u-row>
        </u-row>
        <u-row flex1 class="w-full">
          <u-row flex1>
            <u-input v-model="form.hp" label="No. Hp" 
              :error="isError('hp')"
              :error-message="errorMessage('hp')" 
            />
          </u-row>
          <u-row flex1>
            <!-- <u-input v-model="form.email" label="Email" 
              :error="isError('email')"
              :error-message="errorMessage('email')" 
            /> -->
          </u-row>
        </u-row>
        <u-row flex1 class="w-full">
          <u-textarea
            v-model="form.alamat"
            label="alamat"
            :error="isError('alamat')"
            :error-message="errorMessage('alamat')"
          />
        </u-row>
         <u-row flex1 class="w-full">
          <u-row flex1>
            <u-input v-model="form.password" label="Buat Password" 
              :error="isError('password')"
              :error-message="errorMessage('password')" 
            />
          </u-row>
          <u-row flex1>
            <u-input v-model="form.password_confirmation" label="Password Confirmation" 
              :error="isError('password_confirmation')"
              :error-message="errorMessage('password_confirmation')" 
            />
          </u-row>
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
import { useFormError } from '@/composables/useFormError'
const props = defineProps({
  store: { type: Object, required: true },
  title: { type: String, default: 'Data' },
  mode: { type: String, default: 'add' }
})
const emit = defineEmits(['close', 'save'])



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

const { isError, errorMessage } = useFormError(form.value, props.store)



function handleSubmit() {
  emit('save' , form.value, props.mode)
  
  emit('close')
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