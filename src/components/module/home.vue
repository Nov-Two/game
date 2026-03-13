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
          <AppProgress :currentValue="currentValue" />
        </div>
      </GfrContainer>

      <!-- 块3：分享栏 -->
      <GfrContainer class="app-home-main__bottom">
        <img src="/static/images/share@2x.png" alt="" />
        <p class="app-home-main__bottom-text">You have played 30 matches with friends</p>
      </GfrContainer>
    </GfrContainer>

    <!-- 右侧推广栏：Banner 轮播 + 底部指示条 -->
    <GfrContainer class="app-home-side">
      <AppSideBanner />
    </GfrContainer>
  </GfrContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '@/stores'
import GfrContainer from '@/components/ui/container.vue'
import AppProgress from '@/components/module/progress.vue'
import AppSideBanner from '@/components/module/side-banner.vue'

const store = useStore()
const { fixTransify } = store

defineOptions({
  name: 'AppHomeModule'
})

const currentValue = ref(12000)
const currentValueFormatted = computed(() =>
  currentValue.value >= 1e6 ? `${(currentValue.value / 1e6).toFixed(0)}M` : currentValue.value.toLocaleString('en-US')
)
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
.app-home-main__middle {
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
  width: 100%;
  flex-shrink: 0;
  img {
    width: 103%;
    height: 160px;
    position: absolute;
    top: -160px;
    left: -18px;
    object-fit: cover;
    object-position: center;
    z-index: 1;
  }

  .app-home-main__bottom-text {
    position: absolute;
    left: 16%;
    top: -50px;
    font-size: 26px;
    font-weight: var(--font-medium);
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    z-index: 2;
    color: rgb(46, 48, 54);
  }
}

.app-home-side {
  position: relative;
  width: 329px;
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
