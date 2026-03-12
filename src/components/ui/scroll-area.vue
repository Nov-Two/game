<template>
  <div
    class="gfr-scroll-area"
    :class="[`gfr-scroll-area--${orientation}`, `gfr-scroll-area--${type}`, `gfr-scroll-area--${dir}`]"
  >
    <div
      ref="viewRef"
      :class="[`gfr-scroll-area-view`, showMask && 'gfr-scroll-area-view--mask']"
      :style="maskStyle"
      @scroll.prevent.stop="onScroll"
    >
      <slot />
    </div>
    <transition name="gfr-thumb">
      <div
        v-show="thumbVisible"
        :class="['gfr-scroll-area-track', `gfr-scroll-area-track--${orientation}`, `gfr-scroll-area-track--${dir}`]"
      >
        <div
          :class="['gfr-scroll-area-thumb', `gfr-scroll-area-thumb--${orientation}`, `gfr-scroll-area-thumb--${dir}`]"
          :style="{
            ...thumbStyle
          }"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount, toRefs, watchEffect } from 'vue'
import { useScroll } from '@vueuse/core'
defineOptions({
  name: 'GfrScrollArea'
})
interface ScrollAreaOffset {
  top?: number
  left?: number
  right?: number
  bottom?: number
}
// type === 'auto' --- Show scrollbar when content overflows, otherwise hide
// type === 'scroll' --- Show scrollbar when content is scrolling, otherwise hide
// type === 'hidden' --- Hide scrollbar
interface ScrollAreaProps {
  type?: 'auto' | 'scroll' | 'hidden' // Scroll area type
  orientation?: 'vertical' | 'horizontal' // Scroll direction
  dir?: 'ltr' | 'rtl' // Text direction
  scrollHideDelay?: number // Scrollbar hide delay
  reset?: boolean // Whether to reset scroll position
  offset?: ScrollAreaOffset // Scroll offset
  mask?: boolean // Whether to show mask
  forceUpdate?: boolean // Force update flag
  initialX?: number // Initial horizontal scroll position
  initialY?: number // Initial vertical scroll position
}

const {
  type = 'auto',
  orientation = 'vertical',
  dir = 'ltr',
  scrollHideDelay = 600,
  reset = false,
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  mask = false,
  forceUpdate = false,
  initialX = 0,
  initialY = 0
} = defineProps<ScrollAreaProps>()
const emit = defineEmits<{
  (e: 'scrollEnd', isEnd: boolean): void
}>()

const viewRef = ref<HTMLElement | null>(null)
const { x, y, arrivedState } = useScroll(viewRef, {
  offset: offset
})
const { bottom, right } = toRefs(arrivedState)
const thumbVisible = ref(type === 'auto')
const thumbPos = ref(0)
const thumbSize = ref(0)
const showMask = ref(false)
let hideTimer: any = null

const isVertical = computed(() => orientation === 'vertical')

const thumbStyle = computed(() => {
  if (!viewRef.value) return {}
  if (isVertical.value) {
    return {
      '--scroll-area-thumb-size': `${thumbSize.value}px`,
      transform: `translateY(${thumbPos.value}px)`
    }
  } else {
    return {
      '--scroll-area-thumb-size': `${thumbSize.value}px`,
      transform: `translateX(${thumbPos.value}px)`
    }
  }
})
const maskStyle = computed(() => {
  return {
    '--scroll-area-mask-image': `linear-gradient(to ${
      orientation === 'vertical' ? 'top' : dir === 'ltr' ? 'left' : 'right'
    }, transparent, black 12%)`
  }
})
function updateThumb() {
  const el = viewRef.value
  if (!el) return
  if (isVertical.value) {
    const ratio = el.clientHeight / el.scrollHeight
    thumbSize.value = Math.ceil(Math.max(el.clientHeight * ratio, 20))
    thumbPos.value = Math.floor((el.scrollTop / el.scrollHeight) * el.clientHeight)
  } else {
    const ratio = el.clientWidth / el.scrollWidth
    thumbSize.value = Math.floor(Math.max(el.clientWidth * ratio, 20))
    thumbPos.value = Math.floor((el.scrollLeft / el.scrollWidth) * el.clientWidth)
  }
}
function setThumbVisible() {
  const clientSize = isVertical.value ? (viewRef.value?.clientHeight ?? 0) : (viewRef.value?.clientWidth ?? 0)
  const scrollSize = isVertical.value ? (viewRef.value?.scrollHeight ?? 0) : (viewRef.value?.scrollWidth ?? 0)
  showMask.value = mask && clientSize < scrollSize
  if (type === 'auto') {
    thumbVisible.value = clientSize < scrollSize
  } else {
    thumbVisible.value = false
  }
}
function onScroll() {
  if (type === 'hidden') return
  updateThumb()
  if (type === 'scroll') {
    thumbVisible.value = true
    resetHideTimer()
  }
}

