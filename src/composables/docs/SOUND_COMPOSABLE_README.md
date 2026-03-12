# useSound Composable

音效管理的组合式函数，提供统一的音效管理接口。

## 概述

`useSound` 是一个全局单例的 Composable，用于管理应用中的所有音效。基于 Howler.js 封装，提供了创建、播放、暂停、停止等音效管理功能。

## 特性

- ✅ **全局单例** - 确保整个应用共享同一个音效实例
- ✅ **类型安全** - 完整的 TypeScript 类型支持
- ✅ **简单易用** - 提供直观的 API 接口
- ✅ **功能丰富** - 支持音量控制、静音、销毁等高级功能
- ✅ **错误提示** - 当音效不存在时提供警告信息

## 安装依赖

项目已包含 Howler.js 依赖：

```json
{
  "dependencies": {
    "howler": "^2.2.4"
  }
}
```

## 基础用法

### 1. 创建音效实例

在应用初始化时创建音效实例（通常在 App.vue 或根组件中）：

```typescript
import { useSound } from '@/composables/useSound'
import { Howl } from 'howler'

const { createSounds, playSounds } = useSound()

// 创建音效映射
createSounds({
  bgm: new Howl({
    src: ['bgm.mp3'],
    loop: true,
    volume: 0.5
  }),
  click: new Howl({
    src: ['click.mp3'],
    volume: 1.0
  }),
  toast: new Howl({
    src: ['toast.mp3']
  })
})

// 播放背景音乐
playSounds('bgm')
```

### 2. 在组件中使用

```vue
<script setup lang="ts">
import { useSound } from '@/composables/useSound'

const { playSounds, pauseSounds, stopSounds } = useSound()

function handleClick() {
  playSounds('click')
}

function handlePauseBGM() {
  pauseSounds('bgm')
}

function handleStopBGM() {
  stopSounds('bgm')
}
</script>

<template>
  <button @click="handleClick">点击</button>
  <button @click="handlePauseBGM">暂停音乐</button>
  <button @click="handleStopBGM">停止音乐</button>
</template>
```

## API 参考

### createSounds(soundsMap)

创建音效实例映射。

**参数:**
- `soundsMap: Sounds` - 音效映射对象，key 为音效名称，value 为 Howl 实例

**示例:**

```typescript
import { Howl } from 'howler'
import { useSound } from '@/composables/useSound'

const { createSounds } = useSound()

createSounds({
  bgm: new Howl({ src: ['bgm.mp3'], loop: true }),
  click: new Howl({ src: ['click.mp3'] })
})
```

### playSounds(key)

播放指定的音效。

**参数:**
- `key: string` - 音效名称

**返回值:**
- `boolean` - 是否成功播放

**示例:**

```typescript
const { playSounds } = useSound()

playSounds('click') // true - 成功播放
playSounds('not-exist') // false - 音效不存在
```

### pauseSounds(key)

暂停指定的音效。

**参数:**
- `key: string` - 音效名称

**返回值:**
- `boolean` - 是否成功暂停

**示例:**

```typescript
const { pauseSounds } = useSound()

pauseSounds('bgm') // 暂停背景音乐
```

### stopSounds(key)

停止指定的音效（会重置播放位置）。

**参数:**
- `key: string` - 音效名称

**返回值:**
- `boolean` - 是否成功停止

**示例:**

```typescript
const { stopSounds } = useSound()

stopSounds('bgm') // 停止并重置背景音乐
```

### getSound(key)

获取指定的音效实例。

**参数:**
- `key: string` - 音效名称

**返回值:**
- `Howl | undefined` - Howl 实例或 undefined

**示例:**

```typescript
const { getSound } = useSound()

const bgm = getSound('bgm')
if (bgm) {
  console.log(bgm.playing()) // 检查是否正在播放
}
```

### getSounds()

获取所有音效实例。

**返回值:**
- `Sounds` - 所有音效实例的映射对象

**示例:**

```typescript
const { getSounds } = useSound()

const sounds = getSounds()
console.log(Object.keys(sounds)) // ['bgm', 'click', 'toast']
```

### hasSound(key)

检查音效是否存在。

