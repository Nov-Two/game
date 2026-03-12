# gfr-vue

一个基于 Vue 3 + Vite + TypeScript 的游戏活动前端项目模板，专注于构建高性能、可维护的移动端 H5 活动页面。

## 项目简介

本项目是为游戏活动（如抽奖、兑换、商城等）设计的前端解决方案，具有以下特点：

- 🚀 **现代化技术栈** - Vue 3 Composition API + TypeScript + Vite
- 📱 **移动端优先** - 自动 px2rem 适配，完美支持各种屏幕尺寸
- 🎨 **组件化架构** - 三层组件设计（ui/module/app），职责清晰
- 🔧 **完善的工具链** - ESLint + Oxlint + Prettier + Vitest + Playwright
- 🌍 **多语言支持** - 内置 i18n 多语言方案
- 🎵 **音效管理** - 基于 Howler.js 的音效系统
- 📊 **数据分析** - 集成 Google Analytics
- 🎮 **游戏 SDK** - 内置游戏平台 SDK 集成

## 技术栈

### 核心框架

- **Vue 3.5+** - 采用 Composition API 和 `<script setup>` 语法
- **Vite 7+** - 极速的开发服务器和构建工具
- **TypeScript 5.9+** - 类型安全的 JavaScript

### 状态管理与路由

- **Pinia 3+** - 轻量级状态管理
- **Vue Router 4+** - 官方路由解决方案

### UI 与样式

- **SCSS** - CSS 预处理器
- **PostCSS + px2rem** - 自动移动端适配
- **@vueuse/core** - Vue 组合式工具集

### 网络与数据

- **Axios** - HTTP 客户端
- **vite-plugin-mock** - API Mock 方案

### 工具库

- **Howler.js** - 音效管理
- **MockJS** - 数据模拟

### 开发工具

- **ESLint + Oxlint** - 代码检查（双重保障）
- **Prettier** - 代码格式化
- **Vitest** - 单元测试
- **Playwright** - E2E 测试
- **Vue Devtools** - 开发调试工具

## Node 版本要求

```json
{
  "engines": {
    "node": "^20.19.0 || >=22.12.0"
  }
}
```

