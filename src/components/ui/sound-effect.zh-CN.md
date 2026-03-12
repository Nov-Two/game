# GfrSoundEffect（全局音效开关）

## 概述
GfrSoundEffect 是一个基于 Howler 的音效控制按钮组件。它负责：
- 初始化传入的音效资源并暴露给业务侧
- 控制全局静音/音量
- 按需将开关状态持久化到 localStorage
- 在页面隐藏/显示时自动静音与恢复

## 属性（Props）
- `persistent?: boolean`（默认 `true`）：是否将开关状态写入 `localStorage`。
- `rotate?: boolean`（默认 `true`）：是否为按钮添加旋转修饰类。
- `volume?: number`（默认 `0.5`）：全局音量（`Howler.volume`），参与初始开关判定。
- `storageKey?: string`（默认 `'sound-effect'`）：本地存储键名，建议加项目名前缀避免冲突，如 `fe-entry-task_sounds_status`。
- `sounds?: { tag: string; path: { mpeg: string }; loop?: boolean }[]`（默认 `[]`）：要初始化的音效列表，`tag` 用作业务侧调用标识。

## 事件（Emits）
- `status-change(status: boolean)`：点击切换后触发，表示当前是否开启音效（未静音）。
- `after-init(howlMap: Record<string, Howl>)`：初始化完成后触发，返回以 `tag` 为键的 `Howl` 实例映射，便于业务侧立刻播放 `bgm` 等。
- `before-init`：已声明但当前组件未触发（预留）。

## 插槽（Slots）
- 默认插槽：按钮内部内容（图标/文案等）。未提供时可由外层 CSS 背景图控制外观。

## 行为说明
1. 初始化（挂载时）  
   - 调用 `Howler.unload()` 清理旧资源  
   - 为 `props.sounds` 中每个条目构建 `Howl` 实例  
   - 设置全局音量 `Howler.volume(props.volume)`  
   - 结合 `volume` 与 `localStorage` 判断初始 `status`，并执行 `Howler.mute(!status)`  
   - 触发 `after-init`，业务侧可拿到所有 `Howl` 实例
2. 音量监听  
   - 当 `props.volume` 变化时，同步更新 `Howler.volume`，重新计算 `status` 并设置静音状态
3. 页面可见性  
   - 监听页面 `visibilitychange`：隐藏时强制静音，显示时依当前 `status` 恢复
4. 点击切换  
   - 翻转 `status`、更新 `Howler.mute`、按需写入 `localStorage`，并触发 `status-change`

## 使用示例
```vue
<template>
  <GfrSoundEffect
    :sounds="sounds"
    :volume="volume"
    storage-key="fe-entry-task_sounds_status"
    @after-init="onAfterInit"
    @status-change="onStatusChange"
  >
    <!-- 这里可以放图标或文字 -->
    🔊
  </GfrSoundEffect>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GfrSoundEffect from '@/components/ui/sound-effect.vue'

const volume = ref(0.5)
const sounds = [
  {
    tag: 'bgm',
    path: { mpeg: new URL('@/assets/audio/bgm.mp3', import.meta.url).href },
    loop: true
  },
  {
    tag: 'click',
    path: { mpeg: new URL('@/assets/audio/click.mp3', import.meta.url).href }
  }
]

const onAfterInit = (howls: Record<string, any>) => {
  // 初始化后即可根据业务需要播放
  howls.bgm?.play()
}
const onStatusChange = (enabled: boolean) => {
  // 上报或联动 UI
  console.log('sound enabled:', enabled)
}
</script>
```

## 最佳实践与注意事项
- 资源路径：建议通过 `new URL(..., import.meta.url).href` 引入音频，确保构建路径正确。
- 自动播放：移动端浏览器通常需要用户手势后才允许播放音频；建议在用户点击后再播放 `bgm`。
- 状态持久化：为避免多个项目冲突，`storageKey` 使用项目名前缀（如 `VITE_APP_PROJECT_NAME` + `_sounds_status`）。
- 可见性处理：组件在页面隐藏时会静音，返回可见时按 `status` 恢复，确保用户体验一致。
- 性能：初始化会 `Howler.unload()` 并重建实例，建议组件只在需要时挂载一次。
- 样式提示：若需要按钮在开启时旋转，请确保样式选择器与模板类名一致（`gfr-sound-effect--rotate`）；避免把旋转规则嵌套到 `--active` 下导致类不匹配。