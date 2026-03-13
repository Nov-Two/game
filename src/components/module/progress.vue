<template>
  <div class="progress-container">
    <!-- 进度条轨道 -->
    <div class="progress-track">
      <!-- 进度填充 -->
      <div class="progress-fill" :style="{ width: progressPercentage + '%' }">
        <div class="shine-effect"></div>
      </div>

      <!-- 里程碑标记点：首尾靠近两端，中间节点在中间区域平分 -->
      <div class="markers-layer">
        <div
          v-for="(item, index) in milestones"
          :key="index"
          class="marker"
          :style="getMarkerStyle(index, currentValue >= item.value)"
        ></div>
      </div>
    </div>

    <!-- 底部标签 -->
    <div class="labels-layer">
      <div
        v-for="(item, index) in milestones"
        :key="index"
        class="label-item"
        :style="{ left: getMarkerPosition(index) + '%' }"
      >
        <div class="label-value">{{ formatNumber(item.value) }}</div>
      </div>
    </div>
  </div>

  <div class="award-container" :style="{ gridTemplateColumns: `repeat(${milestones.length}, 1fr)` }">
    <div
      v-for="(item, index) in milestones"
      :key="index"
      class="award-card"
      :class="{ 'award-card--highlight': index === highlightClaimableIndex }"
    >
      <div class="award-card__thumb">
        <div class="award-card__img" :style="{ backgroundImage: getRewardImgStyle(index) }">
          <img src="/static/images/prize@2x.png" alt="" style="width: 50%; height: 50%; object-fit: cover" />
        </div>
        <div class="award-card__qty"></div>
      </div>
      <div class="award-card__btn" :class="getRewardBtnClass(index)" :style="getRewardBtnStyle(index)">
        <p class="award-card__btn-text" :style="{ color: getRewardBtnTextColor(index) }">
          {{ getRewardBtnText(index) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const baseUrl = import.meta.env.BASE_URL
const markerCompletedUrl = `${baseUrl}static/images/completed@2x.png`
const markerNotCompletedUrl = `${baseUrl}static/images/not_completed@2x.png`

// 奖励图三态：未领取 weilingqu、可领取 zhenglingqu、已领取 yilingqu
const rewardImgUrls = {
  unclaimed: `${baseUrl}static/images/weilingqu@2x.png`,
  claimable: `${baseUrl}static/images/zhenglingqu@2x.png`,
  claimed: `${baseUrl}static/images/yilingqu@2x.png`
}

// 按钮两态背景图：未领取、正领取；已领取无背景图
const rewardBtnUrls = {
  unclaimed: `${baseUrl}static/images/weilingqu_btn@2x.png`,
  claimable: `${baseUrl}static/images/zhenglingqu_btn@2x.png`
}

type RewardStatus = 'unclaimed' | 'claimable' | 'claimed'

/** 与奖励图/按钮一致：根据 currentValue 与 isLingQu 得到三态 */
function getRewardStatus(index: number): RewardStatus {
  const list = props.milestones as Array<{ value: number; isLingQu?: boolean }>
  const item = list?.[index]
  if (!item) return 'unclaimed'
  const isReached = props.currentValue >= item.value
  const isClaimed = Boolean(isReached && item.isLingQu)
  return isClaimed ? 'claimed' : isReached ? 'claimable' : 'unclaimed'
}

/** 奖励图背景 */
function getRewardImgStyle(index: number) {
  const status = getRewardStatus(index)
  return `url(${rewardImgUrls[status]})`
}

/** 按钮样式：未领取/正领取用背景图，已领取无背景图 */
function getRewardBtnStyle(index: number) {
  const status = getRewardStatus(index)
  if (status === 'claimed') return {}
  const url = rewardBtnUrls[status]
  return {
    backgroundImage: `url(${url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }
}

/** 按钮 class：已领取态单独样式 */
function getRewardBtnClass(index: number) {
  const status = getRewardStatus(index)
  return status === 'claimed' ? 'award-card__btn--claimed' : ''
}

/** 按钮文案：未领取 / 正领取(可领取) / 已领取 */
function getRewardBtnText(index: number) {
  const status = getRewardStatus(index)
  if (status === 'unclaimed') return '未领取'
  if (status === 'claimable') return '正领取'
  return '已领取'
}

/** 按钮文字颜色：已领取 / 正领取 / 未领取 */
function getRewardBtnTextColor(index: number): string {
  const status = getRewardStatus(index)
  if (status === 'claimed') return 'rgb(49, 90, 181)'
  if (status === 'claimable') return 'rgb(46, 47, 50)'
  return 'rgb(255, 255, 255)'
}

function getMarkerStyle(index: number, isCompleted: boolean) {
  const left = getMarkerPosition(index) + '%'
  const bgImage = `url(${isCompleted ? markerCompletedUrl : markerNotCompletedUrl})`
  return {
    left,
    backgroundImage: bgImage,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }
}

// 定义 Props
const props = defineProps({
  // 当前数值
  currentValue: {
    type: Number,
    default: 0,
    required: true
  },
  milestones: {
    type: Array,
    default: () => [
      { value: 5000, isLingQu: true },
      { value: 10000, isLingQu: false },
      { value: 15000, isLingQu: false },
      { value: 20000, isLingQu: false }
    ]
  }
})

// 计算最大值 (取配置中的最后一个值，或者手动指定最大值逻辑)
const maxValue = computed(() => {
  if (!props.milestones || props.milestones.length === 0) return 100
  // 假设数组已按从小到大排序，取最后一个为最大刻度
  return props.milestones[props.milestones.length - 1].value
})

/** 与进度条结合：高亮第一个「可领取」的卡片（currentValue >= 节点且 isLingQu 不为 true），若无则 -1 */
const highlightClaimableIndex = computed(() => {
  const list = props.milestones as Array<{ value: number; isLingQu?: boolean }>
  for (let i = 0; i < (list?.length ?? 0); i++) {
    const item = list[i]
    if (!item) continue
    if (props.currentValue >= item.value && !item.isLingQu) return i
  }
  return -1
})

// 进度填充宽度：与标记点使用同一套非线性刻度，避免未到某节点时填充已盖过该节点
const progressPercentage = computed(() => {
  const value = Math.max(0, props.currentValue)
  const list = props.milestones
  const n = list?.length ?? 0
  if (n === 0) return 0
  const lastValue = maxValue.value
  if (value >= lastValue) return 100
  // 在第一个里程碑之前：从 0% 插值到第一个标记位置
  const firstVal = list[0].value
  if (value < firstVal) {
    const t = firstVal <= 0 ? 1 : value / firstVal
    return t * getMarkerPosition(0)
  }
  // 找到当前值所在的区间 [milestones[i], milestones[i+1])
  for (let i = 0; i < n - 1; i++) {
    const low = list[i].value
    const high = list[i + 1].value
    if (value >= low && value < high) {
      const t = (value - low) / (high - low)
      return getMarkerPosition(i) + t * (getMarkerPosition(i + 1) - getMarkerPosition(i))
    }
  }
  return getMarkerPosition(n - 1)
})

// 计算当前所处的阶段（最后一个达到的里程碑）
const currentStage = computed(() => {
  // 倒序查找第一个小于等于当前值的里程碑
  const reached = [...props.milestones].reverse().find((m) => props.currentValue >= m.value)
  return reached || null
})

/** 节点位置与下方奖励卡片垂直对齐：每格中心 (index + 0.5) / n * 100% */
const getMarkerPosition = (index: number) => {
  const n = props.milestones?.length ?? 0
  if (n <= 0) return 50
  if (n === 1) return 50
  return ((index + 0.5) / n) * 100
}

// 辅助函数：格式化数字显示 (加逗号)
const formatNumber = (num) => {
  return num.toLocaleString('zh-CN')
}
</script>

<style scoped lang="scss">
.progress-container {
  position: relative;
  padding-top: 10px;
  height: 66px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 轨道 */
.progress-track {
  width: 100%;
  position: relative;
  height: 14px;
  background-color: rgb(38, 33, 78);
  border-radius: 20px;
  border-bottom: 0.5px solid rgb(0, 221, 255);
  /* box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.6); */
  box-shadow:
    /* 1. 外部投影 (Drop Shadow) - 模拟“颜色减淡+白色”效果 */
    0px 1px 0px rgba(255, 255, 255, 0.33),
    /* 2. 内部阴影 (Inner Shadow) - 正片叠底黑色 */ inset 0px 3px 7px rgba(0, 0, 0, 0.2);
}

/* 填充条 */
.progress-fill {
  height: 100%;
  border-radius: 12px;
  background-color: rgb(235, 255, 0);
  /* background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%); */
  /* transition: width 0.6s cubic-bezier(0.25, 1, 0.5, 1); */
  position: relative;
  overflow: hidden;
  /* box-shadow: 0 0 20px rgba(79, 172, 254, 0.6); */
}

/* 光效动画 */
.shine-effect {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transform: translateX(-100%);
  animation: shine 2s infinite;
}

@keyframes shine {
  100% {
    transform: translateX(100%);
  }
}

/* 标记点层：层级高于进度条，漂浮在上方 */
.markers-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.marker {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
  z-index: 10;
}

/* 标签层 */
.labels-layer {
  position: relative;
  /* height: 50px; */
  width: 100%;
}

.label-item {
  position: absolute;
  transform: translateX(-50%);
  text-align: center;
  white-space: nowrap;
}

.label-value {
  font-size: 30px;
  font-weight: 700;
  color: rgb(220, 255, 0);
  font-weight: var(--font-extra-bold);
  padding-top: 14px;
}

/* ----- 奖励区域：与设计稿一致（卡片背景、高亮绿框、x10、按钮三态） ----- */
.award-container {
  flex: 1;
  min-height: 0;
  width: 100%;
  display: grid;
  gap: 20px;
  align-items: stretch;
  // padding-top: 20px;
}

.award-card {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  // padding: 14px 0;
  border-radius: 16px;
  position: relative;
  // background: linear-gradient(180deg, rgba(38, 33, 78, 0.92) 0%, rgba(28, 24, 58, 0.96) 100%);
  // border: 2px solid rgba(255, 255, 255, 0.1);
}

.award-card--highlight {
  // border-color: rgb(0, 255, 170);
  // box-shadow: 0 0 24px rgba(0, 255, 170, 0.35);
  // background: linear-gradient(180deg, rgba(0, 200, 120, 0.2) 0%, rgba(38, 33, 78, 0.92) 100%);
}

.award-card__thumb {
  height: 320px;
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.award-card__img {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.04);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.award-card__qty {
  position: absolute;
  right: 10%;
  bottom: 18%;
  background-image: url('/static/images/quantity@2x.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 46px;
  height: 21px;
}

.award-card__btn {
  position: absolute;
  bottom: 84px;
  left: 0;
  z-index: 3;
  width: 100%;
  height: 72px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  font-weight: var(--font-extra-bold);
  .award-card__btn-text {
    line-height: 50px;
    font-size: 26px;
  }
}

.award-card__btn--claimed {
  background-image: none;
}

.award-card--highlight .award-card__btn:not(.award-card__btn--claimed) {
  color: rgb(255, 235, 0);
}
</style>
