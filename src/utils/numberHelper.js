export function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID').format(value)
}

export function formatRpkoma(value) {
  if (value !== null && value !== '') {
    const numValue = Number(value);
    const formattedValue = Math.abs(numValue)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,');

    if (numValue < 0) {
      return `(${formattedValue})`;
    }
    return `${formattedValue}`;
  }
  return '';
}

export function formatTeleponID(value) {
    if (!value) return null

    // hilangkan spasi, strip, titik, tanda kurung
    let cleaned = value.toString().replace(/[\s\-\.\(\)]/g, "")

    // normalisasi awalan
    if (cleaned.startsWith("0")) {
      cleaned = "+62" + cleaned.slice(1)
    } else if (cleaned.startsWith("62")) {
      cleaned = "+62" + cleaned.slice(2)
    } else if (!cleaned.startsWith("+62")) {
      cleaned = "+62" + cleaned
    }

    // pisahkan prefix +62 dengan nomor
    const prefix = "+62"
    const number = cleaned.replace("+62", "")

    // format dengan spasi setiap 4 digit
    const grouped = number.replace(/(\d{4})(?=\d)/g, "$1 ")

    return `${prefix} ${grouped.trim()}`
  }