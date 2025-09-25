<template>
  <u-modal persistent :title="`${title}`" @close="emit('close')">
    <template #default>
      <div id="printArea" ref="printArea"
        class="w-[58mm] max-w-full bg-white text-black mx-auto font-mono p-1 thermal-58">
        <div class="text-center">
          <div class="text-sm font-semibold tracking-wide">{{ app?.form?.nama || 'NAMA TOKO' }}</div>
          <div class="text-[10px] leading-tight">{{ app?.form?.alamat || 'ALAMAT TOKO' }}</div>
          <div class="text-[10px]">{{ app?.form?.telepon || 'TELEPON TOKO' }}</div>
          <div class="w-full border-t border-dashed border-black my-1"></div>
        </div>
        <div class="flex justify-between text-[10px] mt-1">
          <div>{{ form?.nopenjualan }}</div>
          <div class="text-right">{{ formatDateIndo(form?.tgl_penjualan) }}</div>
        </div>
        <div class="flex justify-between text-[10px] mt-1">
          <div>{{ user?.nama || '-' }}</div>
          <div class="text-right"> Jam : {{ formatTimeOnly(form?.tgl_penjualan) }}</div>
        </div>
        <div class="w-full border-t border-dashed border-black my-1"></div>

        <div class="text-[11px]">
          <div v-for="(it, i) in groupedItems" :key="i" class="py-0.5">
            <div class="flex justify-between">
              <span class="pr-2">{{ it?.nama || '-' }}<span class="opacity-70"></span></span>
              <!-- <span>{{ f.rupiah(it.qty * it.price - (it.discount||0)) }}</span> -->
              <span>{{ formatRupiah(it?.subtotal) }}</span>
            </div>
            <div class="flex justify-between text-[10px] opacity-70">
              <span>{{ it?.jumlah_k }} {{ it?.satuan_k }} x {{ formatRupiah(it?.harga_jual) }}</span>
              <!-- <span>Disc: -</span> -->
            </div>
          </div>
        </div>

        <div class="w-full border-t border-dotted border-black my-1"></div>

        <div class="text-[12px]">
          <!-- <div class="flex justify-between"><span>Subtotal</span><span>5.000.000</span></div> -->
          <!-- <div class="flex justify-between"><span>Pajak</span><span>20.000</span></div> -->
          <div class="flex justify-between font-semibold text-sm"><span>Total</span><span>{{
              formatRupiah(totalPenjualan) }}</span></div>
          <div class="flex justify-between"><span>Bayar ({{ formBayar?.cara_bayar }})</span><span>{{
              formatRupiah(formBayar?.jumlah_bayar) }}</span></div>
          <div class="flex justify-between" :class="{ 'font-semibold': kembali >= 0 }"><span>Kembali</span><span>{{
              formatRupiah(kembali) }}</span></div>
        </div>



        <div class="mt-2 text-center text-[10px] leading-snug">
          <div class="w-full border-t border-dashed border-black my-1"></div>
          <p class="mt-1">{{ app?.form?.footer || 'Terimakasih atas kunjungan anda' }}</p>
          <!-- <p class="opacity-60">Simpan struk ini sebagai bukti transaksi.</p> -->
          <p class="mt-1 opacity-80">&copy; 2025 CV Udumbara Informatika</p>
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
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'
import { formatRupiah } from '@/utils/numberHelper'
import { formatDateIndo, formatTimeOnly } from '@/utils/dateHelper'


const props = defineProps({
  store: { type: Object, required: true },
  title: { type: String, default: 'Nota Penjualan' },
  formBayar : { type: Object, default: null },
  form : { type: Object, default: null },
})
const emit = defineEmits(['close', 'save'])

const auth = useAuthStore()
const { user } = storeToRefs(auth)

const app = useAppStore()


const printType = ref('thermal-58') // 'a4' | 'thermal-58 | 'thermal-80' | 'thermal-100'


const groupedItems = computed(() => {
  const map = new Map()

  const items = props?.store?.form?.rinci ?? []
  items.forEach(item => {
    const key = item.kode_barang
    if (!map.has(key)) {
      map.set(key, {
        kode_barang: item?.kode_barang,
        nama: item?.master?.nama,
        satuan_k: item?.satuan_k,
        jumlah_k: Number(item?.jumlah_k),
        harga_jual: Number(item?.harga_jual),
        subtotal: Number(item?.subtotal),
        created_at: item?.created_at
      })
    } else {
      const existing = map.get(key)
      existing.jumlah_k += Number(item.jumlah_k)
      existing.subtotal += Number(item.subtotal)
      // update created_at jika lebih baru
      if (new Date(item.created_at) > new Date(existing.created_at)) {
        existing.created_at = item.created_at
      }
    }
  })

  return Array.from(map.values())
})

const totalPenjualan = computed(() => {
  const items = props?.store?.form?.rinci ?? []
  return items.reduce((a, b) => a + Number(b?.subtotal), 0)
})

const kembali = computed(() => {
  if (props?.formBayar?.jumlah_bayar < totalPenjualan.value) {
    return 0
  } 
  return props.formBayar?.jumlah_bayar - totalPenjualan.value
})

const printArea = ref(null)

const printObj = {
  id: '#printArea', // ref elemen yang mau diprint
  popTitle: 'Struk Penjualan',
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
