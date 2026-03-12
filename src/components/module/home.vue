<template>
  <GfrContainer class="app-home-container">
    <!-- 主内容区：分 3 块 -->
    <GfrContainer class="app-home-main">
      <!-- 块1：标题 + 进度文案 -->
      <GfrContainer class="app-home-main__top">
        <p class="app-home-main__top-tip">
          {{ fixTransify('Team up with friends and unlock rewards!') }}
        </p>
        <GfrContainer class="app-home-progress">
          <!-- <GfrHeading class="app-home-progress__text">
            {{ fixTransify('Current Region Process:') }} <strong class="app-home-progress__value">89M</strong>
          </GfrHeading> -->
        </GfrContainer>
      </GfrContainer>

      <!-- 块2：里程碑 + 奖励卡片 -->
      <GfrContainer class="app-home-main__middle">
        <div class="app-home-progress__bar-wrap">
          <!-- <div class="app-home-progress__bar" :style="progressBarStyle" /> -->
        </div>
        <div class="app-home-milestones">
          <!-- <span
            v-for="(m, i) in milestones"
            :key="i"
            class="app-home-milestones__item"
            :class="{ 'app-home-milestones__item--reached': m.reached }"
          >
            <span class="app-home-milestones__diamond" />
            {{ m.label }}
          </span> -->
        </div>
        <GfrContainer class="app-home-rewards">
          <!-- <div
            v-for="(r, i) in rewardItems"
            :key="i"
            class="app-home-reward-card"
            :class="[`app-home-reward-card--border-${r.borderType}`, `app-home-reward-card--btn-${r.buttonType}`]"
          >
            <div class="app-home-reward-card__frame">
              <div class="app-home-reward-card__icon" />
              <span class="app-home-reward-card__qty">{{ r.qty }}</span>
            </div>
            <GfrButton type="button" class="app-home-reward-card__btn" :disabled="r.claimed">
              {{ r.claimed ? 'CLAIMED' : 'CLAIM' }}
            </GfrButton>
          </div> -->
        </GfrContainer>
      </GfrContainer>

      <!-- 块3：分享栏 -->
      <GfrContainer class="app-home-main__bottom">
        <!-- <img
          class="app-home-main__bottom-bg"
          src="/static/images/share@1x.png"
          srcset="/static/images/share@1x.png 1x, /static/images/share@2x.png 2x, /static/images/share@3x.png 3x"
          alt=""
          aria-hidden="true"
        /> -->
      </GfrContainer>
    </GfrContainer>

    <!-- 右侧推广栏 -->
    <GfrContainer class="app-home-side">
      <!--  -->
    </GfrContainer>
  </GfrContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/stores'
import GfrContainer from '@/components/ui/container.vue'
import GfrHeading from '@/components/ui/heading.vue'
import GfrButton from '@/components/ui/button.vue'

const store = useStore()
const { fixTransify } = store

defineOptions({
  name: 'AppHomeModule'
})

// 进度条百分比（后续可从 store/API 取）
const progressPercent = 65
const progressBarStyle = computed(() => ({
  width: `${progressPercent}%`
}))

const milestones = [
  { label: '200,000', reached: true },
  { label: '300,000', reached: true },
  { label: '600,000', reached: true },
  { label: '10m', reached: false }
]

const rewardItems = [
  { qty: 'x10', claimed: true, borderType: 'weilingqu', buttonType: 'weilingqu_btn' },
  { qty: 'x10', claimed: true, borderType: 'zhenglingqu', buttonType: 'zhenglingqu_btn' },
  { qty: 'x10', claimed: true, borderType: 'yilingqu', buttonType: 'claimed_btn' },
  { qty: 'x10', claimed: true, borderType: 'yilingqu', buttonType: 'claimed_btn' }
]
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

