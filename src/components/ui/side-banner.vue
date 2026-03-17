<template>
  <div class="side-banner">
    <div ref="scrollRef" class="side-banner__scroll" @scroll="onScroll">
      <div
        v-for="(slide, index) in loopSlides"
        :key="index"
        class="side-banner__slide"
        :style="{ backgroundImage: slide.bgImage }"
      ></div>
    </div>
    <div class="side-banner__tabbar">
      <button
        v-for="(_, index) in slides"
        :key="index"
        type="button"
        class="side-banner__dot"
        :class="{ 'side-banner__dot--active': index === activeIndex }"
        :aria-label="`Slide ${index + 1}`"
        @click="goTo(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

defineOptions({
  name: 'SideBanner'
})

export interface SlideItem {
  bgImage: string
  title?: string
  subtitle?: string
}

const props = withDefaults(
  defineProps<{
    slides?: SlideItem[]
    autoplayInterval?: number
  }>(),
  {
    slides: () => [],
    autoplayInterval: 4000
  }
)

const slides = computed(() => {
  if (props.slides.length > 0) return props.slides
  return [
    { bgImage: 'url(/images/banner-img@2x.png)' },
    { bgImage: 'url(/images/banner-img@2x.png)' }
  ]
})

/** 无限循环用：首尾各克隆一页 [last, ...original, first] */
const loopSlides = computed(() => {
  const list = slides.value
  if (list.length === 0) return []
  if (list.length <= 1) return list
  const last = list[list.length - 1]
  const first = list[0]
  if (!last || !first) return list
  return [last, ...list, first]
})

const slideCount = computed(() => slides.value.length)

const scrollRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
/** 避免跳转时 onScroll 把 activeIndex 改错 */
let isJumping = false

function goTo(logicalIndex: number) {
  const el = scrollRef.value
  if (!el) return
  const w = el.offsetWidth
  // loopSlides 中真实第一页在 DOM 下标 1，真实最后一页在 DOM 下标 n
  const domIndex = logicalIndex + 1
  el.style.scrollBehavior = 'smooth'
  el.scrollTo({ left: domIndex * w, behavior: 'smooth' })
  activeIndex.value = logicalIndex
}

function onScroll() {
  if (isJumping) return
  const el = scrollRef.value
  if (!el) return
  const n = slideCount.value
  const w = el.offsetWidth
  const rawIndex = Math.round(el.scrollLeft / w)

  if (rawIndex <= 0) {
    // 滚到最左侧克隆页（最后一页的克隆）→ 无动画跳到真实最后一页
    activeIndex.value = n - 1
    isJumping = true
    el.style.scrollBehavior = 'auto'
    el.scrollLeft = n * w
    requestAnimationFrame(() => {
      el.style.scrollBehavior = 'smooth'
      isJumping = false
    })
  } else if (rawIndex >= n + 1) {
    // 滚到最右侧克隆页（第一页的克隆）→ 无动画跳到真实第一页
    activeIndex.value = 0
    isJumping = true
    el.style.scrollBehavior = 'auto'
    el.scrollLeft = w
    requestAnimationFrame(() => {
      el.style.scrollBehavior = 'smooth'
      isJumping = false
    })
  } else {
    activeIndex.value = rawIndex - 1
  }
}

let autoplayTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  const el = scrollRef.value
  if (el && slideCount.value > 1) {
    el.scrollLeft = el.offsetWidth
  }
  autoplayTimer = setInterval(() => {
    const n = slideCount.value
    if (n <= 1) return
    const next = (activeIndex.value + 1) % n
    goTo(next)
  }, props.autoplayInterval)
})

onUnmounted(() => {
  if (autoplayTimer) clearInterval(autoplayTimer)
})
</script>

<style scoped lang="scss">
.side-banner {
  width: 100%;
  height: 100%;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
}

.side-banner__scroll {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
}

.side-banner__slide {
  flex: 0 0 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  min-height: 280px;
}

.side-banner__tabbar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 14px;
  /* 作为 ::before 阴影的定位参照，并保证按钮在阴影之上 */
  z-index: 1;

  /* 底部向内发散阴影：底部最深，向上逐渐变淡，覆盖按钮区域 */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 72px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.2) 35%, transparent 100%);
    pointer-events: none;
  }
}

.side-banner__tabbar .side-banner__dot {
  position: relative;
  z-index: 1;
}

.side-banner__dot {
  width: 24px;
  height: 6px;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  background-color: rgb(18, 27, 36);
  transition: background 0.25s ease;
  padding: 0;

  &:hover {
    background-color: rgb(220, 255, 0);
  }

  &.side-banner__dot--active {
    background-color: rgb(220, 255, 0);
    box-shadow: 0 0 8px rgb(220, 255, 0);
  }
}
</style>
