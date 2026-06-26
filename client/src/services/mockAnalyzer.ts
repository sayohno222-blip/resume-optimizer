import type { AnalysisResult } from '../types';

const MOCK_RESULTS: AnalysisResult[] = [
  {
    overallScore: 72,
    categories: {
      format: { score: 80, label: '格式与排版', maxScore: 100 },
      keywords: { score: 60, label: '关键词优化', maxScore: 100 },
      structure: { score: 75, label: '结构与组织', maxScore: 100 },
      content: { score: 73, label: '内容质量', maxScore: 100 },
    },
    keywords: {
      matched: ['React', 'TypeScript', 'Node.js', 'Git', 'REST API', 'Agile'],
      missing: ['Docker', 'Kubernetes', 'CI/CD', 'GraphQL', 'AWS'],
      overused: ['team player', 'hardworking'],
    },
    feedback: [
      {
        severity: 'high',
        category: 'keywords',
        message: '项目经历缺少技术栈关键词，HR 和 ATS 系统难以判断你的技术能力。',
        impact: 'ATS 系统依赖关键词筛选，缺少关键术语会让你的简历在初筛阶段被直接过滤。',
        suggestion: '在项目描述中明确标注使用的技术栈，包括前端框架、后端语言、数据库和部署工具。',
        exampleBefore: '做了一个简历优化器网站。',
        exampleAfter: '基于 React 19、TypeScript、Vite 和 Tailwind CSS 构建 AI 简历优化器，包含简历上传、ATS 分析引擎、关键词匹配和优化建议模块，通过 GitHub + Vercel 实现自动化部署。',
      },
      {
        severity: 'high',
        category: 'content',
        message: '工作/项目经历缺少量化成果，难以体现你的实际贡献。',
        impact: 'HR 平均只看一份简历 6-10 秒，没有量化结果的关键点无法留下印象。',
        suggestion: '在每条经历中补充具体数字：性能提升百分比、服务用户数、代码量、团队规模等。',
        exampleBefore: '负责公司官网前端开发和日常维护。',
        exampleAfter: '独立完成公司官网前端重构，使用 React + TypeScript 替换原有 jQuery 架构，页面加载速度提升 40%，核心 Web Vitals 指标达标率从 45% 提升至 92%，并建立可复用组件库减少后续开发约 30% 工时。',
      },
      {
        severity: 'medium',
        category: 'format',
        message: '简历可能使用了多栏排版或图片元素，影响 ATS 解析。',
        impact: '主流 ATS（Greenhouse、Workday、Lever）采用线性解析方式，多栏布局会导致内容读取顺序错乱，关键信息可能被忽略。',
        suggestion: '使用标准的单栏布局，所有内容按阅读顺序垂直排列。不要使用表格、文本框、图片来展示信息。',
      },
      {
        severity: 'medium',
        category: 'structure',
        message: '工作经历和教育背景的结构不够清晰，ATS 难以正确归类。',
        impact: 'ATS 需要明确的 section 标题来识别不同模块，格式不统一会导致解析错误。',
        suggestion: '使用标准分类标题：专业摘要、核心技能、工作经历、项目经验、教育背景。日期格式统一为 MM/YYYY - MM/YYYY。',
        exampleBefore: '[没有明确结构，混合展示个人信息和经历]',
        exampleAfter: '联系方式 / 专业摘要 / 核心技能（React、TypeScript、Node.js） / 工作经历（逆序排列） / 项目经验 / 教育背景',
      },
      {
        severity: 'low',
        category: 'keywords',
        message: '部分关键词过度使用，可能被 ATS 判定为关键词堆砌。',
        impact: '过度重复某些词汇（如 "team player"）可能触发 ATS 的垃圾关键词过滤机制，反而不利。',
        suggestion: '减少笼统的软技能关键词，用具体的项目经历自然体现这些能力。',
      },
      {
        severity: 'low',
        category: 'content',
        message: '专业摘要部分过于模板化，没有突出你的差异化优势。',
        impact: 'HR 每天看大量同质化摘要，"认真负责、团队合作"这类描述无法让你在候选者中脱颖而出。',
        suggestion: '在摘要中用 2-3 个关键成就直接展示你的核心竞争力，而非罗列软技能。',
        exampleBefore: '本人工作认真负责，具有良好的团队合作精神，能够承受工作压力。',
        exampleAfter: '前端工程师，2 年 React 开发经验，主导完成 3 个 B 端项目的技术选型和架构设计，项目上线后用户操作效率平均提升 35%。擅长性能优化和组件化开发。',
      },
    ],
    summary: '你的简历 ATS 兼容性 72/100，整体可读性良好。主要短板在关键词密度不足：缺少 Docker、CI/CD 等后端生态关键词，且项目经历缺少量化结果。修正后将显著提升 ATS 排名。',
  },
  {
    overallScore: 85,
    categories: {
      format: { score: 90, label: '格式与排版', maxScore: 100 },
      keywords: { score: 82, label: '关键词优化', maxScore: 100 },
      structure: { score: 88, label: '结构与组织', maxScore: 100 },
      content: { score: 80, label: '内容质量', maxScore: 100 },
    },
    keywords: {
      matched: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Data Analysis', 'Pandas', 'NumPy'],
      missing: ['PyTorch', 'MLOps', 'Feature Engineering'],
      overused: [],
    },
    feedback: [
      {
        severity: 'medium',
        category: 'keywords',
        message: '整体关键词匹配不错，但缺少 AI 领域最新的热门技术。',
        impact: '部分公司会对 PyTorch、MLOps 做定向筛选，缺少这些关键词可能错过机会。',
        suggestion: '如果使用过 PyTorch 或涉及 MLOps 流程，请务必标注在技能和项目经历中。',
        exampleBefore: '使用 TensorFlow 完成图像分类模型训练。',
        exampleAfter: '基于 TensorFlow 和 PyTorch 构建图像分类模型，使用 MLflow 管理实验追踪，通过 Docker 容器化部署至云端推理服务。',
      },
      {
        severity: 'low',
        category: 'content',
        message: '技术成果描述很好，但缺少与业务价值的关联。',
        impact: '面试官不仅想看技术能力，还想看到你对业务的影响力和商业敏感度。',
        suggestion: '在技术成果后补充业务影响，例如：节省成本、提升收入、缩短交付周期等。',
        exampleBefore: '优化模型推理速度，将延迟从 200ms 降低到 50ms。',
        exampleAfter: '优化模型推理速度（200ms → 50ms），使 API 服务可支撑日均 10 万次请求，节省服务器成本约 40%。',
      },
      {
        severity: 'low',
        category: 'structure',
        message: '教育经历对于初级岗位可放在靠前位置。',
        impact: '对于 3 年以内经验的候选者，教育背景是 HR 重点关注的字段，放在靠前位置更合理。',
        suggestion: '对于初级岗位，建议顺序为：联系方式 → 教育背景 → 技能 → 项目/实习经历。',
      },
    ],
    summary: '你的简历 ATS 兼容性 85/100，高于平均水平。格式清晰、关键词密度良好。在内容与业务价值的关联上还有提升空间，补充后可达到 90 分以上。',
  },
  {
    overallScore: 58,
    categories: {
      format: { score: 45, label: '格式与排版', maxScore: 100 },
      keywords: { score: 55, label: '关键词优化', maxScore: 100 },
      structure: { score: 50, label: '结构与组织', maxScore: 100 },
      content: { score: 65, label: '内容质量', maxScore: 100 },
    },
    keywords: {
      matched: ['JavaScript', 'HTML', 'CSS'],
      missing: ['React', 'TypeScript', 'Node.js', 'Git', 'REST API', 'Testing', 'Agile'],
      overused: ['responsible', 'helped', 'worked on'],
    },
    feedback: [
      {
        severity: 'high',
        category: 'format',
        message: '简历包含多栏排版或图片，ATS 无法正确读取内容。',
        impact: '部分 ATS 系统会直接丢弃无法解析的内容，你的简历可能被判定为"空文件"。这是最严重的问题。',
        suggestion: '彻底简化版式：单栏、无图、无表格、标准标题。先用纯文本格式测试 ATS 可读性。',
      },
      {
        severity: 'high',
        category: 'keywords',
        message: '技能部分严重缺少前端行业标准关键词。',
        impact: '目前匹配到的关键词仅有 HTML/CSS/JavaScript，对应岗位的核心要求（React、TypeScript、Git）均未覆盖。',
        suggestion: '立即补充 React、TypeScript、Git、REST API、Node.js 到技能清单，并在项目经历中体现使用场景。',
        exampleBefore: '技能：HTML、CSS、JavaScript',
        exampleAfter: '技能：React 19、TypeScript、JavaScript (ES6+)、HTML5、CSS3/Tailwind、Node.js、Git、RESTful API',
      },
      {
        severity: 'high',
        category: 'content',
        message: '项目描述停留在"做了什么"层面，缺少"做成了什么"。',
        impact: '职责式描述（"负责"、"参与"、"协助"）无法让 HR 判断你的个人贡献和产出水平。',
        suggestion: '将每条描述改为：使用什么技术 + 完成了什么功能 + 取得了什么结果。',
        exampleBefore: '负责公司官网的页面开发和维护，协助后端完成接口对接。',
        exampleAfter: '使用 React + TypeScript 开发官网首页和 5 个营销落地页，通过组件化开发将页面复用率提升 60%，并配合后端完成 RESTful API 对接实现动态内容管理。',
      },
      {
        severity: 'medium',
        category: 'structure',
        message: '缺少关键模块：专业摘要、核心技能。',
        impact: 'ATS 标准期望看到清晰的模块划分。缺少模块会降低简历的结构分数。',
        suggestion: '增加专业摘要（2-3 句话介绍自己）和核心技能（技术关键词清单）两个独立模块。',
      },
      {
        severity: 'medium',
        category: 'content',
        message: '部分用词过于笼统，缺乏说服力。',
        impact: '"helped with"、"worked on" 这类用词会让 ATS 判定为低质量内容，降低内容得分。',
        suggestion: '用具体的行为动词替换：built（构建）、optimized（优化）、implemented（实现）、designed（设计）。',
        exampleBefore: 'Helped with the development of the login page.',
        exampleAfter: 'Built a responsive login page with form validation using React Hook Form and Zod, reducing registration errors by 25%.',
      },
    ],
    summary: '你的简历 ATS 兼容性 58/100，需要较大改进。最紧迫的问题是多栏排版导致 ATS 无法读取，以及关键词密度严重不足。建议先简化为单栏纯文本格式，然后系统性地补充技术关键词。',
  },
];

