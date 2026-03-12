# Vue3 Google Analytics 组合式函数重构说明

## 概述

原始的 `useGA.ts` 文件已经成功重构为符合 Vue3 组合式 API 规范的组合式函数。重构后的代码提供了更好的类型安全、响应式状态管理和错误处理。

## 主要改进

### 1. Vue3 组合式 API 集成

- 使用 `ref` 和 `computed` 提供响应式状态
- 使用 `onMounted` 和 `onUnmounted` 进行生命周期管理
- 符合 Vue3 组合式函数的最佳实践

### 2. TypeScript 类型安全

- 添加了完整的类型定义
- 提供了清晰的接口定义
- 改进了类型检查和智能提示

### 3. 响应式状态管理

```typescript
const gaState = ref<GAState>({
  isInitialized: false,
  isConsentSet: false,
  currentUserId: null,
  currentRegion: null,
  error: null
})
```

### 4. 改进的错误处理

- 统一的错误状态管理
- 详细的错误信息
- 更好的错误追踪

### 5. 新增功能

- 页面浏览追踪
- 自定义事件追踪
- 用户属性设置
- GA状态检查
- 状态重置功能

## API 参考

### 状态属性

- `isInitialized`: 是否已初始化
- `isConsentSet`: 是否已设置同意状态
- `currentUserId`: 当前用户ID
- `currentRegion`: 当前地区
- `error`: 错误信息

### 方法

- `initGA(region, uid, dataLogName)`: 初始化GA
- `updateConsentGA(euPolicyChoice)`: 更新同意状态
- `defaultConsentGA()`: 设置默认同意状态
- `addGA(event, status, additionalData)`: 添加GA事件
- `errorGA(err, fatal)`: 错误追踪
- `trackPageView(pagePath, pageTitle)`: 页面浏览追踪
- `trackCustomEvent(eventName, parameters)`: 自定义事件追踪
- `setUserProperties(properties)`: 设置用户属性
- `resetGA()`: 重置GA状态
- `checkGAStatus()`: 检查GA状态

## 使用示例

### 基本使用

```vue
<template>
  <div>
    <p>GA状态: {{ isInitialized ? '已初始化' : '未初始化' }}</p>
    <button @click="handleInitGA">初始化GA</button>
    <button @click="handleTrackEvent">追踪事件</button>
  </div>
</template>

<script setup lang="ts">
import { useGA } from '@/composables/useGA'

const { isInitialized, error, initGA, addGA, trackPageView } = useGA()

const handleInitGA = () => {
  initGA('US', 12345, 'Home Page')
}

const handleTrackEvent = () => {
  addGA('button_click', 'success', {
    custom_parameter: 'example'
  })
}
</script>
```

### 高级使用

```typescript
// 在组合式函数中使用
export function useAnalytics() {
  const { isInitialized, currentUserId, initGA, trackCustomEvent, setUserProperties } = useGA()

  const trackUserAction = (action: string, value: number) => {
    if (isInitialized.value) {
      trackCustomEvent('user_action', {
        action_name: action,
        value: value,
        user_id: currentUserId.value
      })
    }
  }

  const updateUserProfile = (profile: any) => {
    setUserProperties({
      user_type: profile.type,
      subscription: profile.subscription,
      last_activity: new Date().toISOString()
    })
  }

  return {
    trackUserAction,
    updateUserProfile
  }
}
```

## 迁移指南

### 从旧版本迁移

**旧版本:**

```javascript
import { initGA, addGA, errorGA } from '@/composables/useGA'

// 初始化
initGA('US', 12345, 'Home Page')

// 添加事件
addGA('button_click', 'success')

// 错误追踪
errorGA('Something went wrong')
```

**新版本:**

```typescript
import { useGA } from '@/composables/useGA'

const { initGA, addGA, errorGA, isInitialized, error } = useGA()

// 初始化
initGA('US', 12345, 'Home Page')

// 添加事件（支持额外数据）
addGA('button_click', 'success', {
  custom_parameter: 'value'
})

// 错误追踪（支持致命性标记）
errorGA('Something went wrong', false)
```

## 主要变化

1. **函数式到组合式**: 从导出独立函数改为导出组合式函数
2. **响应式状态**: 添加了响应式状态管理
3. **类型安全**: 添加了完整的TypeScript支持
4. **错误处理**: 改进了错误处理机制
5. **新增功能**: 添加了更多GA功能
6. **生命周期**: 添加了生命周期管理

## 类型定义

```typescript
interface GAConsentOptions {
  ad_storage?: number
  ad_user_data?: number
  ad_personalization?: number
  analytics_storage?: number
}

interface GAEventReport {
  event_label: string | boolean
  ts: number
  [key: string]: any
}

interface GAState {
  isInitialized: boolean
  isConsentSet: boolean
  currentUserId: number | null
  currentRegion: string | null
  error: string | null
}
```

## 注意事项

1. 确保在Vue组件中使用 `useGA()` 函数
2. 响应式状态需要使用 `.value` 访问
3. 所有方法都包含错误处理
4. 使用前检查 `isInitialized` 状态
5. 错误信息通过 `error` 状态获取

## 测试

使用提供的 `GAExample.vue` 组件可以测试所有功能：

```vue
<template>
  <GAExample />
</template>

<script setup lang="ts">
import GAExample from '@/components/GAExample.vue'
</script>
```

这个重构版本保持了原有功能的完整性，同时提供了更好的开发体验、类型安全和响应式状态管理。