function resetHideTimer() {
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    thumbVisible.value = false
  }, scrollHideDelay)
}

function resetScrollArea() {
  y.value = initialY
  x.value = dir === 'ltr' ? initialX : -initialX
}

function setScrollArea(initialX: number, initialY: number) {
  x.value = dir === 'ltr' ? initialX : -initialX
  y.value = initialY
}

onMounted(async () => {
  await nextTick()
  updateThumb()
  setThumbVisible()
  window.addEventListener('resize', updateThumb)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateThumb)
  if (hideTimer) clearTimeout(hideTimer)
})

watchEffect(async () => {
  if (forceUpdate) {
    await nextTick()
    if (type === 'hidden') return
    updateThumb()
    setThumbVisible()
  }
})
watch(
  () => [bottom.value, right.value],
  async () => {
    await nextTick()
    if ((isVertical.value && bottom.value) || (!isVertical.value && right.value)) {
      showMask.value = false
      emit('scrollEnd', true)
    } else {
      showMask.value = mask
      emit('scrollEnd', false)
    }
  }
)
watch(
  () => reset,
  (value) => {
    if (value) {
      resetScrollArea()
    }
  }
)
watch(
  () => [initialX, initialY],
  () => {
    setScrollArea(initialX, initialY)
  }
)
</script>

<style lang="scss" scoped>
.gfr-scroll-area {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.gfr-scroll-area--rtl {
  direction: rtl;
}
.gfr-scroll-area--ltr {
  direction: ltr;
}
.gfr-scroll-area--horizontal {
  padding: 16px 0;
  // .gfr-scroll-area-view {
  //   overflow-x: auto;
  // }
}
.gfr-scroll-area--vertical {
  padding: 0 16px;
  // .gfr-scroll-area-view {
  //   overflow-y: auto;
  // }
}
.gfr-scroll-area-view {
  width: 100%;
  height: 100%;
  overflow: auto;
  // Hide native scrollbar
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  &--mask {
    mask-image: var(--scroll-area-mask-image);
  }
}
.gfr-scroll-area-track {
  position: absolute;
  background: var(--scroll-area-track-color);
  border-radius: var(--scroll-area-thumb-radius);
  z-index: 10;
  user-select: none;
  pointer-events: auto;
  &--vertical {
    top: 0;
    right: 0;
    left: auto;
    width: fit-content;
    height: 100%;
    .gfr-scroll-area-thumb {
      width: var(--scroll-area-thumb-width);
      height: var(--scroll-area-thumb-size);
    }
    &.gfr-scroll-area-track--ltr {
      right: 0;
      left: auto;
    }
    &.gfr-scroll-area-track--rtl {
      left: 0;
      right: auto;
    }
  }
  &--horizontal {
    top: auto;
    bottom: 0;
    width: 100%;
    height: fit-content;
    .gfr-scroll-area-thumb {
      height: var(--scroll-area-thumb-height);
      width: var(--scroll-area-thumb-size);
    }
    &.gfr-scroll-area-thumb--ltr {
      left: 0;
      right: auto;
    }
    &.gfr-scroll-area-thumb--rtl {
      right: 0;
      left: auto;
    }
  }
}
.gfr-scroll-area-thumb {
  background: var(--scroll-area-thumb-color);
  border-radius: var(--scroll-area-thumb-radius);
  user-select: none;
  pointer-events: auto;
}

.gfr-thumb-enter-active,
.gfr-thumb-leave-active {
  transition: opacity 0.2s;
}
.gfr-thumb-enter-from,
.gfr-thumb-leave-to {
  opacity: 0;
}
</style>
