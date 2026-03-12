# GfrDialog（通用弹窗）

## 概述
GfrDialog 是一个通用弹窗组件，封装了：
- 触发器（Trigger）区域（可选）
- 遮罩层与锁滚动（Overlay）
- 弹窗容器（Container）
- 多种过渡动画（fade / fall / bounce / zoom）
- 关闭按钮（可选）
- 完整生命周期事件（open/opened/close/closed）
- 命令式控制（open/close/toggle）

适用于规则弹窗、政策弹窗、提示弹窗等场景。

## 组成结构
1. Trigger 区域  
   - 当 `disableTrigger=false` 时渲染触发器容器
   - 点击触发器：当 `trigger='click'` 时自动打开弹窗
   - 触发器内容可通过 `#trigger` 插槽自定义；否则显示默认按钮 “Open Dialog”

2. Overlay（GfrOverlay）  
   - 通过 `v-model:visible` 控制整体显示
   - 支持 `zIndex`、`overlayColor`、`teleport`、`closeOnOverlay`、`lockScroll`、`duration`
   - `clickable` 对应 `closeOnOverlay`，决定点击遮罩是否关闭

3. Dialog 容器（GfrContainer）  
   - 受 `<transition>` 控制进入/离开动画
   - `@click.stop` 防止点击弹窗内部触发 overlay 点击逻辑
   - 可选关闭按钮（`showClose`），点击后关闭

## 属性（Props）
- `type?: 'fade' | 'fall' | 'bounce' | 'zoom'`（默认 `'bounce'`）：动画类型
- `zIndex?: number`（默认 `90`）：遮罩层层级
- `overlayColor?: string`（默认 `'rgba(0,0,0,0.6)'`）：遮罩颜色
- `teleport?: string`（默认 `'body'`）：弹窗挂载目标
- `closeOnOverlay?: boolean`（默认 `true`）：点击遮罩是否关闭
- `showClose?: boolean`（默认 `true`）：是否显示关闭按钮
- `lockScroll?: boolean`（默认 `true`）：显示时是否锁定页面滚动
- `duration?: number`（默认 `300`）：过渡时长（ms）
- `trigger?: 'click' | 'manual'`（默认 `'click'`）：触发模式
- `disableTrigger?: boolean`（默认 `false`）：是否禁用触发器区域
- `containerClass?: string`（默认 `''`）：附加到弹窗容器的 class
- `closeClass?: string`（默认 `''`）：附加到关闭按钮的 class
- `triggerClass?: string`：附加到触发器容器的 class（存在于模板中）

## v-model
- `v-model:visible (boolean)`：控制弹窗显示/隐藏

## 事件（Emits）
- `open`：弹窗开始进入（before-enter）
- `opened`：弹窗进入完成（after-enter）
- `close`：弹窗开始离开（before-leave）
- `closed`：弹窗离开完成（after-leave）

## 插槽（Slots）
- `#trigger`：自定义触发器内容
- 默认插槽：弹窗内容区域

## 命令式控制（Expose）
组件通过 `ref` 暴露以下方法：
- `open()`：打开弹窗
- `close()`：关闭弹窗
- `toggle()`：切换显示状态

## 动画与样式要点
- 过渡类名：`gfr-dialog-${type}`，例如 `gfr-dialog-bounce`
- 过渡时长：通过内联 style 注入 `--gfr-dialog-duration: <duration>ms`
- 默认弹窗尺寸：`width: 856px; height: 478px;`
- 关闭按钮默认定位在弹窗左侧外侧（`left: -77px`），可通过 `closeClass` 覆盖样式

## 使用示例
```vue
<template>
  <GfrDialog v-model:visible="visible" type="fade" :close-on-overlay="true">
    <template #trigger>
      <button>打开弹窗</button>
    </template>

    <div>这里是弹窗内容</div>
  </GfrDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GfrDialog from '@/components/ui/dialog.vue'

const visible = ref(false)
</script>
```