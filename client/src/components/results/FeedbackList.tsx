import type { FeedbackItem } from '../../types';

interface FeedbackListProps {
  feedback: FeedbackItem[];
}

const severityConfig = {
  high: { color: 'border-l-red-500 bg-red-50', dot: 'bg-red-500', label: '严重' },
  medium: { color: 'border-l-yellow-500 bg-yellow-50', dot: 'bg-yellow-500', label: '注意' },
  low: { color: 'border-l-blue-500 bg-blue-50', dot: 'bg-blue-500', label: '建议' },
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
      <h3 className="font-semibold text-gray-900 mb-4">改进建议</h3>
      <div className="space-y-3">
        {sorted.map((item, i) => {
          const s = severityConfig[item.severity];
          return (
            <div key={i} className={`border-l-4 rounded-lg p-4 ${s.color}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                <span className="text-xs font-medium text-gray-500">
                  [{s.label}] {categoryLabel[item.category]}
                </span>
              </div>
              <p className="text-sm text-gray-800 mb-1">{item.message}</p>
              <p className="text-sm text-gray-600 italic">建议: {item.suggestion}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
