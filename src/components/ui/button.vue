<template>
  <button
    :class="[ButtonClass, anime && `gfr-anime-${anime}`, disabled && `gfr-button--disabled`]"
    @click="handleClick"
    :disabled="disabled"
    @animationend="handleAnimationEnd"
  >
    <slot />
  </button>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useSound } from '@/composables/useSound'

defineOptions({
  name: 'GfrButton'
})
interface ButtonProps {
  className?: string
  disabled?: boolean
  anime?: 'none' | 'bounce' | 'fall'
  /** 是否播放点击音效，默认 true；设为 false 时由父组件自行播放（如关闭/确认等专用音效） */
  sound?: boolean
}
const props = withDefaults(defineProps<ButtonProps>(), {
  sound: true
})
const emit = defineEmits(['click'])
const { playSounds } = useSound()

const currentAnime = ref<ButtonProps['anime'] | 'shake'>('none')
const ButtonClass = computed(() => {
  const { className, disabled } = props
  const prefix = 'gfr-button'
  const disabledClass = disabled ? `${prefix}--disabled` : ''
  return [prefix, disabledClass, className].filter(Boolean).join(' ')
})
const handleClick = () => {
  triggerAnimate()
  if (!props.disabled) {
    if (props.sound) playSounds('click')
    emit('click')
  }
}
const triggerAnimate = () => {
  if (props.anime !== 'none') {
    currentAnime.value = props.disabled ? 'shake' : props.anime
  }
}
const handleAnimationEnd = () => {
  currentAnime.value = 'none'
}
</script>
<style lang="scss" scoped>
.gfr-button {
  background-color: inherit;
  color: inherit;
  border-radius: var(--radius);
  padding: 4px 8px;
  border: none;
  cursor: pointer;
  // &:disabled,
  // &--disabled {
  //   opacity: 0.5;
  // }
}
</style>