/* ----- 块1：标题 + 进度文案 ----- */
.app-home-main__top {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 100%;
  height: 100px;
  background-color: red;

  .app-home-main__top-tip {
    flex: 0 0 33.333%;
    display: flex;
    margin: 0;
    font-size: 18px;
    font-weight: var(--font-bold);
    color: #fff;
    line-height: 1.3;
  }

  .app-home-progress {
    flex: 0 0 66.667%;
    width: 100%;
    min-height: 0;
    display: flex;
    // align-items: center;
    // justify-content: center;
    // padding: 0 20px;
    // box-sizing: border-box;
    background-image: url('/static/images/current@1x.png');
    background-image: image-set(
      url('/static/images/current@1x.png') 1x,
      url('/static/images/current@2x.png') 2x,
      url('/static/images/current@3x.png') 3x
    );
    background-size: 100% 100%;
    background-position: top center;
    background-repeat: no-repeat;
    .app-home-progress__text {
      text-align: center;
      margin: 0;
      font-size: 16px;
      font-weight: var(--font-bold);
      color: #fff;
      line-height: 1.3;
    }

    .app-home-progress__value {
      font-size: 28px;
      font-weight: var(--font-extra-bold);
      color: #ffd54f;
    }
  }
}

/* ----- 块2：里程碑 + 奖励卡片 ----- */
.app-home-main__middle {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.app-home-milestones {
  display: flex;
  justify-content: space-between;
  padding: 0 4px;
  flex-shrink: 0;
}

.app-home-milestones__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  &.app-home-milestones__item--reached {
    color: #ffd54f;
  }
}

.app-home-milestones__diamond {
  width: 12px;
  height: 12px;
  background: currentColor;
  transform: rotate(45deg);
  opacity: 0.9;
}

/* ----- 块3：分享栏 ----- */
.app-home-main__bottom {
  position: relative;
  width: 100%;
  height: 112px;
  min-height: 112px;
  flex-shrink: 0;
  overflow: hidden;
  background-color: red;

  .app-home-main__bottom-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    display: block;
    // object-position: top center;
    pointer-events: none;
  }
}
/* ----- 进度（块1 内） ----- */

.app-home-progress__bar {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #ffd54f 0%, #ffb74d 100%);
  transition: width 0.3s ease;
}

/* ----- 奖励卡片（块2 内） ----- */
.app-home-rewards {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  min-height: 0;
  flex: 1;
  background-color: pink;
}

.app-home-reward-card {
  // flex: 1;
  min-width: 120px;
  max-width: 180px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
}

/* 奖品边框（切图） */
.app-home-reward-card__frame {
  height: 252px;
  width: 194px;
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.app-home-reward-card--border-weilingqu .app-home-reward-card__frame {
  background-image: url('/static/images/weilingqu@2x.png');
}
.app-home-reward-card--border-yilingqu .app-home-reward-card__frame {
  background-image: url('/static/images/yilingqu@2x.png');
}
.app-home-reward-card--border-zhenglingqu .app-home-reward-card__frame {
  background-image: url('/static/images/zhenglingqu@2x.png');
}

/* 中间占位（可忽略） */
.app-home-reward-card__icon {
  width: 50%;
  height: 50%;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  flex-shrink: 0;
}

/* 数量 x10 右下角 */
.app-home-reward-card__qty {
  position: absolute;
  right: 8px;
  bottom: 8px;
  font-size: 14px;
  font-weight: var(--font-bold);
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* 按钮边框（切图） */
.app-home-reward-card__btn {
  width: 100%;
  min-height: 44px;
  padding: 0;
  border: none;
  font-size: 14px;
  font-weight: var(--font-bold);
  color: #fff;
  cursor: pointer;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-color: transparent;
  flex-shrink: 0;
  &:disabled {
    cursor: default;
  }
}
.app-home-reward-card--btn-weilingqu_btn .app-home-reward-card__btn {
  background-image: url('/static/images/weilingqu_btn@2x.png');
}
.app-home-reward-card--btn-zhenglingqu_btn .app-home-reward-card__btn {
  background-image: url('/static/images/zhenglingqu_btn@2x.png');
}
.app-home-reward-card--btn-claimed_btn .app-home-reward-card__btn {
  background: linear-gradient(180deg, #b39ddb 0%, #ce93d8 100%);
  border-radius: 8px;
  padding: 10px 16px;
  &:disabled {
    opacity: 0.9;
  }
}

/* ----- 右侧栏 ----- */
.app-home-side {
  width: 451px;
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
