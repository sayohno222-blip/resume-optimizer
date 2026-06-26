import { useState, useEffect } from 'react';

interface CircuitBreakerBannerProps {
  openUntil: number | null;
}

export default function CircuitBreakerBanner({ openUntil }: CircuitBreakerBannerProps) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!openUntil) return;
    const tick = () => {
      const r = Math.max(0, Math.ceil((openUntil - Date.now()) / 1000));
      setRemaining(r);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [openUntil]);

  return (
    <div className="border border-yellow-300 bg-yellow-50 rounded-xl p-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-yellow-800">服务过热保护中</p>
          <p className="text-sm text-yellow-600">
            {remaining > 0
              ? `请等待 ${remaining} 秒后自动重试`
              : '即将恢复...'}
          </p>
        </div>
      </div>
    </div>
  );
}
