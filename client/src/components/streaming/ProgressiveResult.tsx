import { useMemo } from 'react';
import type { StreamedChunk, AnalysisResult, CategoryScore } from '../../types';
import ScoreGauge from '../results/ScoreGauge';

interface ProgressiveResultProps {
  chunks: StreamedChunk[];
}

// Attempt to complete a partial JSON string by adding missing closing brackets
function tryCompleteJSON(text: string): string {
  let completed = text;
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (const ch of completed) {
    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{' || ch === '[') depth++;
    if (ch === '}' || ch === ']') depth--;
  }

  // Close remaining structures
  let suffix = '';
  for (let i = 0; i < depth; i++) suffix += '}';
  // Also close if we ended in a string
  if (inString) suffix = '"' + suffix;
  // Close array if we're inside one
  if (completed.lastIndexOf('[') > completed.lastIndexOf(']')) suffix += ']';

  return completed + suffix;
}

function extractPartial(json: string): Partial<AnalysisResult> | null {
  // Try direct parse
  try { return JSON.parse(json) as AnalysisResult; } catch {}

  // Try with completion
  try {
    const completed = tryCompleteJSON(json);
    return JSON.parse(completed) as AnalysisResult;
  } catch {}

  // Try to extract specific fields via regex
  try {
    const partial: any = {};
    const scoreMatch = json.match(/"overallScore"\s*:\s*(\d+)/);
    if (scoreMatch) partial.overallScore = parseInt(scoreMatch[1]);

    const summaryMatch = json.match(/"summary"\s*:\s*"([^"]*)/);
    if (summaryMatch && summaryMatch[1].length > 10) partial.summary = summaryMatch[1] + '...';

    // Extract category scores
    const categories: any = {};
    for (const key of ['format', 'keywords', 'structure', 'content']) {
      const m = json.match(new RegExp(`"${key}"\\s*:\\s*\\{[^}]*"score"\\s*:\\s*(\\d+)`));
      if (m) {
        const labelMatch = json.match(new RegExp(`"${key}"[^{]*\\{[^}]*"label"\\s*:\\s*"([^"]*)"`));
        categories[key] = {
          score: parseInt(m[1]),
          label: labelMatch?.[1] || key,
          maxScore: 100,
        };
      }
    }
    if (Object.keys(categories).length > 0) partial.categories = categories;

    // Extract keywords
    const matchedMatch = json.match(/"matched"\s*:\s*\[([^\]]*)\]/);
    const missingMatch = json.match(/"missing"\s*:\s*\[([^\]]*)\]/);
    if (matchedMatch || missingMatch) {
      partial.keywords = {
        matched: matchedMatch ? matchedMatch[1].replace(/"/g, '').split(',').filter(Boolean).map(s => s.trim()) : [],
        missing: missingMatch ? missingMatch[1].replace(/"/g, '').split(',').filter(Boolean).map(s => s.trim()) : [],
        overused: [],
      };
    }

    // Count feedback items partially extracted
    const feedbackCount = (json.match(/"severity"/g) || []).length;
    if (feedbackCount > 0) partial._feedbackCount = feedbackCount;

    return Object.keys(partial).length > 0 ? partial : null;
  } catch {
    return null;
  }
}

function SectionStatus({ label, ready, value }: { label: string; ready: boolean; value?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
        ready ? 'bg-green-100' : 'bg-gray-100'
      }`}>
        {ready ? (
          <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
        )}
      </div>
      <span className={ready ? 'text-gray-700' : 'text-gray-400'}>{label}</span>
      {value && <span className="text-gray-500 ml-auto">{value}</span>}
    </div>
  );
}

export default function ProgressiveResult({ chunks }: ProgressiveResultProps) {
  const { partial, sections, progress } = useMemo(() => {
    const text = chunks.map(c => c.text).join('');
    const partial = extractPartial(text);

    const sections = [
      { key: 'overallScore', label: '总体评分', ready: partial?.overallScore !== undefined },
      { key: 'categories', label: '分类得分', ready: partial?.categories !== undefined },
      { key: 'keywords', label: '关键词分析', ready: (partial?.keywords?.matched?.length ?? 0) > 0 || (partial?.keywords?.missing?.length ?? 0) > 0 },
      { key: 'feedback', label: '改进建议', ready: (partial as any)?._feedbackCount > 0 },
      { key: 'summary', label: '总结评价', ready: partial?.summary !== undefined && !partial.summary?.endsWith('...') },
    ];

    const readyCount = sections.filter(s => s.ready).length;
    const progress = Math.round((readyCount / sections.length) * 100);

    return { partial, sections, progress };
  }, [chunks]);

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <div className="bg-white rounded-2xl border p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">正在进行规则分析...</h3>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(progress, 5)}%` }}
              />
            </div>
          </div>
          <span className="text-sm text-gray-500">{progress}%</span>
        </div>

        {/* Section statuses */}
        <div className="space-y-2.5">
          {sections.map(s => (
            <SectionStatus key={s.key} label={s.label} ready={s.ready} />
          ))}
        </div>
      </div>

      {/* Show partial score if available */}
      {partial?.overallScore !== undefined && (
        <div className="bg-white rounded-2xl border p-8 flex justify-center">
          <ScoreGauge score={partial.overallScore} />
        </div>
      )}

      {/* Show partial categories if available */}
      {partial?.categories && Object.keys(partial.categories).length > 0 && (
        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">分类得分（分析中...）</h3>
          <div className="space-y-3">
            {Object.entries(partial.categories as Record<string, CategoryScore>).map(([key, cat]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{cat.label}</span>
                  <span className="font-medium text-gray-900">{cat.score}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show emerging keywords */}
      {partial?.keywords && ((partial.keywords.matched?.length ?? 0) > 0 || (partial.keywords.missing?.length ?? 0) > 0) && (
        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-3">关键词（分析中...）</h3>
          <div className="flex flex-wrap gap-1.5">
            {partial.keywords.matched?.map((kw: string) => (
              <span key={kw} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">{kw}</span>
            ))}
            {partial.keywords.missing?.map((kw: string) => (
              <span key={kw} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">{kw}</span>
            ))}
          </div>
        </div>
      )}

      {/* Show partial summary */}
      {partial?.summary && (
        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-2">总结评价</h3>
          <p className="text-gray-700">{partial.summary}</p>
        </div>
      )}
    </div>
  );
}
