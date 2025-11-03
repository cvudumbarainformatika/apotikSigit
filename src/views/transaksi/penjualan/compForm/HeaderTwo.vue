<template>
  <u-card class="col-span-2 h-full space-y-2">
    <u-row>
      <u-icon name="users" class="w-4 h-4" />
      <u-text class="font-bold">Data Pelanggan</u-text>
    </u-row>
    <u-row>
      <u-autocomplete v-model="searchPelanggan" placeholder="Cari Pelanggan" 
        :debounce="300" :min-search-length="2" 
        item-key="id" 
        item-label="nama"
        not-found-text="Data Pelanggan tidak ditemukan" 
        not-found-subtext="Coba kata kunci lain" 
        :show-add-button="false"
        api-url="/api/v1/master/pelanggan/get-list" api-response-path="data.data" :api-params="{ per_page: 5 }"
        :use-api="true" @select="handleSelectedPelanggan"
      ></u-autocomplete>
    </u-row>
    <u-row>
      <div v-if="store?.pelangganSelected"
        class="bg-primary/10 border border-primary rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md w-full">
        <div class="flex flex-1 justify-between items-start">
          <u-row flex1 class="w-full">
            <u-icon name="UserSearch" class="w-5 h-5 text-primary" />
            <u-text>
              {{ store.pelangganSelected?.nama }}
            </u-text>
          </u-row>
          <button @click="clearSelectedPelanggan"
            class="text-primary hover:text-danger " aria-label="Hapus">
            <u-icon name="X" class="w-4 h-4" />
          </button>
        </div>
      </div>


      <div v-else
        class="bg-danger/10 border border-danger rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md w-full">
        <u-row class="items-start" padding="p-0">
          <u-icon name="UserSearch" class="w-4 h-4 text-primary" />
          <div>
            <u-text>
              Silahkan cari Pelanggan
            </u-text>
          </div>
        </u-row>
      </div>
      
    </u-row>
  </u-card>
</template>

<script setup>

const props = defineProps({
  store: { type: Object, required: true },
})

const emits = defineEmits(['handleSelectedPelanggan'])


const searchPelanggan = ref('')
const handleSelectedPelanggan = (item) => {
  props.store.pelangganSelected = item
  searchPelanggan.value = ''
  emits('handleSelectedPelanggan', item)
}

</script>