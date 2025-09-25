import { createRouter, createWebHistory } from 'vue-router'
import { useStorage } from '@vueuse/core'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    
    {
      path: '/login',
      component: () => import('@/layout/LoginLayout.vue'),
      meta: {
        requiresAuth: false
      },
      children: [
        {
          path: '',
          name: 'login',
          component: () => import('@/views/auth/LoginPage.vue')
        },
        {
          path: '/not-found',
          name: 'not-found',
          component: () => import('@/views/notFound/IndexPage.vue')
        },
      ] 
    },
   


    // INI PATH REQUIRES AUTH
    {
      path: '/admin',
      name: 'admin', // ✅ Tambahkan ini
      meta: {
        requiresAuth: true
      },
      component: () => import('@/layout/AdminLayout.vue'),
      children: [] // diisi dinamis nanti
    },
    
    // INI PATH REQUIRES AUTH
    {
      path: '/profiles',
      name: 'profiles',
      meta: {
        requiresAuth: true
      },
      component: () => import('@/layout/AdminLayout.vue'),
      children: [
        {
          path: '',
          name: 'profiles.index',
          component: () => import('@/views/profiles/IndexPage.vue')
        }
      ] // diisi dinamis nanti
    },
    
  ]
})

// Suntikkan route ke dalam layout admin
export function injectAdminRoutes(routes) {
  routes.forEach(route => {
    router.addRoute('admin', route)
  })
}

// export async function injectBootRoutes() {
//   // console.log('[BOOT] Memasang router guard', router);
//   const { useAuthStore } = await import('@/stores/auth')
//   const auth = useAuthStore()
//   // console.log('[DEBUG] Guard:', auth);
  
//   console.log('[BOOT]  router ', router.beforeEach());
  

//   router.beforeEach((to, from, next) => {
//     console.log('[ROUTER GUARD] navigating to', to.fullPath)
//     const isLoggedIn = !!auth?.token
//     const requiresAuth = to.matched.some(record => record?.meta?.requiresAuth)

//     if (!to.matched?.length) {
//       return next({ path: '/not-found' }) // atau ke halaman NotFound
//     }

//     if (requiresAuth && !isLoggedIn) {
//       // ❌ Belum login, coba akses halaman yang butuh login
//       return next({ path: '/' })
//     }

//     if (to.name === 'login' && isLoggedIn) {
//       // ✅ Sudah login tapi mau ke halaman login
//       return next({ path: '/admin' })
//     }

//     return next()
//   })


  
// }

router.beforeEach((to, from, next) => {
  console.log('[ROUTER GUARD] navigating to', to.fullPath)

  const authStorage = useStorage('auth-store', {}, localStorage)
  //  console.log('authStorage :', authStorage.value)
  const token = authStorage.value?.token || null
  // console.log('Token:', token)

  const isLoggedIn = !!token
  const requiresAuth = to.matched.some(record => record?.meta?.requiresAuth)
  console.log('[ROUTER] navigating to', requiresAuth);

  if (!to.matched?.length) {
    return next({ path: '/not-found' }) // atau ke halaman NotFound
  }

  if (requiresAuth && !isLoggedIn) {
    // ❌ Belum login, coba akses halaman yang butuh login
    return next({ path: '/' })
  }

  if (to.name === 'login' && isLoggedIn) {
    // ✅ Sudah login tapi mau ke halaman login
    return next({ path: '/admin' })
  }

  return next()

  
})





export default router