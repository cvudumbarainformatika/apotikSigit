// src/stores/useTemplateStore.js
import { defineStore } from 'pinia'
import { api } from '@/services/api'
import { useNotificationStore } from '@/stores/notification'

const notify = useNotificationStore().notify

export function createTemplateStore(storeId, config) {
  return defineStore(storeId, {
    state: () => ({
      items: [],
      meta:null,
      item: null,
      loading: true,
      loadingMore: false,
      loadingSave: false,
      loadingDeletes: [],
      error: null,

      emptyTitle:`Belum Ada Data ${storeId}`,
      emptySubtitle:`Silahkan tambahkan data terlebih dahulu / Lakukan Pencarian Data dengan Kata Kunci yang Sesuai`,

      page: 1,
      per_page: 10,
      total: 0,
      q: '',
      order_by: config.order_by || 'created_at',
      sort: config.sort || 'desc',

      hasMore: true,

      order: config.order || 'Nama',
      orders: config.orders || 
        [
          { key: 'nama', sort: 'asc', label: 'Nama' },
          { key: 'created_at', sort: 'desc', label: 'Terbaru' },
          { key: 'created_at', sort: 'asc', label: 'Terlama' },
        ]
      ,

      modalFormOpen: false,


      ...config.state
    }),
    actions: {
      async fetchAll(extraParams = {}) {
        this.loading = true
        try {
          const params = {
            page: 1,
            per_page: this.per_page,
            q: this.q,
            order_by: this.order_by,
            sort: this.sort,
            ...extraParams
          }
          const res = await api.get(config.baseUrl + '/get-list', { params })
          console.log(`resp ${storeId} getList : `, res);
          
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
          }

          const res = await api.get(config.baseUrl + '/get-list', { params })
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
      async create(data, mode) {
        // console.log('data', data);
        // console.log('mode', mode);
          this.loadingSave = true
        
        
        try {
          const res = await api.post(`${config.baseUrl}${config?.createUrl || '/simpan'}`, data)
          console.log(`resp ${storeId} create : `, res);
          if (res.status === 200 || res.status === 201) {
            const result = res.data.data ?? res.data.user ?? null
            console.log('result save', result);
            if (mode === 'add') {
              this.items.unshift(result)
            }else {
              this.items = this.items.map((item) => {
                if (item.id === result.id) {
                  return result
                }
                return item
              })
            }
            this.error = null
            this.modalFormOpen = false
            notify({ message: res.data.message ?? 'Berhasil Menyimpan data', type: 'success' })
          }

          
        } catch (err) {
          console.log(`error ${storeId} create : `, err);
          this.error = err
        } finally {
          this.loadingSave = false
        }
      },
      async update(data, mode) {
        // return await api.put(`${config.baseUrl}/${config?.endpointUpdate || '/update'}/${id}`, data)
        this.loadingSave = true
        try {
          const res = await api.post(`${config.baseUrl}${config?.updateUrl || '/update'}`, data)
          console.log(`resp ${storeId} update : `, res);
          if (res.status === 200) {
            const result = res.data.data || res.data.user
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
            notify({ message: res.data.message ?? 'Berhasil Update data', type: 'success' })
          }
        } catch (error) {
          console.log(`error ${storeId} update : `, error);
          
        } finally {
          this.loadingSave = false
        }
      },
      async remove(id) {
        // return await api.delete(`${config.baseUrl}/${id}`)
        const findIndex = this.items.findIndex(item => item.id === id)
        if (findIndex !== -1) {
          this.loadingDeletes = [findIndex]
        }
        try {
          const res = await api.post(`${config.baseUrl}/delete`, { id })
          console.log(`resp ${storeId} delete : `, res);
          if (res.status === 200) {
            this.items = this.items.filter(item => item.id !== id)
            this.error = null
            notify({ message: res.data.message ?? 'Berhasil menghapus data', type: 'success' })
          }
        } catch (err) {
          console.log(`error ${storeId} delete : `, err);
          this.error = err
        } finally {
          this.loadingDeletes = []
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

      setOrder(label) {
        const res = this.orders?.find(o => o?.label === label)
        // console.log('sort', res);
        
        this.order_by = res?.key
        this.sort = res?.sort
        // this.sort = sort
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
      pick: ['items', 'per_page']
    } : false




  })
}
