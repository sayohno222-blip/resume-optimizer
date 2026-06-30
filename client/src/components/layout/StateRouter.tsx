import type { BionicState } from '../../hooks/useBionicDesign';
import type { BionicInput } from '../../types/bionic';
import BionicDesignForm from '../bionic/BionicDesignForm';
import BionicDesignResults from '../bionic/BionicDesignResults';

interface StateRouterProps {
  state: BionicState;
  actions: {
    setInput: (input: Partial<BionicInput>) => void;
    submit: () => void;
    reset: () => void;
  };
}

function LoadingView({ stage, label }: { stage: number; label: string }) {
  const stages = [
    { label: '正在分析灵感来源...' },
    { label: '正在提取形态与结构特征...' },
    { label: '正在生成设计方案...' },
    { label: '正在完善设计说明...' },
  ];
  return (
    <div className='flex flex-col items-center justify-center py-24'>
      <div className='w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin' />
      <p className='mt-6 text-gray-600 font-medium'>正在生成设计方案</p>
      <p className='text-sm text-gray-400 mt-1'>
        {label || 'AI 正在从生物特征中提取设计灵感，请稍候'}
      </p>
      <div className='mt-8 w-full max-w-sm space-y-3'>
        {stages.map((s, i) => {
          const idx = i + 1;
          return (
            <div key={i} className='flex items-center gap-3'>
              <div
                className={[
                  'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                  stage > idx ? 'bg-blue-500 text-white' : '',
                  stage === idx ? 'bg-blue-500 text-white animate-pulse' : '',
                  stage < idx ? 'bg-gray-100 text-gray-300' : '',
                ].join(' ')}
              >
                {stage > idx ? (
                  <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M5 13l4 4L19 7' />
                  </svg>
                ) : (
                  <span className='text-xs font-medium'>{idx}</span>
                )}
              </div>
              <span
                className={[
                  'text-sm transition-colors',
                  stage === idx ? 'text-gray-900 font-medium' : '',
                  stage > idx ? 'text-gray-500' : '',
                  stage < idx ? 'text-gray-400' : '',
                ].join(' ')}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className='flex flex-col items-center justify-center py-24'>
      <div className='w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4'>
        <svg className='w-6 h-6 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' />
        </svg>
      </div>
      <p className='text-gray-900 font-semibold mb-1'>生成失败</p>
      <p className='text-sm text-gray-500 mb-6'>{message}</p>
      <button
        onClick={onRetry}
        className='px-6 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors cursor-pointer'
      >
        重试
      </button>
    </div>
  );
}

export default function StateRouter({ state, actions }: StateRouterProps) {
  switch (state.status) {
    case 'idle':
      return (
        <BionicDesignForm
          input={state.input}
          status={state.status}
          onInput={actions.setInput}
          onSubmit={actions.submit}
        />
      );
    case 'uploading':
      return (
        <LoadingView stage={state.analysisStage} label={state.analysisLabel} />
      );
    case 'success':
      return state.result ? (
        <BionicDesignResults result={state.result} onReset={actions.reset} />
      ) : null;
    case 'error':
      return (
        <ErrorView
          message={state.error || '发生未知错误，请重试'}
          onRetry={actions.submit}
        />
      );
    default:
      return null;
  }
}
