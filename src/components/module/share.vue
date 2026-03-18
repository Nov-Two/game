<template>
  <AppSharePanel
    :display-name="displayName"
    :matches-played="matchesPlayed"
    :tip-before="tipBefore"
    :tip-after="tipAfter"
    :current-value="currentValue"
    :milestones="milestones"
    :share-disabled="shareDisabled"
    :is-refreshing="isRefreshing"
    :share-text="shareText"
    :refresh-text="refreshText"
    @close="handleClose"
    @refresh="handleRefresh"
    @share="handleShare"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from '@/stores'
import { useGame } from '@/composables/useGame'
import { useSound } from '@/composables/useSound'
import { history } from '@/lib/apis'
import AppSharePanel from '@/components/ui/share-panel.vue'
import type { MilestoneItem } from '@/composables/useMilestoneProgress'

defineOptions({
  name: 'AppShareModule'
})

const emit = defineEmits<{
  close: []
}>()

const store = useStore()
const { playSounds } = useSound()
const { fixTransify } = store

const { isInGame, runScreenShot } = useGame()

const currentValue = ref(12000)
const milestones = ref<Array<MilestoneItem & { name: string }>>([
  { value: 2000, isLingQu: true, quantity: 10, imageUrl: '/static/images/prize@2x.png', name: 'Reward 1' },
  { value: 3000, isLingQu: false, quantity: 10, imageUrl: '/static/images/prize2@2x.png', name: 'Reward 2' },
  { value: 6000, isLingQu: false, quantity: 10, imageUrl: '/static/images/prize3@2x.png', name: 'Reward 3' },
  { value: 10_000, isLingQu: false, quantity: 10, imageUrl: '/static/images/prize2@2x.png', name: 'Reward 4' }
])

const matchesPlayed = ref(100)
const isRefreshing = ref(false)

function initShareDataFromPlayer() {
  const playerUnknown: unknown = store.state.player
  if (playerUnknown && typeof playerUnknown === 'object') {
    const player = playerUnknown as Record<string, unknown>
    const ranking = player['ranking']
    if (typeof ranking === 'number' && Number.isFinite(ranking)) store.setSharePageRank(ranking)
    const matches = player['matches_played']
    if (typeof matches === 'number' && Number.isFinite(matches)) matchesPlayed.value = matches
  }
}
initShareDataFromPlayer()

const displayName = computed(() => {
  const playerUnknown: unknown = store.state.player
  if (playerUnknown && typeof playerUnknown === 'object') {
    const player = playerUnknown as Record<string, unknown>
    const nickname = player['nickname']
    if (typeof nickname === 'string' && nickname.trim()) return nickname
    const uid = player['uid']
    if (typeof uid === 'number') return `UID ${uid}`
    if (typeof uid === 'string' && uid.trim()) return `UID ${uid}`
  }
  return 'Nickname'
})

const shareDisabled = computed(() => !isInGame.value)
const tipBefore = computed(() => fixTransify('have played'))
const tipAfter = computed(() => fixTransify('matches with friends! Ranked in region.'))
const shareText = computed(() => fixTransify('SHARE'))
const refreshText = computed(() => fixTransify('REFRESH'))

function handleClose() {
  playSounds('close')
  emit('close')
}

async function handleRefresh() {
  if (isRefreshing.value) return
  playSounds('click')
  isRefreshing.value = true
  try {
    const res = await history()
    const payload: unknown = res?.data
    if (payload && typeof payload === 'object') {
      const data = payload as Record<string, unknown>
      const maybeMatches = data['matches_played']
      const maybeRank = data['rank']
      if (typeof maybeMatches === 'number' && Number.isFinite(maybeMatches)) matchesPlayed.value = maybeMatches
      if (typeof maybeRank === 'number' && Number.isFinite(maybeRank)) store.setSharePageRank(maybeRank)
    }
  } finally {
    isRefreshing.value = false
  }
}

async function handleShare() {
  if (!isInGame.value) return
  playSounds('screenshoot')
  await runScreenShot()
}

onMounted(() => {
  void handleRefresh()
})

onUnmounted(() => {
  store.setSharePageRank(null)
})
</script>
