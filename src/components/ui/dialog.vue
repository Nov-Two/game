<template>
  <div v-if="!disableTrigger" :class="['gfr-dialog-trigger', triggerClass]" @click="handleTriggerClick">
    <slot name="trigger">
      <button class="gfr-dialog-trigger-button">Open Dialog</button>
    </slot>
  </div>
  <GfrOverlay
    v-model:visible="visible"
    :z-index="zIndex"
    :color="overlayColor"
    :teleport="teleport"
    :clickable="closeOnOverlay"
    :lock-scroll="lockScroll"
    :duration="duration"
    align="center"
  >
    <transition
      :name="`gfr-dialog-${type}`"
      @after-leave="emit('closed')"
      @after-enter="emit('opened')"
      @before-leave="emit('close')"
      @before-enter="emit('open')"
    >
      <GfrContainer
        v-show="visible"
        :class="['gfr-dialog', containerClass]"
        @click.stop
        :style="{ '--gfr-dialog-duration': `${duration}ms` }"
      >
        <GfrButton v-if="showClose" :class="['gfr-dialog-close', closeClass]" @click="triggerClose" aria-label="Close">
          <img
            src="/static/images/close@1x.png"
            srcset="/static/images/close@1x.png 1x, /static/images/close@2x.png 2x, /static/images/close@3x.png 3x"
            alt="close"
          />
        </GfrButton>
        <slot />
      </GfrContainer>
    </transition>
  </GfrOverlay>
</template>

<script setup lang="ts">
import GfrContainer from '@/components/ui/container.vue'
import GfrOverlay from '@/components/ui/overlay.vue'
import GfrButton from '@/components/ui/button.vue'

defineOptions({
  name: 'GfrDialog'
})

interface DialogProps {
  type?: 'fade' | 'fall' | 'bounce' | 'zoom'
  zIndex?: number
  overlayColor?: string
  teleport?: string
  closeOnOverlay?: boolean
  showClose?: boolean
  lockScroll?: boolean
  duration?: number
  trigger?: 'click' | 'manual'
  disableTrigger?: boolean
  containerClass?: string
  closeClass?: string
  triggerClass?: string
}

const props = withDefaults(defineProps<DialogProps>(), {
  zIndex: 90,
  overlayColor: 'rgba(0,0,0,0.6)',
  teleport: 'body',
  closeOnOverlay: true,
  showClose: true,
  type: 'bounce',
  lockScroll: true,
  duration: 300,
  trigger: 'click',
  disableTrigger: false,
  containerClass: '',
  closeClass: ''
})

const emit = defineEmits<{
  close: []
  closed: []
  opened: []
  open: []
}>()

const visible = defineModel<boolean>('visible', { default: false })

function triggerClose() {
  visible.value = false
}

function handleTriggerClick() {
  if (props.trigger === 'click') {
    visible.value = true
  }
}

function handleOpen() {
  visible.value = true
}

function handleClose() {
  visible.value = false
}

defineExpose({
  open: handleOpen,
  close: handleClose,
  toggle: () => (visible.value = !visible.value)
})
</script>

<style scoped lang="scss">
.gfr-dialog-container {
  display: inline-block;
}

.gfr-dialog-trigger-button {
  background-color: var(--dark);
  color: var(--light);
  border-radius: var(--radius);
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    opacity: 0.9;
  }
}

.gfr-dialog {
  position: relative;
  width: 856px;
  height: 478px;
  // background: var(--light);
  // border-radius: var(--radius);
  pointer-events: auto;
}

.gfr-dialog-close {
  position: absolute;
  // top: 8px;
  left: -36px;
  width: 47px;
  height: 47px;
  background-color: transparent;
  img {
    width: 30px;
    height: 30px;
  }
  // border-radius: var(--radius);
  // background: var(--light);
}
.gfr-dialog-fade-enter-active,
.gfr-dialog-fade-leave-active,
.gfr-dialog-zoom-enter-active,
.gfr-dialog-zoom-leave-active {
  transition-property: opacity, transform;
  transition-duration: var(--gfr-dialog-duration);
  transition-timing-function: ease-in-out;
}
.gfr-dialog-fall-enter-active,
.gfr-dialog-fall-leave-active,
.gfr-dialog-bounce-enter-active,
.gfr-dialog-bounce-leave-active {
  transition-property: opacity, transform;
  transition-duration: var(--gfr-dialog-duration);
  transition-timing-function: cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.gfr-dialog-fade-enter-from,
.gfr-dialog-fade-leave-to {
  opacity: 0;
}
.gfr-dialog-fall-enter-from {
  opacity: 0;
  transform: translate3d(0, -30%, 0);
}
.gfr-dialog-fall-leave-to {
  opacity: 0;
}

.gfr-dialog-bounce-enter-from,
.gfr-dialog-bounce-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.gfr-dialog-zoom-enter-from,
.gfr-dialog-zoom-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
