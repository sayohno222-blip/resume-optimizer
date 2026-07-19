import type { AnalysisResult, FeedbackItem } from '../types';
import { extractResumeText } from './fileParser';

interface LocalAnalyzerCallbacks {
  onStage?: (stage: number) => void;
}

interface KnownTerm {
  label: string;
  aliases: string[];
}

const KNOWN_TERMS: KnownTerm[] = [
  { label: 'React', aliases: ['react'] },
  { label: 'Vue', aliases: ['vue', 'vue.js'] },
  { label: 'TypeScript', aliases: ['typescript'] },
  { label: 'JavaScript', aliases: ['javascript'] },
  { label: 'Node.js', aliases: ['node.js', 'nodejs'] },
  { label: 'Python', aliases: ['python'] },
  { label: 'Java', aliases: ['java'] },
  { label: 'SQL', aliases: ['sql'] },
  { label: 'Excel', aliases: ['excel'] },
  { label: 'PowerPoint', aliases: ['powerpoint', 'ppt'] },
  { label: 'Photoshop', aliases: ['photoshop', 'ps'] },
  { label: 'Figma', aliases: ['figma'] },
  { label: 'CAD', aliases: ['cad', 'autocad'] },
  { label: '剪映', aliases: ['剪映'] },
  { label: 'Git', aliases: ['git', 'github'] },
  { label: 'Vercel', aliases: ['vercel'] },
  { label: 'SEO', aliases: ['seo'] },
  { label: 'A/B 测试', aliases: ['a/b测试', 'a/b test', 'ab测试'] },
  { label: '数据分析', aliases: ['数据分析', 'data analysis'] },
  { label: '用户研究', aliases: ['用户研究', 'user research'] },
  { label: '竞品分析', aliases: ['竞品分析'] },
  { label: '内容运营', aliases: ['内容运营'] },
  { label: '产品运营', aliases: ['产品运营'] },
  { label: '用户运营', aliases: ['用户运营'] },
  { label: '新媒体运营', aliases: ['新媒体运营'] },
  { label: '活动策划', aliases: ['活动策划', '活动执行'] },
  { label: '短视频', aliases: ['短视频', '视频剪辑'] },
  { label: '小红书', aliases: ['小红书'] },
  { label: '抖音', aliases: ['抖音', 'douyin', 'tiktok'] },
  { label: '文案', aliases: ['文案', 'copywriting'] },
  { label: '沟通协调', aliases: ['沟通协调', '沟通能力', 'communication'] },
  { label: '团队协作', aliases: ['团队协作', '团队合作', 'teamwork'] },
];

const ENGLISH_STOP_WORDS = new Set([
  'and', 'the', 'with', 'for', 'from', 'that', 'this', 'you', 'your', 'our', 'are', 'will',
  'job', 'work', 'role', 'team', 'have', 'has', 'years', 'year', 'skills', 'skill', 'ability',
  'responsible', 'requirements', 'preferred', 'plus', 'using', 'related', 'good', 'strong',
]);

const CHINESE_STOP_WORDS = new Set([
  '职位', '岗位', '工作', '要求', '负责', '相关', '进行', '能够', '我们', '公司', '经验', '优先',
  '以上', '具有', '良好', '能力', '完成', '熟悉', '参与', '协助', '内容', '以及', '团队', '专业',
  '实习',
]);

const SECTION_PATTERNS = {
  contact: [/\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b/i, /(?:\+?86[- ]?)?1[3-9]\d{9}/],
  education: [/教育背景/i, /教育经历/i, /学历/i, /education/i],
  skills: [/专业技能/i, /核心技能/i, /技能清单/i, /skills?/i],
  projects: [/项目经历/i, /项目经验/i, /projects?/i],
  experience: [/工作经历/i, /实习经历/i, /实践经历/i, /experience/i],
  summary: [/个人总结/i, /自我评价/i, /专业摘要/i, /summary/i, /profile/i],
};

const ACTION_VERBS = [
  '策划', '执行', '搭建', '设计', '开发', '优化', '分析', '协调', '组织', '撰写', '制作', '运营',
  '负责', '主导', '完成', '提升', '降低', 'built', 'designed', 'developed', 'optimized', 'analyzed',
  'coordinated', 'created', 'managed', 'led', 'implemented',
];

