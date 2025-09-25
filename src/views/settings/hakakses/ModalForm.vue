<template>
  <u-modal persistent :title="title" @close="close">
    <template #default>
      <u-col flex1 class="w-full p-4 max-h-[70vh] overflow-auto">
        <div v-if="loading" class="text-gray-500">Loading...</div>

        <div v-else class="w-full">
          <div v-for="menu in menus" :key="menu.id" class="mb-4 border rounded-lg overflow-hidden">
            <!-- header menu -->
            <div class="bg-gray-100 px-3 py-2 font-semibold flex items-center gap-3">
              <input type="checkbox" :checked="selectedMenuIds.includes(menu.id)"
                @change="e => toggleMenu(menu.id, e.target.checked, menu.children)" />
              <span>{{ menu.title || menu.name }}</span>
            </div>

            <!-- daftar submenu -->
            <div v-if="menu.children?.length" class="p-3">
              <div v-for="sub in menu.children" :key="sub.id" class="flex items-center gap-3 py-1">
                <input type="checkbox" :checked="selectedSubIds.includes(`${menu.id}:${sub.id}`)"
                  @change="e => toggleSubmenu(menu, sub.id, e.target.checked)" />
                <span>{{ sub.title || sub.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </u-col>
    </template>

    <template #footer>
      <u-row flex1 class="w-full" right>
        <u-btn variant="secondary" label="Tutup" @click="close" />
        <u-btn :loading="saving" label="Simpan" @click="handleSave" />
      </u-row>
    </template>
  </u-modal>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'
import { useNotificationStore } from '@/stores/notification'

const notify = useNotificationStore().notify
const props = defineProps({
  user: { type: Object, required: true },
  title: { type: String, default: 'Hak Akses' }
})
const emit = defineEmits(['close'])

const loading = ref(false)
const saving = ref(false)
const menus = ref([])

const selectedMenuIds = ref([])
const selectedSubIds = ref([])

const initialSet = ref(new Set())

async function loadData() {
  loading.value = true
  try {
    const resMenu = await api.get('api/v1/setting/menu/get-list')
    console.log('resMenu', resMenu)
    const items = resMenu.data?.data?.items ?? resMenu.data?.data ?? []
    menus.value = items

    if (props.user?.id) {
      const resAccess = await api.post('api/v1/setting/hak-akses/get-user', { id: props.user.id })
      console.log('resAccess', resAccess)
      const aksesRaw = resAccess.data?.data

      const aksesList = Array.isArray(aksesRaw?.akses)
        ? aksesRaw.akses
        : Array.isArray(aksesRaw)
          ? aksesRaw
          : []

      aksesList.forEach(acc => {
        const key = `${acc.menu_id}:${acc.submenu_id ?? 'null'}`
        initialSet.value.add(key)
        
      if (!selectedMenuIds.value.includes(acc.menu_id)) {
          selectedMenuIds.value.push(acc.menu_id)
        }
      
        if (acc.submenu_id !== null && acc.submenu_id !== undefined) {
          const subKey = `${acc.menu_id}:${acc.submenu_id}`
          if (!selectedSubIds.value.includes(subKey)) {
            selectedSubIds.value.push(subKey)
          }
          if (!selectedMenuIds.value.includes(acc.menu_id)) {
            selectedMenuIds.value.push(acc.menu_id)
          }
        }
      })
    }
  } catch (e) {
    console.error('load menus error', e)
    menus.value = []
  } finally {
    loading.value = false
  }
}

function toggleMenu(menuId, checked, children = []) {
  if (checked) {
    if (!selectedMenuIds.value.includes(menuId)) {
      selectedMenuIds.value.push(menuId)
    }
    children.forEach(sub => {
      const key = `${menuId}:${sub.id}`
      if (!selectedSubIds.value.includes(key)) {
        selectedSubIds.value.push(key)
      }
    })
  } else {
    selectedMenuIds.value = selectedMenuIds.value.filter(id => id !== menuId)
    selectedSubIds.value = selectedSubIds.value.filter(
      key => !key.startsWith(`${menuId}:`)
    )
  }
}

function toggleSubmenu(menu, subId, checked) {
  const key = `${menu.id}:${subId}`
  if (checked) {
    if (!selectedSubIds.value.includes(key)) {
      selectedSubIds.value.push(key)
    }
    if (!selectedMenuIds.value.includes(menu.id)) {
      selectedMenuIds.value.push(menu.id)
    }
  } else {
    selectedSubIds.value = selectedSubIds.value.filter(k => k !== key)
    const masihAda = menu.children.some(c =>
      selectedSubIds.value.includes(`${menu.id}:${c.id}`)
    )
    if (!masihAda) {
      selectedMenuIds.value = selectedMenuIds.value.filter(id => id !== menu.id)
    }
  }
}

async function handleSave(e) {
  e.preventDefault()
  e.stopPropagation()
  if (!props.user?.id) return
  saving.value = true
  try {
    const currentSet = new Set()
    menus.value.forEach(menu => {
      if (selectedMenuIds.value.includes(menu.id)) {
        if (menu.children?.length) {
          // punya submenu → hanya simpan sub yang terpilih
          menu.children.forEach(sub => {
            const key = `${menu.id}:${sub.id}`
            if (selectedSubIds.value.includes(key)) {
              currentSet.add(key)
            }
          })
        } else {
          // tidak punya submenu → simpan menu_id:null
          currentSet.add(`${menu.id}:null`)
        }
      }
    })

    const toGrant = []
    const toRevoke = []

    for (const item of currentSet) {
      if (!initialSet.value.has(item)) {
        const [menu_id, sub_id] = item.split(':')
        toGrant.push({
          menu_id: parseInt(menu_id),
          submenu_id: sub_id === 'null' ? null : parseInt(sub_id)
        })
      }
    }

    for (const item of initialSet.value) {
      if (!currentSet.has(item)) {
        const [menu_id, sub_id] = item.split(':')
        toRevoke.push({
          menu_id: parseInt(menu_id),
          submenu_id: sub_id === 'null' ? null : parseInt(sub_id)
        })
      }
    }

    if (toGrant.length) {
      const res = await api.post('api/v1/setting/hak-akses/grant', {
        user_id: props.user.id,
        menus: toGrant
      })
      console.log('grant res', res)
      notify({ message: res.data.message ?? 'Hak akses ditambahkan', type: 'success' })
    }
    if (toRevoke.length) {
      const res = await api.post('api/v1/setting/hak-akses/revoke', {
        user_id: props.user.id,
        menus: toRevoke
      })
      notify({ message: res.data.message ?? 'Hak akses dicabut', type: 'success' })
    }

    initialSet.value = new Set(currentSet)

    emit('close')
  } catch (error) {
    // console.log('simpan hak akses error', error)
    notify({ message: error.message ?? 'Gagal menyimpan hak akses', type: 'error' })
  } finally {
    saving.value = false
  }
}

function close() {
  emit('close')
}

onMounted(async () => {
  await loadData()

  if (props.user?.akses?.length) {
    props.user.akses.forEach(acc => {
      const key = `${acc.menu_id}:${acc.submenu_id ?? 'null'}`
      initialSet.value.add(key)

      if (!selectedMenuIds.value.includes(acc.menu_id)) {
        selectedMenuIds.value.push(acc.menu_id)
      }
      if (acc.submenu_id) {
        selectedSubIds.value.push(`${acc.menu_id}:${acc.submenu_id}`)
      }
    })
  }
})
</script>
