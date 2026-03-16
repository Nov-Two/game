<template>
  <GfrContainer class="app-home-container">
    <!-- 主内容区：分 3 块 -->
    <GfrContainer class="app-home-main">
      <!-- 块1：标题 + 进度文案（与设计稿：Motto + Current Region Process 数值高亮） -->
      <GfrContainer class="app-home-main__top">
        <p class="app-home-main__motto">
          {{ fixTransify('Team up with friends and unlock rewards!') }}
        </p>
        <div class="app-home-progress">
          <span class="app-home-progress__label">{{ fixTransify('Current Region Process:') }}</span>
          <span class="app-home-progress__value">{{ currentValueFormatted }}</span>
        </div>
      </GfrContainer>

      <!-- 块2：里程碑 + 奖励卡片 -->
      <GfrContainer class="app-home-main__middle">
        <div class="app-home">
          <AppProgress :current-value="currentValue" :milestones="milestones" @claim="handleClaim" />
        </div>
      </GfrContainer>

      <!-- 块3：分享栏 -->
      <GfrContainer class="app-home-main__bottom" role="button" tabindex="0">
        <img src="/static/images/share@2x.png" alt="" @click="handleOpenShare" />
        <p class="app-home-main__bottom-text">You have played 30 matches with friends</p>
      </GfrContainer>
    </GfrContainer>

    <!-- 右侧推广栏：Banner 轮播 + 底部指示条 -->
    <GfrContainer class="app-home-side">
      <AppSideBanner />
    </GfrContainer>

    <AppClaimDialog
      v-model="showClaimDialog"
      :reward="claimDialogReward"
      confirm-text="CONFIRM"
      @confirm="handleClaimDialogConfirm"
    />
    <AppCongratsDialog
      v-model="showCongratsDialog"
      :subtitle="congratsSubtitle"
      :progress-min="288888"
      :progress-max="18_000_000"
      :progress-value="congratsProgressValue"
      :center-reward="centerReward"
      :side-rewards="sideRewards"
      confirm-text="CONFIRM"
      @confirm="handleCongratsConfirm"
    />
  </GfrContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '@/stores'
import GfrContainer from '@/components/ui/container.vue'
import AppProgress from '@/components/module/progress.vue'
import AppSideBanner from '@/components/module/side-banner.vue'
import AppClaimDialog from '@/components/app/claim-dialog.vue'
import AppCongratsDialog from '@/components/app/congrats-dialog.vue'

const store = useStore()
const { fixTransify } = store
const emit = defineEmits<{
  'open-share': []
}>()

defineOptions({
  name: 'AppHomeModule'
})

const currentValue = ref(12000)
const milestones = ref<Array<{ value: number; isLingQu?: boolean }>>([
  { value: 2000, isLingQu: true },
  { value: 3000, isLingQu: true },
  { value: 6000, isLingQu: false },
  { value: 10_000, isLingQu: false }
])

const showClaimDialog = ref(false)
const showCongratsDialog = ref(false)

/** 普通领取弹框展示的奖励（非最后一档时使用） */
const claimDialogReward = ref<{ name: string; img: string; qty: number }>({
  name: 'Reward',
  img: '/static/images/prize@2x.png',
  qty: 10
})

/** 各档位对应奖励展示（非最后一档）；与 milestones 索引一致，最后一档走大奖弹框 */
const rewardDisplayList = [
  { name: 'Reward 1', img: '/static/images/prize@2x.png', qty: 10 },
  { name: 'Reward 2', img: '/static/images/prize@2x.png', qty: 10 },
  { name: 'PW_PP19_Rainforest', img: '/static/images/prize@2x.png', qty: 10 }
]

const currentValueFormatted = computed(() =>
  currentValue.value >= 1e6 ? `${(currentValue.value / 1e6).toFixed(0)}M` : currentValue.value.toLocaleString('en-US')
)

const congratsSubtitle = computed(() => {
  const name = 'nickname'
  const t = fixTransify('have played 198 matches with friends! Ranked in region')
  return `${name} ${t}`
})

