interface ScoreGaugeProps {
  score: number;
}

function getColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#eab308';
  if (score >= 40) return '#f97316';
  return '#ef4444';
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
            fill="none" stroke="#e5e7eb" strokeWidth="10"
          />
          <circle
            cx="72" cy="72" r={radius}
            fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{score}</span>
          <span className="text-xs text-gray-500">/ 100</span>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-700 mt-2">总体 ATS 评分</p>
    </div>
  );
}
