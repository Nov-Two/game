<template>
  <main class="gfr-module" :class="{ 'gfr-module--center': center }">
    <slot />
  </main>
</template>
<script setup lang="ts">
defineOptions({
  name: 'GfrModule'
})

withDefaults(
  defineProps<{
    center?: boolean
  }>(),
  {
    center: false
  }
)
</script>
<style lang="scss" scoped>
.gfr-module {
  width: 100%;
  height: 100%;
  &--center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
