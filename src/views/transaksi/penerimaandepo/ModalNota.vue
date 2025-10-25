<template>
  <u-modal persistent :title="`${title}`" @close="emit('close')" size="lg">
    <template #default>
      <div id="printArea" ref="printArea" class=" max-w-full bg-white text-black mx-auto  p-4 print-a4">

        <div class="flex items-start justify-between gap-6">
          <div class="flex items-center gap-4">
            <img src="/images/logo.svg" alt="logo" class="w-14 h-14 object-contain" />
            <div>
              <div class="text-xl font-semibold tracking-wide">{{ company?.nama || 'Nama Apotik nya' }}</div>
              <p class="text-sm text-gray-600">
                {{ company?.alamat }}<br />
                • Telp: {{ formatTeleponID(company?.telepon) }}
                <!-- • Email: {{ company?.email || 'email Apotik nya' }} -->
              </p>
            </div>
          </div>
          <div class="text-right">
            <div class="inline-block px-3 py-1 rounded-full border text-xs uppercase tracking-wider">
              PENERIMAAN BARANG
            </div>
            <div class="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
              <div class="text-gray-500">Nomor:</div>
              <div class="font-medium">{{ form?.nopenerimaan || '-' }}</div>

            </div>
          </div>
        </div>

        <div class="w-full border-t border-dashed border-black my-1"></div>

        <div class="flex justify-between text-[12px] mt-2">
          <div>No Faktur {{ form?.nofaktur }}</div>
          <div class="text-right">{{ formatDateIndo(form?.tgl_penerimaan) }}</div>
        </div>
        <div class="flex justify-between text-[12px] mt-1">
          <div>Petugas: {{ user?.nama || '-' }}</div>
          <div class="text-right"> Jam : {{ formatTimeOnly(form?.tgl_penerimaan) }}</div>
        </div>

        <div class="w-full border-t border-dashed border-black my-1"></div>

        <!-- Items Table -->
        <div class="mt-6">
          <table class="w-full text-sm border-separate [border-spacing:0]">
            <thead>
              <tr class="text-left text-bold">
                <th class="th">#</th>
                <th class="th p-1">Nama Barang</th>
                <th class="th p-1">Nobatch</th>
                <th class="th p-1">Jumlah Barang</th>
                <th class="th text-right p-1">Harga Barang (Rp)</th>
                <th class="th text-right p-1">Disc</th>
                <th class="th text-right p-1">Subtotal (Rp)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in groupedItems" :key="index">
                <td class="td text-gray-500">{{ index + 1 }}</td>
                <td class="td p-1 text-left">{{ item?.nama || '-' }}</td>
                <td class="td p-1 text-left">{{ item?.nobatch || '-' }}</td>
                <td class="td p-1 text-left">{{ item?.jumlah_b }} {{ item?.satuan_b }}</td>
                <td class="td p-1 text-right">{{ formatRupiah(item?.harga_b) }}</td>
                <td class="td p-1 text-right">
                  <div>({{ formatRupiah(item?.diskon) }}%)</div>
                  <div>Rp. {{ formatRupiah(item?.diskonitems) }}</div>
                </td>
                <td class="td p-1 text-right">{{ formatRupiah(item?.subtotal) }}</td>
              </tr>
              <tr v-if="groupedItems?.length === 0">
                <td class="td text-center text-gray-500" colspan="8">Belum ada Item Penerimaan.</td>
              </tr>
            </tbody>
          </table>
        </div>


        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="rounded-xl p-4">
            <div class="space-y-2 text-sm">
              Pembayaran: <span class="font-semibold">{{ form?.hutang }}</span>
            </div>
          </div>
          <div class="rounded-xl p-4 bg-gray-50">
            <div class="space-y-2 text-sm">
              <div class="flex items-center justify-between">
                <span>Subtotal</span>
                <span class="font-medium">Rp . {{ formatRupiah(subTotal) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Pajak </span>
                <span class="font-medium">Rp. {{ formatRupiah(totalPajak) }}</span>
              </div>
              <div class="border-t my-2"></div>
              <div class="flex items-center justify-between text-sm">
                <span class="font-semibold">Total Penerimaan</span>
                <span class="font-semibold">Rp . {{ formatRupiah(totalPenerimaan) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="w-full border-t border-dotted border-black my-1"></div>

        <div class="text-[12px] pt-4">
          <div class="flex justify-between font-semibold text-[12px]">
            <div class="row w-full text-center">
              <div class="col-12 px-2">Supplier</div>
              <div class="col-12 px-2"> {{ store.form?.suplier?.nama }} </div>
              <div class="col-12 px-2 pt-8" style="height: 60px"> </div>
              <div class="col my-1 justify-self-center" style="width: 200px">
                <div class="border-t border-dashed border-black"></div>
              </div>

            </div>
            <div class="col w-full text-center">
              <div class="col-12 px-2">Diterima Oleh</div>
              <div class="col-12 px-2 pt-12" style="height: 80px"> </div>
              <div class="col my-1 justify-self-center" style="width: 200px">
                <div class="border-t border-dashed border-black"></div>
              </div>
            </div>
          </div>
        </div>



        <div class="mt-2 pt-6 text-center text-[10px] leading-snug">
          <div class="w-full border-t border-dashed border-black my-1"></div>
          <!-- <p class="mt-1">Terimakasih atas kunjungan anda</p>
        <p class="opacity-60">Simpan struk ini sebagai bukti transaksi.</p> -->
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
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { formatRupiah, formatTeleponID } from '@/utils/numberHelper'
import { formatDateIndo, formatTimeOnly } from '@/utils/dateHelper'
import { useAppStore } from '@/stores/app'
const props = defineProps({
  store: { type: Object, required: true },
  title: { type: String, default: 'Penerimaan' },
  form: { type: Object, default: null },
})
const emit = defineEmits(['close', 'save'])
const app = useAppStore()
const auth = useAuthStore()
const { user } = storeToRefs(auth)


const printType = ref('a4') // 'a4' | 'thermal-58 | 'thermal-80' | 'thermal-100'
const company = computed(() => {
  return app?.form || null
})
// console.log('form', props?.store?.form)
const groupedItems = computed(() => {
  const map = new Map()
  // console.log('store', props.store?.form)
  const items = props?.store?.form?.rincian ?? []
  items.forEach(item => {
    const key = item.kode_barang
    if (!map.has(key)) {
      map.set(key, {
        kode_barang: item?.kode_barang,
        nama: item?.barang?.nama,
        satuan_k: item?.satuan_k,
        satuan_b: item?.satuan_b,
        nobatch: item?.nobatch,
        jumlah_k: Number(item?.jumlah_k),
        jumlah_b: Number(item?.jumlah_b),
        harga: Number(item?.harga),
        harga_b: Number(item?.harga_b),
        diskon: Number(item?.diskon_persen),
        diskonitems: Number(item?.harga_b) * Number(item?.jumlah_b) * (Number(item?.diskon_persen)/Number(100)),
        subtotal: Number(item?.subtotal) - (Number(item?.pajak_rupiah) * Number(item?.jumlah_k || 0)),
        created_at: item?.created_at
      })
    } 
    // else {
    //   const existing = map.get(key)
    //   existing.jumlah_k += Number(item.jumlah_k)
    //   existing.subtotal += Number(item.subtotal)
    //   // update created_at jika lebih baru
    //   if (new Date(item.created_at) > new Date(existing.created_at)) {
    //     existing.created_at = item.created_at
    //   }
    // }
  })

  return Array.from(map.values())
})

const subTotal = computed(() => {
  const items = props?.store?.form?.rincian ?? []
  return items.reduce((a, b) => a + Number(b?.subtotal - (b?.pajak_rupiah * b?.jumlah_k)), 0)
})

const totalPajak = computed(() => {
  const items = props?.store?.form?.rincian ?? []
  return items.reduce((a, b) => a + Number(b?.pajak_rupiah * b?.jumlah_k), 0)
})


const totalPenerimaan = computed(() => {
  const items = props?.store?.form?.rincian ?? []
  return items.reduce((a, b) => a + Number(b?.subtotal), 0)
})

// const kembali = computed(() => {
//   if (props?.formBayar?.jumlah_bayar < totalPenerimaan.value) {
//     return 0
//   } 
//   return props.formBayar?.jumlah_bayar - totalPenerimaan.value
// })

const printArea = ref(null)

const printObj = {
  id: '#printArea', // ref elemen yang mau diprint
  popTitle: 'Penerimaan Barang',
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