function pickRandomJob(): AnalysisResult {
  return MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
}

interface MockChunk {
  id: number;
  text: string;
  delay: number;
}

function buildChunks(result: AnalysisResult): MockChunk[] {
  const json = JSON.stringify(result, null, 2);
  const charsPerChunk = 8 + Math.floor(Math.random() * 12);
  const chunks: MockChunk[] = [];
  let id = 0;

  for (let i = 0; i < json.length; i += charsPerChunk) {
    chunks.push({
      id,
      text: json.slice(i, i + charsPerChunk),
      delay: 60 + Math.random() * 80,
    });
    id++;
  }

  return chunks;
}

export interface MockCallbacks {
  onChunk: (chunk: string, chunkId: number) => void;
  onComplete: (result: AnalysisResult) => void;
  onProgress: (progress: number) => void;
}

export async function runMockAnalysis(callbacks: MockCallbacks): Promise<void> {
  const result = pickRandomJob();
  const chunks = buildChunks(result);

  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i];
    await new Promise((r) => setTimeout(r, c.delay));
    callbacks.onChunk(c.text, c.id);
    callbacks.onProgress(Math.round(((i + 1) / chunks.length) * 100));
  }

  callbacks.onComplete(result);
}

export function getMockDuration(): number {
  return 2000 + Math.random() * 1500;
}
