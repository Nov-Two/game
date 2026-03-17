<template>
  <GfrContainer class="app-share">
    <div class="app-share__panel" role="main" aria-label="Share">
      <div class="app-share__tip" :class="{ 'app-share__tip--rank-after-threshold': sharePageRankAfterThreshold }">
        <span class="app-share__tip__label">
          <span class="app-share__tip__nickname">{{ displayName }}</span>
          <span class="app-share__tip__text">{{ fixTransify('SHARE_HAVE_PLAYED_AFTER_NICKNAME') }}</span>
          <span class="app-share__tip__num">{{ matchesPlayed }}</span>
          <span class="app-share__tip__highlight">{{ fixTransify('SHARE_MATCHES') }}</span>
          <span class="app-share__tip__text">{{ fixTransify('SHARE_WITH_FRIENDS_RANKED') }}</span>
        </span>
      </div>

      <div v-if="sharePageShowRankAndBadge" class="app-share__rank">
        <img class="app-share__rank-icon" src="/static/images/icon@2x.png" alt="" />
        <div class="app-share__rank-text">{{ sharePageRankText }}</div>
      </div>

      <div class="app-share__progress">
        <GfrProgress :current-value="currentValue" :milestones="milestones" :show-award-buttons="false" />
      </div>
    </div>
  </GfrContainer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import GfrContainer from '@/components/ui/container.vue'
import GfrProgress from '@/components/ui/progress.vue'
import { useStore } from '@/stores'

const store = useStore()
const { fixTransify } = store
const { sharePageRankText, sharePageShowRankAndBadge, sharePageRankAfterThreshold } = storeToRefs(store)

defineOptions({
  name: 'AppSharePanel'
})

const props = defineProps<{
  displayName: string
  matchesPlayed: number
  tipBefore: string
  tipAfter: string
  currentValue: number
  milestones: Array<{ value: number; isLingQu?: boolean }>
  shareDisabled: boolean
  isRefreshing: boolean
}>()

const { displayName, matchesPlayed } = props

defineEmits<{
  share: []
}>()
</script>

<style scoped lang="scss">
.app-share {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.app-share__panel {
  width: 100%;
  height: 100%;
  position: relative;
}

.app-share__tip {
  position: relative;
  display: flex;
  min-height: 86px;
  margin: auto;
  width: 78%;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  &--rank-after-threshold {
    margin-top: 20px;
    margin-bottom: 50px;
  }
}

.app-share__tip::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/static/images/current@1x.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  pointer-events: none;
}

.app-share__tip__label {
  display: block;
  width: 100%;
  max-width: 100%;
  font-size: 26px;
  font-weight: var(--font-extra-bold);
  color: #fff;
  z-index: 2;
  padding-top: 22px;
  text-align: center;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
}

.app-share__tip__nickname,
.app-share__tip__text {
  color: #fff;
}

.app-share__tip__num,
.app-share__tip__highlight {
  color: rgb(220, 255, 0);
  font-weight: var(--font-extra-bold);
}

.app-share__rank {
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-share__rank-icon {
  width: 110px;
  height: 105px;
  object-fit: contain;
}

.app-share__rank-text {
  font-size: 56px;
  font-weight: var(--font-extra-bold);
  color: rgb(255, 235, 0);
  letter-spacing: 1px;
  text-shadow: 0 0 16px rgba(0, 0, 0, 0.3);
}

.app-share__progress {
  width: min(980px, 96%);
  margin: 0 auto;
}
</style>
