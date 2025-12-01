<template>
  <div class="flex items-center justify-between p-3 w-full bg-secondary rounded-b-2xl">
    <!-- Mobile -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>

    <!-- Desktop -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between w-full">
      <div>
        <u-text class="">
          Menampilkan <span class="font-medium">{{ start }}</span> -
          <span class="font-medium">{{ end }}</span> dari
          <span class="font-medium">{{ totalItems }}</span> data
        </u-text>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">

          <!-- Tombol First -->
          <button
            @click="goToPage(1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-100 text-gray-700'"
          >
            « First
          </button>


          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Previous</span>
            <!-- <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" /> -->
            <u-icon name="chevron-left" class="w-5 h-5"></u-icon>
          </button>

          <template v-for="page in visiblePages" :key="page">
            <button
              v-if="page !== '...'"
              @click="goToPage(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                page === currentPage
                  ? 'z-10 bg-light-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-primary'
                  : 'text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
            <span
              v-else
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400"
            >
              ...
            </span>
          </template>

          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Next</span>
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </button>


           <!-- Tombol Last -->
          <button
            @click="goToPage(totalPages)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-100 text-gray-700'"
          >
            Last »
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-vue-next";

const props = defineProps({
  totalItems: { type: Number, required: true },
  perPage: { type: Number, default: 10 },
  currentPage: { type: Number, default: 1 }
});

const emit = defineEmits(["update:currentPage"]);

const totalPages = computed(() => Math.ceil(props.totalItems / props.perPage));
const start = computed(() => (props.currentPage - 1) * props.perPage + 1);
const end = computed(() =>
  Math.min(props.currentPage * props.perPage, props.totalItems)
);

const visiblePages = computed(() => {
  const pages = [];
  const delta = 1;
  for (
    let i = Math.max(1, props.currentPage - delta);
    i <= Math.min(totalPages.value, props.currentPage + delta);
    i++
  ) {
    pages.push(i);
  }
  if (pages[0] > 1) {
    if (pages[0] > 2) pages.unshift("...");
    pages.unshift(1);
  }
  if (pages[pages.length - 1] < totalPages.value) {
    if (pages[pages.length - 1] < totalPages.value - 1) pages.push("...");
    pages.push(totalPages.value);
  }
  return pages;
});

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    emit("update:currentPage", page);
  }
}
</script>
