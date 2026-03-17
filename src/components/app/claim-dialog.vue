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
        <GfrButton class="app-claim-dialog__close" aria-label="Close" @click="handleClose">
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

          <GfrButton class="app-claim-dialog__confirm" @click="handleConfirm">
            <span class="app-claim-dialog__confirm-text">{{ confirmText }}</span>
          </GfrButton>

          <!-- <p class="app-claim-dialog__footer">congratulations congratulations test test</p> -->
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
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
  padding-top: 100px;
}

.app-claim-dialog__bg {
  position: absolute;
  inset: 0;
  width: 967px;
  height: 500px;
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
  left: 16%;
  top: 22%;
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
  }
}

.app-claim-dialog__title {
  position: relative;
  top: 13%;
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
  padding-top: 110px;
}

.app-claim-dialog__reward-icon {
  position: relative;
  display: inline-block;
  width: 180px;
  height: 180px;
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
  margin: 12px 0;
  font-size: 24px;
  font-weight: var(--font-bold);
  color: rgb(40, 44, 52);
}

.app-claim-dialog__confirm {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  width: 300px;
  height: 90px;
  background-image: url('/static/images/weilingqu_btn@2x.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.app-claim-dialog__confirm:hover {
  filter: brightness(1.05);
}

.app-claim-dialog__confirm-text {
  font-size: 30px;
  font-weight: var(--font-extra-bold);
  color: #fff;
  text-transform: uppercase;
  padding-top: 10px;
  // letter-spacing: 1px;
}
</style>
