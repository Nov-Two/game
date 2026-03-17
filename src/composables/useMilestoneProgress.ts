import { type Ref, computed, type ComputedRef } from 'vue'

/** 里程碑节点：匹配场次数、是否已领取，可选奖品展示（后台配置） */
export interface MilestoneItem {
  value: number
  isLingQu?: boolean
  imageUrl?: string
  name?: string
  /** 奖品数量，有值且 > 0 时在进度条上展示数量角标 */
  quantity?: number
}

/** 三态：未领取 / 可领取 / 已领取 */
export type MilestoneStatus = 'unclaimed' | 'claimable' | 'claimed'

/**
 * 进度条与里程碑展示的公共逻辑：进度百分比、节点位置、奖励状态、高亮索引
 * 由 UI 组件 progress.vue 使用，通过父子传值控制展示
 */
export function useMilestoneProgress(
  currentValue: Ref<number>,
  milestones: Ref<MilestoneItem[]>
) {
  const list = computed(() => milestones.value ?? [])

  const maxValue: ComputedRef<number> = computed(() => {
    if (!list.value.length) return 100
    return list.value[list.value.length - 1]!.value
  })

  /** 节点位置百分比：每格中心 (index + 0.5) / n * 100 */
  function getMarkerPosition(index: number): number {
    const n = list.value.length
    if (n <= 0) return 50
    if (n === 1) return 50
    return ((index + 0.5) / n) * 100
  }

  /** 当前进度对应的奖励状态 */
  function getStatus(index: number): MilestoneStatus {
    const item = list.value[index]
    if (!item) return 'unclaimed'
    const isReached = currentValue.value >= item.value
    const isClaimed = Boolean(isReached && item.isLingQu)
    return isClaimed ? 'claimed' : isReached ? 'claimable' : 'unclaimed'
  }

  /** 第一个可领取（未领）的索引，用于高亮 */
  const highlightClaimableIndex: ComputedRef<number> = computed(() => {
    for (let i = 0; i < list.value.length; i++) {
      const item = list.value[i]
      if (!item) continue
      if (currentValue.value >= item.value && !item.isLingQu) return i
    }
    return -1
  })

  /** 进度条填充宽度百分比（与节点位置插值一致） */
  const progressPercentage: ComputedRef<number> = computed(() => {
    const value = Math.max(0, currentValue.value)
    const n = list.value.length
    if (n === 0) return 0
    const lastVal = maxValue.value
    if (value >= lastVal) return 100
    const firstVal = list.value[0]!.value
    if (value < firstVal) {
      const t = firstVal <= 0 ? 1 : value / firstVal
      return t * getMarkerPosition(0)
    }
    for (let i = 0; i < n - 1; i++) {
      const low = list.value[i]!.value
      const high = list.value[i + 1]!.value
      if (value >= low && value < high) {
        const t = (value - low) / (high - low)
        return getMarkerPosition(i) + t * (getMarkerPosition(i + 1) - getMarkerPosition(i))
      }
    }
    return getMarkerPosition(n - 1)
  })

  function formatNumber(num: number): string {
    return num.toLocaleString('zh-CN')
  }

  return {
    list,
    maxValue,
    getMarkerPosition,
    getStatus,
    highlightClaimableIndex,
    progressPercentage,
    formatNumber
  }
}
