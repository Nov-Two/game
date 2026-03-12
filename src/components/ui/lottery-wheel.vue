<template>
  <div
    :class="['gfr-lottery-wheel', { 'gfr-lottery-wheel--disabled': disabled || spinning }]"
    :style="wheelStyle"
  >
    <div class="gfr-lottery-wheel__pointer" :aria-hidden="true" />
    <div
      ref="diskRef"
      class="gfr-lottery-wheel__disk"
      :style="diskStyle"
    >
      <div
        class="gfr-lottery-wheel__disk-bg"
        :style="diskBgStyle"
      />
      <div
        v-for="(item, index) in items"
        :key="getItemKey(item, index)"
        class="gfr-lottery-wheel__item"
        :style="getItemStyle(index)"
      >
        <div class="gfr-lottery-wheel__item-inner">
          <slot name="item" :item="item" :index="index">
            <span class="gfr-lottery-wheel__item-label">{{ item.label }}</span>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

defineOptions({
  name: 'GfrLotteryWheel'
})

export interface LotteryWheelItem {
  id?: string | number
  label: string
  [key: string]: unknown
}

interface Props {
  /** 奖项列表（至少 2 项） */
  items: LotteryWheelItem[]
  /** 转盘尺寸（px），默认 600 */
  size?: number
  /** 旋转时长（ms），默认 4000 */
  duration?: number
  /** 旋转前多转圈数，默认 5 */
  extraRounds?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 600,
  duration: 4000,
  extraRounds: 5,
  disabled: false
})

const emit = defineEmits<{
  start: []
  end: [item: LotteryWheelItem, index: number]
}>()

const diskRef = ref<HTMLElement | null>(null)
const spinning = ref(false)
const currentRotation = ref(0)

const segmentAngle = computed(() => (props.items.length > 0 ? 360 / props.items.length : 0))

const wheelStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  '--gfr-lottery-duration': `${props.duration}ms`
}))

const diskStyle = computed(() => ({
  transform: `rotate(${currentRotation.value}deg)`
}))

const diskBgStyle = computed(() => {
  const n = props.items.length
  if (n < 2) return {}
  const angle = 360 / n
  const stops: string[] = []
  for (let i = 0; i < n; i++) {
    const start = i * angle
    const end = (i + 1) * angle
    const color = i % 2 === 0 ? 'var(--gfr-lottery-color-a)' : 'var(--gfr-lottery-color-b)'
    stops.push(`${color} ${start}deg ${end}deg`)
  }
  return {
    background: `conic-gradient(from 0deg, ${stops.join(', ')})`
  }
})

function getItemKey(item: LotteryWheelItem, index: number) {
  return item.id != null ? String(item.id) : `item-${index}`
}

function getItemStyle(index: number) {
  const angle = segmentAngle.value
  const rotate = index * angle + angle / 2
  return {
    '--gfr-lottery-item-rotate': `${rotate}deg`,
    '--gfr-lottery-item-rotate-inverse': `${-rotate}deg`
  }
}

/**
 * 开始抽奖，旋转到指定索引后停止
 * @param resultIndex 中奖项索引（0-based）
 */
function start(resultIndex: number) {
  if (props.items.length === 0) {
    return
  }
  const index = Math.max(0, Math.min(resultIndex, props.items.length - 1))
  spinning.value = true
  emit('start')

  const angle = segmentAngle.value
  // 在当前角度上累加：多转 extraRounds 圈 + 停到目标扇区，支持多次连续抽奖
  const deltaAngle = 360 * props.extraRounds + index * angle + angle / 2
  currentRotation.value += deltaAngle

  const timer = setTimeout(() => {
    spinning.value = false
    const item = props.items[index]
    if (item) {
      emit('end', item, index)
    }
    clearTimeout(timer)
  }, props.duration)
}

watch(
  () => props.items,
  () => {
    currentRotation.value = 0
  },
  { deep: true }
)

defineExpose({
  start,
  spinning
})
</script>

<style lang="scss" scoped>
.gfr-lottery-wheel {
  --gfr-lottery-color-a: rgba(255, 255, 255, 0.95);
  --gfr-lottery-color-b: rgba(255, 114, 91, 0.25);
  position: relative;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  touch-action: none;
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.08);

  &--disabled {
    pointer-events: none;
    opacity: 0.8;
  }

  &__pointer {
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 28px solid var(--primary);
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.25));
  }

  &__disk {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transition: transform var(--gfr-lottery-duration) cubic-bezier(0.17, 0.67, 0.12, 0.99);
    position: relative;
  }

  &__disk-bg {
    position: absolute;
    inset: 0;
    border-radius: 50%;
  }

  &__item {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 50%;
    height: 50%;
    transform-origin: 0% 0%;
    transform: rotate(var(--gfr-lottery-item-rotate)) translateY(-40%);
    pointer-events: none;

    &-inner {
      transform: rotate(var(--gfr-lottery-item-rotate-inverse));
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80%;
      margin-left: 10%;
      text-align: center;
    }
  }

  &__item-label {
    font-size: 22px;
    font-weight: var(--font-medium);
    color: var(--dark);
    word-break: break-all;
    line-height: 1.2;
  }
}
</style>
