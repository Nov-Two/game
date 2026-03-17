# package.json 说明文档

本文档详细说明项目根目录下 `package.json` 中各字段与脚本的用途。

---

## 一、项目基本信息

| 字段 | 值 | 说明 |
|------|-----|------|
| **name** | `fe-entry-task` | 项目名称，用于 npm 包标识。 |
| **version** | `0.0.1` | 项目版本号，遵循语义化版本。 |
| **private** | `true` | 禁止被意外发布到 npm 仓库。 |
| **type** | `module` | 使用 ES Module 作为默认模块系统（`.js` 视为 ESM）。 |

---

## 二、运行环境要求 (engines)

```json
"node": "^20.19.0 || >=22.12.0"
```

- 要求 **Node.js** 版本为 **20.19.0 及以上**，或 **22.12.0 及以上**。
- 使用 `npm install` 时若本机 Node 版本不满足，会给出警告或报错，保证构建环境一致。

---

## 三、脚本 (scripts)

### 开发与构建

| 脚本 | 命令 | 说明 |
|------|------|------|
| **dev** | `vite` | 启动 Vite 开发服务器，支持热更新，默认通常为 `http://localhost:5173`。 |
| **build** | `run-p type-check "build-only {@}" --` | **完整构建流程**：并行执行 `type-check` 与 `build-only`，两者都成功才算构建成功。 |
| **build-only** | `vite build && run-p tpl` | **仅构建与后处理**：先执行 Vite 生产构建（输出到 `dist/`），成功后再执行 `tpl`（模板处理 + 图片上传）。不包含类型检查。 |
| **build:goku** | `vite build --mode goku && run-p tpl:goku` | 使用 **goku** 模式构建（读取 `.env.goku` 等），输出到 `goku_dist/`，再执行 goku 专用模板处理。 |
| **preview** | `vite preview` | 本地预览生产构建结果（基于 `dist/`），用于上线前自测。 |

### 类型检查

| 脚本 | 命令 | 说明 |
|------|------|------|
| **type-check** | `vue-tsc --build` | 使用 Vue 官方推荐的 TypeScript 编译器进行项目类型检查，不生成产物，只报类型错误。 |

### 测试

| 脚本 | 命令 | 说明 |
|------|------|------|
| **test:unit** | `vitest` | 运行 Vitest 单元测试（默认匹配 `src/__tests__/` 等约定目录）。 |
| **test:e2e** | `playwright test` | 运行 Playwright 端到端测试（默认匹配 `e2e/` 目录）。 |

### 代码质量

| 脚本 | 命令 | 说明 |
|------|------|------|
| **lint** | `run-s lint:*` | **串行**执行所有以 `lint:` 开头的脚本（当前为 `lint:oxlint`、`lint:eslint`）。 |
| **lint:oxlint** | `oxlint . --fix -D correctness --ignore-path .gitignore` | 使用 Oxlint 做快速正确性检查并自动修复，忽略 `.gitignore` 中的路径。 |
| **lint:eslint** | `eslint . --fix` | 使用 ESLint 做完整代码检查并自动修复。 |
| **format** | `prettier --write src/` | 使用 Prettier 格式化 `src/` 下代码。 |

> - `run-p`：来自 **npm-run-all2**，表示 **并行**执行（parallel）。  
> - `run-s`：表示 **串行**执行（sequential）。

### 部署与资源

| 脚本 | 命令 | 说明 |
|------|------|------|
| **tpl** | `gfr tpl ./dist/ -g ff -p fe-entry-task && run-p obs:images` | 使用 **gfr** 对 `dist/` 做模板处理（`-g ff`、`-p fe-entry-task` 为项目/分组参数）；成功后**并行**执行 `obs:images`。 |
| **tpl:goku** | `gfr tpl ./goku_dist/ -g ffgoku -p fe-entry-task` | 对 goku 模式构建产物 `goku_dist/` 做模板处理，使用 ffgoku 分组。 |
| **obs** | `gfr obs ./dist/ -d fe-entry-task -g ff` | 将 `dist/` 目录上传到 OBS 存储，目标路径为 `fe-entry-task`。 |
| **obs:audio** | `gfr obs ./static/audio/ -d fe-entry-task/audio -g ff` | 将 `static/audio/` 上传到 OBS，路径为 `fe-entry-task/audio`。 |
| **obs:images** | `gfr obs ./static/images/ -d fe-entry-task/images -g ff` | 将 `static/images/` 上传到 OBS，路径为 `fe-entry-task/images`。 |
| **transify** | `gfr transify ./mock/lang/ -r 726,740 -i 1` | 使用 gfr 做多语言/翻译相关处理，针对 `mock/lang/` 目录（`-r`、`-i` 为业务参数）。 |

---

## 四、依赖概览

### dependencies（生产依赖）

| 包名 | 用途 |
|------|------|
| **vue** | Vue 3 核心框架。 |
| **vue-router** | Vue 官方路由。 |
| **pinia** | Vue 官方推荐的状态管理库。 |
| **axios** | HTTP 请求库。 |
| **howler** | 音频播放（背景音乐、音效）。 |
| **@vueuse/core** | Vue 组合式工具函数集合。 |

### devDependencies（开发依赖）

| 包名 | 用途 |
|------|------|
| **vite** | 构建与开发服务器。 |
| **@vitejs/plugin-vue** | Vite 的 Vue 3 单文件组件支持。 |
| **@vitejs/plugin-vue-jsx** | Vite 的 Vue JSX 支持。 |
| **vue-tsc** | Vue 项目的 TypeScript 类型检查。 |
| **typescript** | TypeScript 语言支持。 |
| **sass** | SCSS 预处理器。 |
| **postcss-pxtorem** | 将 px 转为 rem，用于移动端适配。 |
| **prettier** | 代码格式化。 |
| **eslint**、**eslint-plugin-vue**、**@vue/eslint-config-*** | ESLint 及 Vue/TS 相关规则。 |
| **oxlint**、**eslint-plugin-oxlint** | Oxlint 快速检查与 ESLint 集成。 |
| **vitest**、**@vue/test-utils**、**@vitest/eslint-plugin** | 单元测试。 |
| **@playwright/test**、**eslint-plugin-playwright** | E2E 测试。 |
| **vite-plugin-mock** | 开发环境 Mock 接口。 |
| **vite-plugin-vue-devtools** | Vue DevTools 集成。 |
| **mockjs** | Mock 数据生成。 |
| **jiti** | 运行时 TypeScript 支持（如配置文件）。 |
| **jsdom** | 在 Node 中模拟 DOM（测试等）。 |
| **npm-run-all2** | 并行/串行执行多条 npm 脚本（`run-p`、`run-s`）。 |
| **@tsconfig/node22**、**@vue/tsconfig** | TypeScript/Node 与 Vue 的推荐配置基础。 |
| **@types/*** | 各类库的 TypeScript 类型声明。 |

---

## 五、常用工作流示例

- **本地开发**：`npm run dev`
- **完整构建（含类型检查）**：`npm run build`
- **只构建 + 模板/图片（不跑类型检查）**：`npm run build-only`
- **Goku 模式构建**：`npm run build:goku`
- **代码检查**：`npm run lint`；格式化：`npm run format`
- **单元测试**：`npm run test:unit`；E2E：`npm run test:e2e`
- **预览构建结果**：`npm run preview`

若需修改 Node 版本、脚本含义或依赖，可对照本文档在 `package.json` 中定位对应字段与脚本名。
