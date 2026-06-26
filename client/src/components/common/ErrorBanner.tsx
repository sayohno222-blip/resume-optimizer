import type { AppError } from '../../types';

interface ErrorBannerProps {
  error: AppError;
}

const codeLabels: Record<string, string> = {
  NETWORK_ERROR: '网络连接失败',
  TIMEOUT: '请求超时',
  SSE_PARSE_ERROR: '数据解析失败',
  API_ERROR: '服务器错误',
  VALIDATION_ERROR: '数据格式错误',
  ABORTED: '请求已取消',
  CIRCUIT_OPEN: '服务暂时不可用',
  RECONNECT_FAILED: '重连失败',
  RATE_LIMITED: '请求过于频繁',
  UNKNOWN: '未知错误',
};

export default function ErrorBanner({ error }: ErrorBannerProps) {
  return (
    <div className="border border-red-200 bg-red-50 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-red-800">
            {codeLabels[error.code] || error.code}
          </p>
          <p className="text-xs text-red-600 mt-0.5">{error.message}</p>
        </div>
      </div>
      <div className="flex gap-2 text-xs text-red-500 mt-2">
        <span className="px-2 py-0.5 bg-red-100 rounded">Code: {error.code}</span>
        <span className="px-2 py-0.5 bg-red-100 rounded">
          {error.recoverable ? '可恢复' : '不可恢复'}
        </span>
        {error.retryAfterMs && (
          <span className="px-2 py-0.5 bg-red-100 rounded">
            等待 {Math.ceil(error.retryAfterMs / 1000)}s
          </span>
        )}
      </div>
    </div>
  );
}
