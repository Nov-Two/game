<template>
  <div class="app-header">
    <div class="app-header__left">
      <GfrSoundEffect
        class="app-header__sound-effect"
        :storage-key="storageKey"
        :volume="volume"
        :default-enabled="false"
        :sounds="sounds"
        @after-init="handleAfterInit"
        @status-change="handleSoundStatusChange"
      >
        <template #default>
          <img
            v-if="!musicStatus"
            class="app-header__left-icon"
            src="/static/images/disable-music@2x.png"
            alt="disable-music"
          />
          <img v-else class="app-header__left-icon" src="/static/images/enable-music@2x.png" alt="enable-music" />
        </template>
      </GfrSoundEffect>
      <GfrRule
        :title="fixTransify('COMMON_RULE')"
        :content="ruleContent"
        type="fall"
        @open="handleRuleOpen('open')"
        @close="handleRuleOpen('close')"
        :dir="state.lang === 'ar' ? 'rtl' : 'ltr'"
      >
        <template #trigger>
          <GfrButton class="app-header__rule-button">
            <img class="app-header__left-icon" src="/static/images/rule@2x.png" alt="rule" />
          </GfrButton>
        </template>
      </GfrRule>
    </div>
    <div class="app-header__center">
      <GfrHeading class="app-header__center-title">
        {{ fixTransify('Regional Progress Setting') }}
      </GfrHeading>
      <div class="app-header__center-cutdown">
        <span class="app-header__center-cutdown-left">{{ countdownLabel }}</span>
        <div class="app-header__center-cutdown-right">
          <template v-if="countdown.mode === 'ddhh'">
            <span class="app-header__countdown-num">{{ countdown.days }}</span
            ><span class="app-header__countdown-unit">{{ countdown.dayUnit }}</span>
            <span class="app-header__countdown-space"> </span>
            <span class="app-header__countdown-num">{{ countdown.hours }}</span
            ><span class="app-header__countdown-unit">{{ countdown.hourUnit }}</span>
          </template>
          <template v-else-if="countdown.mode === 'hms'">
            <span class="app-header__countdown-num">{{ countdown.h }}</span
            ><span class="app-header__countdown-unit">:</span>
            <span class="app-header__countdown-num">{{ countdown.m }}</span
            ><span class="app-header__countdown-unit">:</span>
            <span class="app-header__countdown-num">{{ countdown.s }}</span>
          </template>
          <span v-else class="app-header__countdown-unit">--</span>
        </div>
      </div>
    </div>
    <div class="app-header-uid">
      <span>UID: {{ state.player.uid }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import GfrSoundEffect from '@/components/ui/sound-effect.vue'
import GfrRule from '@/components/ui/rule.vue'
import GfrButton from '@/components/ui/button.vue'
import GfrHeading from '@/components/ui/heading.vue'
import sounds from '@/lib/sounds'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, onBeforeMount, onUnmounted, ref, watch } from 'vue'
import { useGame } from '@/composables/useGame'
import { useSound } from '@/composables/useSound'
import Toast from '@/components/ui/toast'
import { useGA } from '@/composables/useGA'
import { formatCountdown } from '@/lib/utils'
const { addGA } = useGA()
const { getGameVolume } = useGame()
const { createSounds, playSounds, pauseSounds } = useSound()
const store = useStore()
const { fixTransify } = store
const { state } = storeToRefs(store)
defineOptions({
  name: 'AppHeader'
})
const storageKey = `${import.meta.env.VITE_APP_PROJECT_NAME}_sounds_status`
const ruleContent = computed(() => state.value.eventConfig.rule)
const handleAfterInit = (howlMap: Record<string, import('howler').Howl>) => {
  createSounds(howlMap)
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(storageKey) : null
  musicStatus.value = stored === 'true'
  if (musicStatus.value) playSounds('bgm')
  Toast.setDefaultOptions({
    onOpen: () => {
      playSounds('toast')
    }
  })
}
const volume = ref(0.5)
onBeforeMount(() => {
  getGameVolume().then((res) => {
    volume.value = res
  })
})
const musicStatus = ref<boolean>(false)
const handleSoundStatusChange = (status: boolean) => {
  musicStatus.value = status
  if (status) {
    playSounds('bgm')
  } else {
    pauseSounds('bgm')
  }
  addGA(`sound_status_${status ? 'on' : 'off'}`, true)
}
const handleRuleOpen = (type: 'open' | 'close') => {
  addGA(`rule_${type}`, true)
  playSounds(type === 'open' ? 'popup' : 'close')
}

