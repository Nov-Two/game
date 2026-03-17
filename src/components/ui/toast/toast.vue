<template>
  <GfrOverlay
    v-model:visible="visible"
    :z-index="zIndex"
    :color="overlayColor"
    :teleport="teleport"
    :clickable="closeable"
    :lock-scroll="lockScroll"
    :align="position"
    :duration="closeable ? 300 : 0"
  >
    <transition
      appear
      :name="`gfr-toast-${position}`"
      @after-leave="handleClosed"
      @after-enter="handleOpened"
      @before-leave="handleClose"
      @before-enter="handleOpen"
    >
      <div v-show="visible" :class="['gfr-toast', `gfr-toast-${position}`]" :style="toastStyle">
        <slot />
        <slot name="message" />
      </div>
    </transition>
  </GfrOverlay>
</template>

<script setup lang="ts">
import GfrOverlay from '@/components/ui/overlay.vue'
import { computed, watchEffect } from 'vue'
defineOptions({
  name: 'GfrToast'
})
interface ToastProps {
  position?: 'top' | 'bottom' | 'center'
  zIndex?: number
  overlayColor?: string
  teleport?: string
  closeable?: boolean
  lockScroll?: boolean
  duration?: number
  message?: string
  backgroundImage?: string
}

const {
  zIndex = 90,
  overlayColor = 'transparent',
  teleport = 'body',
  closeable = true,
  position = 'center',
  lockScroll = true,
  duration = 2000,
  backgroundImage
} = defineProps<ToastProps>()

const toastStyle = computed(() =>
  backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : undefined
)
const emit = defineEmits(['closed', 'close', 'open', 'opened'])
const visible = defineModel<boolean>('visible', { required: true, default: false })
let timer: any = null
const handleClose = () => {
  emit('close')
}
const handleOpen = () => {
  emit('open')
}
const handleClosed = () => {
  emit('closed')
}
const handleOpened = () => {
  emit('opened')
}
const clearTimer = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}
watchEffect(() => {
  clearTimer()
  if (visible.value && duration > 0) {
    timer = setTimeout(() => {
      visible.value = false
    }, duration)
  }
})
</script>

<style lang="scss" scoped>
.gfr-toast {
  width: var(--toast-width);
  height: var(--toast-height);
  border-radius: var(--toast-radius);
  font-size: var(--toast-font-size);
  font-weight: var(--font-medium);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: italic;
  color: var(--light);
  padding: var(--toast-padding);
  background-color: var(--toast-background-color);
  &-top {
    margin: 20px auto;
  }
  &-bottom {
    margin: 20px auto;
  }
}

.gfr-toast-center-enter-active,
.gfr-toast-center-leave-active,
.gfr-toast-top-enter-active,
.gfr-toast-top-leave-active,
.gfr-toast-bottom-enter-active,
.gfr-toast-bottom-leave-active {
  transition-property: opacity, transform;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.18, 0.89, 0.32, 1.28);
}
.gfr-toast-center-enter-from,
.gfr-toast-center-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.gfr-toast-top-enter-from,
.gfr-toast-top-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
.gfr-toast-bottom-enter-from,
.gfr-toast-bottom-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
