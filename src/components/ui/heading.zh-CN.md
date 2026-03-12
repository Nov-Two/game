# GfrHeading（标题组件）

## 概述
GfrHeading 是一个可配置的标题组件，用于渲染 **h1～h6** 标题，并支持多种文字效果：
- **普通**（normal）：默认标题样式
- **渐变**（gradient）：用渐变色填充文字（`background-clip: text`）
- **图片**（image）：用背景图填充文字（`background-clip: text`）
- **描边**（stroke）：可为任意类型叠加描边效果（`-webkit-text-stroke`）

适用于活动页主标题、副标题、带渐变/图片/描边的标题展示。

## 组成结构
1. **动态标签**  
   通过 `<component :is="\`h${level}\`">` 渲染为 `h1`～`h6`，语义与层级由 `level` 控制。

2. **类型与样式**  
   - `type="normal"`：无额外效果，仅使用默认样式与插槽内容。  
   - `type="gradient"`：使用 `::before` 伪元素 + `attr(data-text)` 复刻文字，用 `--gradient-color` 做背景并 `background-clip: text` 实现渐变字。  
   - `type="image"`：在标题上直接设置 `background-image/size/position`，再 `background-clip: text` 实现图片字。  
   - `stroke` 为 true 或传入配置时：使用 `::after` 伪元素 + `attr(data-text)` 绘制描边层（`z-index: 1`），与上述类型可叠加。

3. **data-text**  
   通过 `headingRef.textContent` 得到当前标题文字并写入 `data-text`，供 `::before` / `::after` 的 `content: attr(data-text)` 使用，保证伪元素与可见文字一致。

## 属性（Props）
- `level?: 1 | 2 | 3 | 4 | 5 | 6`（默认 `1`）：标题级别，对应 `h1`～`h6`。
- `type?: 'normal' | 'gradient' | 'image'`（默认 `'normal'`）：标题类型（普通 / 渐变 / 图片）。
- `gradient?: { color?: string }`：渐变类型时的渐变值，会赋给 CSS 变量 `--gradient-color`（如不传则使用默认线性渐变）。
- `image?: { url: string; size?: string; position?: string }`：图片类型时的背景图配置，对应 `--background-image`、`--background-size`、`--background-position`。
- `stroke?: boolean | { color?: string; width?: number }`（默认 `false`）：是否启用描边；为对象时可指定 `color`（默认 `#000`）和 `width`（数字，会除以 16 转为 rem）。

## 插槽（Slots）
- **默认插槽**：标题显示的文本内容（同时用于 `data-text` 的采集）。

## 样式与 CSS 变量
- 渐变：`--gradient-color`  
- 图片：`--background-image`、`--background-size`、`--background-position`  
- 描边：`--storke-color`、`--storke-width`（注意组件内拼写为 `storke`，与 CSS 变量保持一致）  
- 类名：`gfr-heading`、`gfr-heading-${type}`、`gfr-heading-${level}`，启用描边时有 `gfr-heading-stroke`。

## 使用示例

```vue
<!-- 普通 h1 -->
<GfrHeading>普通标题</GfrHeading>

<!-- 渐变标题 -->
<GfrHeading type="gradient" :gradient="{ color: 'linear-gradient(to bottom, #ff0, #f80)' }">
  渐变标题
</GfrHeading>

<!-- 图片填充标题 -->
<GfrHeading
  type="image"
  :image="{ url: '/static/title-bg.png', size: 'cover', position: 'center' }"
>
  图片标题
</GfrHeading>

<!-- 带描边的标题（可与 gradient/image 叠加） -->
<GfrHeading :stroke="{ color: '#000', width: 4 }">描边标题</GfrHeading>

<!-- h2 副标题 -->
<GfrHeading :level="2" type="gradient" :gradient="{ color: 'linear-gradient(#fff, #ccc)' }">
  副标题
</GfrHeading>
```

## 注意事项
- 描边相关 CSS 变量在组件内拼写为 `--storke-*`（storke），使用时需与组件内部保持一致。
- 渐变、图片效果依赖 `background-clip: text` 与 `-webkit-text-fill-color: transparent`，部分老旧浏览器可能不支持。
- 使用 `type="gradient"` 或 `type="image"` 时，确保传入的标题文本与默认插槽内容一致，以便 `data-text` 与伪元素显示一致。
