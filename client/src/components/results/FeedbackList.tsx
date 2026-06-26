import type { FeedbackItem } from '../../types';

interface FeedbackListProps {
  feedback: FeedbackItem[];
}

const severityConfig = {
  high: {
    border: 'border-l-red-400',
    badge: 'bg-red-100 text-red-700',
    label: '高优先级',
  },
  medium: {
    border: 'border-l-amber-400',
    badge: 'bg-amber-100 text-amber-700',
    label: '中优先级',
  },
  low: {
    border: 'border-l-blue-400',
    badge: 'bg-blue-100 text-blue-700',
    label: '低优先级',
  },
};

const categoryLabel: Record<string, string> = {
  format: '格式',
  keywords: '关键词',
  structure: '结构',
  content: '内容',
};

export default function FeedbackList({ feedback }: FeedbackListProps) {
  const sorted = [...feedback].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4">优化建议</h3>
      <div className="space-y-3">
        {sorted.map((item, i) => {
          const s = severityConfig[item.severity];
          return (
            <div
              key={i}
              className={`border-l-4 rounded-lg bg-white border ${s.border} p-4`}
            >
              {/* Header: severity badge + category */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${s.badge}`}>
                  {s.label}
                </span>
                <span className="text-xs text-gray-400">
                  {categoryLabel[item.category] ?? item.category}
                </span>
              </div>
              {/* Problem (message) */}
              <p className="text-sm text-gray-800 mb-1.5">{item.message}</p>
              {/* Suggestion */}
              <div className="flex items-start gap-1.5">
                <svg className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-500">{item.suggestion}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

