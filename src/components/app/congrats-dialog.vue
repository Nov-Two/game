<template>
  <GfrOverlay v-model:visible="visible" :z-index="95" color="rgba(0, 15, 25, 0.85)" teleport="body" :clickable="false"
    align="center">
    <transition name="gfr-bounce" mode="out-in">
      <div v-show="visible" class="app-congrats-dialog" role="dialog" aria-labelledby="app-congrats-title"
        aria-modal="true" @click.stop>
        <div class="app-congrats-dialog__bg" aria-hidden="true" />
        <GfrButton class="app-congrats-dialog__close" aria-label="Close" @click="handleClose">
          <img src="/static/images/close@2x.png" alt="" />
        </GfrButton>

        <h2 id="app-congrats-title" class="app-congrats-dialog__title">{{ fixTransify('CONGRATULATIONS') }}</h2>

        <div class="app-congrats-dialog__rewards">
          <div class="app-congrats-dialog__reward-img">
            <img :src="centerReward.img || '/static/images/prize@2x.png'" :alt="centerReward.name"
              class="app-congrats-dialog__reward-img-inner" />
            <span v-if="centerReward.qty != null" class="app-congrats-dialog__reward-qty">x{{ centerReward.qty }}</span>
          </div>

          <p class="app-congrats-dialog__reward-name">{{ centerReward.name }}</p>

          <GfrButton class="app-congrats-dialog__confirm" @click="handleConfirm">
            <span class="app-congrats-dialog__confirm-text">{{ confirmText }}</span>
          </GfrButton>
          <p class="app-congrats-dialog__footer">{{ footerText }}</p>
        </div>
      </div>
    </transition>
  </GfrOverlay>
</template>

<script setup lang="ts">
import GfrOverlay from '@/components/ui/overlay.vue'
import GfrButton from '@/components/ui/button.vue'
import { useStore } from '@/stores'

const store = useStore()
const { fixTransify } = store

defineOptions({
  name: 'AppCongratsDialog'
})

export interface CongratsCenterReward {
  name: string
  img?: string
  qty?: number
}

withDefaults(
  defineProps<{
    centerReward?: CongratsCenterReward
    confirmText?: string
    footerText?: string
  }>(),
  {
    centerReward: () => ({
      name: 'Reward',
      img: '/static/images/prize@2x.png',
      qty: 10
    }),
    confirmText: 'CONFIRM',
    footerText: ''
  }
)

const emit = defineEmits<{
  confirm: []
  close: []
}>()

const visible = defineModel<boolean>('modelValue', { default: false })

function handleClose() {
  visible.value = false
  emit('close')
}

function handleConfirm() {
  visible.value = false
  emit('confirm')
}
</script>

<style scoped lang="scss">
.app-congrats-dialog {
  position: relative;
  width: 100%;
  // height: 100%;
  max-height: calc(100vh - 48px);
  aspect-ratio: 980 / 640;
  height: auto;
  overflow: visible;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.app-congrats-dialog__bg {
  position: absolute;
  inset: 0;
  background-image: url('/static/images/big-prices-bg@2x.png');
  background-size: 40%;
  background-position: center;
  background-repeat: no-repeat;
}

.app-congrats-dialog__close {
  position: absolute;
  top: clamp(16px, -1.8vw, -8px);
  left: clamp(48px, -1.8vw, -8px);
  z-index: 2;
  width: clamp(44px, 6vw, 44px);
  height: clamp(44px, 6vw, 44px);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;

  img {
    width: 100%;
    height: 100%;
  }
}

.app-congrats-dialog__title {
  z-index: 1;
  font-size: clamp(44px, 6vw, 68px);
  font-weight: var(--font-extra-bold);
  color: rgb(255, 235, 0);
  text-shadow: 0 0 20px rgba(255, 235, 0, 0.5);
  margin: 20px 0 0 0;
  text-transform: uppercase;
  letter-spacing: 2px;

}

.app-congrats-dialog__rewards {
  position: relative;
  z-index: 1;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.app-congrats-dialog__reward-img {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.app-congrats-dialog__reward-img-inner {
  width: 220px;
  height: 220px;
  object-fit: contain;
}

.app-congrats-dialog__reward-qty {
  position: absolute;
  right: 0%;
  bottom: 27%;
  font-size: clamp(24px, 3.2vw, 36px);
  font-weight: var(--font-extra-bold);
  font-style: italic;
  color: #fff;
}

.app-congrats-dialog__reward-name {
  margin-top: -80px;
  font-size: 30px;
  font-weight: var(--font-extra-bold);
  color: #fff;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
}

.app-congrats-dialog__confirm {
  z-index: 1;
  width: clamp(360px, 52vw, 560px);
  height: clamp(82px, 12vw, 110px);
  padding: 0;
  background-image: url('/static/images/big-prices-btn@2x.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
}

.app-congrats-dialog__confirm-text {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(30px, 4vw, 44px);
  font-weight: var(--font-extra-bold);
  color: rgb(40, 42, 48);
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  line-height: 1;
  text-align: center;
}

.app-congrats-dialog__footer {
  z-index: 1;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
  margin: 6px 0 0;
}
</style>
