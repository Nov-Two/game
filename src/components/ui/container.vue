<template>
  <div class="gfr-container" :class="{ 'gfr-container-flexible': flexible }">
    <slot />
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'GfrContainer'
})
defineProps<{
  flexible?: boolean
}>()
</script>
<style lang="scss" scoped>
.gfr-container {
  width: 100%;
  height: fit-content;
  &-flexible {
    margin: 0 auto;
    width: 100% !important;
    height: 100% !important;
    max-width: var(--container-width);
    max-height: var(--container-height);
  }
}
</style>
