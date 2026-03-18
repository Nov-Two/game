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
        <GfrButton class="app-congrats-dialog__close" aria-label="Close" @click="handleClose">
          <img src="/static/images/close@2x.png" alt="" />
        </GfrButton>

        <h2 id="app-congrats-title" class="app-congrats-dialog__title">
          {{ fixTransify('CONGRATULATIONS') }}
        </h2>

        <div class="app-congrats-dialog__reward">
          <div class="app-congrats-dialog__reward-bg">
            <img
              :src="centerReward.img || '/static/images/prize@2x.png'"
              :alt="centerReward.name"
              class="app-congrats-dialog__reward-img"
            />
            <span v-if="centerReward.qty != null" class="app-congrats-dialog__reward-qty">
              <span class="app-congrats-dialog__reward-qty-x">x</span>
              <span class="app-congrats-dialog__reward-qty-num">{{ centerReward.qty }}</span>
            </span>
          </div>
          <p class="app-congrats-dialog__reward-name">{{ centerReward.name }}</p>
          <GfrButton class="app-congrats-dialog__confirm" @click="handleConfirm">
            <span class="app-congrats-dialog__confirm-text">{{ confirmText }}</span>
          </GfrButton>
          <p class="app-congrats-dialog__footer">congratulations congratulations test test</p>
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
  height: calc(100vh - 96px);
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.app-congrats-dialog__close {
  position: absolute;
  left: 5%;
  top: clamp(20px, 3vh, 28px);
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
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: clamp(40px, 5vw, 60px);
  font-weight: var(--font-extra-bold);
  line-height: 1.1;
  color: rgb(220, 255, 0);
  text-shadow: 0 0 20px rgba(220, 255, 0, 0.5);
  text-transform: uppercase;
  letter-spacing: -2.4px;
}

.app-congrats-dialog__reward {
  position: relative;
  z-index: 1;
  flex: 1;
  width: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  gap: 10px;
}

.app-congrats-dialog__reward-bg {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 600px;
  height: 500px;
  background-image: url('/static/images/big-prices-bg@2x.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.app-congrats-dialog__reward-img {
  width: 40%;
  object-fit: contain;
}

.app-congrats-dialog__reward-qty {
  position: absolute;
  right: 33%;
  bottom: 26%;
  display: inline-flex;
  align-items: baseline;
  color: #fff;
  font-weight: var(--font-bold);
  font-style: italic;

  .app-congrats-dialog__reward-qty-x {
    font-size: 24px;
    line-height: 24px;
  }

  .app-congrats-dialog__reward-qty-num {
    font-size: 36px;
    line-height: 36px;
    letter-spacing: -1.44px;
  }
}

.app-congrats-dialog__reward-name {
  position: absolute;
  bottom: 28%;
  font-size: clamp(24px, 2.6vw, 28px);
  font-weight: var(--font-bold);
  line-height: 28px;
  color: #fff;
  letter-spacing: -1.12px;
}

.app-congrats-dialog__confirm {
  position: relative;
  bottom: 8%;
  width: clamp(320px, 42vw, 420px);
  height: clamp(68px, 9vw, 88px);
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-image: url('/static/images/big-prices-btn@2x.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-color: transparent;
  border: none;
  cursor: pointer;
  // margin-top: 6px;
}

.app-congrats-dialog__confirm:hover {
  filter: brightness(1.05);
}

.app-congrats-dialog__confirm-text {
  font-size: clamp(28px, 3.5vw, 36px);
  font-weight: var(--font-extra-bold);
  color: rgb(46, 47, 50);
  text-transform: uppercase;
  letter-spacing: -1.44px;
  line-height: 1;
  margin-bottom: 16px;
}

.app-congrats-dialog__footer {
  position: absolute;
  bottom: 4%;
  font-size: 24px;
  font-weight: var(--font-medium);
  color: rgb(138, 138, 138);
  letter-spacing: -0.96px;
}
</style>
