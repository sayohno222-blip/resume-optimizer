import { useState, useCallback } from 'react';

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = '复制' }: CopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'fail'>('idle');

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('fail');
      setTimeout(() => setStatus('idle'), 2000);
    }
  }, [text]);

  const btnStyle = status === 'success'
    ? 'bg-green-50 text-green-600 border-green-200'
    : status === 'fail'
    ? 'bg-red-50 text-red-600 border-red-200'
    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-700';

  const btnText = status === 'success'
    ? '已复制'
    : status === 'fail'
    ? '复制失败'
    : label;

  const showIcon = () => {
    if (status === 'success') {
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    if (status === 'fail') {
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    }
    return (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    );
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer ${btnStyle}`}
    >
      {showIcon()}
      {btnText}
    </button>
  );
}
