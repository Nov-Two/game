<template>
  <component
    :is="`h${level}`"
    ref="headingRef"
    :class="[
      'gfr-heading',
      `gfr-heading-${type}`,
      {
        'gfr-heading-stroke': isStrokeEnabled
      },
      `gfr-heading-${level}`
    ]"
    :data-text="headingText"
    :style="headingStyles"
  >
    <slot />
  </component>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'

type HeadingType = 'normal' | 'gradient' | 'image'

interface GradientOptions {
  color?: string
}

interface ImageOptions {
  url: string
  size?: string
  position?: string
}

interface StrokeOptions {
  color?: string
  width?: number
}

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  type?: HeadingType
  gradient?: GradientOptions
  image?: ImageOptions
  stroke?: boolean | StrokeOptions
}
defineOptions({
  name: 'GfrHeading'
})
const props = withDefaults(defineProps<HeadingProps>(), {
  level: 1,
  type: 'normal',
  stroke: false
})

const headingStyles = computed(() => {
  const styles: Record<string, string> = {}

  // Handle stroke
  if (props.stroke) {
    const strokeOptions = typeof props.stroke === 'object' ? props.stroke : {}
    styles['--storke-color'] = strokeOptions.color || '#000'
    styles['--storke-width'] = `${(strokeOptions.width || 4) / 16}rem`
  }

  // Handle gradient
  if (props.type === 'gradient' && props.gradient) {
    styles['--gradient-color'] = props.gradient.color || 'linear-gradient(to bottom, #fff, #fff)'
  }

  // Handle image
  if (props.type === 'image' && props.image) {
    styles['--background-image'] = `url(${props.image.url})`
    styles['--background-size'] = props.image.size || 'cover'
    styles['--background-position'] = props.image.position || 'center'
  }

  return styles
})

const isStrokeEnabled = computed(() => {
  return typeof props.stroke === 'boolean' ? props.stroke : !!props.stroke
})

const headingRef = ref<HTMLElement>()
const headingText = computed(() => {
  return headingRef.value?.textContent
})
</script>
<style lang="scss" scoped>
.gfr-heading {
  position: relative;

  // Gradient type: gradient color text fill
  &-gradient {
    &::before {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;

      background: var(--gradient-color);
      background-size: 100% 100%;

      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  // Image type: background image clipped text fill
  &-image {
    background-image: var(--background-image);
    background-size: var(--background-size);
    background-position: var(--background-position);
    background-repeat: no-repeat;

    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  // Stroke effect: can be combined with any type
  &-stroke {
    &::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      color: transparent;
      -webkit-text-stroke: var(--storke-width) var(--storke-color);
    }
  }
}
</style>
