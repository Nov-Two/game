<!-- 政策弹窗 -->
<template>
  <GfrPolicyDialog
    v-model:visible="state.euPolicyPopup.show"
    :title="fixTransify('EU_TITLE_PRIVACY')"
    :content="state.euPolicyPopup.content"
    :disable-trigger="true"
    :confirm-text="fixTransify('EU_ALLOW')"
    :cancel-text="fixTransify('EU_REJECT')"
    @confirm="handleEuPolicyConfirm"
    @cancel="handleEuPolicyCancel"
    @closed="state.euPolicyPopup.show = false"
    :dir="state.lang === 'ar' ? 'rtl' : 'ltr'"
  >
    <template #model>
      <GfrPolicyDialog
        type="fall"
        :title="fixTransify('EU_TITLE_PREFER')"
        :disable-trigger="false"
        show-close
        :confirm-text="fixTransify('EU_CONFIRM')"
        @confirm="handleEuPolicyConfirm('storage')"
        @open="playSounds('popup')"
        @close="playSounds('close')"
        :dir="state.lang === 'ar' ? 'rtl' : 'ltr'"
      >
        <template #trigger>
          <GfrButton class="gfr-policy-more" @click="addGA('eu_policy_more', true)">
            {{ fixTransify('EU_MORE') }}
          </GfrButton>
        </template>
        <template #content>
          <div class="gfr-policy-checkboxes">
            <div class="gfr-policy-checkbox" @click="playSounds('click')">
              <input
                class="gfr-policy-checkbox-input"
                type="checkbox"
                id="storage-text"
                v-model="state.euPolicyPopup.storageChecked"
              />
              <label for="storage-text" v-html="state.euPolicyPopup.storageText"></label>
            </div>
            <div class="gfr-policy-checkbox" @click="playSounds('click')">
              <input
                class="gfr-policy-checkbox-input"
                type="checkbox"
                id="ad-text"
                v-model="state.euPolicyPopup.adChecked"
              />
              <label for="ad-text" v-html="state.euPolicyPopup.adText"></label>
            </div>
          </div>
        </template>
      </GfrPolicyDialog>
    </template>
  </GfrPolicyDialog>
</template>

<script setup lang="ts">
import GfrPolicyDialog from '@/components/ui/policy-dialog.vue'
import GfrButton from '@/components/ui/button.vue'
import { googlePolicyCheck } from '@/lib/apis'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useGA } from '@/composables/useGA'
import { useSound } from '@/composables/useSound'
const { addGA } = useGA()
const { playSounds } = useSound()
const store = useStore()
const { fixTransify } = store
const { updateConsentGA } = useGA()
const { state } = storeToRefs(store)
function getChoice() {
  const storageChecked = state.value.euPolicyPopup.storageChecked
  const adChecked = state.value.euPolicyPopup.adChecked
  if (storageChecked && adChecked) {
    return setChoice(1, 1, 1, 1)
  } else if (!storageChecked && !adChecked) {
    return setChoice(0, 0, 0, 0)
  } else if (!storageChecked && adChecked) {
    return setChoice(1, 0, 1, 1)
  } else if (storageChecked && !adChecked) {
    return setChoice(0, 1, 0, 0)
  }
  return setChoice(0, 0, 0, 0)
}
function setChoice(value1: number, value2: number, value3: number, value4: number) {
  return {
    ad_storage: value1,
    analytics_storage: value2,
    ad_user_data: value3,
    ad_personalization: value4
  }
}
async function handleEuPolicyConfirm(type = 'all') {
  playSounds('click')
  const choice = type === 'all' ? setChoice(1, 1, 1, 1) : getChoice()
  await googlePolicyCheck({ ...choice })
  updateConsentGA(choice)
  state.value.euPolicyPopup.show = false
  addGA('eu_policy_confirm', true)
}
async function handleEuPolicyCancel() {
  playSounds('click')
  const choice = setChoice(0, 0, 0, 0)
  await googlePolicyCheck({ ...choice })
  updateConsentGA(choice)
  state.value.euPolicyPopup.show = false
  addGA('eu_policy_reject', false)
}
</script>

<style lang="scss" scoped>
.gfr-policy-more {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 32px;
  text-transform: uppercase;
  border-radius: 4px;
  padding-bottom: 2px;
  color: #002757;
  background-image: linear-gradient(to bottom, #008dc1, #007297);
}
.gfr-policy-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 0;
}
.gfr-policy-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  label {
    flex: 1;
    cursor: pointer;
    line-height: 1.5;
    user-select: none;
  }
}
.gfr-policy-checkbox-input {
  position: relative;
  appearance: none;
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 8px;
  border: 1px solid #cbbfa2;
  border-radius: 50%;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  &::after {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-image: linear-gradient(to bottom, #e5d48f, #9e6722);
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  &:checked {
    &::after {
      opacity: 1;
    }
  }
}
</style>