const centerReward = computed(() => ({
  name: 'PW_PP19_Rainforest',
  img: '/static/images/prize@2x.png',
  qty: 10,
  bgStyle: {}
}))

const sideRewards = computed(() => [
  { name: 'Emblem', img: '/static/images/prize@2x.png', bgStyle: {} },
  { name: 'Buggy', img: '/static/images/prize@2x.png', bgStyle: {} }
])

/** 弹窗内进度条当前值：打开时为最后一档，显示满进度 */
const congratsProgressValue = computed(() => {
  const list = milestones.value
  if (!list.length) return 18_000_000
  return list[list.length - 1]?.value ?? 18_000_000
})

function handleOpenShare() {
  emit('open-share')
}

function handleClaim(index: number) {
  const list = milestones.value
  const item = list[index]
  if (!item) return
  const isLast = index === list.length - 1
  if (isLast) {
    showCongratsDialog.value = true
  } else {
    const rewardConfig = rewardDisplayList[index] ?? rewardDisplayList[0] ?? {
      name: 'Reward',
      img: '/static/images/prize@2x.png',
      qty: 10
    }
    claimDialogReward.value = {
      name: rewardConfig.name,
      img: rewardConfig.img,
      qty: rewardConfig.qty ?? 10
    }
    showClaimDialog.value = true
  }
  item.isLingQu = true
}

function handleClaimDialogConfirm() {
  showClaimDialog.value = false
}

function handleCongratsConfirm() {
  showCongratsDialog.value = false
}
</script>

<style lang="scss" scoped>
.app-home-container {
  display: flex;
  gap: 22px;
  width: 100%;
  padding-bottom: 19px;
  padding-top: 20px;
  min-height: 0;
  flex: 1;
}

.app-home-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  min-height: 0;
  height: 100%;
}

.app-home-main__top {
  height: 104px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 100%;
  // padding: 0 0 16px;
}

.app-home-main__motto {
  padding-left: 58px;
  // margin: 0 0 12px;
  font-size: 26px;
  font-weight: var(--font-medium);
  color: #fff;
  line-height: 1.3;
}

.app-home-progress {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 52px;
}

.app-home-progress::before {
  content: '';
  position: absolute;
  top: -24px;
  left: 0;
  width: 105%;
  height: 160%;
  background-image: url('/static/images/current@1x.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  pointer-events: none;
}

.app-home-progress__label {
  font-size: 28px;
  font-weight: var(--font-extra-bold);
  color: #fff;
  padding-left: 58px;
  z-index: 2;
}

.app-home-progress__value {
  font-size: 38px;
  font-weight: var(--font-extra-bold);
  color: rgb(255, 235, 0);
  text-shadow: 0 0 12px rgba(255, 235, 0, 0.4);
  z-index: 2;
}

/* ----- 块2：里程碑 + 奖励卡片（与设计稿留白、间距一致） ----- */
/* 提高层级，避免被块3的分享图（负 top 重叠区）盖住，保证可点击 */
.app-home-main__middle {
  position: relative;
  z-index: 2;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  .app-home {
    height: 100%;
    min-height: 260px;
    display: flex;
    flex-direction: column;
  }
}

/* ----- 块3：分享栏 ----- */
.app-home-main__bottom {
  position: relative;
  height: 60px;
  z-index: 1;
  width: 100%;
  flex-shrink: 0;
  cursor: pointer;
  img {
    width: 103%;
    height: 160px;
    position: absolute;
    top: -96px;
    left: -18px;
    object-fit: cover;
    object-position: center;
    z-index: 1;
  }

  .app-home-main__bottom-text {
    position: absolute;
    left: 16%;
    top: 8px;
    font-size: 26px;
    font-weight: var(--font-medium);
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    z-index: 2;
    color: rgb(46, 48, 54);
  }
}

.app-home-side {
  position: relative;
  width: 372px;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
  border: 4px solid rgb(161, 207, 250);
}
</style>
