<template>
  <u-modal persistent :title="`${title}`" size="xl" @close="emit('close')" :model-value="modelValue">
    <template #default>
      <div class="flex gap-2 mb-4">
        <u-btn size="sm" :variant="activeView === 'view1' ? 'primary' : 'secondary'" label="Reguler"
          @click="changeView('view1')" />
        <u-btn size="sm" :variant="activeView === 'view2' ? 'primary' : 'secondary'" label="Prekursor"
          @click="changeView('view2')" />
        <u-btn size="sm" :variant="activeView === 'view3' ? 'primary' : 'secondary'" label="Obat Tertentu"
          @click="changeView('view3')" />
      </div>
      <div v-show="activeView === 'view1'" id="printArea1"  class="max-w-full bg-white text-black mx-auto p-4 print-a4">
      <!-- Header -->
        <div class="flex items-start justify-between gap-6">
          <div class="flex items-center gap-4">
            <img :src="company?.foto" alt="logo" class="w-14 h-14 object-contain" />
            <div>
              <div class="text-xl font-semibold tracking-wide">{{ company?.nama }}</div>
              <p class="text-sm text-gray-600">
                Nomor SIA : {{ company?.sipa }}<br />
              </p>
              <p class="text-sm text-gray-600">
                {{ company?.alamat || 'Belum di setting' }}<br />
                Telp: {{ formatTeleponID(company?.telepon) || '0' }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <div class="inline-block px-3 py-1 rounded-full border text-xs uppercase tracking-wider">
              SURAT PESANAN
            </div>
            <div class="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
              <div class="text-gray-500">Tanggal</div>
              <div class="font-medium">{{ formatDateIndo(data?.tgl_order) }}</div>
              <div class="text-gray-500">No. SP</div>
              <div class="font-medium">{{ data?.nomor_order || '-' }}</div>
              <div class="text-gray-500">Kepada</div>
              <div class="font-medium">{{ data?.supplier?.nama || '-' }}</div>
            </div>
          </div>
        </div>

        <div class="w-full border-t border-dashed border-black my-1"></div>
        
        <div class="flex items-start justify-between gap-6">
            <div class="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-sm">
              <div class="text-gray-500">Apoteker :
                <span class="font-medium">{{ data?.apoteker?.nama || '-' }} ({{ data?.apoteker?.sipa || '-' }})</span>
              </div>

            </div>
            <div class="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-sm">
              <!-- <div class="text-gray-500">Apoteker :
                <span class="font-medium">{{ data?.user?.nama || '-' }} ({{ data?.user?.kode || '-' }})</span>
              </div> -->
            </div>
          </div>

          <!-- Items Table -->
        <div class="mt-3">
          <table class="w-full text-sm border-separate [border-spacing:0]">
            <thead>
              <tr class="text-left">
                <th class="th">#</th>
                <th class="th">Kode</th>
                <th class="th">Nama Barang</th>
                <th class="th">Kandungan</th>
                <th class="th text-right">Jumlah Pesan</th>
                <!-- <th class="th text-right">Harga</th>
                <th class="th text-right">Diskon</th>
                <th class="th text-right">pajak</th> -->
                <!-- <th class="th text-right">Subtotal</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, idx) in data?.order_records" :key="idx" class="align-top">
                <td class="td text-gray-500">{{ idx + 1 }}</td>
                <td class="td">{{ it?.kode_barang || '-' }}</td>
                <td class="td">
                  <div class="font-medium">{{ it?.master?.nama || '-' }}</div>
                  <!-- <div class="text-gray-500">Batch: {{ it?.kandungan || '-' }}</div> -->
                </td>
                <td class="td">{{ it?.kandungan || '-' }}</td>
                <td class="td text-right">{{ it?.jumlah_pesan || 0 }} {{ it?.satuan_b }}</td>
                <!-- <td class="td text-right">{{ formatRupiah(it?.harga_b) || '-' }}</td> -->
                <!-- <td class="td text-right">{{ it?.discount ? formatRupiah(it?.discount) : '-' }}</td> -->
                <!-- <td class="td text-right">{{ formatRupiah(it?.pajak_rupiah) || '-' }}</td> -->
                <!-- <td class="td text-right">{{ formatRupiah(it?.subtotal) || '-' }}</td> -->
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
            <!-- <div class="text-gray-500 text-xs uppercase">Catatan</div> -->
            <!-- <p class="mt-1 whitespace-pre-wrap leading-relaxed">{{ 'doc.notes' || '—' }}</p> -->
            <!-- <div class="mt-4 flex items-center gap-3">
              <div class="text-xs text-gray-500">Metode Pengembalian</div>
              <div class="px-2 py-1 rounded-lg border text-xs">{{ 'doc.refundMethod '|| 'Saldo / Kas' }}</div>
            </div> -->
          </div>
          <div class="rounded-xl p-4">
            <div class="space-y-2 text-sm">
              <div class="flex items-center justify-between">
                <span>Total Item Order</span>
                <span class="font-medium">{{ data.order_records?.length || 0 }}</span>
              </div>
              <!-- <div class="flex items-center justify-between" >
                <span>Pajak </span>
                <span class="font-medium">Rp. {{ formatRupiah(totalPajak) }}</span>
              </div> -->
              <!-- <div class="flex items-center justify-between" >
                <span>Biaya Restock</span>
                <span class="font-medium">{{ 'formatIDR(doc.restockingFee)' }}</span>
              </div> -->
              <div class="border-t my-2"></div>
              <div class="kanan">
                <div class="mt-0 grid grid-cols-1 gap-x-6 gap-y-1 text-sm">
                  <div class="mt-10 text-center">Probolinggo, {{ today }} </div>
                  <div class="flex justify-center ">
                    <div ref="qrRefReguler"></div>
                  </div>
                  <div class="text-center">{{ data?.apoteker?.nama || '-' }}</div>
                  <div class="text-center">{{ data?.apoteker?.sipa || '-' }}</div>
                </div>
              </div>
              <!-- <div class="flex items-center justify-between text-base">
                <span class="font-semibold">Total Pengembalian</span>
                <span class="font-semibold">Rp . {{ formatRupiah(totals) }}</span>
              </div> -->
            </div>
          </div>
        </div>
  
          <div class="mt-2 pt-6 text-center text-[10px] leading-snug">
            <div class="w-full border-t border-dashed border-black my-1"></div>
            <p class="mt-2">&copy; 2025 CV Udumbara Informatika</p>
          </div>
      </div>

      <div v-show="activeView === 'view2'" id="printArea2"
        class="w-full bg-white text-black mx-auto p-4 print-a4">
        <div class="">
          <div class="w-full mt-3 text-center">SURAT PESANAN OBAT MENGANDUNG PREKUSOR FARMASI</div>
          <div class="flex items-start gap-6">
            <div class="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-sm">
              <div class="w-full"> Yang bertanda tangan di bawah ini :</div>
              <div class="mt-0 grid grid-cols-2 gap-x-2 gap-y-0 text-sm">
                <div class="">Nama</div>
                <div class="">: {{ data?.apoteker?.nama || '-' }}</div>
                <div class="">Jabatan</div>
                <div class="">: Apoteker Penanggung Jawab</div>
                <div class="">Nomor SIPA</div>
                <div class="">: {{ data?.apoteker?.sipa || '-' }}</div>
                <!-- <div class="text-gray-500">Supplier</div>
                <div class="font-medium">{{ data?.supplier?.nama || '-' }}</div> -->
              </div>
              <div class="w-full">Mengajukan pesanan obat mengandung prekursor farmasi kepada :</div>
              <div class="mt-0 grid grid-cols-2 gap-x-2 gap-y-0 text-sm">
                <div class="">Nama Distributor</div>
                <div class="">: {{ data?.supplier?.nama || '-' }}</div>
                <div class="">Alamat</div>
                <div class="">: {{ data?.supplier?.alamat || '-' }}</div>
              </div>
              <div class="w-full">Jenis obat mengandung prekursor farmasi yang dipesan adalah :</div>
            </div>
            <div class="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-sm">
            </div>
          </div>

          <!-- Items Table -->
          <div class="mt-2">
            <table class="w-full text-sm border-separate [border-spacing:0]">
              <thead>
                <tr class="text-left">
                  <th class="th">No</th>
                  <th class="th">Nama Obat</th>
                  <th class="th">Zat Aktif Prekursor Farmasi</th>
                  <th class="th">Bentuk/Kekuatan Sediaan</th>
                  <th class="th">Satun</th>
                  <th class="th text-right">Jumlah</th>
                  <th class="th">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(it, idx) in data?.order_records" :key="idx" class="align-top">
                  <td class="td text-gray-500">{{ idx + 1 }}</td>
                  <td class="td">
                    <div class="font-medium">{{ it?.master?.nama || '-' }}</div>
                  </td>
                  <td class="td">{{ it?.master?.kandungan || '-' }}</td>
                  <td class="td">{{ it?.master?.kesediaan || '-' }}</td>
                  <td class="td">{{ it?.satuan_b }}</td>
                  <td class="td text-right">{{ it?.jumlah_pesan || 0 }} {{ it?.satuan_b }}</td>
                  <td class="td">{{ it?.keterangan || '-' }}</td>
                </tr>
                <tr v-if="data?.rincian?.length === 0">
                  <td class="td text-center text-gray-500" colspan="8">Belum ada item retur.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="w-full mt-3 text-sm"> Obat mengandung prekursor farmasi tersebut akan digunakan untuk memenuhi
            kebutuhan
            :</div>
          <!-- Totals & Notes -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="kiri">
              <div class="mt-0 grid grid-cols-1 gap-x-6 gap-y-1 text-sm">
                <div class="mt-0 grid grid-cols-2 gap-x-2 gap-y-0 text-sm">
                  <div class="">Nama Apotek</div>
                  <div class="">: {{ company?.nama || 'Belum di setting' }}</div>
                  <div class="">Alamat Apotek</div>
                  <div class="">: {{ company?.alamat || 'Belum di setting' }}</div>
                  <div class="">Nomor SIA</div>
                  <div class="">: {{ company?.sipa || 'Belum di setting' }}</div>
                </div>
              </div>
            </div>
            <div class="kanan">
              <div class="mt-0 grid grid-cols-1 gap-x-6 gap-y-1 text-sm">
                <div class="mt-10 text-center">Probolinggo, {{ today }} </div>
                <div class="flex justify-center ">
                  <div ref="qrRefPrekursor"></div>
                </div>
                <div class="text-center">{{ data?.apoteker?.nama || '-' }}</div>
                <div class="text-center">{{ data?.apoteker?.sipa || '-' }}</div>
              </div>
            </div>
          </div>

          <div class="mt-2 pt-6 text-center text-[10px] leading-snug">
            <div class="w-full border-t border-dashed border-black my-1"></div>
            <p class="mt-2">&copy; 2025 CV Udumbara Informatika</p>
          </div>
        </div>
      </div>


      <!-- PRINT 2 -->
      <div v-show="activeView === 'view3'" id="printArea3"
        class="w-full bg-white text-black mx-auto p-4 print-a4">
        <div class="">
          <div class="w-full mt-3 text-center">SURAT PESANAN OBAT-OBATAN TERTENTU</div>
          <div class="flex items-start gap-6">
            <div class="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-sm">
              <div class="w-ful"> Yang bertanda tangan di bawah ini :</div>
              <div class="mt-0 grid grid-cols-2 gap-x-2 gap-y-0 text-sm">
                <div class="">Nama</div>
                <div class="">: {{ data?.apoteker?.nama || '-' }}</div>
                <div class="">Jabatan</div>
                <div class="">: Apoteker Penanggung Jawab</div>
                <div class="">Nomor SIPA</div>
                <div class="">: {{ data?.apoteker?.sipa || '-' }}</div>
                <!-- <div class="text-gray-500">Supplier</div>
                <div class="font-medium">{{ data?.supplier?.nama || '-' }}</div> -->
              </div>
              <div class="w-ful">Mengajukan pesanan obat-obatan tertentu kepada :</div>
              <div class="mt-0 grid grid-cols-2 gap-x-2 gap-y-0 text-sm">
                <div class="">Nama Distributor</div>
                <div class="">: {{ data?.supplier?.nama || '-' }}</div>
                <div class="">Alamat</div>
                <div class="">: {{ data?.supplier?.alamat || '-' }}</div>
              </div>
              <div class="w-ful">Jenis obat-obatan tertentu yang dipesan adalah :</div>
            </div>
            <div class="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-sm">
            </div>
          </div>

          <!-- Items Table -->
          <div class="mt-2">
            <table class="w-full text-sm border-separate [border-spacing:0]">
              <thead>
                <tr class="text-left">
                  <th class="th">No</th>
                  <th class="th">Nama Obat</th>
                  <th class="th">Zat Aktif Prekursor Farmasi</th>
                  <th class="th">Bentuk/Kekuatan Sediaan</th>
                  <th class="th">Satun</th>
                  <th class="th text-right">Jumlah</th>
                  <th class="th">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(it, idx) in data?.order_records" :key="idx" class="align-top">
                  <td class="td text-gray-500">{{ idx + 1 }}</td>
                  <td class="td">
                    <div class="font-medium">{{ it?.master?.nama || '-' }}</div>
                  </td>
                  <td class="td">{{ it?.master?.kandungan || '-' }}</td>
                  <td class="td">{{ it?.master?.kesediaan || '-' }}</td>
                  <td class="td">{{ it?.satuan_b }}</td>
                  <td class="td text-right">{{ it?.jumlah_pesan || 0 }} {{ it?.satuan_b }}</td>
                  <td class="td">{{ it?.keterangan || '-' }}</td>
                </tr>
                <tr v-if="data?.rincian?.length === 0">
                  <td class="td text-center text-gray-500" colspan="8">Belum ada item retur.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="w-full mt-3 text-sm"> Obat tertentu tersebut akan digunakan untuk memenuhi
            kebutuhan
            :</div>
          <!-- Totals & Notes -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="kiri">
              <div class="mt-0 grid grid-cols-1 gap-x-6 gap-y-1 text-sm">
                <div class="mt-0 grid grid-cols-2 gap-x-2 gap-y-0 text-sm">
                  <div class="">Nama Apotek</div>
                  <div class="">: {{ company?.nama || 'Belum di setting' }}</div>
                  <div class="">Alamat Apotek</div>
                  <div class="">: {{ company?.alamat || 'Belum di setting' }}</div>
                  <div class="">Nomor SIA</div>
                  <div class="">: {{ company?.sipa || 'Belum di setting' }}</div>
                </div>
              </div>
            </div>
            <div class="kanan">
              <div class="mt-0 grid grid-cols-1 gap-x-6 gap-y-1 text-sm">
                <div class="mt-10 text-center">Probolinggo, {{ today }} </div>
                <div class="flex justify-center ">
                  <div ref="qrRefObatlain"></div>
                </div>
                <div class="text-center">{{ data?.apoteker?.nama || '-' }}</div>
                <div class="text-center">{{ data?.apoteker?.sipa || '-' }}</div>
              </div>
            </div>
          </div>

          <div class="mt-2 pt-6 text-center text-[10px] leading-snug">
            <div class="w-full border-t border-dashed border-black my-1"></div>
            <p class="mt-2">&copy; 2025 CV Udumbara Informatika</p>
          </div>
        </div>
      </div>
    </template>

     <template #footer>
      <u-row flex1 class="w-full" right>
        <u-btn variant="secondary" label="Batal" @click="$emit('close')" />
        <u-btn v-if="activeView === 'view1'" v-print="printreguler" label="Cetak" />
        <u-btn v-if="activeView === 'view2'" v-print="printprekursor" label="Cetak" />
        <u-btn v-if="activeView === 'view3'" v-print="printobatlain" label="Cetak" />
      </u-row>
    </template>
  </u-modal>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { formatDateIndo, formatDateIndofull, formatTimeOnly } from '@/utils/dateHelper'
