import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from '@/services/api'
import { getToday } from '@/utils/dateHelper'
import { set } from '@vueuse/core';

export const useLaporanFastmovingStore = defineStore('laporan-fastmoving-store', {
  state: () => ({
    items: [],
    grand: null,
    params: {
      q: '',
      per_page: 50,
      page: 1,
      order_by: 'created_at',
      sort: 'desc',
      from: getToday(),
      to: getToday(),
    },
    meta: null,
    loading: false,
    loadingMore: false,

    range:{
      start_date: getToday(),
      end_date: getToday()
    },

    perPages: [50, 100, 200, 500],
    
  }),

  // persist: true,

  actions: {
    setRange(val) {
      console.log('range', val);
      
      this.params.from = val.start_date
      this.params.to = val.end_date
      this.params.page = 1
      this.fetchData()
    },  
    setPage(page) {
      this.params.page = page
      this.fetchData()
    },

    setPerPage(perPage) {
      this.params.per_page = perPage
      this.params.page = 1
      this.fetchData()
    },
    setSearch(term) {
      this.params.q = term
      this.params.page = 1
      this.fetchData()
    },
    async fetchData(extraParams = {}) {
      this.loading = true
      try {
        const params = {
          ...this.params,
          ...extraParams
        }
        const res = await api.get('/api/v1/laporan/laporan-fastmoving/get-list', { params })
        console.log(`resp getList : `, res);
        this.items = res.data.data ?? res.data ?? []
        this.meta = res.data.meta ?? res.meta ?? null
        this.grand = res.data.grand_total ?? null
        // this.hasMore = this.page < (this.meta?.last_page ?? 1)
      } catch (err) {
        console.log(`error getList : `, err);
        this.error = err
      } finally {
        this.loading = false
      }
    },

  },



  getters: {
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLaporanFastmovingStore, import.meta.hot))

}
