<script setup>
import { ref, onMounted } from 'vue'
import { useBarangStore } from '@/stores/template/register'

defineProps({
  msg: String,
})

const store = useBarangStore()

const count = ref(0)
const form = ref({
  email: '',
  password: '',
  error: '',
  status: ''
})

const errorSelect = ref(true)
const errorMessageSelect = ref('coba error select')
const options = ref([
  { value: '1', label: 'Tampilkan' },
  { value: '2', label: 'Sembunyikan' }
])

const users = ref([
  { name: 'coba', address: 'Alamat coba', phone: '08123456789' },
  { name: 'coba2', address: 'Alamat coba 2', phone: '08123456789' },
  { name: 'coba3', address: 'Alamat coba 3', phone: '08123456789' }
])


const handleSelect = (val) => {
  console.log('handleSelect', val);
  
}

onMounted(() => {
  store.fetchAll()
})

</script>

<template>
  <u-page>
    <u-view class="">
      <u-row flex1 class="">
        <u-row>
          <u-input-search />
          <u-btn-icon tooltip="Tambah Data" />
          <u-btn-icon icon="rotate-cw" tooltip="Refresh" />
        </u-row>
      </u-row>
    </u-view>
    <u-view flex1 scrollY>
      <u-col flex1  class="">
        <!-- <div class="font-medium">Color Palette</div> -->
         <u-title label="Color Palette" />
          <u-grid cols="4">
            <div class="bg-primary text-white p-4 h-[100px]">primary</div>
            <div class="bg-light-primary text-white p-4">light-primary</div>
            <div class="bg-secondary text-dark p-4">secondary</div>
            <div class="bg-background text-black p-4">background</div>
            <div class="bg-danger text-white p-4 h-[100px]">danger</div>
            <div class="bg-success text-white p-4 h-[100px]">dark</div>
            <div class="bg-grady-primary text-white p-4 h-[100px]">grady-primary</div>
            <div class="bg-grady-secondary text-black p-4 h-[100px]">grady-secondary</div>
          </u-grid>


          <u-title label="Buttons (u-btn)" />
          
          <!-- <div class="w-full space-y-2 "> -->
            <u-row flex1 class="w-full">
              <u-btn label="Primary" fullWidth />
              <u-btn variant="secondary" label="Secondary" />
              <u-btndrop label="Menu" :items="['Profile', 'Settings', 'Logout']" @select="handleSelect" />
              <u-btndrop label="Menu Dropdown Panjang" :items="['Profile', 'Settings', 'Logout']" @select="handleSelect" />
            </u-row>
           

          <u-title label="Input (u-input)" />
          <u-col class="w-full">
            <u-input label="Email" type="email" v-model="form.email"/>
            <u-input label="Password" type="password" v-model="form.password" />
            <u-input label="Percobaan Error" type="text" v-model="form.error" error error-message="Harap diisi" />
          </u-col>
          <u-title class="">Select (u-select)</u-title>
          <u-col  class="w-full">
              <u-select label="Uselect" v-model="form.status"
                :options="options" 
                @update:modelValue="(val)=> {
                  console.log('val',val);
                  
                }"
              />
              <u-select label="Uselect" v-model="form.status"
                :options="options" :error="errorSelect" :error-message="errorMessageSelect"
              />
          </u-col>
          <u-title>List (u-list)</u-title>
          <u-row flex1 class="">
            <u-row>
              <u-input-search />
              <u-btn-icon tooltip="Tambah Data" />
              <u-btn-icon icon="rotate-cw" tooltip="Refresh" />
            </u-row>
          </u-row>

          <u-list :items="users">
            <template #item="{ item }">
              <u-col gap="gap-1" class="w-full px-4 py-1">
                <u-view padding="0" flex1 class="w-full">
                  <u-row class=" ">
                    <div class="font-bold">Header</div>
                  </u-row>
                  <u-row flex1 right class="">
                    bbb
                  </u-row>
                </u-view>
                <u-separator />
                <u-view padding="0" flex1 class="w-full">
                  <u-row class="">
                    <u-col gap="gap-1">
                      <div class="">Header</div>
                      <div class="text-sm text-light-primary">Sub Header</div>
                    </u-col>
                  </u-row>
                  <u-row flex1 right class="">
                    <u-btndrop label="Menu" :items="['Profile', 'Settings', 'Logout']" />
                  </u-row>
                </u-view>
              </u-col>
            </template>
          </u-list>
          <!-- <div class="my-[100px]">Kenapa gak bisa </div> -->

          
      </u-col>


     

    </u-view>
    
   

  </u-page>
</template>

<style scoped>


</style>
