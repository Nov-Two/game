# 首页内容区布局计划

## 设计参考
- 主内容区（左）：蓝色圆角大容器，内含进度、奖励、统计与分享。
- 右侧栏：推广/赛季面板（S44 BR-RANKED），可做轮播。

## 整体结构（两栏）

```
.app-home-container (flex, 占满容器)
├── .app-home-main   (主内容区，flex: 1，左侧)
│   ├── .app-home-banner        Team Up 横幅
│   ├── .app-home-progress      当前进度文案 + 进度条 + 里程碑
│   ├── .app-home-rewards       奖励卡片一行（4 个）
│   └── .app-home-footer        底部：吉祥物 + 文案 + 分享按钮
└── .app-home-side    (右侧推广栏，固定宽度)
    ├── .app-home-side__date    日期丝带（如 1 MAR）
    ├── .app-home-side__title   主标题（S44 BR-RANKED）
    ├── .app-home-side__desc    副文案
    ├── .app-home-side__art     插画/占位
    └── .app-home-side__dots    轮播指示点
```

## 实施顺序
1. 两栏骨架：主区 + 侧栏，flex 布局，间距与圆角。
2. 主内容区从上到下：横幅 → 进度块 → 奖励行 → 底部栏。
3. 右侧栏从上到下：日期、标题、描述、图、点。
4. 后续再接入数据（store/接口）与动效。

## 技术要点
- 使用 px，由项目 postcss 转 rem。
- 类名 BEM：`app-home-*`、`app-home-*__*`。
- 主区可滚动时仅主区滚动，侧栏固定（或整体在 app-container 内滚动，依需求定）。
