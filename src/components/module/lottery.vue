<template>
  <div class="gfr-lottery">
    <GfrLotteryWheel
      ref="wheelRef"
      :items="items"
      :size="size"
      :duration="duration"
      :extra-rounds="extraRounds"
      :disabled="disabled"
      @start="handleWheelStart"
      @end="handleWheelEnd"
    >
      <template v-if="$slots.item" #item="slotProps">
        <slot name="item" v-bind="slotProps" />
      </template>
    </GfrLotteryWheel>
    <div v-if="$slots.trigger || showDefaultTrigger" class="gfr-lottery__trigger" @click="handleDrawClick">
      <slot name="trigger">
        <GfrButton v-if="showDefaultTrigger" :disabled="disabled || spinning" class="gfr-lottery__btn" anime="bounce">
          {{ drawButtonText }}
        </GfrButton>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GfrLotteryWheel from '@/components/ui/lottery-wheel.vue'
import type { LotteryWheelItem } from '@/components/ui/lottery-wheel.vue'
import GfrButton from '@/components/ui/button.vue'

defineOptions({
  name: 'GfrLottery'
})

interface Props {
  /** 奖项列表 */
  items: LotteryWheelItem[]
  /** 转盘尺寸（px） */
  size?: number
  /** 旋转时长（ms） */
  duration?: number
  /** 多转圈数 */
  extraRounds?: number
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示默认抽奖按钮 */
  showDefaultTrigger?: boolean
  /** 抽奖按钮文案 */
  drawButtonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 200,
  duration: 4000,
  extraRounds: 5,
  disabled: false,
  showDefaultTrigger: true,
  drawButtonText: '抽奖'
})

const emit = defineEmits<{
  /** 用户点击抽奖时触发，父组件请求接口后调用 start(resultIndex) */
  draw: []
  start: []
  end: [item: LotteryWheelItem, index: number]
}>()

const wheelRef = ref<InstanceType<typeof GfrLotteryWheel> | null>(null)
const spinning = ref(false)

function handleDrawClick() {
  if (props.disabled || spinning.value) return
  emit('draw')
}

function handleWheelEnd(item: LotteryWheelItem, index: number) {
  spinning.value = false
  emit('end', item, index)
}

function handleWheelStart() {
  spinning.value = true
  emit('start')
}

/**
 * 开始旋转到指定奖项（由父组件在拿到接口结果后调用）
 * @param resultIndex 中奖索引（0-based）
 */
function start(resultIndex: number) {
  wheelRef.value?.start(resultIndex)
}

defineExpose({
  start,
  spinning
})
</script>

<style lang="scss" scoped>
.gfr-lottery {
  padding: 24px 0;

  &__trigger {
    display: flex;
    justify-content: center;
    margin-top: 24px;
  }

  &__btn {
    min-width: 200px;
    padding: 16px 32px;
    font-size: 28px;
    font-weight: var(--font-bold);
    color: var(--light);
    background: var(--primary);
    border-radius: 48px;
    box-shadow: 0 4px 12px rgba(255, 114, 91, 0.4);
  }
}
</style>
