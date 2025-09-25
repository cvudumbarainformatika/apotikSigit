import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

export const useMenuStore = defineStore('menu-store', {
  state: () => ({
    items: [],
    // items: [
    //   {
    //     title: 'Dashboard',
    //     icon: 'home',
    //     url: 'admin',
    //     name: 'dashboard',
    //     view: '/views/dashboard',
    //     component: 'IndexPage',
    //     children:[]
    //   },


    //   //  MASTER
    //   {
    //     title: 'Master',
    //     icon: 'layers',
    //     url: 'admin/master',
    //     name: null,
    //     view: null,
    //     component: null,
    //     children:[
    //       {
    //         title: 'Master Satuan',
    //         icon: 'tag',
    //         url: 'admin/master/satuan',
    //         name: 'master.satuan',
    //         view: '/views/master/satuan',
    //         component: 'IndexPage',
    //       },
    //       {
    //         title: 'Master Barang',
    //         icon: 'layers',
    //         url: 'admin/master/barang',
    //         name: 'master.barang',
    //         view: '/views/master/barang',
    //         component: 'IndexPage',
    //       },
    //       {
    //         title: 'Master Jabatan',
    //         icon: 'network',
    //         url: 'admin/master/jabatan',
    //         name: 'master.jabatan',
    //         view: '/views/master/jabatan',
    //         component: 'IndexPage',
    //       },
    //       {
    //         title: 'Master Supplier',
    //         icon: 'users-round',
    //         url: 'admin/master/supplier',
    //         name: 'master.supplier',
    //         view: '/views/master/supplier',
    //         component: 'IndexPage',
    //       },
    //       {
    //         title: 'Master Pelanggan',
    //         icon: 'users',
    //         url: 'admin/master/pelanggan',
    //         name: 'master.pelanggan',
    //         view: '/views/master/pelanggan',
    //         component: 'IndexPage',
    //       },
    //       {
    //         title: 'Master Pengguna',
    //         icon: 'users',
    //         url: 'admin/master/user',
    //         name: 'master.user',
    //         view: '/views/master/user',
    //         component: 'IndexPage',
    //       },
    //       {
    //         title: 'Master Dokter',
    //         icon: 'users',
    //         url: 'admin/master/dokter',
    //         name: 'master.dokter',
    //         view: '/views/master/dokter',
    //         component: 'IndexPage',
    //       },
    //       {
    //         title: 'Master Beban',
    //         icon: 'users',
    //         url: 'admin/master/beban',
    //         name: 'master.beban',
    //         view: '/views/master/beban',
    //         component: 'IndexPage',
    //       }
    //     ]
    //   },


    //   // TRANSAKSI
    //   {
    //     title: 'Transaksi',
    //     icon: 'layers',
    //     url: 'admin/transaksi',
    //     name: null,
    //     view: null,
    //     component: null,
    //     children:[
    //       {
    //         title: 'Order Product',
    //         icon: 'layers',
    //         url: 'admin/transaksi/order',
    //         name: 'transaksi.order',
    //         view: '/views/transaksi/order',
    //         component: 'IndexPage',
    //       },
    //        {
    //         title: 'Penerimaan',
    //         icon: 'layers',
    //         url: 'admin/transaksi/penerimaan',
    //         name: 'transaksi.penerimaan',
    //         view: '/views/transaksi/penerimaan',
    //         component: 'IndexPage',
    //       },
    //       {
    //         title: 'Retur PBF',
    //         icon: 'layers',
    //         url: 'admin/transaksi/returpembelian',
    //         name: 'transaksi.returpembelian',
    //         view: '/views/transaksi/returpembelian',
    //         component: 'IndexPage',
    //       },
    //        {
    //         title: 'Penjualan',
    //         icon: 'layers',
    //         url: 'admin/transaksi/penjualan',
    //         name: 'transaksi.penjualan',
    //         view: '/views/transaksi/penjualan',
    //         component: 'IndexPage',
    //       },
    //       {
    //         title: 'Retur Penjualan',
    //         icon: 'layers',
    //         url: 'admin/transaksi/returpenjualan',
    //         name: 'transaksi.returpenjualan',
    //         view: '/views/transaksi/returpenjualan',
    //         component: 'IndexPage',
    //       },
    //        {
    //         title: 'Stock List',
    //         icon: 'layers',
    //         url: 'admin/transaksi/stock',
    //         name: 'transaksi.stock',
    //         view: '/views/transaksi/stock',
    //         component: 'IndexPage',
    //       },
    //       {
    //         title: 'Beban Pengeluaran',
    //         icon: 'layers',
    //         url: 'admin/transaksi/beban',
    //         name: 'transaksi.beban',
    //         view: '/views/transaksi/beban',
    //         component: 'IndexPage',
    //       }
    //     ]
    //   },

    //   //  LAPORAN
    //   {
    //     title: 'Laporan',
    //     icon: 'layers',
    //     url: 'admin/laporan',
    //     name: null,
    //     view: null,
    //     component: null,
    //     children:[
    //       {
    //         title: 'Kartu Stok',
    //         icon: 'layers',
    //         url: 'admin/laporan/kartustok',
    //         name: 'laporan.kartustok',
    //         view: '/views/laporan/kartustok',
    //         component: 'IndexPage',
    //       },
    //       {
    //         title: 'Laporan Penjualan',
    //         icon: 'layers',
    //         url: 'admin/laporan/penjualan',
    //         name: 'laporan.penjualan',
    //         view: '/views/laporan/penjualan',
    //         component: 'IndexPage',
    //       },
    //       {
    //         title: 'Laporan Pembelian',
    //         icon: 'layers',
    //         url: 'admin/laporan/pembelian',
    //         name: 'laporan.pembelian',
    //         view: '/views/laporan/pembelian',
    //         component: 'IndexPage',
    //       },
    //       {
    //         title: 'Laporan Labarugi',
    //         icon: 'layers',
    //         url: 'admin/laporan/labarugi',
    //         name: 'laporan.labarugi',
    //         view: '/views/laporan/labarugi',
    //         component: 'IndexPage',
    //       },
    //       {
    //         title: 'Laporan Hutang',
    //         icon: 'layers',
    //         url: 'admin/laporan/hutang',
    //         name: 'laporan.hutang',
    //         view: '/views/laporan/hutang',
    //         component: 'IndexPage',
    //       },
          
    //     ]
    //   },

    //   //SETTINGS
    //   {
    //     title: 'Settings',
    //     icon: 'layers',
    //     url: 'admin/settings',
    //     name: null,
    //     view: null,
    //     component: null,
    //     children:[
    //       {
    //         title: 'Aplikasi',
    //         icon: 'layers',
    //         url: 'admin/settings/aplikasi',
    //         name: 'settings.aplikasi',
    //         view: '/views/settings/aplikasi',
    //         component: 'IndexPage',
    //       },
    //       {
    //         title: 'Akses User',
    //         icon: 'layers',
    //         url: 'admin/settings/hak-akses',
    //         name: 'settings.hakakses',
    //         view: '/views/settings/hakakses',
    //         component: 'IndexPage',
    //       },
    //     ]
    //   },
    // ],
    loading: false
  }),
  persist: true,
  actions: {
    // async loadUserMenu() {
    //   this.loading = true
     
    //   try {
    //     const authStore = useAuthStore()
    //     const menus = authStore.user?.items
    //     this.items = menus || []
    //     // console.log('userid', menus)

    //     // const res = await api.post('api/v1/setting/hak-akses/get-user', { id: idUser })
    //     // const data = res.data?.data
    //     // console.log('Menu user:', data)
    //     // if (data?.items) {
    //     //   this.items = data.items
         
    //     // } else {
    //     //   this.items = []
    //     // }
    //   } catch (e) {
    //     console.error('Gagal load menu user:', e)
    //     this.items = []
    //   } finally {
    //     this.loading = false
    //   }
    // }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot))
}