**参数:**
- `key: string` - 音效名称

**返回值:**
- `boolean` - 是否存在

**示例:**

```typescript
const { hasSound } = useSound()

if (hasSound('bgm')) {
  console.log('BGM 音效存在')
}
```

### setVolume(key, volume)

设置指定音效的音量。

**参数:**
- `key: string` - 音效名称
- `volume: number` - 音量 (0-1)

**示例:**

```typescript
const { setVolume } = useSound()

setVolume('bgm', 0.5) // 设置为 50% 音量
setVolume('click', 1.0) // 设置为 100% 音量
```

### muteSounds(key, muted)

静音/取消静音指定音效。

**参数:**
- `key: string` - 音效名称
- `muted: boolean` - 是否静音

**示例:**

```typescript
const { muteSounds } = useSound()

muteSounds('bgm', true) // 静音
muteSounds('bgm', false) // 取消静音
```

### muteAllSounds(muted)

静音/取消静音所有音效。

**参数:**
- `muted: boolean` - 是否静音

**示例:**

```typescript
const { muteAllSounds } = useSound()

muteAllSounds(true) // 静音所有音效
muteAllSounds(false) // 取消静音所有音效
```

### unloadSounds(key)

销毁指定的音效。

**参数:**
- `key: string` - 音效名称

**示例:**

```typescript
const { unloadSounds } = useSound()

unloadSounds('bgm') // 销毁并释放 BGM 音效资源
```

### unloadAllSounds()

销毁所有音效。

**示例:**

```typescript
const { unloadAllSounds } = useSound()

unloadAllSounds() // 销毁所有音效资源
```

## 完整示例

### 在 App.vue 中初始化

```vue
<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount } from 'vue'
import { useSound } from '@/composables/useSound'
import { Howl } from 'howler'

const { createSounds, playSounds, unloadAllSounds } = useSound()

onBeforeMount(() => {
  // 创建音效实例
  createSounds({
    bgm: new Howl({
      src: ['/audio/bgm.mp3'],
      loop: true,
      volume: 0.5
    }),
    click: new Howl({
      src: ['/audio/click.mp3'],
      volume: 1.0
    }),
    popup: new Howl({
      src: ['/audio/popup.mp3'],
      volume: 0.8
    }),
    toast: new Howl({
      src: ['/audio/toast.mp3'],
      volume: 0.8
    })
  })

  // 播放背景音乐
  playSounds('bgm')
})

onBeforeUnmount(() => {
  // 组件卸载时清理资源
  unloadAllSounds()
})
</script>
```

### 在按钮组件中使用

```vue
<script setup lang="ts">
import { useSound } from '@/composables/useSound'

const { playSounds } = useSound()

function handleClick() {
  playSounds('click')
  // 执行点击逻辑
}
</script>

<template>
  <button @click="handleClick">
    点击按钮
  </button>
</template>
```

### Toast 组件集成

```typescript
import { useSound } from '@/composables/useSound'

const { playSounds } = useSound()

Toast.setDefaultOptions({
  onOpen: () => {
    playSounds('toast')
  }
})
```

### 音效控制组件

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useSound } from '@/composables/useSound'

const { muteAllSounds } = useSound()
const isMuted = ref(false)

function toggleMute() {
  isMuted.value = !isMuted.value
  muteAllSounds(isMuted.value)
}
</script>

<template>
  <button @click="toggleMute">
    {{ isMuted ? '🔇' : '🔊' }}
  </button>
</template>
```

## 与项目音效配置集成

项目中的音效配置文件位于 `src/lib/sounds.ts`：

```typescript
// src/lib/sounds.ts
export default [
  {
    tag: 'bgm',
    loop: true,
    path: {
      mpeg: formatSoundUrl('BGM_OB51_WL51_Lobby.mp3')
    }
  },
  {
    tag: 'click',
    path: {
      mpeg: commonSoundUrl('FF_SFX_WebEvent_UI_Click.mp3')
    }
  }
  // ... 更多音效配置
]
```

在 `GfrSoundEffect` 组件中会自动加载这些配置并调用 `createSounds`。

## 注意事项

### 1. 浏览器自动播放限制

现代浏览器通常会阻止自动播放音频，需要在用户交互后才能播放：

```typescript
// ❌ 错误：页面加载时直接播放可能被阻止
playSounds('bgm')

