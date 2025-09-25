<template>
  <div flex1 class="w-full p-3"
  >
    <!-- Glow bawah -->
    <div class="absolute -bottom-1 left-4 right-4 h-[2px] rounded-full bg-white/40 blur-md"></div>

      <!-- Kiri: Nama & Detail -->
    <u-row flex1 class="w-full" cols="4">
      <u-row flex1 class="w-full">
        <u-col gap="gap-1">
          <u-row gap="gap-2">
            <span>💊 </span>
            <u-text size="md" class="font-bold" >{{ item?.nama || '-' }}</u-text>
          </u-row>
          <u-row gap="gap-1">
            <u-badge variant="warning" class="">{{ item?.jumlah_k || 0 }} {{ item?.satuan_k }}</u-badge> x
            <u-badge variant="warning">Rp. {{ formatRupiah(item?.harga_jual) }}</u-badge>
          </u-row>
        </u-col>
      </u-row>
      <u-row gap="gap-0">
        <u-col align="items-end" gap="gap-1">
          <u-row gap="gap-2">
            <u-text color="text-primary" class="italic">{{ formatJamMenit(item?.created_at) }}</u-text>
            <!-- <u-icon v-if="isHovered" name="pencil" size="18" class="mb-0 text-light-primary cursor-pointer" @click="handleSelectedBarang(item)"  /> -->
            <u-icon v-if="isHovered" name="delete" size="18" class="mb-0 text-danger cursor-pointer" @click.stop="handleDelete(item)" />
          </u-row>
            <u-row gap="gap-1">
              <u-text>Rp. </u-text>
              <u-text size="lg" class="font-bold" color="text-primary">{{ formatRupiah(item?.subtotal) }}</u-text>
            </u-row>
        </u-col>
      </u-row>
    </u-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { api } from '@/services/api'
import { formatRupiah } from '@/utils/numberHelper'
import { formatJamMenit } from '@/utils/dateHelper'

const focusId = ref(null)

const props = defineProps({
  item: { type: Object, default: null },
  store: { type: Object, required: true },
  isHovered: { type: Boolean, default: false },
})

const loadingHapusItem = ref(false)


const handleSelectedBarang = (item) => {

  // console.log('handleSelectedBarang', item);
  // console.log('handleSelectedBarang', props.store.form.rinci);
  
  // const rinci = props.store.form.rinci
  // const rincians = rinci.filter(el => el.kode_barang === item.kode_barang)

  // console.log('rincians', rincians);
  
  // props.store.barangSelected = item
  // // console.log('handleSelectedBarang', item);
  // searchBarang.value = ''
  // handleFocus(inpJumlahRef)
  
}

const handleDelete = async (item) => {


  const payload = {
    kode_barang: item?.kode_barang ?? null,
    nopenjualan: props.store.form?.nopenjualan,
  }

  

  // console.log('handleDelete payload', props.store.form.rinci);

  try {
    const resp = await api.post(`api/v1/transactions/penjualan/hapus`, payload)

    // console.log('resp hapus', resp);
    const rincian = props?.store?.form?.rinci?.filter(el => el?.kode_barang !== item?.kode_barang)
    props.store.form.rinci = rincian


    // console.log('handleDelete resp', props.store.form.rinci);
    if (props?.store?.form?.rinci?.length === 0) {
      props.store.init()
    }
    props.store.fetchAll()

  } catch (error) {
    console.log('error', error);
  } finally {
    loadingHapusItem.value = false
  }

  
}
</script>