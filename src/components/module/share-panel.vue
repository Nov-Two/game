<template>
  <GfrContainer class="app-share">
    <div class="app-share__panel" role="dialog" aria-label="Share">
      <div class="app-share__toolbar">
        <GfrButton class="app-share__close" aria-label="Close" @click="emit('close')">
          <img src="/static/images/close@1x.png"
            srcset="/static/images/close@1x.png 1x, /static/images/close@2x.png 2x, /static/images/close@3x.png 3x"
            alt="" />
        </GfrButton>
      </div>

      <div class="app-share__tip">
        <span class="app-share__tip__label">{{ fixTransify('Current Region Process:') }}</span>
      </div>

      <!-- <div class="app-share__rank">
        <img class="app-share__rank-icon" src="/static/images/top@2x.png" alt="" />
        <div class="app-share__rank-text">{{ rankText }}</div>
      </div> -->

      <div class="app-share__progress">
        <AppProgress :currentValue="currentValue" :milestones="milestones" />
      </div>


    </div>
  </GfrContainer>
</template>

<script setup lang="ts">
import GfrContainer from '@/components/ui/container.vue'
import GfrButton from '@/components/ui/button.vue'
import AppProgress from '@/components/module/progress.vue'
import { useStore } from '@/stores'

const store = useStore()
const { fixTransify } = store

defineOptions({
  name: 'AppSharePanel'
})

defineProps<{
  displayName: string
  matchesPlayed: number
  tipBefore: string
  tipAfter: string
  rankText: string
  currentValue: number
  milestones: Array<{ value: number; isLingQu?: boolean }>
  shareDisabled: boolean
  isRefreshing: boolean
}>()

const emit = defineEmits<{
  close: []
  refresh: []
  share: []
}>()
</script>

<style scoped lang="scss">
.app-share {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center
}

.app-share__panel {
  width: 100%;
  height: 100%;
  border-radius: 18px;
  overflow: hidden;
  background-image: url('/static/images/share-have@1x.jpg');
  background-image: image-set(url('/static/images/share-have@1x.jpg') 1x, url('/static/images/share-have@2x.jpg') 2x, url('/static/images/share-have@3x.jpg') 3x);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.app-share__toolbar {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 2
}

.app-share__close {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  img {
    width: 30px;
    height: 30px
  }
}

.app-share__tip {
  position: relative;
  display: flex;
  min-height: 100px;
  margin: auto;
  width: min(829px, 92%);
  justify-content: center;
  align-items: center;
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
  font-size: 28px;
  font-weight: var(--font-extra-bold);
  color: #fff;
  z-index: 2;
}

// .app-share__name {
//   margin-right: 6px
// }

// .app-share__highlight {
//   color: rgb(255, 235, 0);
//   text-shadow: 0 0 12px rgba(255, 235, 0, .35);
//   padding: 0 4px
// }

.app-share__rank {
  margin: 12px auto 8px;
  width: min(680px, 92%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px
}

.app-share__rank-icon {
  width: 58px;
  height: 58px;
  object-fit: contain
}

.app-share__rank-text {
  font-size: 66px;
  font-weight: var(--font-extra-bold);
  color: rgb(255, 235, 0);
  letter-spacing: 1px;
  text-shadow: 0 0 16px rgba(0, 0, 0, .3)
}

.app-share__progress {
  width: min(980px, 96%);
  margin: 0 auto
}
</style>
