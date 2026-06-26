interface KeywordAnalysisProps {
  keywords: {
    matched: string[];
    missing: string[];
    overused: string[];
  };
}

function TagList({ items, type }: { items: string[]; type: 'match' | 'missing' | 'overused' }) {
  const config = {
    match: { bg: 'bg-green-50 text-green-700 border-green-200', label: '已匹配' },
    missing: { bg: 'bg-red-50 text-red-700 border-red-200', label: '缺失' },
    overused: { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: '可优化' },
  };

  const { bg, label } = config[type];

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <span className="text-xs text-gray-400">({items.length})</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.length > 0 ? items.map((kw) => (
          <span
            key={kw}
            className={`inline-block px-2.5 py-1 rounded-md border text-xs leading-tight ${bg}`}
          >
            {kw}
          </span>
        )) : (
          <span className="text-xs text-gray-400">无</span>
        )}
      </div>
    </div>
  );
}

export default function KeywordAnalysis({ keywords }: KeywordAnalysisProps) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4">关键词分析</h3>
      <div className="space-y-4">
        <TagList items={keywords.matched} type="match" />
        <TagList items={keywords.missing} type="missing" />
        {keywords.overused.length > 0 && <TagList items={keywords.overused} type="overused" />}
      </div>
    </div>
  );
}
