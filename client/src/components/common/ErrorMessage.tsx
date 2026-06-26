interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  onReset: () => void;
}

export default function ErrorMessage({ message, onRetry, onReset }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">分析失败</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          重试
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-white border text-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          重新上传
        </button>
      </div>
    </div>
  );
}
