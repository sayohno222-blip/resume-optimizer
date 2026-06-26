import type { FeedbackItem } from '../../types';
import CopyButton from './CopyButton';

interface BeforeAfterComparisonProps {
  feedback: FeedbackItem[];
}

export default function BeforeAfterComparison({ feedback }: BeforeAfterComparisonProps) {
  const items = feedback.filter((f) => f.exampleBefore && f.exampleAfter);

  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4">优化前后对比</h3>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border p-4 md:p-5">
            {/* What changed */}
            <p className="text-sm text-gray-800 mb-3">
              {item.message}
            </p>

            {/* Before / After comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-red-50 rounded-lg p-3">
                <span className="text-xs font-medium text-red-500">优化前</span>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {item.exampleBefore}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-medium text-green-600">优化后</span>
                  <CopyButton text={item.exampleAfter || ''} label="复制" />
                </div>
                <p className="text-sm text-gray-800 mt-1 leading-relaxed">
                  {item.exampleAfter}
                </p>
              </div>
            </div>

            {/* Why this change */}
            <div className="mt-3 flex items-start gap-1.5">
              <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-gray-500 leading-relaxed">
                <span className="font-medium text-gray-600">为什么这样改：</span>
                {item.suggestion}
                {item.impact && <span className="block mt-1">{item.impact}</span>}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
