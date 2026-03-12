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
defineOptions({
  name: 'GfrButton'
})
interface ButtonProps {
  className?: string
  disabled?: boolean
  anime?: 'none' | 'bounce' | 'fall'
}
const props = defineProps<ButtonProps>()
const emit = defineEmits(['click'])

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
