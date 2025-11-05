<template>
    <u-modal persistent :title="'Info Shortcut Kasir'" @click="handleClose">
        <template #default>
            <div class="w-full mx-auto bg-white rounded-lg text-gray-800 space-y-3 p-2">
                <div v-for="(item, i) in shortcutList" :key="i"
                    class="flex justify-between items-center border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 transition">
                    <div class="text-sm font-medium">{{ item.action }}</div>
                    <div class="flex flex-wrap gap-1">
                        <span v-for="(k, idx) in item.keys" :key="idx"
                            class="bg-gray-100 border border-gray-400 rounded px-2 py-1 text-xs font-mono shadow-sm">
                            {{ k }}
                        </span>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <!-- <u-row flex1 class="w-full" right>
                <u-btn variant="secondary" label="Tutup" @click="emit('close')" />
            </u-row> -->
        </template>
    </u-modal>
</template>

<script setup>
import { defineProps, defineEmits, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    title: { type: String, default: 'Informasi Shortcut Kasir' },
})
const emit = defineEmits(['close'])

const shortcutList = [
    { keys: ['Ctrl', '`'], action: 'Fokus ke Cari Barang' },
    { keys: ['Ctrl', '1'], action: 'Fokus ke Cari Pelanggan' },
    { keys: ['Ctrl', '2'], action: 'Fokus ke Cari Dokter' },
    { keys: ['F2'], action: 'Fokus ke Input Pembayaran' },
    { keys: ['Ctrl', 'Space'], action: 'Ganti Metode Pembayaran (Tunai / Transfer)' },
    { keys: ['F1'], action: 'Reload Halaman Kasir' },
    { keys: ['Ctrl', 'i'], action: 'Buka Info Shortcut' },
    { keys: ['Escape'], action: 'Batal Pilih Barang / Tutup Komponen' },
]

function handleClose() {
    emit('close')
}

function handleKeydown(e) {
    if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
span {
    background-color: #f9fafb;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 2px 5px;
    font-family: monospace;
}
</style>
