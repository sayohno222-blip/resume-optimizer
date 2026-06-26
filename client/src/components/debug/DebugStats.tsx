interface DebugStatsProps {
  stats: Record<string, unknown>;
}

export default function DebugStats({ stats }: DebugStatsProps) {
  const entries = Object.entries(stats);

  return (
    <div>
      <div className="text-gray-400 mb-1">-- Stats --</div>
      <div className="space-y-0.5">
        {entries.map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-gray-500">{key}:</span>
            <span className="text-green-400">
              {typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value ?? 'N/A')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
