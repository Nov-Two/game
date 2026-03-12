<template>
  <GfrOverlay
    v-model:visible="visible"
    :z-index="zIndex"
    :color="overlayColor"
    :teleport="teleport"
    :clickable="closeable"
    :lock-scroll="lockScroll"
    :duration="overlayDuration"
    @closed="emit('closed')"
    @close="emit('close')"
    @opened="emit('opened')"
    @open="emit('open')"
    align="center"
  >
    <div v-show="visible && loadingShow" :class="['gfr-loading']">
      <span :class="['gfr-loading-icon', `gfr-loading-${type}`]"></span>
    </div>
  </GfrOverlay>
</template>

<script setup lang="ts">
import GfrOverlay from '@/components/ui/overlay.vue'
import { watchEffect, ref } from 'vue'
defineOptions({
  name: 'GfrLoading'
})
interface loadingProps {
  zIndex?: number
  overlayColor?: string
  teleport?: string
  closeable?: boolean
  lockScroll?: boolean
  delay?: number
  overlayDuration?: number
  type?: 'circle' | 'circle-thin'
}

const {
  zIndex = 90,
  overlayColor = 'transparent',
  teleport = 'body',
  closeable = false,
  lockScroll = true,
  type = 'circle',
  delay = 300,
  overlayDuration = 0
} = defineProps<loadingProps>()
const emit = defineEmits(['closed', 'close', 'open', 'opened'])
const visible = defineModel<boolean>('visible', { required: true, default: false })
let timer: any = null
const loadingShow = ref(false)

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}
watchEffect(() => {
  clearTimer()
  if (visible.value) {
    if (delay > 0) {
      loadingShow.value = false
      timer = setTimeout(() => {
        loadingShow.value = true
      }, delay)
    } else {
      loadingShow.value = true
    }
  } else {
    loadingShow.value = false
  }
})
</script>

<style lang="scss" scoped>
.gfr-loading {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gfr-loading-icon {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.gfr-loading-circle {
  border: 0.4rem solid rgba(255, 255, 255, 0.7);
  border-bottom-color: #ff0057;
  border-radius: 50%;
  animation: rotator 1s linear infinite;
}
.gfr-loading-circle-thin {
  border-radius: 50%;
  border-top: 0.2rem solid #ff0057;
  border-right: 0.2rem solid transparent;
  animation: rotator 0.8s linear infinite;
}
@keyframes rotator {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
