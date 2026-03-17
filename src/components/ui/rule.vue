<template>
  <GfrDialog
    v-model:visible="visible"
    :type="type"
    show-close
    :close-on-overlay="false"
    lock-scroll
    :disable-trigger="disableTrigger"
    @open="handleRuleOpen"
    @closed="handleRuleClosed"
    @close="emit('close')"
    @opened="emit('opened')"
  >
    <template #trigger>
      <slot name="trigger" />
    </template>
    <GfrContainer class="gfr-rule-wrapper">
      <div class="gfr-rule-header">
        {{ title }}
      </div>
      <GfrScrollArea
        ref="scrollAreaRef"
        class="gfr-rule-container"
        :reset="resetScrollArea"
        :dir="dir"
        :type="scrollType"
        mask
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
        @scroll-end="handleScrollEnd"
      >
        <GfrContent :context="content || ''" class="gfr-rule-content" />
      </GfrScrollArea>
      <div
        v-show="!isScrollAtBottom"
        class="gfr-rule-scroll-bottom"
        role="button"
        tabindex="0"
        aria-label="Scroll to bottom"
        @click="scrollToBottom"
      />
    </GfrContainer>
  </GfrDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GfrDialog from '@/components/ui/dialog.vue'
import GfrContainer from '@/components/ui/container.vue'
import GfrScrollArea from '@/components/ui/scroll-area.vue'
import GfrContent from '@/components/ui/content.vue'

defineOptions({
  name: 'GfrRule'
})

const scrollAreaRef = ref<InstanceType<typeof GfrScrollArea> | null>(null)
const isScrollAtBottom = ref(false)

function scrollToBottom() {
  scrollAreaRef.value?.scrollToBottom?.()
}

interface RuleProps {
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
}

withDefaults(defineProps<RuleProps>(), {
  type: 'bounce',
  dir: 'ltr',
  scrollType: 'auto',
  orientation: 'vertical'
})

const emit = defineEmits<{
  close: []
  closed: []
  opened: []
  open: []
  scrollEnd: [boolean]
}>()

const visible = defineModel<boolean>('visible', { default: false })
const resetScrollArea = ref(false)

function handleRuleOpen() {
  resetScrollArea.value = true
  isScrollAtBottom.value = false
  emit('open')
}

function handleRuleClosed() {
  resetScrollArea.value = false
  emit('closed')
}

function handleScrollEnd(isEnd: boolean) {
  isScrollAtBottom.value = isEnd
  emit('scrollEnd', isEnd)
}
</script>

<style scoped lang="scss">
.gfr-container.gfr-rule-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: url('/static/images/dialog-rule@2x.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  padding-left: 100px;
  padding-right: 98px;
  padding-bottom: 50px;
}
.gfr-rule-header {
  font-size: 40px;
  font-weight: var(--font-extra-bold);
  text-transform: uppercase;
  color: var(--dark);
  text-align: center;
  padding-top: 40px;
}

.gfr-rule-container {
  margin: 20px 0;
}

.gfr-rule-scroll-bottom {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/static/images/arrow@2x.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
