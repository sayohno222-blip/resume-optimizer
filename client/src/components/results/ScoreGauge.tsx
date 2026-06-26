interface ScoreGaugeProps {
  score: number;
}

function getColor(score: number): string {
  if (score >= 80) return '#16a34a';
  if (score >= 60) return '#ca8a04';
  if (score >= 40) return '#ea580c';
  return '#dc2626';
}

function getRating(score: number): string {
  if (score >= 80) return '优秀';
  if (score >= 60) return '良好';
  if (score >= 40) return '需要改进';
  return '待优化';
}

function getRatingClass(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-amber-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

export default function ScoreGauge({ score }: ScoreGaugeProps) {
  const color = getColor(score);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 144 144" className="w-full h-full -rotate-90">
          <circle
            cx="72" cy="72" r={radius}
            fill="none" stroke="#f1f5f9" strokeWidth="10"
          />
          <circle
            cx="72" cy="72" r={radius}
            fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gray-900">{score}</span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>
      <span className={`text-sm font-semibold mt-1 ${getRatingClass(score)}`}>
        {getRating(score)}
      </span>
      <span className="text-xs text-gray-400 mt-0.5">总体 ATS 评分</span>
    </div>
  );
}