// 倒计时：根据后台配置的活动结束时间，复用 utils.formatCountdown；>24h 显示 DD HH，<=24h 显示 HH:MM:SS，D/H 走 transify
const countdownLabel = computed(() => fixTransify('COUNTDOWN_LABEL'))
const countdownEndTime = computed(() => {
  const end = state.value.eventConfig?.end_time
  if (end == null || typeof end !== 'number') return 0
  return end * 1000
})
const countdownRemaining = ref(0)
const countdown = computed(() => {
  const raw = formatCountdown(Math.floor(countdownRemaining.value / 1000))
  if (raw.mode === 'ddhh') {
    return {
      ...raw,
      dayUnit: fixTransify('COUNTDOWN_DAY_UNIT'),
      hourUnit: fixTransify('COUNTDOWN_HOUR_UNIT')
    }
  }
  return raw
})

let countdownTimer: ReturnType<typeof setInterval> | null = null
function tickCountdown() {
  const end = countdownEndTime.value
  countdownRemaining.value = end > 0 ? Math.max(0, end - Date.now()) : 0
}
function startCountdownTimer() {
  if (countdownTimer) return
  const end = countdownEndTime.value
  if (end <= 0) return
  tickCountdown()
  countdownTimer = setInterval(tickCountdown, 1000)
}
watch(
  countdownEndTime,
  (end) => {
    if (end > 0) startCountdownTimer()
  },
  { immediate: true }
)
onBeforeMount(() => {
  tickCountdown()
  startCountdownTimer()
})
onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
  countdownTimer = null
})
</script>

<style lang="scss" scoped>
.app-header {
  position: relative;
  z-index: 9;
  width: 100%;
  height: fit-content;
  padding: 12px 0;
  display: flex;
  justify-content: space-between;
}
.app-header__center {
  position: relative;
  flex: 1;
  padding: 0 180px;
  .app-header__center-title {
    font-size: 40px;
    font-weight: var(--font-extra-bold);
    color: #fff;
    text-transform: uppercase;
    text-align: center;
    line-height: 1;
    padding: 0 20px;
    // letter-spacing: 2px;
    text-shadow:
      -2px -2px 0 #4a90e2,
      2px -2px 0 #4a90e2,
      -2px 2px 0 #4a90e2,
      2px 2px 0 #4a90e2,
      -4px -4px 0 #2c5aa0,
      4px -4px 0 #2c5aa0,
      -4px 4px 0 #2c5aa0,
      4px 4px 0 #2c5aa0,
      0 10px 20px rgba(0, 0, 0, 0.5);
  }
}

.app-header__center-cutdown {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-size: 26px;
  font-weight: var(--font-extra-bold);
  text-transform: uppercase;
}
.app-header__center-cutdown-left {
  color: rgb(255, 255, 255);
  font-weight: var(--font-extra-bold);
}
.app-header__center-cutdown-right {
  display: inline-flex;
  align-items: baseline;
  color: rgb(255, 255, 255);
  font-weight: var(--font-extra-bold);
}
.app-header__countdown-num {
  color: rgb(220, 255, 0);
  font-variant-numeric: tabular-nums;
}
.app-header__countdown-unit {
  color: rgb(255, 255, 255);
}
.app-header__countdown-space {
  color: rgb(255, 255, 255);
  margin: 0 2px;
}

.app-header__left {
  display: flex;
  align-items: center;
  padding-top: 12px;
  .app-header__left-icon {
    width: 35px;
    height: 35px;
  }
}
.app-header__sound-effect {
  width: 34px;
  height: 34px;
  margin-right: 16px;
}
.app-header-uid {
  font-size: 18px;
  color: #fff;
  font-weight: var(--font-medium);
  text-shadow: 0 0 10px rgba(0, 0, 0, 1);
  padding-top: 12px;
}
.app-header__rule-button {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  // width: 34px;
  // height: 34px;
}
.app-header-rule-arrow {
  width: 29px;
  height: 29px;
  margin: 0 auto 20px;
}
.app-header-rule-arrow--hidden {
  opacity: 0;
  transition: opacity 0.3s ease;
}
</style>
