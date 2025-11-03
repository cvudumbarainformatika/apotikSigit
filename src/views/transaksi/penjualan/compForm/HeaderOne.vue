<template>
  <u-card class="h-full min-h-[100px] space-y-2">
    <u-row>
      <u-icon name="layers" class="w-4 h-4" />
      <u-text class="font-bold">Informasi Penjualan</u-text>
    </u-row>
    <u-row >
      <div 
        class="bg-primary/10 border border-primary rounded-xl shadow-sm p-2 transition-all duration-300 hover:shadow-md w-full">
        <div class="flex flex-1 justify-between items-start">
          <u-row flex1 class="w-full">
            <u-avatar icon="users" size="w-10 h-10" ></u-avatar>
            <u-col gap="gap-0">
              <u-text class="font-bold">
                Petugas Saat ini
              </u-text>
              <u-text>
                {{ auth?.user?.nama }}
              </u-text>
            </u-col>
          </u-row>
          
        </div>
      </div>
    </u-row>
    <u-row >

      <div
        class="inline-flex rounded-lg overflow-hidden border border-light-primary bg-grady-primary w-full justify-center">
        <u-grid cols="2" gap="gap-0">
          <label
          :class="['text-sm w-full font-medium text-center px-4 py-2 select-none transition-colors', jenis === 'umum' ? 'bg-grady-primary text-background ' : 'bg-secondary text-primary font-semibold shadow']">
          Umum
        </label>
        <label
          :class="['text-sm w-full font-medium text-center px-2 py-2 select-none transition-colors', jenis === 'resep' ? 'bg-grady-primary text-background ' : 'bg-secondary text-primary font-semibold shadow']">
          Resep
        </label>
        </u-grid>
      </div>
    </u-row>
    
  </u-card>
</template>

<script setup>

const props = defineProps({
  jenis: { type: String, default: 'umum' },
  auth: { type: Object, default: null },
})
</script>