建议使用 [nvm](https://github.com/nvm-sh/nvm) 或 [fnm](https://github.com/Schniz/fnm) 管理 Node.js 版本。

## 项目结构

```
gfr-vue/
├── src/
│   ├── components/          # 组件目录（三层架构）
│   │   ├── ui/             # 通用 UI 组件（纯展示，无业务逻辑）
│   │   ├── module/         # 模块级组件（业务功能模块）
│   │   └── app/            # 应用级组件（活动相关）
│   ├── composables/        # 组合式函数
│   │   ├── useGA.ts       # Google Analytics 埋点
│   │   └── useGame.ts     # 游戏 SDK 集成
│   ├── lib/                # 工具库
│   │   ├── apis/          # API 定义和类型
│   │   ├── axios/         # HTTP 请求封装
│   │   ├── sounds.ts      # 音效管理
│   │   ├── storage.ts     # 本地存储
│   │   ├── session.ts     # 会话管理
│   │   └── utils.ts       # 工具函数
│   ├── stores/             # Pinia 状态管理
│   ├── router/             # 路由配置
│   ├── assets/             # 静态资源
│   │   └── css/           # 全局样式
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── mock/                   # Mock 数据
│   ├── api/               # API Mock
│   └── lang/              # 多语言文件
├── static/                 # 静态资源（不参与构建）
├── e2e/                    # E2E 测试
├── public/                 # 公共资源
├── .cursorrules           # Cursor AI 规则配置
├── vite.config.ts         # Vite 配置
├── eslint.config.ts       # ESLint 配置
└── package.json           # 项目配置
```

### 组件分层架构

项目采用**三层组件架构**，明确区分组件职责：

#### 1. `components/ui/` - 通用 UI 组件

- **职责**: 纯展示组件，无业务逻辑
- **特点**: 可在任何项目中复用
- **通信**: 通过 props 接收数据，通过 emits 传递事件
- **示例**: `button.vue`, `dialog.vue`, `loading.vue`, `toast.vue`

#### 2. `components/module/` - 模块级组件

- **职责**: 特定功能模块的业务组件
- **特点**: 可能包含业务逻辑和状态，可在多个活动中复用
- **示例**: `home.vue`（首页模块）

#### 3. `components/app/` - 应用级组件

- **职责**: 与当前活动强相关的组件
- **特点**: 依赖活动配置数据（`eventConfig`），与活动生命周期紧密相关
- **命名**: 建议以 `App` 前缀开头（如 `AppHeader`）
- **示例**: `header.vue`（活动头部，包含规则、音效等）

> 详细的组件分层说明请参考 `src/components/app/0_README.md`

## 开发流程

### 1. 环境准备

参考[gfr-cli](https://gfr-npm.garenanow.com/-/web/detail/@gfr/cli)

```bash
# 全局安装gfr-cli
npm install @gfr/cli -g --registry https://gfr-npm.garenanow.com/
gfr -v
gfr -h

# 创建项目 跟随命令行提示填入信息
gfr create dirname -t template-name

# 创建完成后进入项目目录运行
npm run dev
```

### 2. 开发活动页面

#### Step 1: 配置活动信息

在 `mock/api/info.ts` 中配置活动配置信息：

```typescript
export default [
  {
    url: '/api/info',
    method: 'get',
    response: () => ({
      code: 0,
      data: {
        rule: '活动规则说明...'
        // ... 其他配置
      }
    })
  }
]
```

#### Step 2: 创建模块组件

在 `src/views/` 或 `src/components/module/` 中创建模块组件：

```vue
<script setup lang="ts">
import { useDefaultStore } from '@/stores'
import { storeToRefs } from 'pinia'

const store = useDefaultStore()
const { eventConfig, userInfo } = storeToRefs(store)
</script>

<template>
  <GfrContainer>
    <AppHeader>
      <GfrHeading>{{ eventConfig.title }}</GfrHeading>
    </AppHeader>
    <GfrContent>
      <!-- 页面内容 -->
    </GfrContent>
  </GfrContainer>
</template>
```

#### Step 3: 添加路由 （根据业务需求）

在 `src/router/index.ts` 中配置路由：

```typescript
{
  path: '/event',
  name: 'event',
  component: () => import('@/views/EventView.vue')
}
```

#### Step 4: 开发业务逻辑

- 创建可复用的 UI 组件放在 `components/ui/`
- 创建业务模块组件放在 `components/module/`
- 创建活动特定组件放在 `components/app/`
- API 接口定义在 `lib/apis/index.ts`
- 使用 Composables 封装可复用逻辑

#### Step 5: 测试 （非强制要求）

```bash
# 运行单元测试
npm run test:unit

# 运行 E2E 测试
npm run test:e2e

# 代码检查
npm run lint
```

### 3. 构建部署

```bash
# 生产构建
npm run build


# Goku 模式构建（特殊部署）
npm run build:goku
```

### 4. 发布流程

```bash
# 1. 构建
npm run build

# 2. 上传资源到 OBS
npm run obs

# 3. 处理模板
npm run tpl

# 4. 上传图片资源
npm run obs:audio  # 上传音频（如需要）
```

## 开发规范

### 代码规范

#### 命名约定

- **组件文件**: `kebab-case` (如 `sound-effect.vue`)
- **组件名**: `PascalCase` (如 `SoundEffect`, `AppHeader`)
- **Composables**: `camelCase` with `use` prefix (如 `useGA`, `useGame`)
- **常量**: `UPPER_SNAKE_CASE` (如 `API_BASE_URL`)
- **函数/变量**: `camelCase` (如 `getUserInfo`, `isLoading`)

#### TypeScript 规范

```typescript
// ✅ 推荐：明确的类型定义
interface UserInfo {
  uid: string
  nickname: string
  level: number
}

// ✅ 推荐：为 Props 定义类型
interface Props {
  title: string
  count?: number
  items: string[]
}
const props = defineProps<Props>()

// ✅ 推荐：为 Emits 定义类型
interface Emits {
  (e: 'update', value: string): void
  (e: 'close'): void
}
const emit = defineEmits<Emits>()

// ❌ 避免：使用 any（除非确实必要）
const data: any = {} // 不推荐
```

#### Vue 组件规范

```vue
<script setup lang="ts">
// ✅ 使用 Composition API 和 <script setup>
import { ref, computed, onMounted } from 'vue'
import { useDefaultStore } from '@/stores'
import { storeToRefs } from 'pinia'

// Props 定义
interface Props {
  title: string
  count?: number
}
const props = withDefaults(defineProps<Props>(), {
  count: 0
})

// Emits 定义
interface Emits {
  (e: 'update', value: number): void
}
const emit = defineEmits<Emits>()

// Store 使用
const store = useDefaultStore()
const { eventConfig } = storeToRefs(store)

// 响应式状态
const isLoading = ref(false)
const total = computed(() => props.count * 2)

// 生命周期
onMounted(() => {
  console.log('Component mounted')
})
</script>

<template>
  <div class="my-component">
    <h1>{{ title }}</h1>
    <p>{{ total }}</p>
  </div>
</template>

<style scoped lang="scss">
// ✅ 使用 scoped 样式
.my-component {
  padding: 16px;

  h1 {
    font-size: 24px;
    color: var(--primary);
  }
}
</style>
```

### 样式规范

#### SCSS 使用

```scss
// ✅ 使用嵌套
.parent {
  padding: 16px;

  .child {
    margin: 8px;
  }

  &:hover {
    background: #f0f0f0;
  }
}

// ✅ 使用 CSS 变量
.button {
  color: var(--primary);
  border-radius: var(--radius);
  transition: all var(--gfr-transition-duration);
}

// ✅ 使用内置动画类
.dialog {
  // ... 样式
}
```

#### 移动端适配（重要！）

```scss
// ✅ 直接使用 px，会自动转换为 rem
.container {
  width: 750px; // → 46.875rem (750 / 16)
  padding: 32px; // → 2rem (32 / 16)
  margin: 16px; // → 1rem (16 / 16)
  border-width: 2px; // → 2px (不转换，小于 minPixelValue)
  font-size: 24px; // → 1.5rem (24 / 16)
}

// ❌ 不要手动计算 rem
.container {
  width: 46.875rem; // 不推荐，直接写 px
}

// 📝 转换规则：
// - rootValue: 16 (1rem = 16px)
// - minPixelValue: 2 (小于 2px 的不转换)
// - 所有属性都会转换（propList: ['*']）
```

#### 内置动画使用

```vue
<template>
  <!-- 过渡动画 -->
  <Transition name="gfr-bounce">
    <div v-if="show">弹出内容</div>
  </Transition>

  <Transition name="gfr-fade">
    <div v-if="show">淡入淡出</div>
  </Transition>

  <!-- 动画类 -->
  <button class="btn" @mousedown="$event.target.classList.add('gfr-anime-bounce')">点击按钮</button>
</template>
```

**可用的过渡类**:

- `gfr-bounce` - 缩放弹出效果
- `gfr-fade` - 淡入淡出
- `gfr-rise` - 从下往上升起
- `gfr-left` - 从左侧滑入
- `gfr-right` - 从右侧滑入

**可用的动画类**:

- `gfr-anime-bounce` - 按压效果
- `gfr-anime-fall` - 下落效果
- `gfr-anime-shake` - 震动效果

### API 请求规范

```typescript
// lib/apis/index.ts

import request from '../axios/request'
import type { EventInfo, DrawResult } from './types'

// ✅ 定义 API 函数和返回类型
export const getEventInfo = () => {
  return request.get<EventInfo>('/api/event/info')
}

export const drawLottery = (times: number) => {
  return request.post<DrawResult>('/api/event/draw', { times })
}

// 使用示例
import { getEventInfo } from '@/lib/apis'

const fetchData = async () => {
  try {
    const info = await getEventInfo()
    console.log(info) // 类型安全
  } catch (error) {
    // 错误已被全局处理（Toast 提示）
  }
}
```

### 状态管理规范

```typescript
// stores/event.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEventStore = defineStore('event', () => {
  // State
  const eventConfig = ref<EventConfig | null>(null)
  const userInfo = ref<UserInfo | null>(null)

  // Getters
  const isEventActive = computed(() => {
    if (!eventConfig.value) return false
    const now = Date.now()
    return now >= eventConfig.value.startTime && now <= eventConfig.value.endTime
  })

  // Actions
  const fetchEventConfig = async () => {
    const data = await getEventInfo()
    eventConfig.value = data
  }

  return {
    eventConfig,
    userInfo,
    isEventActive,
    fetchEventConfig
  }
})

// 使用示例
import { useEventStore } from '@/stores/event'
import { storeToRefs } from 'pinia'

const store = useEventStore()
const { eventConfig, isEventActive } = storeToRefs(store) // 响应式
const { fetchEventConfig } = store // 方法
```

### Git 提交规范

```bash
# 提交格式
<type>(<scope>): <subject>

# Type 类型：
# feat: 新功能
# fix: 修复 bug
# docs: 文档更新
# style: 代码格式（不影响代码运行）
# refactor: 重构
# perf: 性能优化
# test: 测试相关
# chore: 构建过程或辅助工具的变动

# 示例：
git commit -m "feat(lottery): add lottery animation effect"
git commit -m "fix(api): fix user info request error"
git commit -m "docs(readme): update development guide"
```

## 移动端适配方案

### 方案概述

本项目采用 **rem + viewport** 适配方案，通过 `postcss-pxtorem` 自动将 `px` 转换为 `rem`，无需手动计算。

### 配置说明

```typescript
// vite.config.ts
postcss: {
  plugins: [
    px2rem({
      rootValue: 16, // 1rem = 16px
      unitPrecision: 5, // rem 精度
      propList: ['*'], // 所有属性都转换
      selectorBlackList: [], // 选择器黑名单
      replace: true, // 直接替换
      mediaQuery: false, // 不转换媒体查询中的 px
      minPixelValue: 2, // 小于 2px 的不转换
      exclude: /node_modules/i // 排除 node_modules
    })
  ]
}
```

### 使用方法

#### 1. 直接使用 px

```scss
.container {
  width: 750px; // 自动转换为 46.875rem
  height: 1206px; // 自动转换为 75.375rem
  padding: 32px; // 自动转换为 2rem
  font-size: 28px; // 自动转换为 1.75rem
  border: 1px solid; // 1px 不转换（< minPixelValue）
}
```

#### 2. 设计稿尺寸对照

假设设计稿宽度为 750px：

```scss
// 设计稿 750px 宽度
.page {
  width: 750px; // → 46.875rem
}

// 设计稿中的 32px 边距
.container {
  padding: 32px; // → 2rem
}

// 设计稿中的 28px 字体
.title {
  font-size: 28px; // → 1.75rem
}
```

#### 3. 不需要转换的场景

对于不希望转换的值（如 1px 边框），有两种方式：

**方式一：利用 minPixelValue**

```scss
.border {
  border-width: 1px; // < 2px，不会转换
}
```

**方式二：使用大写 PX**

```scss
.border {
  border-width: 1px; // 大写 PX 不会被转换
}
```

### Viewport 设置

```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```

### 屏幕尺寸适配

项目使用 rem 单位后，会自动根据屏幕宽度进行缩放：

- **iPhone 6/7/8** (375px): `1rem = 6px` 左右
- **iPhone 6/7/8 Plus** (414px): `1rem = 6.6px` 左右
- **iPad** (768px): `1rem = 12.3px` 左右

> **注意**: 具体的 rem 值取决于设备的实际 CSS 像素和浏览器的默认字体大小。

### 响应式断点

对于需要响应式布局的场景，使用媒体查询：

```scss
.container {
  width: 750px;

  // 小屏幕
  @media (max-width: 640px) {
    padding: 16px;
  }

  // 大屏幕
  @media (min-width: 1024px) {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### 高清屏适配

对于图片资源，建议使用 2x 或 3x 图：

```vue
<template>
  <img src="@/assets/images/icon@2x.png" alt="icon" style="width: 48px; height: 48px;" />
</template>
```

### 最佳实践

1. **以设计稿尺寸编写** - 直接使用设计稿中的 px 值，无需计算
2. **小数值注意** - 1px 边框会被保留，其他值自动转换
3. **第三方组件** - node_modules 中的样式不会被转换
4. **测试多设备** - 在不同屏幕尺寸下测试效果
5. **性能优化** - 避免过度使用大图，使用 CDN 加速

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## 常用 API

### Store API

```typescript
import { useDefaultStore } from '@/stores'
import { storeToRefs } from 'pinia'

const store = useDefaultStore()
const { eventConfig, userInfo, transify } = storeToRefs(store)

// eventConfig - 活动配置
// userInfo - 用户信息
// transify - 多语言文本
```

### Composables

```typescript
// Google Analytics
import { useGA } from '@/composables/useGA'
const { addGA } = useGA()
addGA('button_click', true)

// 游戏 SDK
import { useGame } from '@/composables/useGame'
const { isInGame } = useGame()
```

### 音效管理

```typescript
import { useSound } from '@/composables/useSound'
const { playSounds, pauseSounds, stopSounds, muteAllSounds } = useSound()

// 播放音效
playSounds('bgm')    // 播放背景音乐
playSounds('click')  // 播放点击音效

// 暂停音效
pauseSounds('bgm')

// 停止音效
stopSounds('bgm')

// 静音所有音效
muteAllSounds(true)
```

### Toast 提示

```typescript
import { showToast } from '@/components/ui/toast'

showToast('操作成功')
showToast('操作失败', 'error')
```

### Loading 加载

```typescript
import { showLoading, hideLoading } from '@/components/ui/loading'

showLoading()
// ... 异步操作
hideLoading()
```

## 常见问题

### 1. 样式不生效？

**问题**: 写了样式但页面没有变化

**解决方案**:

- 检查是否使用了 `scoped`，确保选择器权重足够
- 检查是否被其他样式覆盖
- 清除浏览器缓存，重新运行 `npm run dev`
- 检查 px 值是否小于 2px（会被保留原样）

### 2. API 请求报错？

**问题**: API 请求返回错误或者没有响应

**解决方案**:

- 检查 Mock 数据配置是否正确（`mock/api/`）
- 检查网络请求是否被拦截（查看 Network 面板）
- 检查环境变量配置（`.env` 文件）
- 查看 axios 拦截器的错误处理（`lib/axios/`）

### 3. TypeScript 类型错误？

**问题**: 代码有类型错误提示

**解决方案**:

- 运行 `npm run type-check` 查看详细错误
- 确保安装了 Volar 扩展
- 重启 VS Code 的 TypeScript 服务器
- 检查 `tsconfig.json` 配置

### 4. 组件样式在移动端显示异常？

**问题**: 在移动端样式大小不对

**解决方案**:

- 确认使用了 px 单位（会自动转换为 rem）
- 检查 viewport meta 标签是否正确
- 使用浏览器开发者工具的移动端模式测试
- 检查是否有固定宽度的容器限制了布局

### 5. 音效无法播放？

**问题**: 音效或背景音乐不播放

**解决方案**:

- 检查浏览器是否允许自动播放（需要用户交互后才能播放）
- 检查音频文件路径是否正确
- 检查音频文件格式是否支持（推荐 mp3）
- 查看控制台是否有错误信息

### 6. 构建后资源 404？

**问题**: 生产环境资源加载失败

**解决方案**:

- 检查 `.env.production` 中的 `VITE_APP_CDN_URL` 配置
- 确认资源已正确上传到 CDN
- 检查 `base` 配置是否正确（`vite.config.ts`）
- 查看构建产物的目录结构是否正确

## 性能优化建议

### 1. 图片优化

- 使用 WebP 格式
- 使用合适的图片尺寸（避免过大）
- 使用 CDN 加速
- 对于小图标，考虑使用 SVG

### 2. 代码分割

```typescript
// 路由懒加载
{
  path: '/event',
  component: () => import('@/views/EventView.vue')
}

// 组件懒加载
import { defineAsyncComponent } from 'vue'
const HeavyComponent = defineAsyncComponent(() =>
  import('@/components/HeavyComponent.vue')
)
```

### 3. 打包优化

```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vue-vendor': ['vue', 'vue-router', 'pinia'],
        'utils': ['axios', '@vueuse/core']
      }
    }
  }
}
```

### 4. 性能监控

```typescript
// 使用 Performance API
const start = performance.now()
// ... 操作
const end = performance.now()
console.log(`耗时: ${end - start}ms`)
```

## 部署配置

### 环境变量

#### `.env` (开发环境)

```env
VITE_APP_PROJECT_NAME=gfr-vue
VITE_BASE_URL=/
VITE_OUTPUT_DIR=dist
```

#### `.env.production` (生产环境)

```env
VITE_APP_PROJECT_NAME=gfr-vue
VITE_APP_CDN_URL=https://cdn.example.com/
VITE_BASE_URL=/
VITE_OUTPUT_DIR=dist
```

#### `.env.goku` (Goku 模式)

```env
VITE_APP_PROJECT_NAME=gfr-vue
VITE_APP_CDN_URL=https://cdn-goku.example.com/
VITE_BASE_URL=/
VITE_OUTPUT_DIR=goku_dist
```

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name example.com;

    root /var/www/gfr-vue;
    index index.html;

    # 开启 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # HTML 不缓存
    location ~* \.html$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 相关文档

- [Vue 3 官方文档](https://vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Pinia 官方文档](https://pinia.vuejs.org/)
- [Vue Router 官方文档](https://router.vuejs.org/)
- [@vueuse/core 文档](https://vueuse.org/)

## 项目配置文件

- `.cursorrules` - Cursor AI 开发规则（详细的项目规范和最佳实践）
- `src/components/app/0_README.md` - 组件分层架构详细说明
- `src/composables/docs/` - Composables 使用文档

## License

[MIT](./LICENSE)

## 贡献指南

欢迎提交 Issue 和 Pull Request！

提交 PR 前请确保：

1. 代码通过 lint 检查：`npm run lint`
2. 代码格式化：`npm run format`
3. 类型检查通过：`npm run type-check`
4. 测试通过：`npm run test:unit`

## 联系方式

如有问题或建议，请提交 Issue 或联系项目维护者。
