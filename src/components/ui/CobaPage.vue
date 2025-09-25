<template>
  <u-page class="">
    <u-view class="">
      <u-row flex1 separator>
        <u-title :label="label" />
      </u-row>
    </u-view>
    <u-view flex1 class="overflow-y-scroll">
      <u-col flex1>
        <slot />
      </u-col>
    </u-view>
  </u-page>
</template>

<script setup>

const props = defineProps({
  label: { type: String, default: '' },
})

</script>