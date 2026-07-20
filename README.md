# ATS Resume Optimizer

> 在浏览器本地运行的简历结构、内容与岗位关键词检查工具

[在线体验](https://resume-optimizer-beta-ten.vercel.app/) · [GitHub 仓库](https://github.com/sayohno222-blip/resume-optimizer)

## 项目定位

ATS Resume Optimizer 面向求职者，提供“上传简历 → 读取文本 → 对照岗位 JD → 查看规则分数 → 获取修改建议”的完整自查流程。项目重点是隐私友好的本地文件处理、规则评分、交互状态和结果信息层级。

## 当前状态

- 分析逻辑在浏览器本地运行，不上传、保存或发送简历内容。
- 支持读取带文字层的 PDF、DOCX 和 UTF-8 TXT，单个文件最大 5MB。
- 提供岗位关键词匹配、结构完整性、文本可读性和内容表达检查。
- 不调用 DeepSeek、OpenAI 或其他第三方 AI API，不需要用户密钥。
- `/api/analyze` 保持关闭，避免公开端点意外消耗密钥。
- `server/` 是未接入生产环境的后端原型，不参与当前 Vercel 部署。

## 核心功能

| 功能 | 当前实现 |
|---|---|
| 简历读取 | 浏览器本地解析 PDF / DOCX / TXT，不上传文件 |
| 岗位描述 | 提取目标岗位 JD 中的技能、工具与业务关键词 |
| 关键词匹配 | 展示已覆盖和缺失的重点词，提醒只补充真实经历 |
| 结构检查 | 检查联系方式、教育、技能、项目和实践等常见模块 |
| 内容检查 | 识别行动词、数字成果、弱表达和文本长度 |
| 规则评分 | 汇总文本可读性、岗位关键词、结构和内容四个维度 |
| 修改建议 | 按问题、影响和建议组织结果，提供不虚构数据的改写模板 |
| 响应式布局 | 适配桌面端和移动端浏览 |

## 技术栈

| 模块 | 技术 |
|---|---|
| 前端 | React 19、TypeScript 5 |
| 构建 | Vite 6 |
| 样式 | Tailwind CSS 4 |
| 文件解析 | PDF.js、Mammoth |
| 状态管理 | useReducer + 状态机式流程 |
| 部署 | GitHub + Vercel |

## 项目结构

```text
resume-optimizer/
├── client/
│   └── src/
│       ├── components/              # 上传、加载、结果与布局组件
│       ├── hooks/useAnalyze.ts       # 本地分析流程与状态管理
│       ├── services/fileParser.ts    # PDF / DOCX / TXT 本地解析
│       ├── services/localAnalyzer.ts # 关键词、结构、内容与评分规则
│       └── types/                    # TypeScript 类型
├── api/analyze.js                    # 公开 AI 分析端点保持关闭
├── server/                           # 未部署的后端原型
├── package.json
└── vercel.json
```

## 本地运行

```bash
git clone https://github.com/sayohno222-blip/resume-optimizer.git
cd resume-optimizer/client
npm ci
npm run dev
```

生产构建：

```bash
cd client
npm run build
```

## 评分边界

本项目不是任何招聘平台或企业 ATS 的官方检测器。规则分数用于帮助用户发现文本层、关键词和内容结构问题，不能判断真实录用概率，也不能可靠识别 PDF 中所有多栏、文本框、图标或视觉排版问题。

扫描版 PDF 如果没有文字层，需要先进行 OCR，或改用 DOCX / TXT。

## 我的工作

- 确定目标用户、核心功能和隐私优先的本地分析方案。
- 规划上传、解析、检查和结果反馈的完整交互流程。
- 使用 React、TypeScript 和 Tailwind CSS 完成响应式前端。
- 设计关键词、结构、内容和文本可读性规则，并组织结果层级。
- 通过 GitHub 与 Vercel 完成自动构建和生产部署。
- 项目使用 AI 辅助开发；需求定义、规则取舍、布局判断和最终验证由我完成。

## 使用说明

本项目用于学习、作品集展示和简历自查。所有建议都需要用户结合真实经历人工核对，禁止为了提高分数编造关键词、数据或项目成果。
