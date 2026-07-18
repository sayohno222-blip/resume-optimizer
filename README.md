# ATS Resume Optimizer

> 简历 ATS 兼容性分析工具｜前端交互演示

[在线体验](https://resume-optimizer-beta-ten.vercel.app/) · [GitHub 仓库](https://github.com/sayohno222-blip/resume-optimizer)

## 项目定位

ATS Resume Optimizer 面向求职者，展示“上传简历 → 分析 → 查看评分 → 获取修改建议 → 对比优化结果”的完整产品流程。项目重点是需求拆解、交互流程、结果信息层级和前端部署。

## 当前状态

- 当前默认使用 Mock 数据，页面会明确标注“演示版本”。
- 前端流程完整，可用于展示产品设计与前端实现能力。
- 公开 AI 接口已停用；当前线上版本不会读取密钥或调用 DeepSeek。
- TXT 文本读取已预留；PDF 与 DOCX 的真实文本解析尚未实现。
- 演示分数和建议不代表真实 ATS 系统结果。

## 核心功能

| 功能 | 当前实现 |
|---|---|
| 简历上传 | 支持选择 PDF / DOCX / TXT，进行文件格式与大小校验 |
| 岗位描述 | 可填写目标岗位 JD，展示关键词匹配场景 |
| 分析过程 | 展示解析、关键词识别、评分和建议生成等阶段 |
| ATS 评分 | 展示总体得分及格式、关键词、结构、内容四个维度 |
| 关键词分析 | 区分已匹配、缺失和需要优化的关键词 |
| 修改建议 | 按问题、影响、建议和改写示例组织结果 |
| 前后对比 | 并排展示原始表达与优化表达，支持复制 |
| 响应式布局 | 适配桌面端和移动端浏览 |

## 技术栈

| 模块 | 技术 |
|---|---|
| 前端 | React 19、TypeScript 5 |
| 构建 | Vite 6 |
| 样式 | Tailwind CSS 4 |
| 状态管理 | useReducer + 状态机式流程 |
| API（预留） | 公开接口已停用；完成鉴权与限流后再启用 |
| 部署 | GitHub + Vercel |

## 项目结构

```text
resume-optimizer/
├── client/                 # React 前端
│   └── src/
│       ├── components/     # 上传、结果、布局等组件
│       ├── hooks/          # 分析流程与状态管理
│       ├── services/       # Mock 与 API 调用逻辑
│       └── types/          # TypeScript 类型
├── api/
│   └── analyze.js          # 固定返回停用状态，不调用外部 AI
├── .env.example            # 环境变量示例，不包含真实密钥
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

## 我的工作

- 确定目标用户、核心功能和分析流程。
- 规划页面结构、结果信息层级与交互状态。
- 使用 React、TypeScript 和 Tailwind CSS 完成前端页面。
- 调整视觉细节和移动端布局，并通过 GitHub 与 Vercel 完成部署。
- 项目使用 AI 辅助开发；需求定义、布局判断、交互取舍和最终视觉调整由我完成。

## 后续方向

- [ ] 实现 PDF / DOCX 文本解析
- [ ] 完成真实 API 模式的安全配置与错误处理
- [ ] 增加结果导出
- [ ] 增加真实简历与岗位 JD 的可用性测试

## 使用说明

本项目用于学习、作品集展示和产品流程验证，不提供招聘结果或 ATS 通过率保证。
