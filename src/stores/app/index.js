// src/stores/useTemplateStore.js
import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from '@/services/api'
import { useNotificationStore } from '@/stores/notification'

const notify = useNotificationStore().notify

export const useAppStore = defineStore('app-store', {
    state: () => ({
      meta:null,
      item: null,
      loading: true,
      loadingSave: false,
      error: null,

      form:{
        nama: '',
        alamat: '',
        telepon: '',
        pemilik: '',
        pajak: 11,
        header: '',
        footer: '',
      }

      

      
    }),
    actions: {
     
     


      async fetchData(id) {
        this.loading = true
        try {
          const res = await api.get(`/api/v1/setting/profile-toko/get-profile`)
          console.log('res', res);
          

          this.updateForm(res.data?.data)
          // this.item = res.data
        } catch (err) {
          this.error = err
        } finally {
          this.loading = false
        }
      },
      async create() {
        // console.log('data', data);
        // console.log('mode', mode);
        this.loadingSave = true
        
        
        try {
          const res = await api.post(`/api/v1/setting/profile-toko/simpan`, this.form)
          console.log(`resp aplikasi create : `, res);
          // if (res.status === 200) {
          //   const result = res.data.data
            
          //   this.error = null
          //   this.modalFormOpen = false
          //   notify({ message: res.data.message ?? 'Berhasil Menyimpan data', type: 'success' })
          // }
        
        notify({ message: res.data.message ?? 'Berhasil Menyimpan data', type: 'success' })
          
        } catch (err) {
          console.log(`error aplikasi create : `, err);
          this.error = err
        } finally {
          this.loadingSave = false
        }
      },


      updateForm(data) {

        this.form = {
          ...this.form,
          ...data
        }

        
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
    
    // persist: config.persist === true ? {
    //   pick: ['items', 'per_page']
    // } : false




})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
  
}
