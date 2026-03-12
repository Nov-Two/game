<template>
  <GfrFlexible>
    <GfrModule center :class="`app-${Modules[currentModule].toLowerCase()}-module`">
      <GfrContainer flexible class="app-container" :class="{ 'app-container--home': currentModule === Modules.Home }">
        <AppHeader>
          <transition name="gfr-heading-fade" mode="out-in">
            <GfrHeading v-if="currentHeading" :key="currentHeading" class="app-header-title">
              {{ currentHeading }}
            </GfrHeading>
          </transition>
        </AppHeader>
        <AppHomeModule v-if="currentModule === Modules.Home" />
      </GfrContainer>
    </GfrModule>
    <AppThPolicyDialog />
    <AppEuPolicyDialog />
  </GfrFlexible>
</template>
<script setup lang="ts">
import GfrFlexible from '@/components/ui/flexible.vue'
import GfrModule from '@/components/ui/module.vue'
import GfrContainer from '@/components/ui/container.vue'
import AppHomeModule from '@/components/module/home.vue'
// import AppLotteryModule from '@/components/module/lottery.vue'
import AppHeader from '@/components/app/header.vue'
import AppEuPolicyDialog from '@/components/app/eu-policy-dialog.vue'
import AppThPolicyDialog from '@/components/app/th-policy-dialog.vue'
import GfrHeading from '@/components/ui/heading.vue'

import { ref, computed, onBeforeMount } from 'vue'
import { useStore } from '@/stores'
// import { storeToRefs } from 'pinia'
const store = useStore()

const { initConfig, fixTransify } = store
// const { state } = storeToRefs(store)
// GA tracking page duration

defineOptions({
  name: 'App'
})

enum Modules {
  Home = 1,
  Lottery = 2
}

const currentModule = ref<Modules>(Modules.Home)

const headingTexts: Record<Modules, string> = {
  [Modules.Home]: '',
  [Modules.Lottery]: ''
}

const currentHeading = computed(() => fixTransify(headingTexts[currentModule.value]))

onBeforeMount(async () => {
  await initConfig()
})
</script>

<style lang="scss" scoped>
.app-home-module {
  background-image: url('/static/images/bg@1x.jpg');
  background-image: image-set(
    url('/static/images/bg@1x.jpg') 1x,
    url('/static/images/bg@2x.jpg') 2x,
    url('/static/images/bg@3x.jpg') 3x
  );
  // background-image: url('/static/images/share-have@1x.jpg');
  // background-image: image-set(
  //   url('/static/images/share-have@1x.jpg') 1x,
  //   url('/static/images/share-have@2x.jpg') 2x,
  //   url('/static/images/share-have@3x.jpg') 3x
  // );
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.app-container {
  padding: 0 20px 40px 30px;
  display: flex;
  flex-direction: column;
  &.app-container--home {
    padding: 0 68px 0px 20px;
  }
}
.app-header-title {
  position: absolute;
  top: 12%;
  left: 50%;
  transform: translateX(-50%);
  width: 740px;
  font-size: 40px;
  padding: 0 20px;
  line-height: 1;
  font-weight: var(--font-extra-bold);
  color: #fff;
  text-transform: uppercase;
  text-align: center;
  font-style: italic;
  /* letter-spacing: -4px; */
}
.app-main-footer {
  position: relative;
  z-index: 9;
}
.app-extra-module {
  margin-top: 32px;
}
.gfr-heading-fade-enter-active,
.gfr-heading-fade-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.gfr-heading-fade-enter-from {
  opacity: 0;
  transform: translate(-50%, -30%) scale(0.95);
}

.gfr-heading-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 30%) scale(0.95);
}
</style>
