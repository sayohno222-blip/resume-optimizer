interface KeywordAnalysisProps {
  keywords: {
    matched: string[];
    missing: string[];
    overused: string[];
  };
}

export default function KeywordAnalysis({ keywords }: KeywordAnalysisProps) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4">关键词分析</h3>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-500 mb-1.5">匹配关键词 ({keywords.matched.length})</p>
          <div className="flex flex-wrap gap-1.5">
            {keywords.matched.map((kw) => (
              <span key={kw} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1.5">缺失关键词 ({keywords.missing.length})</p>
          <div className="flex flex-wrap gap-1.5">
            {keywords.missing.map((kw) => (
              <span key={kw} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                {kw}
              </span>
            ))}
          </div>
        </div>

        {keywords.overused.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-1.5">过度使用 ({keywords.overused.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {keywords.overused.map((kw) => (
                <span key={kw} className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
