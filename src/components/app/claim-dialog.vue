<template>
  <GfrOverlay
    v-model:visible="visible"
    :z-index="10"
    color="rgba(0, 15, 25, 0.85)"
    teleport="body"
    :clickable="false"
    align="center"
  >
    <transition name="gfr-bounce" mode="out-in">
      <div
        v-show="visible"
        class="app-claim-dialog"
        role="dialog"
        aria-labelledby="app-claim-dialog-title"
        aria-modal="true"
        @click.stop
      >
        <div class="app-claim-dialog__bg" aria-hidden="true" />
        <GfrButton class="app-claim-dialog__close" aria-label="Close" :sound="false" @click="handleClose">
          <img src="/static/images/close@2x.png" alt="" />
        </GfrButton>

        <h2 id="app-claim-dialog-title" class="app-claim-dialog__title">
          {{ fixTransify('CONGRATULATIONS') }}
        </h2>

        <div class="app-claim-dialog__reward">
          <div class="app-claim-dialog__reward-icon">
            <img v-if="reward.img" :src="reward.img" :alt="reward.name" class="app-claim-dialog__reward-img" />
            <span v-if="reward.qty != null" class="app-claim-dialog__reward-qty">x{{ reward.qty }}</span>
          </div>
          <p class="app-claim-dialog__reward-name">{{ reward.name }}</p>

          <GfrButton class="app-claim-dialog__confirm" :sound="false" @click="handleConfirm">
            <span class="app-claim-dialog__confirm-text">{{ confirmText }}</span>
          </GfrButton>

          <p class="app-claim-dialog__footer">congratulations congratulations test test</p>
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
  name: 'AppClaimDialog'
})

interface RewardItem {
  name: string
  img?: string
  qty?: number
}

withDefaults(
  defineProps<{
    reward?: RewardItem
    confirmText?: string
  }>(),
  {
    reward: () => ({
      name: 'Reward',
      img: '',
      qty: 10
    }),
    confirmText: 'CONFIRM'
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
.app-claim-dialog {
  position: relative;
  width: min(967px, calc(100vw - 48px));
  max-height: calc(100vh - 48px);
  aspect-ratio: 967 / 500;
  height: auto;
  box-sizing: border-box;
  overflow: visible;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: clamp(40px, 8vh, 72px) 24px 28px;
}

.app-claim-dialog__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-image: url('/static/images/dialog-rule@2x.png');
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 24px;
}

.app-claim-dialog__close {
  position: absolute;
  left: clamp(0px, -2vw, -10px);
  top: clamp(26px, -2vw, -10px);
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

.app-claim-dialog__title {
  z-index: 1;
  font-size: clamp(28px, 4.2vw, 40px);
  font-weight: var(--font-extra-bold);
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgb(47, 47, 47);
}

.app-claim-dialog__reward {
  margin-top: 14px;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 0;
}

.app-claim-dialog__reward-icon {
  position: relative;
  display: inline-block;
  width: clamp(132px, 18vw, 180px);
  height: clamp(132px, 18vw, 180px);
  background-image: url('/static/images/receive@2x.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.app-claim-dialog__reward-img {
  width: 90%;
  height: 90%;
  object-fit: contain;
  padding: 12px;
  box-sizing: border-box;
}

.app-claim-dialog__reward-qty {
  position: absolute;
  right: 18px;
  bottom: 12px;
  font-size: 24px;
  font-weight: var(--font-extra-bold);
  font-style: italic;
  color: #000;
}

.app-claim-dialog__reward-name {
  margin: 0;
  font-size: clamp(18px, 2.8vw, 24px);
  font-weight: var(--font-bold);
  color: rgb(40, 44, 52);
}

.app-claim-dialog__confirm {
  z-index: 1;
  width: 360px;
  height: 100px;
  background-image: url('/static/images/weilingqu_btn@2x.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  // align-items: center;
}

.app-claim-dialog__confirm:hover {
  filter: brightness(1.05);
}

.app-claim-dialog__confirm-text {
  font-size: 30px;
  font-weight: var(--font-extra-bold);
  color: #fff;
  text-transform: uppercase;
  line-height: 72px;
}

.app-claim-dialog__footer {
  font-size: 22px;
  color: rgb(107, 107, 107);
  margin-top: -36px;
}
</style>
