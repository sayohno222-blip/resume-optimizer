import { useEffect, useState } from 'react';

interface StreamingIndicatorProps {
  chunkCount: number;
  startTime: number | null;
}

export default function StreamingIndicator({ chunkCount, startTime }: StreamingIndicatorProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;
    const tick = () => setElapsed(Date.now() - startTime);
    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [startTime]);

  return (
    <div className="bg-white rounded-2xl border p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 relative">
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
        <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">正在分析您的简历...</h3>
      <div className="flex gap-4 justify-center text-sm text-gray-500 mt-3">
        <span>{chunkCount} 个内容块</span>
        <span>{(elapsed / 1000).toFixed(1)}s</span>
      </div>
    </div>
  );
}
