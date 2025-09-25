<template>
    <u-page>
      <u-view scrollY flex1>
        <u-col flex1  class="">
          <u-title class="text-lg" label="Settings Aplikasi" />
          <u-separator></u-separator>
          <u-grid cols="12">
            <u-card padding="p-6" class="col-span-1 md:col-span-7 w-full">
              <u-row class="">
                <u-text size="md" class="font-light" color="text-light-primary">Profile Aplikasi</u-text>
              </u-row>

              <u-col class="w-full mt-4" gap="gap-6">
                <u-input v-model="store.form.nama" label="Nama Apotik" 
                  :error="isError('nama')"
                  :error-message="errorMessage('nama')" 
                />
                <u-input v-model="store.form.telepon" label="Telepon" 
                  :error="isError('telepon')"
                  :error-message="errorMessage('telepon')" 
                />
                <u-input v-model="store.form.pemilik" label="Nama Pemilik" 
                  :error="isError('pemilik')"
                  :error-message="errorMessage('pemilik')" 
                />
                <u-textarea v-model="store.form.alamat" label="Alamat" 
                  :error="isError('alamat')"
                  :error-message="errorMessage('alamat')" 
                />
              </u-col>

            </u-card>
            <u-card padding="p-6" class="col-span-1 md:col-span-7 w-full">
              <u-row class="">
                <u-text size="md" class="font-light" color="text-light-primary">Preferrence</u-text>
              </u-row>

              <u-col class="w-full mt-4" gap="gap-6">

                <u-input v-model.number="store.form.pajak" label="Pajak (%) (0-100)" type="number"
                  :error="isError('pajak')"
                  :error-message="errorMessage('pajak')" 
                />

                <u-textarea v-model="store.form.footer" label="Footer Nota / Struk Penjualan" 
                  :error="isError('footer')"
                  :error-message="errorMessage('footer')" 
                />
              </u-col>

            </u-card>
          </u-grid>

          <u-separator></u-separator>
          <u-row flex1 class="w-full" >
            <u-btn :loading="store.loadingSave" label="Simpan" color="primary" class="w-full" @click="handleSave"  />
          </u-row>

        </u-col>

      </u-view>
    </u-page>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'

import { useAppStore } from '@/stores/app'



const store = useAppStore()

// console.log('store', store.form);


const error = computed(() => {
  const err = store.error
  const status = err?.status === 422
  if (status) {
    return err?.response?.data?.errors
  }
  return null
})

function isError(field){
  return !!error.value?.[field]
}

function errorMessage(field){
  return error.value?.[field]?.[0] ?? null
} 

onMounted(() => {
  store.fetchData()
})

const handleSave = (e) => {
  e.preventDefault()
  e.stopPropagation()
  console.log('store', store.form);
  
  store.create()
}

</script>