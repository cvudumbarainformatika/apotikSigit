// src/router/setupDynamicRoutes.js

import { convertMenuToRoutes } from './menuToRoutes'
import { injectAdminRoutes } from '../index'


export async function setupDynamicRoutes(pinia) {
  // console.log('[DEBUG] pinia:', pinia) // ✅ Sekarang tidak undefined
  const { useMenuStore } = await import('@/stores/menus') // ✅ ESM dynamic import
  const { useAuthStore } = await import('@/stores/auth') // ✅ ESM dynamic import
  const menuStore = useMenuStore(pinia)
  const authStore = useAuthStore(pinia)

  const dynamicRoutes = convertMenuToRoutes(menuStore?.items)
  injectAdminRoutes(dynamicRoutes)
  // injectBootRoutes()
  // console.log('[DEBUG] dynamicRoutes injected:', dynamicRoutes)
}
