<!--
  Flexible Component

  Function Description:
  This component is used to implement responsive container layout, adapting to different screen sizes and orientations (landscape/portrait),
  by dynamically setting the root element's font-size and container width/height to achieve rem-based adaptive scaling.
  The component receives width and height as design draft dimensions (default 1334x750),
  and converts them to CSS variables to drive global layout and font scaling.

  Design Philosophy:
  - By setting html's font-size, achieve global scaling of rem units, making it easy for page elements to scale proportionally according to the design draft.
  - By monitoring screen orientation, handle layout and rotation for landscape and portrait separately, ensuring content is always centered at design draft proportions.
  - The component internally uses CSS variables to flexibly control container max width/height, facilitating content adaptation.
  - Suitable for scenarios requiring high-fidelity design draft restoration and multi-terminal compatibility, especially for mobile H5, mini-games, and other projects.
-->

<template>
  <div
    class="gfr-flexible"
    :style="{
      '--container-width': Number(width) / 16 + 'rem',
      '--container-height': Number(height) / 16 + 'rem'
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
defineOptions({
  name: 'GfrFlexible'
})
/**
 * Props
 * @param width  Design draft width, unit px, default 1334
 * @param height Design draft height, unit px, default 750
 */
interface Props {
  width?: number | string
  height?: number | string
}

// Parse props, set default values
const { width = 1334, height = 750 } = defineProps<Props>()

// Set global CSS variables on mount for layout and font scaling
onMounted(() => {
  if (Number(width) > Number(height)) {
    document.documentElement.classList.add('flexible-landscape')
  } else {
    document.documentElement.classList.add('flexible-portrait')
  }
  document.documentElement.style.setProperty('--flexible-width', width.toString())
  document.documentElement.style.setProperty('--flexible-height', height.toString())
})
</script>

<style lang="scss">
/*
  Global layout styles
  - body fixed positioning to prevent scrolling, all elements depend on body
  - Set html's font-size separately for landscape/portrait to achieve rem scaling
  - Normal display in landscape, rotate 90 degrees in portrait to match design draft
*/
body {
  overflow: auto;
  position: fixed;
  top: 0;
  left: 0;
}
@media (orientation: portrait) {
  html.flexible-landscape {
    font-size: calc(100vw / var(--flexible-height) * 16);
    body {
      width: 100vh;
      height: 100vw;
      transform-origin: left top;
      transform: rotate(90deg) translate(0, -100%);
    }
  }
  html.flexible-portrait {
    font-size: calc(100vw / var(--flexible-width) * 16);
    body {
      width: 100vw;
      height: 100vh;
    }
  }
  @media (min-aspect-ratio: 9 / 16) {
    html.flexible-landscape {
      font-size: calc(100vh / var(--flexible-width) * 16);
    }
    html.flexible-portrait {
      font-size: calc(100vh / var(--flexible-height) * 16);
    }
  }
}
@media (orientation: landscape) {
  html.flexible-landscape {
    font-size: calc(100vh / var(--flexible-height) * 16);
    body {
      width: 100vw;
      height: 100vh;
    }
  }
  html.flexible-portrait {
    font-size: calc(100vh / var(--flexible-width) * 16);
    body {
      width: 100vh;
      height: 100vw;
      transform-origin: left top;
      transform: rotate(90deg) translate(0, -100%);
    }
  }
  @media (max-aspect-ratio: 16 / 9) {
    html.flexible-landscape {
      font-size: calc(100vw / var(--flexible-width) * 16);
    }
    html.flexible-portrait {
      font-size: calc(100vw / var(--flexible-height) * 16);
    }
  }
}
</style>

<style lang="scss" scoped>
/*
  Flexible component internal styles
  - gfr-flexible: outer container, center aligned
*/
.gfr-flexible {
  width: 100%;
  height: 100%;
}
</style>
