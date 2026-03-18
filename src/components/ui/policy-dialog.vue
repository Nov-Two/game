<template>
  <GfrDialog
    v-model:visible="visible"
    :type="type"
    :show-close="showClose"
    :close-on-overlay="false"
    lock-scroll
    :disable-trigger="disableTrigger"
    overlay-color="rgba(0, 0, 0, 1)"
    container-class="gfr-policy-dialog"
    close-class="gfr-policy-dialog-close"
    trigger-class="gfr-policy-dialog-trigger"
    @open="
      () => {
        resetScrollArea = true
        emit('open')
      }
    "
    @closed="
      () => {
        resetScrollArea = false
        emit('closed')
      }
    "
    @close="emit('close')"
    @opened="emit('opened')"
  >
    <template #trigger>
      <slot name="trigger" />
    </template>
    <GfrContainer class="gfr-policy-wrapper">
      <div class="gfr-policy-header">
        <span class="gfr-policy-header-title">{{ title }}</span>
      </div>
      <GfrScrollArea
        class="gfr-policy-container"
        :reset="resetScrollArea"
        :dir="dir"
        :type="scrollType"
        :mask="false"
        :orientation="orientation"
        :offset="{
          top: 20,
          left: 20,
          right: 20,
          bottom: 20
        }"
        :initial-x="0"
        :initial-y="0"
        :force-update="visible"
        @scroll-end="onScrollEnd"
      >
        <GfrContent v-if="content" :context="content" class="gfr-policy-content" />
        <div v-else class="gfr-policy-content">
          <slot name="content" />
        </div>
      </GfrScrollArea>
      <div class="gfr-policy-bottom" :dir="dir">
        <slot name="model" />
        <GfrButton v-if="cancelText" class="gfr-policy-bottom-button cancel" :sound="false" @click="handleCancel">
          {{ cancelText }}
        </GfrButton>
        <GfrButton v-if="confirmText" class="gfr-policy-bottom-button confirm" :sound="false" @click="handleConfirm">
          {{ confirmText }}
        </GfrButton>
      </div>
    </GfrContainer>
  </GfrDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GfrDialog from '@/components/ui/dialog.vue'
import GfrContainer from '@/components/ui/container.vue'
import GfrScrollArea from '@/components/ui/scroll-area.vue'
import GfrContent from '@/components/ui/content.vue'
import GfrButton from '@/components/ui/button.vue'
import { useSound } from '@/composables/useSound'

defineOptions({
  name: 'GfrPolicyDialog'
})
const { playSounds } = useSound()

interface PolicyDialogProps {
  type?: 'fade' | 'fall' | 'bounce' | 'zoom'
  disableTrigger?: boolean
  title?: string
  content?: string
  dir?: 'ltr' | 'rtl'
  scrollType?: 'auto' | 'scroll' | 'hidden'
  orientation?: 'vertical' | 'horizontal'
  offset?: {
    top?: number
    left?: number
    right?: number
    bottom?: number
  }
  confirmText?: string
  cancelText?: string
  showClose?: boolean
}

withDefaults(defineProps<PolicyDialogProps>(), {
  type: 'bounce',
  dir: 'ltr',
  scrollType: 'auto',
  orientation: 'vertical',
  confirmText: '',
  cancelText: '',
  showClose: false
})

const emit = defineEmits<{
  close: []
  closed: []
  opened: []
  open: []
  scrollEnd: [boolean]
  cancel: []
  confirm: []
}>()

const visible = defineModel<boolean>('visible', { default: false })
const resetScrollArea = ref(false)
const onScrollEnd = (isEnd: boolean) => {
  emit('scrollEnd', isEnd)
}
const handleCancel = () => {
  playSounds('close')
  emit('cancel')
  visible.value = false
}
const handleConfirm = () => {
  playSounds('confirm')
  emit('confirm')
  visible.value = false
}
</script>
<style lang="scss">
.gfr-policy-dialog {
  background-image: none !important;
  background-color: #343434;
  border-radius: 0 !important;
  padding: 0 !important;
  border-bottom: 4px solid #6f6f6f;
}
.gfr-policy-dialog-trigger {
  height: 100%;
  width: fit-content;
}
.gfr-policy-dialog-close {
  left: auto !important;
  right: -62px;
}
</style>
<style scoped lang="scss">
.gfr-policy-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;
}
.gfr-policy-header {
  position: relative;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 42px;
  font-weight: var(--font-bold);
  text-transform: uppercase;
  text-align: center;
  height: 68px;
  background-image: linear-gradient(to bottom, #b1b1b1, #f7f5ed);
  .gfr-policy-header-title {
    display: inline-block;
    background-image: linear-gradient(to bottom, #353332, #836133);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: rgba(0, 0, 0, 0);
  }
  &::after {
    content: '';
    position: absolute;
    bottom: 2px;
    width: 70%;
    height: 4px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(
      to right,
      rgba(255, 242, 146, 0) 0%,
      rgb(255, 242, 146) 20%,
      rgb(255, 242, 146) 50%,
      rgb(255, 242, 146) 80%,
      rgba(255, 242, 146, 0) 100%
    );
    filter: drop-shadow(0 0.1em 0.05em rgba(228, 149, 18, 0.3));
  }
}

.gfr-policy-container {
  --scroll-area-thumb-color: #8f8f8f;
  --scroll-area-track-color: #161616;
  --scroll-area-thumb-width: 6px;
  --scroll-area-thumb-height: 6px;
  --scroll-area-thumb-radius: 0px;
  flex: 1;
  width: calc(100% - 60px);
  margin: 26px auto;
  background-color: #444444;
}
.gfr-policy-content {
  font-size: 24px;
  color: #c9c9c9 !important;
  padding: 8px 0;
}
.gfr-policy-dialog {
  background: none;
}
.gfr-policy-bottom {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 62px;
  font-weight: var(--font-bold);
  width: calc(100% - 60px);
  margin: 0 auto 20px;
}
.gfr-policy-bottom-button {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 32px;
  text-transform: uppercase;
  border-radius: 4px;
  padding-bottom: 2px;
  max-width: 30%;
  color: #753f00;
  background-image: linear-gradient(to bottom, #fbed65, #f0b64d);
  &:first-child {
    color: #002757;
    background-image: linear-gradient(to bottom, #008dc1, #007297);
  }
}
</style>
