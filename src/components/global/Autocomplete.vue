<template>
  <div class="relative w-full">
    <u-input-search
      v-model="searchQuery"
      :debounce="500"
      :id="id"
      :placeholder="placeholder"
      :isLoading="isLoading"
      @input="onSearch" @keydown="handleKeydown" ref="inputRef"
    />

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="showResults"
        class="absolute z-10 mt-0 w-full bg-background dark:bg-dark rounded-md shadow-lg max-h-80 overflow-auto border border-secondary dark:border-secondary"
      >
        <div v-if="isLoading" class="p-4 text-center text-secondary dark:text-secondary">
          <div class="flex justify-center items-center space-x-2">
            <i class="ri-loader-4-line animate-spin text-xl"></i>
            <span>Mencari...</span>
          </div>
        </div>

        <div v-else-if="displayItems.length > 0">
          <div
            v-for="(item, index) in displayItems"
            :key="getItemKey(item, index)"
            @click="onItemSelect(item)"
            @mouseover="selectedIndex = index"
            class="search-dropdown-item p-3 hover:bg-secondary dark:hover:bg-secondary cursor-pointer transition-colors duration-150 border-b border-secondary dark:border-secondary last:border-0"
            :class="{ 'selected bg-secondary dark:bg-secondary': selectedIndex === index }"
          >
            <template v-if="$slots.item">
              <slot name="item" :item="item" />
            </template>
            <template v-else>
              <div class="">
                {{ getItemLabel(item) }}
              </div>
            </template>
          </div>
        </div>

        <div
          v-else-if="searchQuery.length >= minSearchLength"
          class="p-4 text-center text-secondary-500 dark:text-secondary-400"
        >
          <i class="ri-search-line text-xl mb-2 block"></i>
          <p>{{ notFoundText }}</p>

          <div v-if="showAddButton" class="mt-3 flex flex-col gap-2">
            <p class="text-xs">{{ notFoundSubtext }}</p>
            <button
              @click="onAddNew"
              class="mt-1 text-sm px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors duration-200 flex items-center justify-center gap-1.5 mx-auto"
            >
              <i class="ri-add-line"></i>
              {{ addButtonText }}
            </button>
          </div>
        </div>
      </div>
    </transition>


  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import { api } from '@/services/api'

const props = defineProps({
  store: { type: Object, default: null },
  modelValue: { type: String, default: '' },
  debounce: { type: Number, default: 300 },
  id: { type: String, default: () => `input-${Math.random().toString(36).substring(2, 8)}` },
  placeholder: { type: String, default: ' ' },
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  minSearchLength: { type: Number, default: 2 },
  notFoundText: { type: String, default: 'Data tidak ditemukan' },
  notFoundSubtext: { type: String, default: 'Silahkan tambahkan data baru' },
  addButtonText: { type: String, default: 'Tambah Data' },
  showAddButton: { type: Boolean, default: false },
  apiUrl: { type: String, default: '' },
  apiParams: { type: Object, default: () => ({}) },
  apiResponsePath: { type: String, default: 'data' },
  useApi: { type: Boolean, default: false },
  itemKey: { type: String, default: 'id' },
  itemLabel: { type: String, default: 'nama' },
  searchKey: { type: String, default: 'q' },
 
})

const emit = defineEmits(['update:modelValue', 'search', 'select', 'add-new', 'items-loaded'])

const searchQuery = ref(props.modelValue)

const inputRef = ref(null)
const showResults = ref(false)
const internalLoading = ref(false)
const internalItems = ref([])
const selectedIndex = ref(-1)



const displayItems = computed(() => {
  return props.useApi ? internalItems.value : props.items
})

// Computed untuk menentukan status loading
const isLoading = computed(() => {
  return props.useApi ? internalLoading.value : props.loading
})

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  console.log('modelValue', newValue);
  
  searchQuery.value = newValue
})

// Watch for internal changes to searchQuery
watch(searchQuery, (newValue) => {
  // console.log('searchQuery', newValue);
  
  emit('update:modelValue', newValue)
  if (!newValue) {
    showResults.value = false
  }
})

// Watch for changes in items to ensure smooth transitions
watch(() => props.items, () => {
  if (searchQuery.value.length >= props.minSearchLength) {
    showResults.value = true
  }
}, { deep: true })


