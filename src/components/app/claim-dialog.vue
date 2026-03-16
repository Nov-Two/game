<template>
  <GfrOverlay
    v-model:visible="visible"
    :z-index="94"
    color="rgba(0, 0, 0, 0.65)"
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
        <GfrButton class="app-claim-dialog__close" aria-label="Close" @click="handleClose">
          <img
            src="/static/images/close@1x.png"
            srcset="/static/images/close@1x.png 1x, /static/images/close@2x.png 2x, /static/images/close@3x.png 3x"
            alt=""
          />
        </GfrButton>

        <h2 id="app-claim-dialog-title" class="app-claim-dialog__title">CONGRATULATIONS</h2>

        <div class="app-claim-dialog__reward">
          <div class="app-claim-dialog__reward-icon">
            <img v-if="reward.img" :src="reward.img" :alt="reward.name" class="app-claim-dialog__reward-img" />
            <span v-if="reward.qty != null" class="app-claim-dialog__reward-qty">x{{ reward.qty }}</span>
          </div>
          <p class="app-claim-dialog__reward-name">{{ reward.name }}</p>

          <GfrButton class="app-claim-dialog__confirm" @click="handleConfirm">
            <span class="app-claim-dialog__confirm-text">{{ confirmText }}</span>
          </GfrButton>
        </div>
      </div>
    </transition>
  </GfrOverlay>
</template>

<script setup lang="ts">
import GfrOverlay from '@/components/ui/overlay.vue'
import GfrButton from '@/components/ui/button.vue'

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
    /** 当前展示的奖励：图片、名称、数量 */
    reward?: RewardItem
    confirmText?: string
  }>(),
  {
    reward: () => ({
      name: 'Reward',
      img: '/static/images/prize@2x.png',
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
  visible.value = false
  emit('close')
}

function handleConfirm() {
  visible.value = false
  emit('confirm')
}
</script>

<style scoped lang="scss">
.app-claim-dialog {
  position: relative;
  width: 100%;
  height: 100%;
  // width: min(520px, 90vw);
  // padding: 48px 32px 28px;
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
  padding-top: 100px;
}

.app-claim-dialog__bg {
  position: absolute;
  inset: 0;
  width: 667px;
  height: 375px;
  background-image: url('/static/images/dialog-rule@2x.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.app-claim-dialog__close {
  position: absolute;
  top: 12px;
  left: 12px;
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
    width: 28px;
    height: 28px;
    filter: brightness(0);
  }
}

.app-claim-dialog__title {
  position: relative;
  top: 20%;
  z-index: 1;
  font-size: 40px;
  font-weight: var(--font-extra-bold);
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgb(47, 47, 47);
}

.app-claim-dialog__reward {
  height: 60%;
  position: relative;
  z-index: 1;
  margin-bottom: 20px;
  padding-top: 140px;
}

.app-claim-dialog__reward-icon {
  position: relative;
  display: inline-block;
  width: 124px;
  height: 124px;
  border-radius: 16px;
  border: 3px solid rgb(160, 100, 220);
  background: rgba(255, 255, 255, 0.6);
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(100, 80, 180, 0.25);
}

.app-claim-dialog__reward-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
  box-sizing: border-box;
}

.app-claim-dialog__reward-qty {
  position: absolute;
  right: 8px;
  bottom: 8px;
  min-width: 44px;
  padding: 4px 8px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.75);
  font-size: 18px;
  font-weight: var(--font-extra-bold);
  color: #fff;
  line-height: 1.2;
}

.app-claim-dialog__reward-name {
  margin: 12px 0 0;
  font-size: 18px;
  font-weight: var(--font-bold);
  color: rgb(40, 44, 52);
  word-break: break-word;
}

.app-claim-dialog__confirm {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  width: 320px;
  height: 52px;
  padding: 0;
  border: none;
  border-radius: 14px;
  background: linear-gradient(180deg, rgb(140, 80, 200), rgb(110, 60, 170));
  box-shadow: 0 4px 12px rgba(110, 60, 170, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.app-claim-dialog__confirm:hover {
  filter: brightness(1.05);
}

.app-claim-dialog__confirm-text {
  font-size: 20px;
  font-weight: var(--font-extra-bold);
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
</style>
