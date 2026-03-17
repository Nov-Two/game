<template>
  <GfrOverlay
    v-model:visible="visible"
    :z-index="95"
    color="rgba(0, 20, 40, 0.75)"
    teleport="body"
    :clickable="false"
    align="center"
  >
    <transition name="gfr-bounce" mode="out-in">
      <div
        v-show="visible"
        class="app-congrats-dialog"
        role="dialog"
        aria-labelledby="app-congrats-title"
        aria-modal="true"
        @click.stop
      >
        <div class="app-congrats-dialog__bg" aria-hidden="true" />
        <GfrButton class="app-congrats-dialog__close" aria-label="Close" @click="handleClose">
          <img src="/static/images/close@2x.png" alt="" />
        </GfrButton>

        <h2 id="app-congrats-title" class="app-congrats-dialog__title">{{ fixTransify('CONGRATULATIONS') }}</h2>

        <div class="app-congrats-dialog__rewards">
          <div class="app-congrats-dialog__reward-img">
            <img
              :src="centerReward.img || '/static/images/prize@2x.png'"
              :alt="centerReward.name"
              class="app-congrats-dialog__reward-img-inner"
            />
            <span v-if="centerReward.qty != null" class="app-congrats-dialog__reward-qty">x{{ centerReward.qty }}</span>
          </div>
        </div>

        <p class="app-congrats-dialog__reward-name">{{ centerReward.name }}</p>

        <GfrButton class="app-congrats-dialog__confirm" @click="handleConfirm">
          <span class="app-congrats-dialog__confirm-text">{{ confirmText }}</span>
        </GfrButton>
        <p class="app-congrats-dialog__footer">{{ footerText }}</p>
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
  height: 100%;
  overflow: hidden;
  text-align: center;
  padding-top: 50px;
}

.app-congrats-dialog__bg {
  position: absolute;
  inset: 0;
  background-image: url('/static/images/big-prices-bg@2x.png');
  background-size: 50%;
  background-position: center;
  background-repeat: no-repeat;
  pointer-events: none;

  @media (min-width: 768px) {
    background-size: 40%;
  }
}

.app-congrats-dialog__close {
  position: absolute;
  // top: 60px;
  top: 9%;
  left: 4%;
  z-index: 2;
  width: 44px;
  height: 44px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;

  img {
    width: 48px;
    height: 48px;
    // filter: brightness(0) invert(1);
  }
}

.app-congrats-dialog__title {
  position: relative;
  z-index: 1;
  font-size: 60px;
  font-weight: var(--font-extra-bold);
  color: rgb(255, 235, 0);
  text-shadow: 0 0 20px rgba(255, 235, 0, 0.5);
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.app-congrats-dialog__rewards {
  height: 64%;
  position: relative;
  z-index: 1;
}

.app-congrats-dialog__reward-img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: inline-block;
  width: 206px;
  height: 266px;
}

.app-congrats-dialog__reward-img-inner {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.app-congrats-dialog__reward-qty {
  position: absolute;
  bottom: 0;
  right: -5%;
  font-size: 30px;
  font-weight: var(--font-extra-bold);
  font-style: italic;
  color: #fff;
}

.app-congrats-dialog__reward-name {
  font-size: 28px;
  font-weight: var(--font-extra-bold);
}

.app-congrats-dialog__confirm {
  position: relative;
  top: 2%;
  z-index: 1;
  width: 100%;
  height: 96px;
  padding: 0;
  background-image: url('/static/images/big-prices-btn@2x.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.app-congrats-dialog__confirm-text {
  padding-bottom: 20px;
  font-size: 36px;
  font-weight: var(--font-extra-bold);
  color: rgb(40, 42, 48);
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
}

.app-congrats-dialog__footer {
  position: relative;
  z-index: 1;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}
</style>
