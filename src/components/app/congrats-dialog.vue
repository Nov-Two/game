<template>
  <GfrOverlay
    v-model:visible="visible"
    :z-index="95"
    color="rgba(0, 15, 25, 0.85)"
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
        <GfrButton class="app-congrats-dialog__close" aria-label="Close" :sound="false" @click="handleClose">
          <img src="/static/images/close@2x.png" alt="" />
        </GfrButton>

        <h2 id="app-congrats-title" class="app-congrats-dialog__title">
          {{ fixTransify('CONGRATULATIONS') }}
        </h2>

        <div class="app-congrats-dialog__reward">
          <div class="app-congrats-dialog__reward-bg">
            <span v-if="centerReward.qty != null" class="app-congrats-dialog__reward-qty">
              <span class="app-congrats-dialog__reward-qty-x">x</span>
              <span class="app-congrats-dialog__reward-qty-num">{{ centerReward.qty }}</span>
            </span>
          </div>
          <img
            :src="centerReward.img || '/static/images/prize@2x.png'"
            :alt="centerReward.name"
            class="app-congrats-dialog__reward-img"
          />

          <p class="app-congrats-dialog__reward-name">{{ centerReward.name }}</p>

          <GfrButton class="app-congrats-dialog__confirm" :sound="false" @click="handleConfirm">
            <span class="app-congrats-dialog__confirm-text">{{ confirmText }}</span>
          </GfrButton>
          <p class="app-congrats-dialog__footer">{{ footerText || 'congratulations congratulations test test' }}</p>
        </div>
      </div>
    </transition>
  </GfrOverlay>
</template>

<script setup lang="ts">
import GfrOverlay from '@/components/ui/overlay.vue'
import GfrButton from '@/components/ui/button.vue'
import { useStore } from '@/stores'
import { useSound } from '@/composables/useSound'

const store = useStore()
const { fixTransify } = store
const { playSounds } = useSound()

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
    confirmText: 'CONFIREM',
    footerText: ''
  }
)

const emit = defineEmits<{
  confirm: []
  close: []
}>()

const visible = defineModel<boolean>('modelValue', { default: false })

function handleClose() {
  playSounds('close')
  visible.value = false
  emit('close')
}

function handleConfirm() {
  playSounds('confirm')
  visible.value = false
  emit('confirm')
}
</script>

<style scoped lang="scss">
.app-congrats-dialog {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
  margin: auto;
  background-color: transparent;
}

.app-congrats-dialog__close {
  position: absolute;
  top: 74px;
  left: 94px;
  z-index: 2;
  width: 46px;
  height: 46px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.app-congrats-dialog__title {
  position: absolute;
  top: 52px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  margin: 0;
  width: 100%;
  font-size: 60px;
  font-weight: 800;
  line-height: 60px;
  color: #d7ff1f;
}

.app-congrats-dialog__reward-bg {
  position: absolute;
  top: 126px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 500px;
  background-image: url('/static/images/big-prices-bg@2x.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.app-congrats-dialog__reward-img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 249px;
  height: 311px;
  object-fit: contain;
}

.app-congrats-dialog__reward-qty {
  position: absolute;
  bottom: 30%;
  right: 30%;
  display: flex;
  align-items: baseline;
  color: #ffffff;
  font-weight: 700;
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

  .app-congrats-dialog__reward-qty-x {
    font-size: 24px;
    line-height: 24px;
    letter-spacing: -0.96px;
  }

  .app-congrats-dialog__reward-qty-num {
    font-size: 36px;
    line-height: 36px;
    letter-spacing: -1.44px;
  }
}

.app-congrats-dialog__reward-name {
  position: absolute;
  top: 532px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 28px;
  font-weight: 700;
  line-height: 28px;
  color: #ffffff;
  white-space: nowrap;
}

.app-congrats-dialog__confirm {
  position: absolute;
  top: 580px;
  left: 50%;
  transform: translateX(-50%);
  width: 420px;
  height: 88px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/static/images/big-prices-btn@2x.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-color: transparent;
  cursor: pointer;
}

.app-congrats-dialog__confirm:hover {
  filter: brightness(1.05);
}

.app-congrats-dialog__confirm-text {
  font-size: 36px;
  font-weight: 800;
  color: #0e1a3a;
  text-transform: uppercase;
  letter-spacing: -1.44px;
  line-height: 1;
  margin-bottom: 28px; /* Adjust to center text vertically in the button image */
}

.app-congrats-dialog__footer {
  position: absolute;
  top: 660px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: -0.96px;
  white-space: nowrap;
}
</style>
