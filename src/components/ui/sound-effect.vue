<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import GfrButton from '@/components/ui/button.vue'
import { Howl, Howler } from 'howler'
interface howlerSoundsType {
  [key: string]: Howl
}
interface SoundEffectProps {
  persistent?: boolean
  rotate?: boolean
  volume?: number
  storageKey?: string
  sounds?: {
    tag: string
    path: {
      mpeg: string
    }
    loop?: boolean
  }[]
}
defineOptions({
  name: 'GfrSoundEffect'
})
const props = withDefaults(defineProps<SoundEffectProps>(), {
  persistent: true,
  rotate: true,
  volume: 0.5,
  storageKey: 'sound-effect',
  sounds: () => []
})
const emit = defineEmits(['status-change', 'after-init', 'before-init'])
const status = ref<boolean>(false)
const howlerSounds = ref<howlerSoundsType>()
const toggleSound = () => {
  status.value = !status.value
  Howler.mute(!status.value)
  if (props.persistent) {
    localStorage.setItem(`${props.storageKey}`, status.value.toString())
  }
  emit('status-change', status.value)
}
function createHowlerSounds() {
  const HowlSounds: howlerSoundsType = {}
  for (const item of props.sounds) {
    const { mpeg } = item.path
    HowlSounds[item.tag] = new Howl({
      loop: item.loop || false,
      src: [mpeg]
    })
  }
  return HowlSounds
}
const setSoundStatus = (defaultStatus: boolean): boolean => {
  const storageStatus = localStorage.getItem(props.storageKey)
  const soundStatus = storageStatus ? (storageStatus === 'true' ? true : false) : undefined
  if (typeof soundStatus === 'undefined' || soundStatus) {
    return defaultStatus
  } else {
    return props.persistent ? (soundStatus as boolean) : defaultStatus
  }
}
const initSound = () => {
  Howler.unload()
  howlerSounds.value = createHowlerSounds()
  Howler.volume(props.volume)
  status.value = setSoundStatus(props.volume != 0)
  Howler.mute(!status.value)
  emit('after-init', howlerSounds.value)
}
const handleVisibilityChange = () => {
  Howler.mute(document.hidden || !status.value)
}
watch(
  () => props.volume,
  (newVal: number) => {
    Howler.volume(newVal)
    status.value = setSoundStatus(newVal != 0)
    Howler.mute(!status.value)
  },
  { immediate: false }
)
onMounted(() => {
  initSound()
  handleVisibilityChange()
  document.addEventListener('visibilitychange', handleVisibilityChange)
})
onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <GfrButton
    :class="['gfr-sound-effect', status && 'gfr-sound-effect--active', rotate && 'gfr-sound-effect--rotate']"
    @click="toggleSound"
  >
    <slot />
  </GfrButton>
</template>
<style lang="scss" scoped>
.gfr-sound-effect {
  background-color: transparent;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  width: 42px;
  height: 42px;
  padding: 0;
  &--active {
    &--rotate {
      animation: gfr-rotate 2s linear infinite;
    }
  }
}
</style>
