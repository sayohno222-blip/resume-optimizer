# ATS Resume Optimizer

> 一个用于简历 ATS 兼容性分析和优化建议生成的 AI 工具。

**在线体验**：[resume-optimizer-beta-ten.vercel.app](https://resume-optimizer-beta-ten.vercel.app/)
**GitHub 仓库**：[github.com/sayohno222-blip/resume-optimizer](https://github.com/sayohno222-blip/resume-optimizer)

---

## 项目简介

ATS Resume Optimizer 是一款面向求职者的简历优化工具。用户上传简历后，系统对简历进行 ATS（Applicant Tracking System，申请人追踪系统）兼容性分析，生成包括总体评分、分类得分、关键词匹配和优化建议的综合报告。

**当前状态：演示版（V1.0 Demo）**

- 前端流程完整：上传 → 分析 → 结果展示 → 优化建议 → 前后对比
- AI 分析当前为 Mock 数据，展示完整产品流程
- 后端代码已预留（Express + DeepSeek API），待部署后启用
- 从 Mock 切换到真实 API 只需修改 `config.ts` 中 `IS_MOCK = false`

---

## 功能列表

| 功能 | 说明 |
|---|---|
| 简历上传 | 拖拽或点击上传 PDF / DOCX / TXT，前端校验格式（≤5MB） |
| 分析阶段提示 | 4 阶段进度：解析简历 → 识别关键词 → 计算 ATS 匹配度 → 生成建议 |
| ATS 评分展示 | 圆环分数 + 评级文字（优秀 / 良好 / 需要改进 / 待优化） |
| 分类得分 | 格式排版、关键词优化、结构组织、内容质量 4 维度卡片式展示 |
| 关键词分析 | 已匹配 / 缺失 / 可优化关键词，标签式呈现 |
| 优化建议 | 问题 → 影响 → 修改建议 → 示例改写，层级清晰 |
| 优化前后对比 | 原始表达和优化后表达并排对比，支持一键复制 |
| 移动端适配 | 首页、上传区、结果页支持手机端浏览 |
| Mock 透明标注 | 演示版页面明确标注"演示版本"，避免误导用户 |
| 生产环境优化 | 调试面板在生产构建中自动隐藏 |

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

## 项目结构

```
resume-optimizer/
├── client/                   # 前端应用
│   ├── src/
│   │   ├── components/       # UI 组件（layout / upload / results / streaming）
│   │   ├── hooks/            # 自定义 Hooks（useAnalyze 状态机）
│   │   ├── services/         # Mock 分析引擎
│   │   └── types/            # TypeScript 类型定义
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── server/                   # 后端服务（预留）
│   ├── src/
│   │   ├── routes/           # /api/analyze, /api/analyze/stream
│   │   ├── services/         # AI 调用、文件解析、SSE 管理
│   │   ├── middleware/       # 熔断、限流、上传
│   │   └── prompts/          # AI Prompt 模板
│   └── package.json
├── .env.example              # 环境变量模板
├── .gitignore
├── package.json
└── vercel.json               # Vercel 部署配置
```

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

### 构建前端

```bash
cd client
npm run build
```

构建产物输出到 `client/dist/`。

### 启动后端（预留，暂不可用）

```bash
cd server
npm install
# 复制 .env.example 为 .env 并填入 API Key
cp ../.env.example ../.env
npm run dev
```

后端默认运行在 `http://localhost:3001`。

---

## 环境变量说明

参考 `.env.example`，当前预留以下变量：

| 变量 | 说明 | 默认值 |
|---|---|---|
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | （空） |
| `DEEPSEEK_BASE_URL` | DeepSeek API 地址 | `https://api.deepseek.com` |
| `DEEPSEEK_MODEL` | AI 模型名称 | `deepseek-chat` |
| `PORT` | 后端服务端口 | `3001` |
| `MAX_FILE_SIZE_MB` | 上传文件大小限制（MB） | `5` |
| `CLIENT_ORIGIN` | 前端地址（CORS） | `http://localhost:5173` |

> **注意**：`.env` 文件包含敏感信息，已被 `.gitignore` 排除，不会提交到仓库。

---

## 部署说明

### Vercel 部署（当前）

项目使用根目录 `vercel.json` 配置部署：

```json
{
  "buildCommand": "cd client && npm install && npx vite build",
  "outputDirectory": "client/dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

部署方式：
1. 在 [Vercel](https://vercel.com) 中导入 GitHub 仓库
2. 框架预设选 **Other**
3. Vercel 会自动读取 `vercel.json` 配置
4. 每次推送 `main` 分支自动触发部署

### 后端部署（计划中）

后端计划部署到 Railway 或 Fly.io，需配置环境变量 `DEEPSEEK_API_KEY`。

---

## 截图

> 以下为占位区域，后续可替换为实际截图。

- **首页**：_（待添加截图）_
- **上传区**：_（待添加截图）_
- **分析过程**：_（待添加截图）_
- **结果页**：_（待添加截图）_
- **优化前后对比**：_（待添加截图）_

---

## Roadmap

- [ ] 真实文件解析（PDF / DOCX 文本提取）
- [ ] 接入 DeepSeek API（真实 AI 分析）
- [ ] 后端部署（Vercel Serverless Function 或独立 Node 服务）
- [ ] 结果导出（PDF 报告）
- [ ] AI 模拟面试模块

---

## 许可

仅用于学习与作品集展示
