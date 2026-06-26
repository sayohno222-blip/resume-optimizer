import type { MachineStatus } from '../../types';

interface ActionBarProps {
  status: MachineStatus;
  hasFile: boolean;
  circuitOpen: boolean;
  onAnalyze: () => void;
  onAbort: () => void;
  onRetry: () => void;
  onRegenerate: () => void;
  onReset: () => void;
}

export default function ActionBar({
  status,
  hasFile,
  circuitOpen,
  onAnalyze,
  onAbort,
  onRetry,
  onRegenerate,
  onReset,
}: ActionBarProps) {
  const buttons: { label: string; action: () => void; style: string }[] = [];

  switch (status) {
    case 'idle':
      if (hasFile) {
        buttons.push({ label: '开始分析', action: onAnalyze, style: 'bg-blue-600 hover:bg-blue-700 text-white' });
      }
      break;
    case 'uploading':
    case 'streaming':
    case 'reconnecting':
      buttons.push({ label: status === 'reconnecting' ? '取消重连' : '停止', action: onAbort, style: 'bg-red-600 hover:bg-red-700 text-white' });
      break;
    case 'success':
      buttons.push({ label: '重新生成', action: onRegenerate, style: 'bg-blue-600 hover:bg-blue-700 text-white' });
      buttons.push({ label: '分析新简历', action: onReset, style: 'bg-gray-100 hover:bg-gray-200 text-gray-700' });
      break;
    case 'error':
      if (!circuitOpen) {
        buttons.push({ label: '重试', action: onRetry, style: 'bg-blue-600 hover:bg-blue-700 text-white' });
      }
      buttons.push({ label: '重新上传', action: onReset, style: 'bg-gray-100 hover:bg-gray-200 text-gray-700' });
      break;
    case 'aborted':
      buttons.push({ label: '重试', action: onRetry, style: 'bg-blue-600 hover:bg-blue-700 text-white' });
      buttons.push({ label: '重新上传', action: onReset, style: 'bg-gray-100 hover:bg-gray-200 text-gray-700' });
      break;
  }

  if (buttons.length === 0) return null;

  return (
    <div className="flex gap-3 justify-center mt-6">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          onClick={btn.action}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${btn.style}`}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}
