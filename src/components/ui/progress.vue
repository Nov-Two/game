<template>
  <div class="gfr-progress">
    <div class="gfr-progress__top">
      <div class="gfr-progress__track">
        <div class="gfr-progress__fill" :style="{ width: progressPercentage + '%' }">
          <div class="gfr-progress__shine" aria-hidden="true" />
        </div>
        <div class="gfr-progress__markers">
          <div v-for="(item, index) in list" :key="index" class="gfr-progress__marker" :style="markerStyle(index)" />
        </div>
      </div>

      <div class="gfr-progress__labels">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="gfr-progress__label"
          :style="{ left: getMarkerPosition(index) + '%' }"
        >
          <span class="gfr-progress__label-value">{{ formatNumber(item.value) }}</span>
        </div>
      </div>
    </div>

    <div class="gfr-progress__rewards" :style="{ gridTemplateColumns: `repeat(${list.length}, 1fr)` }">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="gfr-progress__reward"
        :class="{ 'gfr-progress__reward--highlight': index === highlightClaimableIndex }"
      >
        <div class="gfr-progress__reward-thumb">
          <div class="gfr-progress__reward-img" :style="{ backgroundImage: rewardImgStyle(index) }">
            <img
              :src="item.imageUrl || `${baseUrl}static/images/prize@2x.png`"
              :alt="item.name ?? ''"
              class="gfr-progress__reward-img-inner"
            />
          </div>
          <div
            v-if="hasRewardQuantity(index)"
            class="gfr-progress__reward-qty"
            :class="{ 'gfr-progress__reward-qty--claimed': getStatus(index) === 'claimed' }"
          >
            {{ rewardQtyText(index) }}
          </div>
        </div>
        <div
          v-if="isButtonVisible(index)"
          class="gfr-progress__reward-btn"
          :class="{ 'gfr-progress__reward-btn--claimed': getStatus(index) === 'claimed' }"
          :style="rewardBtnStyle(index)"
          role="button"
          tabindex="0"
          @click="onClaim(index)"
        >
          <span class="gfr-progress__reward-btn-text" :style="{ color: buttonTextColor(index) }">
            {{ buttonText(index) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import { type MilestoneItem, useMilestoneProgress } from '@/composables/useMilestoneProgress'
import { useStore } from '@/stores'
import Toast from '@/components/ui/toast'

defineOptions({
  name: 'GfrProgress'
})

const store = useStore()
const { fixTransify } = store

/** 按钮展示覆盖（按索引），由父组件传入以走 transify 等 */
export interface RewardButtonOverride {
  text?: string
  color?: string
  visible?: boolean
}

const props = withDefaults(
  defineProps<{
    currentValue: number
    milestones?: MilestoneItem[]
    showAwardButtons?: boolean
    rewardButtonOverrides?: RewardButtonOverride[]
  }>(),
  {
    milestones: () => [],
    showAwardButtons: true,
    rewardButtonOverrides: undefined
  }
)

const emit = defineEmits<{
  claim: [index: number]
}>()

const baseUrl = import.meta.env.BASE_URL
const { list, getMarkerPosition, getStatus, highlightClaimableIndex, progressPercentage, formatNumber } =
  useMilestoneProgress(toRef(props, 'currentValue'), toRef(props, 'milestones'))

const markerCompletedUrl = `${baseUrl}static/images/completed@2x.png`
const markerNotCompletedUrl = `${baseUrl}static/images/not_completed@2x.png`
const rewardImgUrls: Record<string, string> = {
  unclaimed: `${baseUrl}static/images/weilingqu@2x.png`,
  claimable: `${baseUrl}static/images/zhenglingqu@2x.png`,
  claimed: `${baseUrl}static/images/yilingqu@2x.png`
}
const rewardBtnUrls: Record<string, string> = {
  unclaimed: `${baseUrl}static/images/weilingqu_btn@2x.png`,
  claimable: `${baseUrl}static/images/zhenglingqu_btn@2x.png`
}
const buttonTextKeys: Record<string, string> = {
  unclaimed: 'MILESTONE_BTN_UNCLAIMED',
  claimable: 'MILESTONE_BTN_CLAIMABLE',
  claimed: 'MILESTONE_BTN_CLAIMED'
}
const defaultButtonColor: Record<string, string> = {
  unclaimed: 'rgb(255, 255, 255)',
  claimable: 'rgb(46, 47, 50)',
  claimed: 'rgb(49, 90, 181)'
}

function markerStyle(index: number) {
  const left = getMarkerPosition(index) + '%'
  const status = getStatus(index)
  const isCompleted = status !== 'unclaimed'
  const bg = isCompleted ? markerCompletedUrl : markerNotCompletedUrl
  return {
    left,
    backgroundImage: `url(${bg})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }
}

function rewardImgStyle(index: number): string {
  return `url(${rewardImgUrls[getStatus(index)]})`
}

/** 当前节点奖品是否有数量（根据奖品对象判断，用于是否展示数量角标） */
function hasRewardQuantity(index: number): boolean {
  const item = list.value[index]
  if (!item) return false
  const q = item.quantity
  return typeof q === 'number' && !Number.isNaN(q) && q > 0
}

/** 奖品数量展示文案：x + 数量，如 x10 */
function rewardQtyText(index: number): string {
  const q = list.value[index]?.quantity
  return typeof q === 'number' && !Number.isNaN(q) && q > 0 ? `x${q}` : ''
}

function rewardBtnStyle(index: number) {
  const status = getStatus(index)
  if (status === 'claimed') return {}
  const url = rewardBtnUrls[status]
  return {
    backgroundImage: `url(${url})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }
}

function isButtonVisible(index: number): boolean {
  if (!props.showAwardButtons) return false
  const o = props.rewardButtonOverrides?.[index]
  if (o && typeof o.visible === 'boolean') return o.visible
  return true
}

/** 按钮文案：优先用外部 override（走 transify），否则用当前状态的 transify key */
function buttonText(index: number): string {
  const o = props.rewardButtonOverrides?.[index]
  if (o?.text != null && String(o.text) !== '') return fixTransify(String(o.text))
  const key = buttonTextKeys[getStatus(index)] ?? 'MILESTONE_BTN_UNCLAIMED'
  return fixTransify(key)
}

function buttonTextColor(index: number): string {
  const o = props.rewardButtonOverrides?.[index]
  if (o?.color != null && String(o.color) !== '') return String(o.color)
  return defaultButtonColor[getStatus(index)] ?? 'rgb(255, 255, 255)'
}

function onClaim(index: number) {
  if (getStatus(index) !== 'claimable') {
    Toast({
      message: fixTransify('TOAST_TASK_NOT_COMPLETE')
      // backgroundImage: `${baseUrl}static/images/toast@2x.png`,
      // duration: 200000
    })
    return
  }
  emit('claim', index)
}
</script>

<style scoped lang="scss">
.gfr-progress {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 0;
  flex: 1;
}

.gfr-progress__top {
  position: relative;
  margin-top: 26px;
  height: 66px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gfr-progress__track {
  width: 100%;
  position: relative;
  height: 16px;
  background-color: rgb(38, 33, 78);
  border-radius: 20px;
  border-bottom: 0.5px solid rgb(0, 221, 255);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.33),
    inset 0 3px 7px rgba(0, 0, 0, 0.2);
}

.gfr-progress__fill {
  height: 100%;
  border-radius: 12px;
  background-color: rgb(235, 255, 0);
  position: relative;
  overflow: hidden;
}

.gfr-progress__shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transform: translateX(-100%);
  animation: gfr-progress-shine 2s infinite;
}

@keyframes gfr-progress-shine {
  100% {
    transform: translateX(100%);
  }
}

.gfr-progress__markers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.gfr-progress__marker {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.gfr-progress__labels {
  position: relative;
  width: 100%;
}

.gfr-progress__label {
  position: absolute;
  transform: translateX(-50%);
  text-align: center;
  white-space: nowrap;
  padding: 10px 0;
}

.gfr-progress__label-value {
  font-size: 30px;
  font-weight: 700;
  font-weight: var(--font-extra-bold);
  color: rgb(220, 255, 0);
  padding-top: 14px;
}

.gfr-progress__rewards {
  flex: 1;
  min-height: 0;
  width: 100%;
  display: grid;
  gap: 20px;
  align-items: stretch;
}

.gfr-progress__reward {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-top: 10px;
}

.gfr-progress__reward--highlight {
  /* 可领取高亮，可由父组件或主题覆盖 */
  outline: none;
}

.gfr-progress__reward-thumb {
  height: 290px;
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.gfr-progress__reward-img {
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

.gfr-progress__reward-img-inner {
  max-width: 80%;
  max-height: 50%;
  object-fit: contain;
}

.gfr-progress__reward-qty {
  position: absolute;
  right: 10%;
  bottom: 13%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: var(--font-extra-bold);
  font-style: italic;
  color: #000;
  &--claimed {
    color: #fff;
  }
}

.gfr-progress__reward-btn {
  width: 100%;
  height: 72px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  font-weight: var(--font-extra-bold);

  .gfr-progress__reward-btn-text {
    line-height: 50px;
    font-size: 26px;
  }
}

.gfr-progress__reward-btn--claimed {
  background-image: none;
}

.gfr-progress__reward--highlight .gfr-progress__reward-btn:not(.gfr-progress__reward-btn--claimed) {
  color: rgb(255, 235, 0);
}
</style>
