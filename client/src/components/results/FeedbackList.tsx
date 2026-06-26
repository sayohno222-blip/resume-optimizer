import type { FeedbackItem } from '../../types';
import CopyButton from './CopyButton';

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
              className={`border-l-4 rounded-lg bg-white border ${s.border} p-4 md:p-5`}
            >
              {/* Header: severity badge + category */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${s.badge}`}>
                  {s.label}
                </span>
                <span className="text-xs text-gray-400">
                  {categoryLabel[item.category] ?? item.category}
                </span>
              </div>

              {/* Problem */}
              <div className="mb-2">
                <p className="text-sm text-gray-800">
                  <span className="font-medium text-gray-900">问题：</span>
                  {item.message}
                </p>
              </div>

              {/* Impact */}
              {item.impact && (
                <div className="mb-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-700">影响：</span>
                    {item.impact}
                  </p>
                </div>
              )}

              {/* Suggestion */}
              <div className="mb-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-700">修改建议：</span>
                  {item.suggestion}
                </p>
              </div>

              {/* Example rewrite */}
              {item.exampleBefore && item.exampleAfter && (
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div>
                    <span className="text-xs font-medium text-gray-400">原始表达</span>
                    <p className="text-sm text-gray-600 mt-0.5 line-through decoration-gray-300">
                      {item.exampleBefore}
                    </p>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <span className="text-xs font-medium text-green-600">优化后表达</span>
                      <p className="text-sm text-gray-800 mt-0.5">
                        {item.exampleAfter}
                      </p>
                    </div>
                    <div className="flex-shrink-0 mt-3">
                      <CopyButton text={item.exampleAfter} label="复制" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
