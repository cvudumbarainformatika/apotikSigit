<template>
  <u-modal persistent :title="`${title}`" @close="emit('close')" size="xl">
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
            <!-- <div class="inline-block px-3 py-1 rounded-full border text-sm uppercase tracking-wider">
              KARTU STOK
            </div> -->
            <div class="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
              <div class="text-gray-500"></div>
              <div class="font-bold uppercase">{{ store.item?.nama || '-' }}</div>
              <div class="text-gray-500">Kode:</div>
              <div class="font-medium">{{ store.item?.kode || '-' }}</div>
              <div class="text-gray-500">Kemasan:</div>
              <div class="text-right"> 1 {{ store.item?.satuan_b }} isi {{ store.item?.isi }} {{
                store.item?.satuan_k}}
              </div>
            </div>
          </div>
        </div>
        <div class="w-full border-t border-dashed border-black my-1"></div>

        <div class="text-center mt-4">
          <div class="inline-block px-3 py-1 rounded-full border text-sm uppercase tracking-wider">
            KARTU STOK
          </div>
          <div class="mt-2 text-sm">Periode {{ periode }} </div>
        </div>

        <div class="mt-6">
          <table class="w-full text-sm border-separate [border-spacing:0]">
            <thead>
              <tr>
                <th class="th text-left p-1">Tanggal</th>
                <th class="th text-left p-1">Nomor Transaksi</th>
                <th class="th text-left p-1">Jenis Transaksi</th>
                <th class="th text-right p-1">Penerimaan ({{ store?.item?.satuan_k }}) </th>
                <th class="th text-right p-1">Pengeluaran ({{ store?.item?.satuan_k }}) </th>
                <th class="th text-right p-1">Saldo ({{ store?.item?.satuan_k }}) </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in groupedItems" :key="index">
                <td class="td p-1 text-left">{{ formatDateIndo(item?.tanggal) }}</td>
                <td class="td p-1 text-left">{{ item?.notrans || '-' }}</td>
                <td class="td p-1 text-left">{{ item?.jenis || '-' }}</td>
                <td class="td p-1 text-right">{{ formatRupiah(item?.debit) }}</td>
                <td class="td p-1 text-right">{{ formatRupiah(item?.kredit) }}</td>
                <td class="td p-1 text-right">{{ formatRupiah(item?.saldo) }}</td>
              </tr>
              <tr>
                <td colspan="5" class="td p-1 text-right font-bold">SALDO AKHIR</td>
                <td class="td p-1 text-right font-bold">{{formatRupiah(totalStokAkhir)}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="rounded-xl p-4">
            <!-- <div class="space-y-2 text-sm">
              <div class="flex items-center justify-between text-sm">
                <span class="font-semibold">Total Masuk</span>
                <span class="font-semibold">{{ formatRupiah(totalDebit) }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="font-semibold">Total Keluar</span>
                <span class="font-semibold">{{ formatRupiah(totalKredit) }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="font-semibold">Total Stok</span>
                <span class="font-semibold">{{ formatRupiah(totalStok) }}</span>
              </div>
            </div> -->
          </div>
          <div class="rounded-xl p-4 bg-gray-50">
            <div class="space-y-2 text-sm">
              <div class="flex items-center justify-between text-sm">
                <span class="font-semibold">Total Penerimaan</span>
                <span class="font-semibold">{{ formatRupiah(totalPenerimaan) }} {{ store?.item?.satuan_k }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="font-semibold">Total Retur Penjualan</span>
                <span class="font-semibold">{{ formatRupiah(totalReturPenjualan) }} {{ store?.item?.satuan_k }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="font-semibold">Total Penyesuaian</span>
                <span class="font-semibold">{{ formatRupiah(totalPenyesuaian) }} {{ store?.item?.satuan_k }}</span>
              </div>

              <div class="flex items-center justify-between text-sm">
                <span class="font-semibold">Total Penjualan</span>
                <span class="font-semibold">{{ formatRupiah(totalPenjualan) }} {{ store?.item?.satuan_k }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="font-semibold">Total Retur Pembelian</span>
                <span class="font-semibold">{{ formatRupiah(totalReturPembelian) }} {{ store?.item?.satuan_k }}</span>
              </div>
              <div class="w-full border-t border-dotted border-black my-1"></div>
              <div class="flex items-center justify-between text-sm">
                <span class="font-semibold">Total Stok</span>
                <span class="font-semibold">{{ formatRupiah(totalStokAkhir) }} {{ store?.item?.satuan_k }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-2 text-center text-[10px] leading-snug">
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
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { formatRupiah, formatTeleponID } from '@/utils/numberHelper'
import { formatDateIndo, formatJamMenit, formatTimeOnly } from '@/utils/dateHelper'
import { useAppStore } from '@/stores/app'
// import { useDateFormat } from '@vueuse/core'
const props = defineProps({
  store: { type: Object, required: true },
  title: { type: String, default: 'Kartu Stok' },
})
const emit = defineEmits(['close', 'save'])
const app = useAppStore()
const auth = useAuthStore()
const { user } = storeToRefs(auth)
const printType = ref('a4') // 'a4' | 'thermal-58 | 'thermal-80' | 'thermal-100'
const company = computed(() => {
  return app.form || null
})


const bulans = computed(() => [
  { label: 'Januari', value: '01' },
  { label: 'Februari', value: '02' },
  { label: 'Maret', value: '03' },
  { label: 'April', value: '04' },
  { label: 'Mei', value: '05' },
  { label: 'Juni', value: '06' },
  { label: 'Juli', value: '07' },
  { label: 'Agustus', value: '08' },
  { label: 'September', value: '09' },
  { label: 'Oktober', value: '10' },
  { label: 'November', value: '11' },
  { label: 'Desember', value: '12' },
])
const periode = computed(() => {
  const bulanObj = bulans.value.find(b => b.value === props.store.range.start_date)
  const namaBulan = bulanObj ? bulanObj.label : ''
  const tahun = props.store.range.end_date || ''
  return `${namaBulan} ${tahun}`
})

const groupedItems = computed(() => {
  const result = []

  // --- SALDO AWAL ---
  const stokAwal = props.store?.item?.stok_awal ?? []
  const totalAwal = stokAwal.reduce((sum, s) => sum + Number(s.jumlah_k ?? 0), 0)

  const saldoAwalRow = {
    jenis: 'SALDO AWAL',
    notrans: '-',
    tanggal: `${props.store.range.end_date}-${props.store.range.start_date}-01`,
    satuan: props.store?.item?.satuan_k,
    debit: 0,
    kredit: 0,
    saldo: totalAwal,
  }

  // saldo awal di-push dulu
  result.push(saldoAwalRow)

  // const formatted = useDateFormat(useNow(), 'MM-DD-YYYY 00:00:01')
  // --- PENERIMAAN (selalu langsung setelah saldo awal) ---

  
  const penerimaan = props.store?.item?.penerimaan_rinci ?? []
  const penerimaanRows = penerimaan.map(item => {
    const [year, month, day] = item.tgl_penerimaan.split("-")
    const tanggal = `${year}-${month}-${day} 00:01:00`

    return {
      jenis: "PENERIMAAN",
      notrans: item.nopenerimaan,
      tanggal,
      satuan: props.store?.item?.satuan_k,
      debit: Number(item.jumlah_k ?? 0),
      kredit: 0,
      saldo: 0,
    }
  })
  result.push(...penerimaanRows)

  // --- TRANSAKSI LAIN ---
  const transaksiLain = []

  // penjualan
  const penjualan = props.store?.item?.penjualan_rinci ?? []
  penjualan.forEach(item => {
    transaksiLain.push({
      jenis: 'PENJUALAN',
      notrans: item.nopenjualan,
      tanggal: item.tgl_penjualan,
      satuan: props.store?.item?.satuan_k,
      debit: 0,
      kredit: Number(item.jumlah_k ?? 0),
      saldo: 0,
    })
  })

  // penyesuaian
  const penyesuaian = props.store?.item?.penyesuaian ?? []
  penyesuaian.forEach(item => {
    const jumlah = Number(item.jumlah_k ?? 0)
    transaksiLain.push({
      jenis: 'PENYESUAIAN',
      notrans: 'PS' + item.kode_barang,
      tanggal: item.tgl_penyesuaian,
      satuan: props.store?.item?.satuan_k,
      debit: jumlah > 0 ? jumlah : 0,
      kredit: jumlah < 0 ? Math.abs(jumlah) : 0,
      saldo: 0,
    })
  })

  // retur pembelian
  const returPembelian = props.store?.item?.retur_pembelian_rinci ?? []
  returPembelian.forEach(item => {
    transaksiLain.push({
      jenis: 'RETUR PEMBELIAN',
      notrans: item.noretur,
      tanggal: item.tglretur,
      satuan: props.store?.item?.satuan_k,
      debit: 0,
      kredit: Number(item.jumlahretur_k ?? 0),
      saldo: 0,
    })
  })

  // retur penjualan
  const returPenjualan = props.store?.item?.retur_penjualan_rinci ?? []
  returPenjualan.forEach(item => {
    transaksiLain.push({
      jenis: 'RETUR PENJUALAN',
      notrans: item.noretur_penjualan,
      tanggal: item.tgl_retur,
      satuan: props.store?.item?.satuan_k,
      debit: Number(item.jumlah_k ?? 0),
      kredit: 0,
      saldo: 0,
    })
  })

  // urutkan transaksi lain berdasarkan tanggal
  transaksiLain.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))

  // gabungkan penerimaan + transaksi lain
  result.push(...transaksiLain)

  // --- HITUNG SALDO BERJALAN ---
  let saldo = saldoAwalRow.saldo
  result.forEach(r => {
    if (r.jenis !== 'SALDO AWAL') {
      saldo += r.debit - r.kredit
      r.saldo = saldo
    }
  })

  console.log('groupedItems', result)
  return result
})


// PENERIMAAN //
const totalPenerimaan = computed(() => {
  const items = props.store?.item?.penerimaan_rinci
  const total = items.reduce((sum, s) => sum + Number(s.jumlah_k ?? 0), 0)
  return total
})
const totalReturPenjualan = computed(() => {
  const items = props.store?.item?.retur_penjualan_rinci
  const total = items.reduce((sum, s) => sum + Number(s.jumlah_k ?? 0), 0)
  return total
})
const totalPenyesuaian = computed(() => {
  const items = props.store?.item?.penyesuaian
  const total = items.reduce((sum, s) => sum + Number(s.jumlah_k ?? 0), 0)
  return total
})

// PENGELUARAN //
const totalPenjualan = computed(() => {
  const items = props.store?.item?.penjualan_rinci
  const total = items.reduce((sum, s) => sum + Number(s.jumlah_k ?? 0), 0)
  return total
})

const totalReturPembelian = computed(() => {
  const items = props.store?.item?.retur_pembelian_rinci
  const total = items.reduce((sum, s) => sum + Number(s.jumlahretur_k ?? 0), 0)
  return total
})


const totalStokAkhir = computed(() => {
  return (totalPenerimaan.value + totalReturPenjualan.value + totalPenyesuaian.value) - (totalPenjualan.value + totalReturPembelian.value)
})


const totalDebit = computed(() => {
  const items = groupedItems.value ?? []
  return items.reduce((a, b) => a + Number(b?.debit), 0)
})

const totalKredit = computed(() => {
  const items = groupedItems.value ?? []
  return items.reduce((a, b) => a + Number(b?.kredit), 0)
})


const totalStok = computed(() => {
  const items = props.store?.item?.stok ?? []
  return items.reduce((a, b) => a + Number(b?.jumlah_k), 0)
})



const printArea = ref(null)

const printObj = {
  id: '#printArea', // ref elemen yang mau diprint
  popTitle: 'Penerimaan Barang',
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
}


</script>
