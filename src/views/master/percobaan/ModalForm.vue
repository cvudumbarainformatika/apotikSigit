<template>
  <u-modal persistent  title="Form" @close="$emit('close')" >
    <template #default>
      <u-col flex1 class="w-full p-4">
        <u-row flex1 class="w-full">
          <u-input label="Nama" />
        </u-row>
        <u-row flex1 class="w-full">
          <u-row>
            <u-input label="Satuan Kecil" />
          </u-row>
          <u-row>
            <u-input label="Satuan Besar" />
          </u-row>
          <u-row class="w-36">
            <u-input label="Isi sat Bsr" />
          </u-row>
        </u-row>
        <u-row flex1 class="w-full">
          <u-input label="Kandungan" />
        </u-row>
        <u-row flex1 class="w-full">
          <u-row>
            <u-input label="Harga jual Resep" />
          </u-row>
          <u-row>
            <u-input label="Harga Jual Biasa" />
          </u-row>
        </u-row>
      </u-col>
    </template>
    <template #footer>
      <u-row flex1 class="w-full" right>
        <u-btn variant="secondary" label="Batal" @click="$emit('close')" />
        <u-btn label="Simpan"  />
      </u-row>
    </template>
  </u-modal>
</template>

<script setup>
defineProps({
  store: { type: Object, required: true },
})

</script>