import { formatRupiah, formatTeleponID } from '@/utils/numberHelper'

import { useAppStore } from '@/stores/app'
import QRCode from 'qrcode'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  store: { type: Object, required: true },
  title: { type: String, default: 'Data' },
})
const emit = defineEmits(['close', 'save'])
const activeView = ref('view1')
const today = computed(() => {
  return formatDateIndofull(new Date())
})
const app = useAppStore()
const company = computed(() => {
  return app?.form || null
})

const data = computed(() => {
  return props.store.form
})
const qrRefReguler = ref(null)
const qrRefPrekursor = ref(null)
const qrRefObatlain = ref(null)

const renderQR = async (el, text) => {
  await nextTick()
  if (!el || !text) return

  el.innerHTML = ''

  try {
    const svg = await QRCode.toString(text, {
      type: 'svg',
      width: 90,
      margin: 1
    })
    el.innerHTML = svg
  } catch (e) {
    console.error(e)
  }
}


watch(
  [() => props.modelValue, activeView],
  async ([open, view]) => {
    if (!open) return

    await nextTick()
    const sipa = data?.value?.apoteker?.sipa
    if (!sipa) return

    if (view === 'view1') {
      renderQR(qrRefReguler.value, sipa)
    }

    if (view === 'view2') {
      renderQR(qrRefPrekursor.value, sipa)
    }

    if (view === 'view3') {
      renderQR(qrRefObatlain.value, sipa)
    }
  },
  { immediate: true }
)

