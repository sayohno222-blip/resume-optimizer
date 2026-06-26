import type { DebugEntry } from '../../types';

interface DebugTimelineProps {
  log: DebugEntry[];
}

const typeColors: Record<string, string> = {
  INITIATE: 'text-blue-400',
  CONNECTION_ESTABLISHED: 'text-green-400',
  STREAM_COMPLETE: 'text-green-400',
  STREAM_ERROR: 'text-red-400',
  RECONNECT_START: 'text-yellow-400',
  RECONNECT_MAX_RETRIES: 'text-red-400',
  CIRCUIT_OPEN: 'text-orange-400',
  USER_ABORT: 'text-gray-400',
};

export default function DebugTimeline({ log }: DebugTimelineProps) {
  const recent = log.slice(-20);

  return (
    <div>
      <div className="text-gray-400 mb-1">-- Timeline (recent {recent.length}) --</div>
      <div className="space-y-0.5 max-h-40 overflow-y-auto">
        {recent.map((entry, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-gray-600 flex-shrink-0">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </span>
            <span className={typeColors[entry.type] || 'text-gray-400'}>
              {entry.type}
            </span>
            {entry.detail !== undefined && (
              <span className="text-gray-500">{JSON.stringify(entry.detail)}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