const fetchFromApi = async (query) => {
  if (!props.apiUrl || query.length < props.minSearchLength) return

  internalLoading.value = true

  try {
    const params = {
      ...props.apiParams,
      [props.searchKey || 'q']: query
    }

    const response = await api.get(props.apiUrl, { params })

    // Ekstrak data dari respons berdasarkan apiResponsePath
    let data = response
    // console.log('response', response);

    const pathSegments = props.apiResponsePath.split('.')
    // console.log('pathSegments', pathSegments);

    for (const segment of pathSegments) {
      // console.log('segment', segment);
      data = data[segment]
      console.log('data', data);
      if (!data) break
    }

    internalItems.value = Array.isArray(data) ? data : []
    // console.log('internalItems', internalItems);
    emit('items-loaded', internalItems.value)
  } catch (error) {
    console.error(`Error fetching data from ${props.apiUrl}:`, error)
    internalItems.value = []
  } finally {
    internalLoading.value = false
  }
}


const onSearch = (e) => {
  // console.log('onSearch', e);
  searchQuery.value = e
  
  if ((searchQuery.value.length >= props.minSearchLength) && searchQuery.value.trim()) {
    if (props.useApi) {
      fetchFromApi(searchQuery.value)
    } else {
      emit('search', searchQuery.value)
    }
    showResults.value = true
  } else {
    showResults.value = false
  }
}

const onItemSelect = (item) => {
  emit('select', item)
  showResults.value = false
}

const onAddNew = () => {
  emit('add-new', searchQuery.value)
  showResults.value = false
}

const getItemKey = (item, index) => {
  return item[props.itemKey] || index
}

const getItemLabel = (item) => {
  // console.log('item', item);
  
  // console.log('getItemLabel', props.itemLabel);
  
  return item[props.itemLabel] || 'Unnamed'
}

const focus = () => {
  if (inputRef.value && inputRef.value.$el) {
    // Jika inputRef adalah komponen (BaseInput), coba akses elemen input di dalamnya
    const inputElement = inputRef.value.$el.querySelector('input')
    if (inputElement) {
      inputElement.focus()
      return
    }
  }

  // Fallback: coba fokus langsung jika inputRef adalah elemen DOM
  if (inputRef.value && typeof inputRef.value.focus === 'function') {
    inputRef.value.focus()
  }
}

const closeDropdown = () => {
  showResults.value = false
  selectedIndex.value = -1
}

// Tambahkan handler keyboard
const handleKeydown = (event) => {
  // console.log('handleKeydown', event.key);
  
  // Jika dropdown tidak ditampilkan dan tombol panah bawah ditekan, tampilkan dropdown
  if (!showResults.value) {
    if (event.key === 'ArrowDown') {
      if (searchQuery.value.length >= props.minSearchLength) {
        showResults.value = true
        event.preventDefault()
      }
    }
    return
  }

  const items = displayItems.value

  switch (event.key) {
    case 'ArrowDown':
      // Navigasi ke bawah
      event.preventDefault()
      if (items.length > 0) {
        
        
        selectedIndex.value = (selectedIndex.value + 1) % items.length
        console.log('selectedIndex', selectedIndex.value);
        scrollToSelectedItem()
      }
      break
    case 'ArrowUp':
      // Navigasi ke atas
      event.preventDefault()
      if (items.length > 0) {
        selectedIndex.value = selectedIndex.value <= 0 ? items.length - 1 : selectedIndex.value - 1
        console.log('selectedIndex', selectedIndex.value);
        scrollToSelectedItem()
      }
      break
    case 'Enter':
      // Pilih item yang dipilih
      event.preventDefault()

      if (items.length === 1) {
        onItemSelect(items[0])

      } else if (selectedIndex.value > -1 && items.length > selectedIndex.value) {
        onItemSelect(items[selectedIndex.value])
      }

      break
    case 'Escape':
      // Tutup dropdown
      event.preventDefault()
      showResults.value = false
      selectedIndex.value = -1
      break
  }
}

// Fungsi untuk scroll ke item yang dipilih
const scrollToSelectedItem = () => {
  nextTick(() => {
    const selectedElement = document.querySelector('.search-dropdown-item.selected')
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest' })
    }
  })
}

// Reset selectedIndex saat hasil pencarian berubah
watch(displayItems, () => {
  selectedIndex.value = -1
})

// Reset selectedIndex saat dropdown ditutup
watch(showResults, (newValue) => {
  if (!newValue) {
    selectedIndex.value = -1
  }
})

// Expose methods to parent component
defineExpose({
  focus,
  closeDropdown,
  fetchFromApi
})





</script>


<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>