const totalSubtotal = computed(() => {
  const items = data?.value?.rincian || []
  return items.reduce((a, b) => a + Number(b?.subtotal), 0)
})
const totalPajak = computed(() => {
  const items = data?.value?.rincian || []
  return items.reduce((a, b) => a + Number(b?.pajak_rupiah), 0)
})

const totals = computed(() => {
  return (totalSubtotal.value + totalPajak.value) || 0
})
const canPrint = ref(false)
watch(activeView, async () => {
  canPrint.value = false
  await nextTick()
  canPrint.value = true
}, { immediate: true })

const changeView = async (view) => {
  activeView.value = view
  await nextTick()
}

const printAreaMap = {
  view1: '#printArea1',
  view2: '#printArea2',
  view3: '#printArea3',
}

const printreguler = computed(() => ({
  id: '#printArea1',
  popTitle: 'Surat Pesanan',
  preview: false,
  extraCss: '',
  extraHead: '',
  beforeOpenCallback(vue) {
    console.log('wait...')
  },
  openCallback(vue) {
    console.log('opened')
  },
  closeCallback(vue) {
    console.log('closePrint')
    emit('close')
  }
}))
const printprekursor = computed(() => ({
  id: '#printArea2',
  popTitle: 'Surat Pesanan',
  preview: false,
  extraCss: '',
  extraHead: '',
  beforeOpenCallback(vue) {
    console.log('wait...')
  },
  openCallback(vue) {
    console.log('opened')
  },
  closeCallback(vue) {
    console.log('closePrint')
    emit('close')
  }
}))

const printobatlain = computed(() => ({
  id: '#printArea3',
  popTitle: 'Surat Pesanan',
  preview: false,
  extraCss: '',
  extraHead: '',
  beforeOpenCallback(vue) {
    console.log('wait...')
  },
  openCallback(vue) {
    console.log('opened')
  },
  closeCallback(vue) {
    console.log('closePrint')
    emit('close')
  }
}))

</script>

<style scoped>

</style>