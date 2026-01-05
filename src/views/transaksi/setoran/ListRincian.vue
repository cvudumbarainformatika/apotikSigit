<template>
  <u-view flex1 class="w-full">
    <u-grid cols="5" class="items-center">

      <!-- CHECKBOX MANUAL -->
      <u-col class="col-span-1 flex justify-center">
        <input
          v-if="flag === 1"
          type="checkbox"
          :checked="checked"
          @change="$emit('toggle', { item, checked: $event.target.checked })"
          class="accent-blue-600 scale-110"
        />
      </u-col>

      <!-- DATA -->
      <u-col class="col-span-3" gap="gap-1">
        <u-text class="font-bold">{{ item?.nopenjualan }}</u-text>

        <u-text size="xs" color="text-gray-500">
          Tgl Transaksi : {{ formatDateIndo(item?.tgl_penjualan || '-') }}
        </u-text>

        <u-text size="xs" color="text-gray-500">
          No Faktur : {{ item?.nominal_transaksi || '-' }}
        </u-text>
      </u-col>

      <!-- HARGA + DELETE -->
      <u-col align="items-end" class="col-span-1" gap="gap-0">
        <u-row>
          <u-col align="items-end" gap="gap-0">
            <u-text size="md" class="font-bold" color="text-gray-500">
              Rp. {{ formatRupiah(item?.nominal_transaksi || 0) }}
            </u-text>
            <span class="text-xs font-normal">{{ item?.satuan_b }}</span>
          </u-col>

          <div v-if="flag === 2" class="ml-2">
            <u-icon
              size="20"
              name="delete"
              class="mb-0 text-danger cursor-pointer"
              @click.stop="handleDelete(item)"
            />
          </div>
        </u-row>
      </u-col>

    </u-grid>
  </u-view>
</template>

<script setup>
import { ref } from 'vue'
import { api } from '@/services/api'
import { formatDateIndo } from '@/utils/dateHelper'
import { useNotificationStore } from '@/stores/notification'
import { formatRupiah } from '@/utils/numberHelper'

const props = defineProps({
  item: { type: Object, required: true },
  store: { type: Object, required: true },
  isHovered: { type: Boolean, default: false },
  checked: { type: Boolean, default: false },
  flag: { type: Number, default: 0 }
})

const emit = defineEmits(['toggle'])

const loadingHapusItem = ref(false)
const notify = useNotificationStore().notify

/* CHECKBOX HANDLER */
// const onToggle = (e) => {
//   emit('toggle', {
//     item: props.item,
//     checked: e.target.checked
//   })
// }

/* DELETE ITEM */
const handleDelete = async (item) => {
  loadingHapusItem.value = true

  try {
    const resp = await api.post(
      'api/v1/transactions/pembayaran-hutang/delete',
      {
        nopelunasan: item?.nopelunasan,
        nopenerimaan: item?.nopenerimaan,
        noorder: item?.noorder
      }
    )

    props.store.form.rinci =
      props.store.form.rinci.filter(el => el.id !== item.id)

    notify({
      message: resp.data.message ?? 'Data Berhasil dihapus',
      type: 'success'
    })

    props.store.fetchAll()
  } catch (err) {
    notify({
      message: err.response?.data?.message ?? 'Data Gagal dihapus',
      type: 'error'
    })
  } finally {
    loadingHapusItem.value = false
  }
}
</script>
