<template>
  <div class="app-header">
    <div class="app-header__left">
      <GfrSoundEffect
        class="app-header__sound-effect"
        :storage-key="storageKey"
        :volume="volume"
        :sounds="sounds"
        @after-init="handleAfterInit"
        @status-change="handleSoundStatusChange"
      >
        <template #default>
          <img
            v-if="!musicStatus"
            class="app-header__left-icon"
            src="/static/images/disable-music@1x.png"
            srcset="
              /static/images/disable-music@1x.png 1x,
              /static/images/disable-music@2x.png 2x,
              /static/images/disable-music@3x.png 3x
            "
            alt="disable-music"
          />
          <img
            v-else
            class="app-header__left-icon"
            src="/static/images/enable-music@1x.png"
            srcset="
              /static/images/enable-music@1x.png 1x,
              /static/images/enable-music@2x.png 2x,
              /static/images/enable-music@3x.png 3x
            "
            alt="enable-music"
          />
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
            <img
              class="app-header__left-icon"
              src="/static/images/rule@1x.png"
              srcset="/static/images/rule@1x.png 1x, /static/images/rule@2x.png 2x, /static/images/rule@3x.png 3x"
              alt="rule"
            />
          </GfrButton>
        </template>
      </GfrRule>
    </div>
    <div class="app-header__center">
      <!-- <GfrHeading
        type="gradient"
        :gradient="{ color: 'linear-gradient(to bottom, #fff, #fff)' }"
        :data-text="fixTransify('Regional Progress Setting')"
      >
      </GfrHeading> -->
      <GfrHeading>
        {{ fixTransify('Regional Progress Setting') }}
      </GfrHeading>
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
import { computed, onBeforeMount, ref } from 'vue'
import { useGame } from '@/composables/useGame'
import { useSound } from '@/composables/useSound'
import Toast from '@/components/ui/toast'
import { useGA } from '@/composables/useGA'
const { addGA } = useGA()
const { getGameVolume } = useGame()
const { createSounds, playSounds } = useSound()
const store = useStore()
const { fixTransify } = store
const { state } = storeToRefs(store)
defineOptions({
  name: 'AppHeader'
})
const storageKey = `${import.meta.env.VITE_APP_PROJECT_NAME}_sounds_status`
const ruleContent = computed(() => state.value.eventConfig.rule)
const handleAfterInit = (sounds: any) => {
  createSounds(sounds)
  playSounds('bgm')
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
  playSounds(status ? 'bgm' : 'bgm_off')
  musicStatus.value = status
  addGA(`sound_status_${status ? 'on' : 'off'}`, true)
}
const handleRuleOpen = (type: 'open' | 'close') => {
  addGA(`rule_${type}`, true)
  playSounds(type === 'open' ? 'popup' : 'close')
}
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
  h1 {
    font-size: 40px;
    font-weight: var(--font-extra-bold);
    color: #fff;
    text-transform: uppercase;
    text-align: center;
    line-height: 1;
    padding: 0 20px;
  }
  .app-header__center-bottom {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    img {
      width: 158px;
      height: 19px;
    }
    // width: 158px;
    // height: 19px;
    // position: absolute;
  }
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