// ✅ 正确：在用户交互后播放
button.addEventListener('click', () => {
  playSounds('bgm')
})
```

### 2. 音效预加载

建议在应用初始化时预加载所有音效，避免播放时的延迟：

```typescript
createSounds({
  bgm: new Howl({
    src: ['bgm.mp3'],
    preload: true // 预加载
  })
})
```

### 3. 资源清理

在组件卸载或页面关闭时，记得清理音效资源：

```typescript
import { onBeforeUnmount } from 'vue'
import { useSound } from '@/composables/useSound'

const { unloadAllSounds } = useSound()

onBeforeUnmount(() => {
  unloadAllSounds()
})
```

### 4. 音效路径

- 开发环境：使用 `/static/audio/` 路径
- 生产环境：使用 CDN 路径

项目中已在 `src/lib/sounds.ts` 中处理了路径的自动切换。

## 最佳实践

### 1. 统一音效管理

在应用根组件中统一初始化所有音效：

```typescript
// App.vue
import soundsConfig from '@/lib/sounds'
import { Howl } from 'howler'
import { useSound } from '@/composables/useSound'

const { createSounds, playSounds } = useSound()

const sounds = soundsConfig.reduce((acc, config) => {
  acc[config.tag] = new Howl({
    src: [config.path.mpeg],
    loop: config.loop || false
  })
  return acc
}, {})

createSounds(sounds)
playSounds('bgm') // 播放背景音乐
```

### 2. 音效命名规范

使用语义化的音效名称：

```typescript
createSounds({
  bgm: ...,           // 背景音乐
  click: ...,         // 点击音效
  popup: ...,         // 弹窗音效
  close: ...,         // 关闭音效
  confirm: ...,       // 确认音效
  toast: ...,         // 提示音效
  success: ...,       // 成功音效
  error: ...          // 错误音效
})
```

### 3. 组件解耦

不要在组件中硬编码音效逻辑，通过 props 传递：

```vue
<script setup lang="ts">
import { useSound } from '@/composables/useSound'

interface Props {
  soundKey?: string // 可选的音效名称
}

const props = defineProps<Props>()
const { playSounds } = useSound()

function handleClick() {
  if (props.soundKey) {
    playSounds(props.soundKey)
  }
  // 执行其他逻辑
}
</script>
```

### 4. 条件播放

根据用户设置或游戏状态决定是否播放音效：

```typescript
import { useSound } from '@/composables/useSound'
import { useStore } from '@/stores'

const { playSounds } = useSound()
const store = useStore()

function playConditional(key: string) {
  // 检查用户是否开启了音效
  if (store.state.soundEnabled) {
    playSounds(key)
  }
}
```

## 迁移指南

### 从 Store 迁移

**旧代码（使用 Store）:**

```typescript
import { useStore } from '@/stores'

const store = useStore()
const { playSounds, pauseSounds, stopSounds, createSounds } = store

createSounds(sounds)
playSounds('bgm')
pauseSounds('bgm')
stopSounds('bgm')
```

**新代码（使用 Composable）:**

```typescript
import { useSound } from '@/composables/useSound'

const { createSounds, playSounds, pauseSounds, stopSounds } = useSound()

createSounds(sounds)
playSounds('bgm')
pauseSounds('bgm')
stopSounds('bgm')
```

## 故障排查

### 音效不播放

1. 检查音效是否已创建：`hasSound('bgm')`
2. 检查浏览器控制台是否有错误
3. 确认音频文件路径正确
4. 检查浏览器是否阻止了自动播放

### 音效卡顿

1. 启用音效预加载：`preload: true`
2. 使用合适的音频格式（推荐 mp3）
3. 减小音频文件大小

### 内存泄漏

1. 确保在组件卸载时调用 `unloadAllSounds()`
2. 避免重复创建音效实例

## 相关资源

- [Howler.js 官方文档](https://howlerjs.com/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [浏览器自动播放策略](https://developer.chrome.com/blog/autoplay/)
