import { useTimeAgo } from '@vueuse/core'

/**
 * Format tanggal ke format lokal Indonesia
 * Contoh: "10 Jul 2025"
 */
export function formatDateIndo(dateInput) {
  const date = new Date(dateInput)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}


const monthMap = {
  jan: 0, januari: 0,
  feb: 1, februari: 1,
  mar: 2, maret: 2,
  apr: 3, april: 3,
  mei: 4,
  jun: 5, juni: 5,
  jul: 6, juli: 6,
  agu: 7, agustus: 7,
  sep: 8, september: 8,
  okt: 9, oktober: 9,
  nov: 10, november: 10,
  des: 11, desember: 11
}


export function parseDateIndo(str) {
  // contoh: "13 Juni 2025" → "2025-06-13"
  const [day, monthName, year] = str.trim().split(/\s+/)
  const month = monthMap[monthName?.toLowerCase()]
  if (month === undefined) return null

  const date = new Date(year, month, parseInt(day, 10))
  return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0]
}

/**
 * Format tanggal + jam ke format lokal Indonesia
 * Contoh: "10 Jul 2025 14:30"
 */
export function formatDateTimeIndo(dateInput) {
  const date = new Date(dateInput)
  const tanggal = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const waktu = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${tanggal} ${waktu}`
}

/**
 * Format hanya waktu (jam:menit)
 * Contoh: "14:30"
 */
export function formatTimeOnly(dateInput) {
  const date = new Date(dateInput)
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format waktu lalu (static, tidak reactive)
 * Contoh: "3 menit yang lalu"
 */
export function formatWaktuLalu(dateInput) {
  const now = new Date()
  const date = new Date(dateInput)
  const diff = (now - date) / 1000

  if (diff < 60) return `${Math.floor(diff)} detik yg lalu`
  if (diff < 3600) return `${Math.floor(diff / 60)} menit yg lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam yg lalu`
  if (diff < 2592000) return `${Math.floor(diff / 86400)} hari yg lalu`
  if (diff < 31104000) return `${Math.floor(diff / 2592000)} bulan yg lalu`
  return `${Math.floor(diff / 31104000)} tahun yg lalu`
}

export function formatWaktuSisa(dateInput) {
  const now = new Date()
  const date = new Date(dateInput)
  const diff = (date - now) / 1000 // hitung selisih detik, positif kalau di masa depan

  if (diff <= 0) return 'Sudah expired'

  if (diff < 60) return `${Math.floor(diff)} detik lagi`
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lagi`
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lagi`
  if (diff < 2592000) return `${Math.floor(diff / 86400)} hari lagi`
  if (diff < 31104000) return `${Math.floor(diff / 2592000)} bulan lagi`
  return `${Math.floor(diff / 31104000)} tahun lagi`
}

/**
 * Format waktu lalu reactive (otomatis update)
 * return: Ref<String>
 */



export function useWaktuLaluReactive(dateInput) {
  return useTimeAgo(new Date(dateInput), {
    updateInterval: 60,
    messages: {
        justNow: 'baru saja',
        past: (n) => n.match(/\d/) ? `${n} lalu` : n,
        future: (n) => n.match(/\d/) ? `dalam ${n}` : n,
        second: (n) => `${n} dtk`,
        minute: (n) => `${n} mnt`,
        hour: (n) => `${n} jam`,
        day: (n, past) => n === 1
          ? (past ? 'kemarin' : 'besok')
          : `${n} hr`,
        week: (n, past) => n === 1
          ? (past ? 'minggu lalu' : 'minggu depan')
          : `${n} mgu`,
        month: (n, past) => n === 1
          ? (past ? 'bulan lalu' : 'bulan depan')
          : `${n} bln`,
        year: (n, past) => n === 1
          ? (past ? 'tahun lalu' : 'tahun depan')
          : `${n} thn`,
        invalid: ''
      }
  })
}

export function toLocalDateString(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
export function getMonthStartDate() {
  const now = new Date()
  return toLocalDateString(new Date(now.getFullYear(), now.getMonth(), 1))
}

export function getMonthEndDate() {
  const now = new Date()
  return toLocalDateString(new Date(now.getFullYear(), now.getMonth() + 1, 0))
}
export function getToday() {
  const now = new Date()
  return toLocalDateString(now)
}

export function getWeekStartDate() {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Senin sebagai awal minggu
  return toLocalDateString(new Date(now.setDate(diff)))
}

export function getWeekEndDate() {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() + (7 - day)
  return toLocalDateString(new Date(now.setDate(diff)))
}

export function getYearStartDate() {
  const now = new Date()
  return toLocalDateString(new Date(now.getFullYear(), 0, 1))
}

export function getYearEndDate() {
  const now = new Date()
  return toLocalDateString(new Date(now.getFullYear(), 11, 31))
}

export function formatJamMenit(dateInput = new Date(), timeZone = 'Asia/Jakarta') {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone
  })
    .format(new Date(dateInput))
    .replace('.', ':'); // ubah titik jadi :
}