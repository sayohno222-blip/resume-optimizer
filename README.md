# Resume Optimizer · AI 简历优化器

> 用 AI 分析简历 ATS 兼容性，检测关键词匹配度，提供可执行的优化建议。

**在线体验**：[resume-optimizer-beta-ten.vercel.app](https://resume-optimizer-beta-ten.vercel.app/)
**GitHub 仓库**：[github.com/sayohno222-blip/resume-optimizer](https://github.com/sayohno222-blip/resume-optimizer)

---

## 项目简介

Resume Optimizer 是一个 AI 简历优化器的前端产品 Demo。用户上传简历后，系统模拟 AI 分析流程，生成 ATS（Applicant Tracking System）兼容性报告，包括总体评分、分类得分、关键词分析和优化建议。

**当前版本为前端演示版本**，使用 Mock 数据展示完整产品流程。后端已预留 AI 分析、PDF/DOCX 解析和 SSE 流式输出能力，待后续接入真实 API。

---

## 核心功能

| 功能 | 说明 |
|---|---|
| 简历上传 | 支持拖拽或点击上传 PDF / DOCX / TXT 文件，前端校验格式和大小 |
| 分析阶段提示 | 4 阶段进度展示：解析简历 → 识别关键词 → 计算 ATS 匹配度 → 生成建议 |
| ATS 评分展示 | 圆环分数 + 评级文字（优秀 / 良好 / 需要改进 / 待优化） |
| 分类得分 | 格式排版、关键词优化、结构组织、内容质量 4 个维度卡片式展示 |
| 关键词分析 | 已匹配关键词 / 缺失关键词 / 可优化关键词，标签式呈现 |
| 优化建议 | 问题 → 影响 → 修改建议 → 示例改写，层级清晰 |
| 优化前后对比 | 原始表达和优化后表达并排对比，支持一键复制 |
| 移动端适配 | 首页、上传区、结果页支持手机端浏览 |

---

## 技术栈

| 层 | 技术 |
|---|---|
| 前端框架 | React 19 + TypeScript 5 |
| 构建工具 | Vite 6 |
| 样式方案 | Tailwind CSS 4 |
| 状态管理 | useReducer + 状态机模式 |
| 后端（预留） | Node.js + Express 5 |
| AI API（预留） | DeepSeek Chat（OpenAI SDK） |
| 文件解析（预留） | pdf-parse / mammoth |
| 部署 | GitHub + Vercel 自动部署 |

---

## 项目亮点

- **产品化首页设计**：Hero 区清晰传达价值主张，3 步流程引导降低用户理解成本
- **分析过程可视化**：4 阶段进度提示让 AI 工作过程透明，增强真实感
- **结果页信息层级优化**：总分突出 → 分类得分 → 关键词 → 建议，层层递进
- **可执行的优化建议**：每条建议拆分为问题、影响、修改建议、示例改写，用户可直接复制使用
- **优化前后对比**：原始表达和优化后表达并排对比，直观展示优化效果
- **Mock/真实数据边界透明**：页面明确标注"演示版本"，避免误导用户
- **生产环境优化**：调试面板在生产构建中自动隐藏

---

## 版本说明

```
Version 1.0.0 (Demo)
```

- 当前线上版本为**前端演示版本**
- 分析结果使用 Mock 数据展示产品流程，暂未接入真实 AI API
- 后端目录 `server/` 已预留 AI 分析、文件解析、SSE 流式输出能力，待部署后启用
- 从 Mock 切换到真实 API 后，只需修改配置文件 `IS_MOCK = false`，无需大规模重构

---

## 本地运行

### 前置要求

- Node.js >= 18
- npm

### 启动前端

```bash
cd client
npm install
npm run dev
```

前端默认运行在 `http://localhost:5173`。

### 构建产物

```bash
cd client
npm run build
```

构建产物输出到 `client/dist/`。

### 启动后端（预留）

```bash
cd server
npm install
# 配置 .env 文件（参考 .env.example）
npm run dev
```

后端默认运行在 `http://localhost:3001`。

---

## 截图

> 以下为占位区域，建议后续替换为实际截图。

### 首页
_（待添加截图）_

### 上传区
_（待添加截图）_

### 分析过程
_（待添加截图）_

### 结果页
_（待添加截图）_

### 优化建议
_（待添加截图）_

### 优化前后对比
_（待添加截图）_

---

## 后续计划

- [ ] 接入真实 AI API（DeepSeek）
- [ ] 部署后端服务（Railway / Fly.io）
- [ ] 真实 PDF/DOCX 解析和文本提取
- [ ] 导出 PDF 分析报告
- [ ] 优化建议历史记录
- [ ] 暗色模式

---

## 项目结构

```
resume-optimizer/
├── client/                   # 前端（React + Vite + Tailwind）
│   ├── src/
│   │   ├── components/       # UI 组件
│   │   │   ├── layout/       # 布局、导航
│   │   │   ├── upload/       # 文件上传
│   │   │   ├── results/      # 结果展示
│   │   │   ├── streaming/    # 流式分析
│   │   │   └── common/       # 通用组件
│   │   ├── hooks/            # 自定义 Hooks
│   │   ├── services/         # Mock 分析引擎
│   │   └── types/            # TypeScript 类型定义
│   └── ...
├── server/                   # 后端（Express，预留）
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── prompts/
│   └── ...
├── .gitignore
├── package.json
└── vercel.json
```

---

## 许可

仅用于学习与作品集展示


