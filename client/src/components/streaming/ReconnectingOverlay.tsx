interface ReconnectingOverlayProps {
  attempt: number;
  maxAttempts: number;
}

export default function ReconnectingOverlay({ attempt, maxAttempts }: ReconnectingOverlayProps) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
      <div className="w-12 h-12 mx-auto mb-4">
        <svg className="w-full h-full text-yellow-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">正在重新连接...</h3>
      <p className="text-sm text-gray-500">
        第 {attempt}/{maxAttempts} 次尝试
      </p>
      <div className="flex gap-1 justify-center mt-3">
        {Array.from({ length: maxAttempts }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < attempt ? 'bg-yellow-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
