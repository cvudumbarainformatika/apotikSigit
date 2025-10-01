// src/stores/useTemplateStore.js
import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from '@/services/api'
import { useNotificationStore } from '@/stores/notification'
import { getToday } from '@/utils/dateHelper'

const notify = useNotificationStore().notify

export function createTemplateTransaksiStore(storeId, config) {
  return defineStore(storeId, {
    state: () => ({
      items: [],
      meta:null,
      item: null,
      loading: true,
      loadingMore: false,
      loadingSave: false,
      loadingDelete: false,
      error: null,

      emptyTitle:`Belum Ada Data ${storeId}`,
      emptySubtitle:`Silahkan tambahkan data terlebih dahulu / Lakukan Pencarian Data dengan Kata Kunci yang Sesuai`,

      supplierSelected: null,
      barangSelected: null,
      orderSelected: null,
      penerimaanSelected: null,
      pelangganSelected: null,
      dokterSelected: null,

      page: 1,
      per_page: 10,
      total: 0,
      q: '',
      order_by: 'created_at',
      sort: 'desc',

      range:{
        start_date: null,
        end_date: null
      },

      hasMore: true,


      maxRight: false,
      form:null,
      mode: 'add',


      ...config.state
    }),
    actions: {
      async fetchAll(extraParams = {}) {
        this.loading = true
        try {
          const params = {
            page: this.page,
            per_page: this.per_page,
            q: this.q,
            order_by: this.order_by,
            sort: this.sort,
            from: this.range.start_date,
            to: this.range.end_date,
            ...extraParams
          }
          const res = await api.get(`${config.baseUrl}${config?.createUrl  || '/get-list'}`, { params })
          console.log(`resp ${storeId} header getList : `, res);
          // this.items = []
          this.items = res.data.data ?? res.data ?? []
          this.meta = res.data.meta ?? res.meta ?? null
          this.hasMore = this.page < (this.meta?.last_page ?? 1)

        } catch (err) {
          console.log(`error ${storeId} getList : `, err);
          this.error = err
        } finally {
          this.loading = false
        }
      },

      async fetchMore(extraParams = {}) {
        
        if (this.meta.page >= this.meta.last_page) return
        this.loadingMore = true
        this.page += 1
        try {
          const params = {
            page: this.page,
            per_page: this.per_page,
            q: this.q,
            order_by: this.order_by,
            sort: this.sort,
            from: this.range.start_date,
            to: this.range.end_date,
            ...extraParams
          }

          const res = await api.get(`${config.baseUrl}${config?.createUrl  || '/get-list'}`, { params })
          const newItems = res.data.data ?? []
          this.items.push(...newItems)
          this.meta = res.data.meta
          this.hasMore = this.page < (this.meta?.last_page ?? 1)  
        } catch (err) {
          console.error('FetchMore error:', err)
        } finally {
          this.loadingMore = false
        }
      },


      async fetchOne(id) {
        this.loading = true
        try {
          const res = await api.get(`${config.baseUrl}/${id}`)
          this.item = res.data
        } catch (err) {
          this.error = err
        } finally {
          this.loading = false
        }
      },
      async create(data) {
        // console.log('data', data);
        // console.log('mode', mode);
          this.loadingSave = true
        
        
        try {
          const res = await api.post(`${config.baseUrl}${config?.createUrl || '/simpan'}`, data)
          console.log(`resp ${storeId} create : `, res);
          // if (res.status === 200) {
            const result = res.data?.data?.header ?? res.data?.data ?? null
            if (this.mode === 'add') {
              this.items.unshift(result)
              this.initModeEdit(result)
            } else {
              this.initModeEdit(result)
            }

            this.error = null
          // }

          notify({ message: res.data.message ?? 'Berhasil Menyimpan data', type: 'success' })
          
        } catch (err) {
          console.log(`error ${storeId} create : `, err);
          this.error = err
          notify({ message: err.response?.data?.message ?? 'Gagal menyimpan data', type: 'error' })
        } finally {
          this.loadingSave = false
        }
      },

      init(){
        this.form = null
        this.range.from = getToday()
        this.range.to = getToday()
        this.supplierSelected = null
        this.barangSelected = null
        this.orderSelected = null
        this.maxRight = false
        this.mode = 'add'
      },

      initModeEdit(result){
        this.form = result
        const id = result?.id ?? null
        const index = this.items.findIndex(item => item?.id === id)
        if (index !== -1) {
          this.items[index] = result
        }
        this.supplierSelected = result?.supplier ?? result?.suplier ?? null
        this.maxRight = false
        this.mode = 'edit'
      },
      async update(data, mode) {
        // return await api.put(`${config.baseUrl}/${config?.endpointUpdate || '/update'}/${id}`, data)
        this.loadingSave = true
        try {
          const res = await api.post(`${config.baseUrl}${config?.updateUrl || '/update'}`, data)
          console.log(`resp ${storeId} update : `, res);
          if (res.status === 200) {
            const result = res.data.data
            // if (mode === 'add') {
            //   this.items.unshift(result)
            // }else {
            this.items = this.items.map((item) => {
              if (item.id === result.id) {
                return result
              }
              return item
            })
            // }
            this.error = null
          }
        } catch (error) {
          console.log(`error ${storeId} update : `, error);
          
        } finally {
          this.loadingSave = false
        }
      },
      setPage(page) {
        this.page = page
        this.fetchAll()
      },
      setSearch(term) {
        this.search = term
        this.page = 1
        this.fetchAll()
      },

      setRange(val) {
        // console.log('range', val);
        
        this.from = val.start_date
        this.to = val.end_date
        this.page = 1
        this.fetchAll()
      },  

      clearFieldError(field) {
        if (this.error?.response?.data?.errors?.[field]) {
          delete this.error.response.data.errors[field]
        }
      },
      reset() {
        this.item = null
        this.error = null
        this.loading = false
        this.page = 1
        this.q = ''
      }
    },

    // 💡 Hanya aktifkan persist jika config.persist = true
    
    persist: config.persist === true ? {
      pick: ['items', 'per_page', 'form', 'supplierSelected', 'barangSelected', 'orderSelected', 'mode'],
    } : false




  })
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(createTemplateTransaksiStore, import.meta.hot))
  
}
