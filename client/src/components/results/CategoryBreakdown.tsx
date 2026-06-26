interface CategoryBreakdownProps {
  categories: Record<string, { score: number; label: string }>;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-amber-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

function getScoreBg(score: number): string {
  if (score >= 80) return 'text-green-700 bg-green-50';
  if (score >= 60) return 'text-amber-700 bg-amber-50';
  if (score >= 40) return 'text-orange-700 bg-orange-50';
  return 'text-red-700 bg-red-50';
}

export default function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4">分类得分</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(categories).map(([key, cat]) => (
          <div key={key} className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{cat.label}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getScoreBg(cat.score)}`}>
                {cat.score}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${getScoreColor(cat.score)}`}
                style={{ width: `${cat.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
