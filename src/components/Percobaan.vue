<template>
  <CobaPage label="Percobaan">
    <div v-for="i in 10" :key="i">
      <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius delectus laudantium aliquam, magni natus esse sequi, molestiae ullam, dolorum libero temporibus rerum impedit quas amet porro corrupti repellat nulla dolor!</div>
    </div>
    <u-row>
      <u-btn label="Simpan Data" />
      <u-btn variant="secondary" label="Cancel" />
    </u-row>
  </CobaPage>
</template>

<script setup>
import CobaPage from '../components/ui/CobaPage.vue'
</script>