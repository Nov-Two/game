<template>
  <AppSharePanel
    :display-name="displayName"
    :matches-played="matchesPlayed"
    :tip-before="tipBefore"
    :tip-after="tipAfter"
    :rank-text="rankText"
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
import { computed, onMounted, ref } from 'vue'
import { useStore } from '@/stores'
import { useGame } from '@/composables/useGame'
import { history } from '@/lib/apis'
import AppSharePanel from '@/components/module/share-panel.vue'

defineOptions({
  name: 'AppShareModule'
})

const emit = defineEmits<{
  close: []
}>()

const store = useStore()
const { fixTransify } = store

const { isInGame, runScreenShot } = useGame()

const currentValue = ref(12000)
const milestones = ref<Array<{ value: number; isLingQu?: boolean }>>([
  { value: 200000, isLingQu: true },
  { value: 300000, isLingQu: true },
  { value: 600000, isLingQu: false },
  { value: 10_000_000, isLingQu: false }
])

const matchesPlayed = ref(100)
const rank = ref<number | null>(900)
const isRefreshing = ref(false)

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

const rankText = computed(() => (rank.value == null ? '--' : `${rank.value}th`))
const shareDisabled = computed(() => !isInGame.value)
const tipBefore = computed(() => fixTransify('have played'))
const tipAfter = computed(() => fixTransify('matches with friends! Ranked in region.'))
const shareText = computed(() => fixTransify('SHARE'))
const refreshText = computed(() => fixTransify('REFRESH'))

function handleClose() {
  emit('close')
}

async function handleRefresh() {
  if (isRefreshing.value) return
  isRefreshing.value = true
  try {
    const res = await history()
    const payload: unknown = res?.data
    if (payload && typeof payload === 'object') {
      const data = payload as Record<string, unknown>
      const maybeMatches = data['matches_played']
      const maybeRank = data['rank']
      if (typeof maybeMatches === 'number' && Number.isFinite(maybeMatches)) matchesPlayed.value = maybeMatches
      if (typeof maybeRank === 'number' && Number.isFinite(maybeRank)) rank.value = maybeRank
    }
  } finally {
    isRefreshing.value = false
  }
}

async function handleShare() {
  if (!isInGame.value) return
  await runScreenShot()
}

onMounted(() => {
  void handleRefresh()
})
</script>