const WEAK_PHRASES = ['负责', '参与', '协助', '熟悉', 'responsible for', 'helped', 'worked on'];

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function countOccurrences(text: string, term: string): number {
  if (!term) return 0;
  return text.toLowerCase().split(term.toLowerCase()).length - 1;
}

function containsKnownTerm(text: string, term: KnownTerm): boolean {
  const lower = text.toLowerCase();
  return term.aliases.some((alias) => lower.includes(alias.toLowerCase()));
}

function segmentChineseWords(text: string): string[] {
  if (typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' });
    return Array.from(segmenter.segment(text))
      .filter((part) => part.isWordLike)
      .map((part) => part.segment);
  }

  return text.match(/[\u4e00-\u9fff]{2,8}/g) ?? [];
}

function extractJdKeywords(jobDescription: string): string[] {
  const counts = new Map<string, number>();
  const lower = jobDescription.toLowerCase();
  const knownLabels: string[] = [];

  for (const term of KNOWN_TERMS) {
    if (containsKnownTerm(jobDescription, term)) {
      const frequency = Math.max(...term.aliases.map((alias) => countOccurrences(lower, alias)));
      counts.set(term.label, 20 + frequency);
      knownLabels.push(term.label.toLowerCase());
    }
  }

  const isCoveredByKnownTerm = (word: string) => knownLabels.some((label) => (
    label !== word.toLowerCase() && label.includes(word.toLowerCase())
  ));

  const englishWords = lower.match(/[a-z][a-z0-9+#./-]{1,24}/g) ?? [];
  for (const word of englishWords) {
    if (ENGLISH_STOP_WORDS.has(word) || /^\d/.test(word) || isCoveredByKnownTerm(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  for (const word of segmentChineseWords(jobDescription)) {
    if (word.length < 2 || word.length > 8 || CHINESE_STOP_WORDS.has(word) || isCoveredByKnownTerm(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([keyword]) => keyword)
    .filter((keyword, index, all) => !all.slice(0, index).some((existing) => existing.toLowerCase() === keyword.toLowerCase()))
    .slice(0, 16);
}

function keywordAppears(text: string, keyword: string): boolean {
  const known = KNOWN_TERMS.find((term) => term.label.toLowerCase() === keyword.toLowerCase());
  if (known) return containsKnownTerm(text, known);
  return text.toLowerCase().includes(keyword.toLowerCase());
}

function detectResumeKeywords(text: string): string[] {
  return KNOWN_TERMS.filter((term) => containsKnownTerm(text, term)).map((term) => term.label).slice(0, 16);
}

function hasAnyPattern(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function calculateFormatScore(text: string, extension: string): number {
  let score = 65;
  const lineCount = text.split('\n').filter((line) => line.trim()).length;

  if (text.length >= 300) score += 10;
  if (text.length >= 800 && text.length <= 12_000) score += 8;
  if (lineCount >= 8) score += 7;
  if (extension === 'txt' || extension === 'docx') score += 5;
  if (text.includes('\ufffd')) score -= 25;
  if (text.length > 30_000) score -= 5;

  return clamp(score);
}

function calculateStructureScore(text: string): { score: number; missingSections: string[]; hasContact: boolean } {
  const hasContact = hasAnyPattern(text, SECTION_PATTERNS.contact);
  const sections = [
    ['教育背景', hasAnyPattern(text, SECTION_PATTERNS.education)],
    ['技能', hasAnyPattern(text, SECTION_PATTERNS.skills)],
    ['项目经历', hasAnyPattern(text, SECTION_PATTERNS.projects)],
    ['工作/实践经历', hasAnyPattern(text, SECTION_PATTERNS.experience)],
    ['个人摘要', hasAnyPattern(text, SECTION_PATTERNS.summary)],
  ] as const;
  const missingSections = sections.filter(([, present]) => !present).map(([label]) => label);
  const presentCount = sections.length - missingSections.length;
  const hasCoreExperience = sections[2][1] || sections[3][1];
  const score = 28 + (hasContact ? 17 : 0) + presentCount * 9 + (hasCoreExperience ? 10 : 0);

  return { score: clamp(score), missingSections, hasContact };
}

function calculateContentScore(text: string): { score: number; metricCount: number; actionCount: number; bulletCount: number } {
  const metricCount = (text.match(/(?:\d+(?:\.\d+)?%|\d+\s*(?:人|次|项|个|篇|场|天|周|月|年|元|万|k|K))/g) ?? []).length;
  const actionCount = ACTION_VERBS.reduce((sum, verb) => sum + Math.min(countOccurrences(text, verb), 3), 0);
  const bulletCount = text.split('\n').filter((line) => /^\s*(?:[-•·▪]|\d+[.)、])/.test(line)).length;
  let score = 42;

  score += Math.min(metricCount * 5, 20);
  score += Math.min(actionCount * 2, 18);
  score += Math.min(bulletCount * 2, 10);
  if (text.length >= 600) score += 5;
  if (text.length < 250) score -= 20;

  return { score: clamp(score), metricCount, actionCount, bulletCount };
}

function detectOverusedPhrases(text: string): string[] {
  return WEAK_PHRASES
    .map((phrase) => ({ phrase, count: countOccurrences(text, phrase) }))
    .filter(({ count }) => count >= 3)
    .map(({ phrase, count }) => `${phrase}（${count}次）`);
}

function buildFeedback(params: {
  text: string;
  hasJobDescription: boolean;
  matched: string[];
  missing: string[];
  hasContact: boolean;
  missingSections: string[];
  metricCount: number;
  actionCount: number;
  extension: string;
}): FeedbackItem[] {
  const feedback: FeedbackItem[] = [];

  if (!params.hasJobDescription) {
    feedback.push({
      severity: 'medium',
      category: 'keywords',
      message: '没有提供目标岗位 JD，无法计算岗位关键词匹配率。',
      suggestion: '粘贴准备投递岗位的完整职位描述，再重新分析。不同岗位需要不同版本的简历。',
      impact: '当前关键词分数只反映简历中可识别的技能和运营术语，不代表与具体岗位匹配。',
    });
  } else if (params.missing.length > 0) {
    feedback.push({
      severity: params.missing.length > params.matched.length ? 'high' : 'medium',
      category: 'keywords',
      message: `岗位描述中的部分重要词没有出现在简历中：${params.missing.slice(0, 6).join('、')}。`,
      suggestion: '只补充你真实掌握或做过的关键词，并在项目或实践经历中说明使用场景，不要直接堆词。',
      impact: '规则筛选通常会优先检查岗位要求中的技能、工具和业务场景是否出现在简历文本里。',
    });
  }

  if (!params.hasContact) {
    feedback.push({
      severity: 'high',
      category: 'structure',
      message: '没有识别到有效的邮箱或中国大陆手机号。',
      suggestion: '在简历顶部加入常用手机号和邮箱，并确保它们是可以复制的普通文字。',
      impact: '联系方式缺失或被做成图片，会影响招聘人员联系，也可能导致解析失败。',
    });
  }

  const importantMissingSections = params.missingSections.filter((section) => section !== '个人摘要');
  if (importantMissingSections.length > 0) {
    feedback.push({
      severity: importantMissingSections.length >= 3 ? 'high' : 'medium',
      category: 'structure',
      message: `没有识别到这些常见模块：${importantMissingSections.join('、')}。`,
      suggestion: '使用清楚的标准标题，并按“基本信息—教育—技能—项目/实践”的顺序组织内容。',
    });
  }

  if (params.metricCount < 2) {
    feedback.push({
      severity: 'medium',
      category: 'content',
      message: '经历描述中可识别的数字或结果较少。',
      suggestion: '补充真实的活动次数、参与人数、内容数量、周期或效果；没有数据就不要编造。',
      impact: '具体数字能帮助招聘人员快速判断你的工作范围和实际产出。',
      exampleBefore: '负责校园活动的宣传和执行。',
      exampleAfter: '策划并执行校园活动宣传，完成海报、通知与现场协调；请补充真实的活动场次、参与人数或内容数量。',
    });
  }

  if (params.actionCount < 3) {
    feedback.push({
      severity: 'low',
      category: 'content',
      message: '经历描述中的具体行动词较少，个人贡献不够清楚。',
      suggestion: '每条经历尽量以“策划、制作、分析、协调、优化、完成”等具体动作开头。',
    });
  }

  if (params.text.length < 300) {
    feedback.push({
      severity: 'high',
      category: 'content',
      message: '简历文字内容偏少，现有信息不足以支持完整判断。',
      suggestion: '补充教育背景、技能、项目或校园实践，并说明你具体做了什么。',
    });
  }

  if (params.extension === 'pdf') {
    feedback.push({
      severity: 'low',
      category: 'format',
      message: '本次只检查了 PDF 的文字层，无法可靠判断多栏、文本框、图标等视觉排版。',
      suggestion: '另存一份纯文本查看读取顺序；正式投递时优先使用单栏、少图形的版式。',
    });
  }

  if (feedback.length === 0) {
    feedback.push({
      severity: 'low',
      category: 'content',
      message: '基础规则检查没有发现明显缺项。',
      suggestion: '继续人工核对事实、错别字和岗位针对性；本工具的规则分数不能替代招聘人员判断。',
    });
  }

  return feedback.slice(0, 7);
}

export function analyzeResumeText(resumeText: string, jobDescription: string, fileName = 'resume.txt'): AnalysisResult {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
  const jdKeywords = extractJdKeywords(jobDescription);
  const hasJobDescription = jobDescription.trim().length >= 20;
  const resumeKeywords = detectResumeKeywords(resumeText);
  const matched = hasJobDescription
    ? jdKeywords.filter((keyword) => keywordAppears(resumeText, keyword))
    : resumeKeywords;
  const missing = hasJobDescription
    ? jdKeywords.filter((keyword) => !keywordAppears(resumeText, keyword))
    : [];
  const keywordScore = hasJobDescription && jdKeywords.length > 0
    ? clamp(35 + (matched.length / jdKeywords.length) * 65)
    : clamp(48 + Math.min(resumeKeywords.length * 3, 27));
  const formatScore = calculateFormatScore(resumeText, extension);
  const structure = calculateStructureScore(resumeText);
  const content = calculateContentScore(resumeText);
  const overallScore = clamp(
    formatScore * 0.2
    + keywordScore * 0.3
    + structure.score * 0.22
    + content.score * 0.28,
  );
  const feedback = buildFeedback({
    text: resumeText,
    hasJobDescription,
    matched,
    missing,
    hasContact: structure.hasContact,
    missingSections: structure.missingSections,
    metricCount: content.metricCount,
    actionCount: content.actionCount,
    extension,
  });
  const matchSummary = hasJobDescription
    ? `识别到 ${jdKeywords.length} 个岗位重点词，简历覆盖 ${matched.length} 个。`
    : `未提供完整 JD，已识别 ${resumeKeywords.length} 个技能或业务术语。`;

  return {
    overallScore,
    categories: {
      format: { score: formatScore, label: '文本可读性', maxScore: 100 },
      keywords: { score: keywordScore, label: '岗位关键词', maxScore: 100 },
      structure: { score: structure.score, label: '结构完整性', maxScore: 100 },
      content: { score: content.score, label: '内容表达', maxScore: 100 },
    },
    keywords: {
      matched,
      missing,
      overused: detectOverusedPhrases(resumeText),
    },
    feedback,
    summary: `本地规则分析已读取约 ${resumeText.length} 个字符。${matchSummary} 当前 ${overallScore} 分是规则参考值，不是招聘平台或企业 ATS 的官方分数。`,
  };
}

function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, 0));
}

export async function analyzeResumeLocally(
  file: File,
  jobDescription: string,
  callbacks: LocalAnalyzerCallbacks = {},
): Promise<AnalysisResult> {
  callbacks.onStage?.(1);
  await yieldToBrowser();
  const resumeText = await extractResumeText(file);

  callbacks.onStage?.(2);
  await yieldToBrowser();

  callbacks.onStage?.(3);
  const result = analyzeResumeText(resumeText, jobDescription, file.name);
  await yieldToBrowser();

  callbacks.onStage?.(4);
  return result;
}
