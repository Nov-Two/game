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
          <GfrProgress :current-value="currentValue" :milestones="milestones" @claim="handleClaim" />
        </div>
      </GfrContainer>

      <!-- 块3：分享栏 -->
      <GfrContainer class="app-home-main__bottom" role="button" tabindex="0">
        <img src="/static/images/share@2x.png" alt="" @click="handleOpenShare" />
        <p class="app-home-main__bottom-text">
          <span class="app-home-main__bottom-text__muted">{{ fixTransify('SHARE_HAVE_PLAYED') }}</span>
          <span class="app-home-main__bottom-text__num">{{ matchesPlayed }}</span>
          <span class="app-home-main__bottom-text__highlight">{{ fixTransify('SHARE_MATCHES') }}</span>
          <span class="app-home-main__bottom-text__muted">{{ fixTransify('SHARE_WITH_FRIENDS') }}</span>
        </p>
      </GfrContainer>
    </GfrContainer>

    <!-- 右侧推广栏：Banner 轮播 + 底部指示条 -->
    <GfrContainer class="app-home-side">
      <AppSideBanner :slides="sideBannerSlides" :autoplay-interval="4000" />
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
import GfrProgress from '@/components/ui/progress.vue'
import AppSideBanner from '@/components/ui/side-banner.vue'
import AppClaimDialog from '@/components/app/claim-dialog.vue'
import AppCongratsDialog from '@/components/app/congrats-dialog.vue'
import type { MilestoneItem } from '@/composables/useMilestoneProgress'

const store = useStore()
const { fixTransify } = store
const emit = defineEmits<{
  'open-share': []
}>()

defineOptions({
  name: 'AppHomeModule'
})

const currentValue = ref(9000)
const milestones = ref<Array<MilestoneItem & { name: string }>>([
  { value: 2000, isLingQu: true, quantity: 10, imageUrl: '/static/images/prize@2x.png', name: 'Reward 1' },
  { value: 3000, isLingQu: false, quantity: 10, imageUrl: '/static/images/prize2@2x.png', name: 'Reward 2' },
  { value: 6000, isLingQu: false, quantity: 10, imageUrl: '/static/images/prize3@2x.png', name: 'Reward 3' },
  { value: 10_000, isLingQu: false, quantity: 10, imageUrl: '/static/images/prize2@2x.png', name: 'Reward 4' }
])

const showClaimDialog = ref(false)
const showCongratsDialog = ref(false)

/** 普通领取弹框展示的奖励（非最后一档时使用） */
const claimDialogReward = ref<{ name: string; img: string; qty: number }>({
  name: 'Reward',
  img: '/static/images/prize@2x.png',
  qty: 10
})

const currentValueFormatted = computed(() =>
  currentValue.value >= 1e6 ? `${(currentValue.value / 1e6).toFixed(0)}M` : currentValue.value.toLocaleString('en-US')
)

/** 对战场次：来自用户信息接口 player.matches_played */
const matchesPlayed = computed(() => {
  const p = store.state.player as Record<string, unknown> | undefined
  const m = p?.['matches_played']
  return typeof m === 'number' && Number.isFinite(m) ? m : 0
})

/** 右侧轮播图数据，由父组件控制；图片使用 /images/banner-img@2x.png */
const sideBannerSlides = ref<Array<{ bgImage: string; title?: string; subtitle?: string }>>([
  { bgImage: 'url(/static/images/banner-img@2x.png)' },
  { bgImage: 'url(/static/images/banner-img@2x.png)' }
])

const congratsSubtitle = computed(() => {
  const name = 'nickname'
  const t = fixTransify('have played 198 matches with friends! Ranked in region')
  return `${name} ${t}`
})

const centerReward = ref<{ name: string; img: string; qty: number }>({
  name: '',
  img: '',
  qty: 0
})

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
    centerReward.value = {
      name: item.name ?? 'Reward',
      img: item.imageUrl ?? '',
      qty: item.quantity ?? 10
    }
    showCongratsDialog.value = true
  } else {
    claimDialogReward.value = {
      name: item.name ?? 'Reward',
      img: item.imageUrl ?? '',
      qty: item.quantity ?? 10
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
  min-height: 104px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 100%;
}

.app-home-main__motto {
  padding-left: 58px;
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
  min-height: 56px;
  padding-top: 8px;
  box-sizing: border-box;
}

.app-home-progress::before {
  content: '';
  position: absolute;
  top: -20px;
  left: 0;
  width: 105%;
  height: 150%;
  background-image: url('/static/images/current@2x.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  pointer-events: none;
  z-index: 0;
}

.app-home-progress__label {
  position: relative;
  z-index: 2;
  font-size: 28px;
  font-weight: var(--font-extra-bold);
  color: #fff;
  padding-left: 58px;
  line-height: 1.2;
}

.app-home-progress__value {
  position: relative;
  z-index: 2;
  font-size: 38px;
  font-weight: var(--font-extra-bold);
  color: rgb(255, 235, 0);
  text-shadow: 0 0 12px rgba(255, 235, 0, 0.4);
  line-height: 1.2;
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
    z-index: 2;
    color: rgb(46, 48, 54);

    &__muted {
      color: rgb(46, 48, 54);
    }

    &__num,
    &__highlight {
      color: rgb(255, 49, 49);
      font-weight: var(--font-extra-bold);
    }
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
