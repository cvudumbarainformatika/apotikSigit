<template>
  <div class="flex md:hidden ">
    <div class="relative mobile-menu">
      <img src="/images/menu.svg" alt="Logo" class="w-6 h-6" @click="toggleMenuMobile"/>

      <div v-if="isOpen" class=" md:hidden space-y-2 absolute top-full right-0 mt-4 w-max max-w-[320px] bg-light-primary text-background border shadow-lg rounded-lg py-2 z-50">
        <ul class="text-sm">
          <li v-for="menu in menus" :key="menu.name" class="">
            <div class="">
              <a :href="menu.url" class="block px-4 py-2 font-medium text-background hover:text-secondary hover:bg-primary">
                {{ menu.label }}
              </a>
              <ul v-if="menu.submenu && menu.submenu.length" class="my-1 space-y-1">
                <li v-for="sub in menu.submenu" :key="sub.name">
                  <a :href="sub.url" class="flex items-center gap-2 pl-8 pr-2 py-1 text-sm text-background hover:text-secondary hover:bg-primary">
                    <span class="w-1 h-1 bg-background rounded-full shrink-0"></span>
                    <span>{{ sub.label }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>

    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  menus: { type: Array, default: () => [] },
})
// KHusus Mobile
const isOpen = ref(false)
const toggleMenuMobile = () => {
  isOpen.value = !isOpen.value
}


onMounted(() => window.addEventListener('click', handleClickOutside))
onUnmounted(() => window.removeEventListener('click', handleClickOutside))

function handleClickOutside(e) {
  if (!e.target.closest('.mobile-menu')) {
    isOpen.value = false
  }
}
</script>