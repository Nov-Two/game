# Vue3 游戏组合式函数重构说明

## 概述

原始的 `useGame.ts` 文件已经成功重构为符合 Vue3 组合式 API 规范的组合式函数。重构后的代码提供了更好的类型安全、响应式状态管理和错误处理。

## 主要改进

### 1. Vue3 组合式 API 集成

- 使用 `ref` 和 `computed` 提供响应式状态
- 使用 `onUnmounted` 进行生命周期管理
- 符合 Vue3 组合式函数的最佳实践

### 2. TypeScript 类型安全

- 添加了完整的类型定义
- 扩展了 Window 接口以支持游戏相关属性
- 提供了清晰的接口定义

### 3. 响应式状态管理

```typescript
const gameState = ref<GameState>({
  isInGame: false,
  isLoading: false,
  error: null
})
```

### 4. 改进的错误处理

- 统一的错误状态管理
- 异步操作的错误捕获
- 更好的错误信息提示

### 5. 生命周期管理

- 自动清理未完成的 promises
- 防止内存泄漏

## API 参考

### 状态属性

- `isInGame`: 是否在游戏环境中
- `isLoading`: 是否正在加载
- `error`: 错误信息

### 方法

- `checkInGame()`: 检查是否在游戏环境中
- `gamePromise(key, value)`: 发送游戏Promise
- `deepLink(url, callback?)`: 处理深度链接
- `checkScreenShotOpen()`: 检查截图权限
- `runScreenShot()`: 执行截图
- `downloadImage(options)`: 下载图片
- `getBrowserInfo()`: 获取浏览器信息

## 使用示例

```vue
<template>
  <div>
    <p>游戏状态: {{ isInGame ? '在游戏中' : '不在游戏中' }}</p>
    <button @click="handleScreenshot" :disabled="!isInGame">截图</button>
  </div>
</template>

<script setup lang="ts">
import { useGame } from '@/composables/useGame'

const { isInGame, isLoading, error, runScreenShot } = useGame()

const handleScreenshot = async () => {
  try {
    await runScreenShot()
    console.log('截图成功')
  } catch (err) {
    console.error('截图失败:', err)
  }
}
</script>
```

## 迁移指南

### 从旧版本迁移

**旧版本:**

```javascript
import { game } from '@/composables/useGame'

// 检查游戏状态
if (game.inGame()) {
  // 执行游戏操作
}

// 发送Promise
game.run('TestKey', 'TestValue')
```

**新版本:**

```typescript
import { useGame } from '@/composables/useGame'

const { isInGame, gamePromise } = useGame()

// 检查游戏状态
if (isInGame.value) {
  // 执行游戏操作
}

// 发送Promise
await gamePromise('TestKey', 'TestValue')
```

## 主要变化

1. **函数式到组合式**: 从导出独立函数改为导出组合式函数
2. **响应式状态**: 添加了响应式状态管理
3. **异步处理**: 改进了异步操作的错误处理
4. **类型安全**: 添加了完整的TypeScript支持
5. **生命周期**: 添加了自动清理机制

## 注意事项

1. 确保在Vue组件中使用 `useGame()` 函数
2. 响应式状态需要使用 `.value` 访问
3. 异步操作现在返回Promise，需要使用 `await` 或 `.then()`
4. 错误处理通过响应式状态和异常抛出两种方式

## 测试

使用提供的 `GameExample.vue` 组件可以测试所有功能：

```vue
<template>
  <GameExample />
</template>

<script setup lang="ts">
import GameExample from '@/components/GameExample.vue'
</script>
```

这个重构版本保持了原有功能的完整性，同时提供了更好的开发体验和类型安全。
