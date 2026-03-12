# AppEuPolicyDialog（欧盟政策/隐私同意弹窗）

## 概述

本组件是**应用级**的欧盟隐私与 Cookie 同意弹窗，负责在活动页中展示隐私政策、收集用户同意，并调用后端与 GA 同步同意状态。  
它通过**嵌套使用**两个 `GfrPolicyDialog` 实现「主隐私弹窗 + 偏好设置子弹窗」的流程，**不是**模块/组件之间的循环引用。

---

## 组件做了什么事

### 1. 整体流程

1. **主弹窗**由 Store 控制显示（`state.euPolicyPopup.show`），无触发按钮（`disable-trigger="true"`）。
2. 主弹窗展示**隐私政策正文**（`state.euPolicyPopup.content`），底部有「更多」「拒绝」「允许」。
3. 点击「更多」会打开**子弹窗**（偏好设置），可勾选存储、广告等选项。
4. 用户在主弹窗点「允许」或「拒绝」、或在子弹窗点「确认」后，会调用 `googlePolicyCheck` 与 GA 的 `updateConsentGA`，并关闭弹窗。

### 2. 两层弹窗的关系（嵌套，非循环引用）

| 层级 | 组件 | 作用 | 显示方式 |
|------|------|------|----------|
| 外层 | 第一个 `GfrPolicyDialog` | 欧盟隐私政策主弹窗 | 由 Store `euPolicyPopup.show` 控制 |
| 内层 | 第二个 `GfrPolicyDialog` | 偏好设置（Cookie/存储等） | 由「更多」按钮作为 trigger 打开 |

- **外层**：标题为隐私政策标题，内容区用 `content` 渲染政策 HTML，底部插槽 `#model` 里放了「更多」按钮 + **内层弹窗**。
- **内层**：`#trigger` 是「更多」按钮，`#content` 是两个 checkbox（存储、广告），底部只有「确认」。
- 两个弹窗是**两个独立实例**，只是内层弹窗的触发按钮被放在外层弹窗的底部栏里，所以看起来像「弹窗套弹窗」，这是**插槽嵌套**，不是组件或模块的循环引用。

### 3. 数据与状态

- **Store**：`state.euPolicyPopup` 提供  
  `show`、`content`、`storageChecked`、`adChecked`、`storageText`、`adText` 等，由 stores 的 `initConfig` 等逻辑赋值。
- **多语言**：标题、按钮文案通过 `fixTransify('EU_*')` 获取。
- **方向**：`dir="state.lang === 'ar' ? 'rtl' : 'ltr'"` 支持阿拉伯语 RTL。

### 4. 用户操作与副作用

- **允许（主弹窗）**：`handleEuPolicyConfirm('all')` → 全选同意 → `googlePolicyCheck` + `updateConsentGA` → 关主弹窗。
- **拒绝（主弹窗）**：`handleEuPolicyCancel` → 全部拒绝 → 同上并关主弹窗。
- **更多 → 子弹窗确认**：`handleEuPolicyConfirm('storage')` → 按当前 checkbox 状态调用 `getChoice()` → 同上并关主弹窗。
- 关闭时：`@closed` 里执行 `state.euPolicyPopup.show = false`，保证状态与 UI 一致。

### 5. 音效与埋点

- 子弹窗：`@open` 播放 `popup`，`@close` 播放 `close`。
- 勾选/点击：`playSounds('click')`。
- GA：`addGA('eu_policy_more', …)`、`eu_policy_confirm`、`eu_policy_reject` 等。

---

## 关于「循环引用」的说明

- **没有循环依赖**：`eu-policy-dialog.vue` 只引用 `GfrPolicyDialog`、`GfrButton`、store、API、composables，没有引用会再引用回本组件的模块。
- **视觉上的「套娃」**：是因为在**同一个页面组件**里用了两次 `GfrPolicyDialog`，第二次作为第一次的 `#model` 插槽内容（一个带 trigger 的弹窗），所以会出现「弹窗里再开一个弹窗」的效果，这是**嵌套使用**，不是循环引用。
- 若希望结构更直观，可以：
  - 把内层弹窗拆成独立组件（如 `EuPreferDialog.vue`），在 `eu-policy-dialog.vue` 里只放一个「更多」按钮，点击时用 `ref` 或状态打开 `EuPreferDialog`；
  - 或继续保留当前写法，在文档中注明「两层 GfrPolicyDialog 为嵌套使用」即可。

---

## 依赖

- `@/components/ui/policy-dialog.vue`（GfrPolicyDialog）
- `@/components/ui/button.vue`（GfrButton）
- `@/lib/apis`（googlePolicyCheck）
- `@/stores`（useStore、storeToRefs、state.euPolicyPopup）
- `@/composables/useGA`（addGA、updateConsentGA）
- `@/composables/useSound`（playSounds）

---

## 使用位置

在 `App.vue` 中全局挂载：`<AppEuPolicyDialog />`。显示与否由 Store 的 `euPolicyPopup.show` 控制，通常由初始化或策略逻辑在适当时机设为 `true`。
