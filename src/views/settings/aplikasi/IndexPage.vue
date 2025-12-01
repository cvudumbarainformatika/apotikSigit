<template>
  <u-page>
    <u-view scrollY flex1>
      <u-col flex1 class="">
        <u-title class="text-lg" label="Settings Aplikasi" />
        <u-separator></u-separator>
        <u-grid cols="12">
          <u-card padding="p-6" class="col-span-1 md:col-span-7 w-full">
            <u-row class="">
              <u-text size="md" class="font-light" color="text-light-primary">Profile Aplikasi</u-text>
            </u-row>

            <u-col class="w-full mt-4" gap="gap-6">
              <u-input v-model="store.form.nama" label="Nama Toko" :error="isError('nama')"
                :error-message="errorMessage('nama')" />
              <u-input v-model="store.form.telepon" label="Telepon" :error="isError('telepon')"
                :error-message="errorMessage('telepon')" />
              <u-input v-model="store.form.pemilik" label="Nama Pemilik" :error="isError('pemilik')"
                :error-message="errorMessage('pemilik')" />
              <u-textarea v-model="store.form.alamat" label="Alamat" :error="isError('alamat')"
                :error-message="errorMessage('alamat')" />
            </u-col>

          </u-card>
          <!-- <u-card padding="p-6" class="col-span-1 md:col-span-5 w-full flex items-center justify-center">
            <div class="text-center">
              <u-text size="md" class="font-light mb-4" color="text-light-primary">Upload Foto</u-text>

              <div class="relative w-64 h-64">
                <img v-if="previewFoto || store.form.foto" :src="previewFoto || store.form.foto"
                  class="w-full h-full rounded-full object-cover border-4 border-white shadow-md" />
                <div v-else
                  class="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg border-4 border-white shadow-md">
                  No Image
                </div>

                <label for="fileUpload"
                  class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-lg rounded-full opacity-0 hover:opacity-100 cursor-pointer transition">
                  Upload
                </label>
                <input id="fileUpload" type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
              </div>
            </div>
          </u-card> -->
          <u-card padding="p-6" class="col-span-1 md:col-span-5 w-full">
            <u-row class="">
              <u-text size="md" class="font-light" color="text-light-primary">Preferrence</u-text>
            </u-row>

            <u-col class="w-full mt-4" gap="gap-6">

              <u-input v-model.number="store.form.pajak" label="Pajak (%) (0-100)" type="number"
                :error="isError('pajak')" :error-message="errorMessage('pajak')" />

              <u-textarea v-model="store.form.footer" label="Footer Nota / Struk Penjualan" :error="isError('footer')"
                :error-message="errorMessage('footer')" />
            </u-col>

          </u-card>
        </u-grid>

        <u-separator></u-separator>
        <u-row flex1 class="w-full">
          <u-btn :loading="store.loadingSave" label="Simpan" color="primary" class="w-full" @click="handleSave" />
        </u-row>

      </u-col>

    </u-view>
  </u-page>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'

const store = useAppStore()
const previewFoto = ref(null)

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Generate nama file & path yg dikirim ke backend
  const fileName = `foto_toko_${Date.now()}.${file.name.split('.').pop()}`
  const filePath = `/images/${fileName}`

  // === 1. Kompres untuk preview saja ===
  const compressedBlob = await compressImage(file, 800, 0.7)
  const base64Preview = await blobToBase64(compressedBlob)

  // Tampilkan preview hasil kompres
  previewFoto.value = base64Preview

  // === 2. Kirim ke backend: HANYA PATH ===
  store.form.foto = filePath
  store.form.base64_foto = null
  delete store.form.base64_foto
}

// const handleFileUpload = async (event) => {
//   const file = event.target.files[0]
//   if (!file) return

//   const compressedBlob = await compressImage(file, 800, 0.7) // width=800px, quality=70%
//   const base64 = await blobToBase64(compressedBlob)

//   store.form.foto = base64
//   previewFoto.value = base64
//   // const file = event.target.files[0]
//   // if (!file) return

//   // const reader = new FileReader()
//   // reader.onload = (e) => {
//   //   const base64 = e.target.result
//   //   store.form.foto = base64     // simpan string base64 ke form
//   //   previewFoto.value = base64   // untuk ditampilkan langsung
//   // }
//   // reader.readAsDataURL(file)
// }

function compressImage(file, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => resolve(blob),
        "image/jpeg",
        quality
      );
    };

    reader.readAsDataURL(file);
  });
}

function blobToBase64(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

const error = computed(() => {
  const err = store.error
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