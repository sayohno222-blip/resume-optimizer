interface CategoryBreakdownProps {
  categories: Record<string, { score: number; label: string }>;
}

function barColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

export default function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4">分类得分</h3>
      <div className="space-y-4">
        {Object.entries(categories).map(([key, cat]) => (
          <div key={key}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{cat.label}</span>
              <span className="font-medium text-gray-900">{cat.score}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${barColor(cat.score)}`}
                style={{ width: `${cat.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
