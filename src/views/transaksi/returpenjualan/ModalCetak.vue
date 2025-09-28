<template>
  <u-modal persistent :title="`${title}`" size="xl" @close="emit('close')">
    <template #default>
      <div id="printArea" ref="printArea" class=" max-w-full bg-white text-black mx-auto  p-4 print-a4">


        <!-- Header -->

        <!-- Header -->
        <div class="flex items-start justify-between gap-6">
          <div class="flex items-center gap-4">
            <img src="/images/logo.svg" alt="logo" class="w-14 h-14 object-contain" />
            <div>
              <div class="text-xl font-semibold tracking-wide">{{ company?.nama }}</div>
              <p class="text-sm text-gray-600">
                {{ company?.alamat }}<br />
                • Telp: {{ formatTeleponID(company?.telepon) }}
                <!-- • Email: {{ company?.email || 'email Apotik nya' }} -->
              </p>
            </div>
          </div>
          <div class="text-right">
            <div class="inline-block px-3 py-1 rounded-full border text-xs uppercase tracking-wider">
              Retur Penjualan
            </div>
            <div class="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
              <div class="text-gray-500">No. Retur</div>
              <div class="font-medium">{{ data?.noretur || '-' }}</div>
              <div class="text-gray-500">Tanggal</div>
              <div class="font-medium">{{ formatDateIndo(data?.tgl_retur) }}</div>
              <div class="text-gray-500">Referensi Faktur</div>
              <div class="font-medium">{{ data?.nopenjualan || '-' }}</div>
            </div>
          </div>
        </div>


        <div class="w-full border-t border-dotted border-black my-1"></div>
        <!-- Parties -->
        <div class="grid sm:grid-cols-2 gap-6 text-sm">
          <div class="p-4 rounded-xl bg-gray-50">
            <div class="text-gray-500 text-xs uppercase">Gudang / Penerima</div>
            <div class="mt-1 font-medium">{{ company?.nama }}</div>
            <div class="text-gray-700 leading-snug">
              <div>Petugas: {{ data?.kode_user || '-' }}</div>
            </div>
          </div>
          <div class="p-4 rounded-xl">
            <!-- <div class="text-gray-500 text-xs uppercase">Gudang / Penerima</div>
            <div class="mt-1 font-medium">{{ company?.nama }}</div>
            <div class="text-gray-700 leading-snug">
              <div>Petugas: {{ data?.kode_user || '-' }}</div>
            </div> -->
          </div>
        </div>




        <div class="w-full border-t border-dashed border-black my-1"></div>


        <!-- Items Table -->
        <div class="mt-6">
          <table class="w-full text-sm border-separate [border-spacing:0]">
            <thead>
              <tr class="text-left">
                <th class="th">#</th>
                <th class="th">Kode</th>
                <th class="th">Nama Barang</th>
                <th class="th text-right">Qty</th>
                <th class="th text-right">Harga</th>
                <th class="th text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, idx) in data?.retur_penjualan_r" :key="idx" class="align-top">
                <td class="td text-gray-500">{{ idx + 1 }}</td>
                <td class="td">{{ it?.kode_barang || '-' }}</td>
                <td class="td">
                  <div class="font-medium">{{ it?.master?.nama || '-' }}</div>
                  <div class="text-gray-500">Batch: {{ it?.nobatch || '-' }}
                    <!-- • Exp: {{ it.tgl_exprd ? formatDateIndo(it.tgl_exprd) : '-' }} -->
                  </div>
                </td>
                <td class="td text-right">{{ it?.jumlah_k || '-' }}</td>
                <td class="td text-right">{{ formatRupiah(it?.harga) || '-' }}</td>
                <td class="td text-right">{{ formatRupiah((Number(it?.jumlah_k) || 0) * (Number(it?.harga) || 0)) }}
                </td>
              </tr>
              <tr v-if="data?.rincian?.length === 0">
                <td class="td text-center text-gray-500" colspan="8">Belum ada item retur.</td>
              </tr>
            </tbody>
          </table>
        </div>


        <!-- <div class="w-full border-t border-dotted border-black my-4"></div> -->

        <!-- Totals & Notes -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="rounded-xl p-4">
            <!-- <div class="text-gray-500 text-xs uppercase">Catatan</div>
            <p class="mt-1 whitespace-pre-wrap leading-relaxed">{{ 'doc.notes' || '—' }}</p>
            <div class="mt-4 flex items-center gap-3">
              <div class="text-xs text-gray-500">Metode Pengembalian</div>
              <div class="px-2 py-1 rounded-lg border text-xs">{{ 'doc.refundMethod '|| 'Saldo / Kas' }}</div>
            </div> -->
          </div>
          <div class="rounded-xl p-4 bg-gray-50">
            <div class="space-y-2 text-sm">
              <div class="flex items-center justify-between">
                <span>Subtotal</span>
                <span class="font-medium">Rp . {{ formatRupiah(totalSubtotal) }}</span>
              </div>
              <!-- <div class="flex items-center justify-between">
                <span>Pajak </span>
                <span class="font-medium">Rp. {{ formatRupiah(totalPajak) }}</span>
              </div> -->
              <!-- <div class="flex items-center justify-between" >
              <span>Biaya Restock</span>
              <span class="font-medium">{{ 'formatIDR(doc.restockingFee)' }}</span>
            </div> -->
              <div class="border-t my-2"></div>
              <div class="flex items-center justify-between text-base">
                <span class="font-semibold">Total Pengembalian</span>
                <span class="font-semibold">Rp . {{ formatRupiah(totals) }}</span>
              </div>
            </div>
          </div>
        </div>




        <div class="mt-2 pt-6 text-center text-[10px] leading-snug">
          <div class="w-full border-t border-dashed border-black my-1"></div>
          <p class="mt-2">&copy; 2025 CV Udumbara Informatika</p>
        </div>

      </div>
    </template>

    <template #footer>
      <u-row flex1 class="w-full" right>
        <u-btn variant="secondary" label="Batal" @click="$emit('close')" />
        <u-btn v-print="printObj" label="Cetak" type="button" />
      </u-row>
    </template>
  </u-modal>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { formatDateIndo, formatTimeOnly } from '@/utils/dateHelper'
import { formatRupiah, formatTeleponID } from '@/utils/numberHelper'
import { useAppStore } from '@/stores/app'
const props = defineProps({
  store: { type: Object, required: true },
  title: { type: String, default: 'Data' },
})
const emit = defineEmits(['close', 'save'])
const app = useAppStore()
const company = computed(() => {
  return app?.form || null
})

const data = computed(() => {
  return props.store.form
})
const totalSubtotal = computed(() => {
  const items = data?.value?.retur_penjualan_r || []
  return items.reduce((total, item) => {
    const qty = Number(item?.jumlah_k) || 0
    const harga = Number(item?.harga) || 0
    return total + (qty * harga)
  }, 0)
})

const totals = computed(() => {
  return totalSubtotal.value || 0
})

// console.log('data', data.value);

const printObj = {
  id: '#printArea', // ref elemen yang mau diprint
  popTitle: 'Retur PBF',
  preview: false,
  extraCss: '',
  extraHead: '',
  beforeOpenCallback (vue) {
    console.log('wait...')
  },
  openCallback (vue) {
    console.log('opened')
  },
  closeCallback (vue) {
    console.log('closePrint')
    emit('close')
  }
}


</script>

<style scoped>

</style>