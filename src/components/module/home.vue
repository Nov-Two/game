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
      </GfrContainer>
    </GfrContainer>

    <!-- 右侧推广栏 -->
    <GfrContainer class="app-home-side">
      <!--  -->
    </GfrContainer>
  </GfrContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '@/stores'
import GfrContainer from '@/components/ui/container.vue'
import AppProgress from '@/components/module/progress.vue'

const store = useStore()
const { fixTransify } = store

defineOptions({
  name: 'AppHomeModule'
})

const currentValue = ref(8000)
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
  font-size: 18px;
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
  font-size: 22px;
  font-weight: var(--font-extra-bold);
  color: #fff;
  padding-left: 58px;
  z-index: 2;
}

.app-home-progress__value {
  font-size: 24px;
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
}

/* ----- 右侧栏 ----- */
.app-home-side {
  width: 350px;
  height: 100%;
  flex-shrink: 0;
  background-color: #ffd54f;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.app-home-side__ribbon {
  background: #ff9800;
  color: #fff;
  font-size: 12px;
  font-weight: var(--font-bold);
  padding: 4px 12px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.app-home-side__title {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: var(--font-extra-bold);
  color: #fff;
  text-transform: uppercase;
  line-height: 1.2;
  .app-home-side__title-accent {
    color: #ffd54f;
  }
}

.app-home-side__desc {
  margin: 0 0 16px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
}

.app-home-side__art {
  width: 100%;
  height: 180px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-bottom: 12px;
}

.app-home-side__dots {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.app-home-side__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  &.app-home-side__dot--active {
    background: #ffd54f;
  }
}
</style>
