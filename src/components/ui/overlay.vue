<template>
  <Teleport :to="teleport">
    <transition
      appear
      enter-from-class="gfr-overlay-enter-from"
      enter-active-class="gfr-overlay-enter-active"
      leave-to-class="gfr-overlay-leave-to"
      leave-active-class="gfr-overlay-leave-active"
      @after-leave="emit('closed')"
      @after-enter="emit('opened')"
      @before-leave="emit('close')"
      @before-enter="emit('open')"
    >
      <div
        v-show="visible"
        :class="['gfr-overlay', `gfr-overlay-${align}`]"
        :style="{ zIndex, backgroundColor: color, '--gfr-overlay-duration': `${duration}ms` }"
        @click="handleClick"
      >
        <slot />
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue'
defineOptions({
  name: 'GfrOverlay'
})
interface OverlayProps {
  zIndex?: number
  color?: string
  teleport?: string
  clickable?: boolean
  lockScroll?: boolean
  duration?: number
  align?: 'center' | 'top' | 'bottom' | 'left' | 'right'
}
const emit = defineEmits(['click', 'closed', 'close', 'open', 'opened'])
const visible = defineModel<boolean>('visible', { required: true })
const {
  zIndex = 90,
  color = 'rgba(0, 0, 0, 0.5)',
  teleport = 'body',
  clickable = true,
  lockScroll = true,
  duration = 300,
  align = 'center'
} = defineProps<OverlayProps>()
watch(
  () => visible.value,
  (val) => {
    if (val && lockScroll) {
      document.body.classList.add('gfr-overlay-lock-scroll')
    } else if (!val) {
      document.body.classList.remove('gfr-overlay-lock-scroll')
    }
  }
)
const handleClick = () => {
  if (clickable) {
    emit('click')
    visible.value = false
  }
}
</script>

<style lang="scss">
.gfr-overlay-lock-scroll {
  pointer-events: none;
  overflow: hidden;
}
</style>
<style lang="scss" scoped>
.gfr-overlay {
  position: fixed;
  z-index: 90;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  display: flex;
  &-center {
    align-items: center;
    justify-content: center;
  }
  &-top {
    align-items: flex-start;
  }
  &-bottom {
    align-items: flex-end;
  }
  &-left {
    justify-content: flex-start;
  }
  &-right {
    justify-content: flex-end;
  }
}
.gfr-overlay-enter-from,
.gfr-overlay-leave-to {
  opacity: 0;
}
.gfr-overlay-enter-active,
.gfr-overlay-leave-active {
  transition: opacity var(--gfr-overlay-duration) ease-in-out;
}
</style>
