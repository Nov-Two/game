# module 目录

## 概述

`module` 目录用于放置与**当前活动主体内容模块**相关的组件。这些组件构成活动页面的核心内容区域，是用户主要交互和浏览的部分。

## 目录定位

该目录中的组件与以下目录的组件有所区别：

- **`ui/`** - 通用 UI 组件，可在任何场景复用
- **`app/`** - 应用级组件，与活动配置和全局功能相关（如头部、规则等）
- **`module/`** - 主体内容模块组件，构成活动页面的主要内容区域

## 组件特点

放置在此目录的组件通常具有以下特征：

1. **主体内容**：构成活动页面的核心内容区域，位于 `AppHeader` 下方
2. **完整功能单元**：每个模块是一个相对独立、完整的功能单元
3. **模块化设计**：通过 `Modules` 枚举进行模块切换和管理
4. **活动业务逻辑**：实现活动的主要业务功能和交互逻辑
5. **内容展示**：包含活动的主要内容展示、用户交互等功能

## 使用场景

### 典型模块示例

- **首页模块** (`HomeModule`) - 活动首页的主要内容
- **活动主内容模块** - 活动的主要功能区域
- **功能模块** - 特定的功能模块（如抽奖、排行榜、任务等）

### 在 App.vue 中的使用

```vue
<template>
  <GfrFlexible>
    <GfrModule center :class="`app-${Modules[currentModule].toLowerCase()}-module`">
      <GfrContainer flexible class="app-container">
        <AppHeader>
          <!-- 头部内容 -->
        </AppHeader>

        <!-- 主体内容模块 -->
        <HomeModule v-if="currentModule === Modules.Home" />
        <!-- 其他模块... -->
      </GfrContainer>
    </GfrModule>
  </GfrFlexible>
</template>

<script setup lang="ts">
import AppHeader from '@/components/app/header.vue'
import HomeModule from '@/components/module/home.vue'

enum Modules {
  Home = 1
  // 其他模块...
}

const currentModule = ref<Modules>(Modules.Home)
</script>
```

## 使用规范

### 何时将组件放在此目录

✅ **应该放在这里**：

- 组件是活动页面的主体内容部分
- 组件构成一个完整的功能模块
- 组件需要在 `Modules` 枚举中定义和管理
- 组件位于 `AppHeader` 下方的主要内容区域
- 组件实现活动的主要业务功能和交互

❌ **不应该放在这里**：

- 通用的 UI 组件（应放在 `ui/`）
- 应用级组件如头部、规则等（应放在 `app/`）
- 小的功能组件（可放在模块内部或 `ui/`）

### 命名规范

- 组件文件名使用 kebab-case（如 `home.vue`、`lottery.vue`）
- 组件名使用 PascalCase（如 `HomeModule`、`LotteryModule`）
- 组件名建议以 `Module` 后缀结尾，便于识别
- 文件名应与 `Modules` 枚举值对应（如 `Home` 对应 `home.vue`）

### 模块管理

在 `App.vue` 中通过 `Modules` 枚举管理模块：

```typescript
enum Modules {
  Home = 1,
  Lottery = 2,
  Ranking = 3
}

const currentModule = ref<Modules>(Modules.Home)
```

## 组件结构建议

一个典型的模块组件结构：

```vue
<template>
  <div class="module-home">
    <!-- 模块主要内容 -->
    <div class="module-home__content">
      <!-- 使用 UI 组件和业务逻辑 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'

defineOptions({
  name: 'HomeModule'
})

const store = useStore()
const { state } = storeToRefs(store)

// 模块特定的业务逻辑
</script>

<style lang="scss" scoped>
.module-home {
  // 模块样式
}
</style>
```

## 注意事项

1. **模块独立性**：每个模块应该是相对独立的，可以单独开发和测试
2. **状态管理**：模块可以通过 store 访问活动配置和全局状态
3. **模块切换**：通过 `currentModule` 控制模块的显示和切换
4. **样式隔离**：使用 scoped 样式，避免样式冲突
5. **性能优化**：对于大型模块，考虑使用动态导入（`defineAsyncComponent`）

## 扩展建议

当需要添加新的主体内容模块时：

1. 在 `Modules` 枚举中添加新的模块类型
2. 在 `module/` 目录下创建对应的组件文件
3. 在 `App.vue` 中导入并使用该模块
4. 根据 `currentModule` 的值条件渲染对应模块
5. 遵循命名规范和组件结构建议

## 示例：添加新模块

```typescript
// App.vue
enum Modules {
  Home = 1,
  Lottery = 2  // 新增模块
}

const currentModule = ref<Modules>(Modules.Home)

// 模板中
<LotteryModule v-if="currentModule === Modules.Lottery" />
```

```vue
<!-- src/components/module/lottery.vue -->
<template>
  <div class="module-lottery">
    <!-- 抽奖模块内容 -->
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'LotteryModule'
})
</script>
```
