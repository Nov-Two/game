# AppHeader（应用头部）

## 概述
AppHeader 是活动页面的头部组件，整合了「音效控制」「规则查看」与「玩家 UID 展示」。组件在用户交互时会联动全局音效与埋点（GA），并通过插槽让业务层自定义头部标题或其他内容。

- 左侧：音效开关（GfrSoundEffect）、规则弹窗入口（GfrRule）
- 中部：默认插槽（页面标题/装饰等）
- 右侧：玩家 UID 展示（来自全局 Store）

## 组成与依赖
- UI 组件：
  - `GfrSoundEffect`：音效状态切换，接收资源与音量
  - `GfrRule`：规则弹窗（标题、内容、动画、方向等）
  - `GfrButton`：规则按钮触发器
- 组合与工具：
  - `useStore`（Pinia）：读取 `state.player.uid`、`state.eventConfig.rule`、`state.lang`，以及 `fixTransify`
  - `useSound`：`createSounds` 注册音效、`playSounds` 播放指定音效（如 `bgm`、`click`、`popup`、`close`、`toast`）
  - `useGame`：`getGameVolume` 获取游戏内音量作为初始值
  - `useGA`：`addGA` 上报音效与规则弹窗行为
  - `Toast`：全局提示，打开时播放提示音
- 环境变量：
  - `VITE_APP_PROJECT_NAME` 用于构造本地存储键名：`<project>_sounds_status`

## 关键行为
1. 音效初始化与播放
   - 组件挂载前获取游戏环境音量，设置到 `volume`
   - `GfrSoundEffect` 完成初始化后：
     - 使用 `createSounds(sounds)` 注册音效资源
     - 自动播放 `bgm`
     - 设置 `Toast` 的 `onOpen` 钩子，打开时播放 `toast` 提示音
2. 规则弹窗
   - 标题：`fixTransify('COMMON_RULE')`
   - 内容：`state.eventConfig.rule`（后端或 Mock 提供的规则富文本）
   - 动画：`type="fall"`
   - 方向：`dir` 根据语言切换，阿语 `ar` 使用 `rtl`，其他 `ltr`
   - 触发器：插槽中使用 `GfrButton`，点击时播放 `click` 音效
3. 埋点（GA）
   - 音效状态变化：`sound_status_on` / `sound_status_off`
   - 规则弹窗开/关：`rule_open` / `rule_close`，并分别播放 `popup` / `close` 音效
4. UID 展示
   - 右侧显示 `UID: state.player.uid`，由全局初始化（如 `initConfig`）拉取

## 对外 API
- Props：无
- Emits：无（内部仅用于 GA 上报与音效控制）
- Slots：
  - 默认插槽：用于在头部中间区域插入标题或其他内容

## 倒计时（COUNTDOWN）
- **数据**：根据后台配置的活动结束时间 `event_config.end_time`（Unix 秒）计算剩余时间。
- **展示规则**（复用 `@/lib/utils` 的 `formatCountdown`）：
  - 剩余 > 24 小时：显示 **DD HH**（天 + 小时），D/H 文案走 transify（`COUNTDOWN_DAY_UNIT` / `COUNTDOWN_HOUR_UNIT`）。
  - 剩余 ≤ 24 小时：显示 **HH:MM:SS**。
  - 已结束或未配置 `end_time`：显示 `--`。
- **如何使用**：
  - 开发：`npm run dev` 后直接打开页面即可（无 `access_token` 时开发环境会自动用 `dev` 调 Mock）；Mock 的 `end_time` 为「当前 + 10 天 16 小时」，会显示如 `COUNTDOWN: 10D 16H`。
  - 生产：URL 需带 `access_token`（或由游戏内注入），后端在 `event_config` 中返回 `end_time`，倒计时才会显示具体数值；否则为 `--`。

## 与 Store/Mock 的协作
- 组件依赖 `state.player.uid`、`state.eventConfig.rule`、`state.eventConfig.end_time`
  - 开发态可通过 Mock 接口 `/api/info` 返回 `player.uid`、`event_config.rule`、`event_config.end_time`（Mock 已设为未来时间以便倒计时有数）
  - 在应用启动阶段（如根组件）调用 `initConfig` 拉取配置后再渲染 AppHeader；开发环境下若无 `access_token` 会自动使用 `dev` 调 Mock，避免页面被登录失败 Toast 挡住

## 使用示例
```vue
<template>
  <AppHeader>
    <h1 class="page-title">活动标题</h1>
  </AppHeader>
</template>

<script setup lang="ts">
import AppHeader from '@/components/app/header.vue'
// 根组件在 beforeMount/created 阶段应完成全局配置拉取，以便 header 能显示 UID 和规则内容
</script>
```

## 可配置项与扩展建议
- 替换音效资源：在 `sounds` 中新增或调整音效键值，确保 `createSounds` 与 `playSounds` 使用一致的 key
- 业务校验：如需在打开规则后要求「阅读到底」方可继续操作，可结合规则弹窗组件（`GfrRule`）的滚动事件在业务层处理
- 多语言与方向：基于 `state.lang` 自动设置 `dir`，如需细化可在上层对 `dir` 做统一管理

## 样式（节选）
- 布局使用 `scoped` 样式，三段式结构（左/中/右）；音效与规则按钮尺寸统一（34px）；UID 文案带投影与加粗