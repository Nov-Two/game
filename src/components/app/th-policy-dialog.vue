<!-- TODO: Update to gfr-vue -->
<template>
  <AppPolicyDialog
    v-model:visible="state.policyPopup.show"
    :title="state.policyPopup.title"
    :content="state.policyPopup.content"
    :disable-trigger="true"
    :confirm-text="state.policyPopup.confirmText"
    :cancel-text="state.policyPopup.cancelText"
    @confirm="handlePolicyConfirm"
    @cancel="handlePolicyCancel"
    @closed="state.policyPopup.show = false"
    :dir="state.lang === 'ar' ? 'rtl' : 'ltr'"
  />
</template>

<script setup lang="ts">
import AppPolicyDialog from '@/components/ui/policy-dialog.vue'
import { policyCheck } from '@/lib/apis'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useGA } from '@/composables/useGA'
const { addGA } = useGA()
const store = useStore()
const { state } = storeToRefs(store)
async function handlePolicyConfirm() {
  await policyCheck({ action: 1 })
  state.value.policyPopup.show = false
  addGA('th_policy_confirm', true)
}
async function handlePolicyCancel() {
  await policyCheck({ action: 0 })
  state.value.policyPopup.show = false
  addGA('th_policy_cancel', false)
}
</script>
