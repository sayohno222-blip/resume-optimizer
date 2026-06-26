import { useEffect, useState } from 'react';

interface StreamingIndicatorProps {
  chunkCount: number;
  startTime: number | null;
  analysisStage: number;
}

const STAGES = [
  { label: '正在解析简历内容' },
  { label: '正在识别岗位关键词' },
  { label: '正在计算 ATS 匹配度' },
  { label: '正在生成优化建议' },
];

export default function StreamingIndicator({ chunkCount, startTime, analysisStage }: StreamingIndicatorProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;
    const tick = () => setElapsed(Date.now() - startTime);
    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [startTime]);

  return (
    <div className="bg-white rounded-2xl border p-8">
      <div className="max-w-sm mx-auto">
        {/* Stages timeline */}
        <div className="space-y-4">
          {STAGES.map((stage, index) => {
            const stageNum = index + 1;
            const isCurrent = analysisStage === stageNum;
            const isPast = analysisStage > stageNum;
            const isFuture = analysisStage < stageNum;

            return (
              <div key={index} className="flex items-center gap-3">
                {/* Indicator */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300
                      ${isPast ? 'bg-blue-500 text-white' : ''}
                      ${isCurrent ? 'bg-blue-500 text-white' : ''}
                      ${isFuture ? 'bg-gray-100 text-gray-300' : ''}
                    `}
                  >
                    {isPast ? (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs font-medium">{stageNum}</span>
                    )}
                  </div>
                  {/* Connecting line */}
                  {index < STAGES.length - 1 && (
                    <div
                      className={`absolute top-6 left-3 w-0.5 h-4 -translate-x-1/2
                        ${isPast ? 'bg-blue-400' : 'bg-gray-200'}
                      `}
                    />
                  )}
                </div>
                {/* Label */}
                <span
                  className={`text-sm transition-colors duration-300
                    ${isCurrent ? 'text-gray-900 font-medium' : ''}
                    ${isPast ? 'text-gray-500' : ''}
                    ${isFuture ? 'text-gray-400' : ''}
                  `}
                >
                  {stage.label}
                </span>
                {/* Current stage spinner */}
                {isCurrent && (
                  <svg className="w-4 h-4 text-blue-500 animate-spin ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="flex gap-4 justify-center text-xs text-gray-400 mt-6 pt-4 border-t">
          <span>已接收 {chunkCount} 个数据块</span>
          <span>{startTime ? `${(elapsed / 1000).toFixed(1)}s` : '等待中'}</span>
        </div>
      </div>
    </div>
  );
}
