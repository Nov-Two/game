# GfrPolicyDialog（政策/条款弹窗）

## 概述
GfrPolicyDialog 基于通用弹窗 GfrDialog 封装的“政策/条款”专用弹窗组件，内置标题区、可滚动内容区与底部操作区，适合展示较长富文本并引导用户确认或拒绝。

## 功能特性
- 双向绑定可见性：`v-model:visible`
- 完整生命周期事件：`open`、`opened`、`close`、`closed`
- 滚动容器：`GfrScrollArea`，支持 `dir`、`type`、`orientation`、`offset`、`initial-x/y`、`force-update`
- 内容渲染：支持 `content`（字符串富文本）或 `content` 插槽
- 操作区：可选 `confirmText`/`cancelText` 按钮 + `model` 插槽（用于勾选条款等）
- 滚动到底事件：`scrollEnd(isEnd: boolean)`

## 属性（Props）
- `type?: 'fade' | 'fall' | 'bounce' | 'zoom'`（默认 `'bounce'`）：弹窗动画类型
- `disableTrigger?: boolean`：禁用触发器
- `title?: string`：标题文本
- `content?: string`：富文本内容（若不传则使用 `content` 插槽）
- `dir?: 'ltr' | 'rtl'`（默认 `'ltr'`）：文本/滚动方向
- `scrollType?: 'auto' | 'scroll' | 'hidden'`（默认 `'auto'`）：滚动条策略
- `orientation?: 'vertical' | 'horizontal'`（默认 `'vertical'`）：滚动方向
- `offset?: { top?: number; left?: number; right?: number; bottom?: number }`（默认四边 `20`）
- `confirmText?: string`：确认按钮文案（为空则不显示）
- `cancelText?: string`：取消按钮文案（为空则不显示）
- `showClose?: boolean`（默认 `false`）：右上角关闭按钮

## v-model
- `visible: boolean`：控制弹窗显示/隐藏

## 事件（Emits）
- `open`：弹窗开始打开
- `opened`：弹窗已打开
- `close`：弹窗开始关闭
- `closed`：弹窗已关闭
- `scrollEnd(isEnd: boolean)`：内容滚动到末尾回调
- `cancel`：点击取消按钮
- `confirm`：点击确认按钮

> 说明：点击“取消/确认”后组件会自动将 `visible` 设为 `false`。

## 插槽（Slots）
- `trigger`：自定义触发器（如按钮/链接）
- `content`：自定义内容（与 `content` 字符串二选一，插槽优先）
- `model`：底部操作区左侧的扩展区域（如勾选“已阅读并同意”）

## 使用示例
```vue
<template>
  <GfrPolicyDialog
    v-model:visible="visible"
    title="隐私政策"
    :content="htmlContent"
    confirm-text="同意"
    cancel-text="拒绝"
    @confirm="onConfirm"
    @cancel="onCancel"
    @scrollEnd="onScrollEnd"
  >
    <template #trigger>
      <GfrButton>查看政策</GfrButton>
    </template>

    <!-- 可选：使用插槽自定义内容，覆盖 content 字符串 -->
    <!--
    <template #content>
      <div v-html="htmlContent"></div>
    </template>
    -->

    <template #model>
      <label class="agree">
        <input type="checkbox" v-model="agree" /> 我已阅读并同意
      </label>
    </template>
  </GfrPolicyDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
const agree = ref(false)
const htmlContent = '<p>这是示例政策内容……</p>'

const onConfirm = () => {
  if (!agree.value) {
    // 在业务层校验是否勾选
    return
  }
  // TODO: 提交同意
}
const onCancel = () => {
  // TODO: 处理拒绝逻辑
}
const onScrollEnd = (isEnd: boolean) => {
  // 根据 isEnd 控制“需阅读到底才可点击确认”等逻辑
}
</script>
```

## 样式与类名
- 外层容器类：`gfr-policy-dialog`（可覆写背景、边框等）
- 关闭按钮类：`gfr-policy-dialog-close`
- 触发器类：`gfr-policy-dialog-trigger`
- 标题容器：`gfr-policy-header`；内容容器：`gfr-policy-container`；底部：`gfr-policy-bottom`
- 滚动条主题通过 CSS 变量控制：`--scroll-area-thumb-color`、`--scroll-area-track-color` 等

## 最佳实践
- 长文本建议通过 `content` 字符串配合 `GfrContent` 渲染（带安全处理与样式适配）；如需更灵活布局则使用 `content` 插槽。
- 若需要“阅读到底才允许点击确认”，监听 `scrollEnd` 并结合 `confirmText`/按钮禁用态在业务侧控制。
- 国际化/RTL：通过 `dir` 适配阿语等从右到左场景；底部区也会同步设置 `dir`。

## 相关组件
- `GfrDialog`：基础弹窗
- `GfrScrollArea`：滚动容器
- `GfrContent`：富文本内容渲染
- `GfrButton`、`GfrContainer`：布局与按钮