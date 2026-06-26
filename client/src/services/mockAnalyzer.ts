import type { AnalysisResult, StreamedChunk } from '../types';

const MOCK_RESULTS: AnalysisResult[] = [
  {
    overallScore: 72,
    categories: {
      format: { score: 80, label: 'Format & Layout', maxScore: 100 },
      keywords: { score: 60, label: 'Keyword Optimization', maxScore: 100 },
      structure: { score: 75, label: 'Structure & Organization', maxScore: 100 },
      content: { score: 73, label: 'Content Quality', maxScore: 100 },
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
        message: 'Missing key technical terms that ATS systems scan for.',
        suggestion: 'Add Docker, Kubernetes, and CI/CD under your Skills section.',
      },
      {
        severity: 'high',
        category: 'content',
        message: 'Bullet points lack quantified achievements.',
        suggestion: 'Replace "Responsible for..." with specific metrics like "Increased performance by 30%"',
      },
      {
        severity: 'medium',
        category: 'format',
        message: 'Resume may use formatting elements that confuse ATS parsers.',
        suggestion: 'Switch to a single-column layout with standard section headings.',
      },
      {
        severity: 'medium',
        category: 'structure',
        message: 'Work experience section could be better organized.',
        suggestion: 'Use reverse-chronological order and consistent date formatting (MM/YYYY).',
      },
      {
        severity: 'low',
        category: 'keywords',
        message: 'Some keywords appear to be overused.',
        suggestion: 'Reduce generic phrases like "team player" and replace with specific collaboration examples.',
      },
      {
        severity: 'low',
        category: 'content',
        message: 'Summary section is too generic.',
        suggestion: 'Tailor your summary to specific roles with 2-3 key achievements.',
      },
    ],
    summary: 'Your resume scores 72/100 on ATS compatibility. The format is generally readable by ATS systems, but keyword optimization needs improvement. Adding missing technical terms and quantified achievements will significantly boost your score.',
  },
  {
    overallScore: 85,
    categories: {
      format: { score: 90, label: 'Format & Layout', maxScore: 100 },
      keywords: { score: 82, label: 'Keyword Optimization', maxScore: 100 },
      structure: { score: 88, label: 'Structure & Organization', maxScore: 100 },
      content: { score: 80, label: 'Content Quality', maxScore: 100 },
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
        message: 'Strong keyword match but missing some trending technologies.',
        suggestion: 'Consider adding PyTorch and MLOps experience if applicable.',
      },
      {
        severity: 'low',
        category: 'content',
        message: 'Achievements are well-quantified but could use more business impact context.',
        suggestion: 'Link technical achievements to revenue or cost savings where possible.',
      },
      {
        severity: 'low',
        category: 'structure',
        message: 'Education section could be moved after experience for senior roles.',
        suggestion: 'Place experience before education if you have 3+ years of work history.',
      },
    ],
    summary: 'Your resume scores 85/100 — well above average for ATS compatibility. The format is clean and machine-readable, and keyword density is strong. Minor improvements in content framing could push this into the 90+ range.',
  },
  {
    overallScore: 58,
    categories: {
      format: { score: 45, label: 'Format & Layout', maxScore: 100 },
      keywords: { score: 55, label: 'Keyword Optimization', maxScore: 100 },
      structure: { score: 50, label: 'Structure & Organization', maxScore: 100 },
      content: { score: 65, label: 'Content Quality', maxScore: 100 },
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
        message: 'Resume likely contains elements that will be completely missed by ATS.',
        suggestion: 'Remove all images, icons, tables, and text boxes. Use plain single-column text only.',
      },
      {
        severity: 'high',
        category: 'keywords',
        message: 'Severely lacking industry-standard keywords for the detected role.',
        suggestion: 'Add React, TypeScript, Node.js, REST API, and Git to your skills section.',
      },
      {
        severity: 'high',
        category: 'content',
        message: 'Job descriptions use duty-based language instead of achievement-based.',
        suggestion: 'Rewrite every bullet to start with an action verb and include a measurable result.',
      },
      {
        severity: 'medium',
        category: 'structure',
        message: 'Missing critical resume sections that ATS expects.',
        suggestion: 'Ensure you have clearly labeled sections: Contact, Summary, Experience, Education, Skills.',
      },
      {
        severity: 'medium',
        category: 'content',
        message: 'Vague language throughout reduces ATS confidence scores.',
        suggestion: 'Replace "helped with" and "worked on" with specific, measurable contributions.',
      },
    ],
    summary: 'Your resume scores 58/100 and needs significant improvement for ATS compatibility. The format is likely confusing ATS parsers, and keyword density is well below industry expectations. Focus on format simplification and keyword enrichment first.',
  },
];

function pickRandomJob(): AnalysisResult {
  return MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
}

// Chunk types within a mock result
interface MockChunk {
  id: number;
  text: string;
  delay: number; // ms before this chunk
}

// Build simulated streaming chunks from a result
function buildChunks(result: AnalysisResult): MockChunk[] {
  const json = JSON.stringify(result, null, 2);
  const charsPerChunk = 8 + Math.floor(Math.random() * 12); // random chunk size for natural feel
  const chunks: MockChunk[] = [];
  let id = 0;

  for (let i = 0; i < json.length; i += charsPerChunk) {
    chunks.push({
      id,
      text: json.slice(i, i + charsPerChunk),
      delay: 60 + Math.random() * 80, // 60-140ms per chunk
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
  return 2000 + Math.random() * 1500; // 2-3.5 seconds
}
