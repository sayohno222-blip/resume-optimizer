import type { MachineState } from '../../types';
import FileUploader from '../upload/FileUploader';
import FilePreview from '../upload/FilePreview';
import JobDescriptionInput from '../upload/JobDescriptionInput';
import ResultsDashboard from '../results/ResultsDashboard';
import LoadingOverlay from '../common/LoadingOverlay';
import ErrorBanner from '../common/ErrorBanner';
import CircuitBreakerBanner from '../common/CircuitBreakerBanner';
import EmptyState from '../common/EmptyState';
import StreamingIndicator from '../streaming/StreamingIndicator';
import ProgressiveResult from '../streaming/ProgressiveResult';
import ReconnectingOverlay from '../streaming/ReconnectingOverlay';
import ActionBar from './ActionBar';

interface StateRouterProps {
  state: MachineState;
  actions: {
    setFile: (f: File | null) => void;
    setJobDescription: (jd: string) => void;
    analyze: () => void;
    abort: () => void;
    retry: () => void;
    regenerate: () => void;
    reset: () => void;
    toggleDebug: () => void;
  };
}

export default function StateRouter({ state, actions }: StateRouterProps) {
  const actionBar = (
    <ActionBar
      status={state.status}
      hasFile={state.file !== null}
      circuitOpen={state.circuitOpen}
      onAnalyze={actions.analyze}
      onAbort={actions.abort}
      onRetry={actions.retry}
      onRegenerate={actions.regenerate}
      onReset={actions.reset}
    />
  );

  switch (state.status) {
    // --- idle ---
    case 'idle':
      return (
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="text-center mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              检查简历的 ATS 兼容性
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed text-sm md:text-base">
              在浏览器本地读取简历，检查结构、内容与岗位关键词，
              <br className="hidden sm:block" />
              不上传文件，也不使用第三方 AI 接口
            </p>
          </div>

          {/* 3-step flow */}
          {!state.file && <EmptyState />}

          {/* Upload */}
          <FileUploader file={state.file} onFile={actions.setFile} />

          {/* After file selected */}
          {state.file && (
            <>
              <FilePreview file={state.file} />
              <JobDescriptionInput value={state.jobDescription} onChange={actions.setJobDescription} />
            </>
          )}

          {actionBar}
        </div>
      );

    // --- uploading ---
    case 'uploading':
      return (
        <div className="space-y-6">
          <LoadingOverlay stage={state.analysisStage} />
          {actionBar}
        </div>
      );

    // --- streaming ---
    case 'streaming':
      return (
        <div className="space-y-6">
          {state.streamedChunks.length > 0 ? (
            <ProgressiveResult chunks={state.streamedChunks} />
          ) : (
            <StreamingIndicator
              chunkCount={state.streamedChunks.length}
              startTime={state.requestStartTime}
              analysisStage={state.analysisStage}
            />
          )}
          {actionBar}
        </div>
      );

    // --- reconnecting ---
    case 'reconnecting':
      return (
        <div className="space-y-6">
          <ReconnectingOverlay
            attempt={state.reconnectAttempt}
            maxAttempts={3}
          />
          {actionBar}
        </div>
      );

    // --- success ---
    case 'success':
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">分析报告</h2>
          </div>
          {state.result && <ResultsDashboard result={state.result} onReset={actions.reset} />}
          {actionBar}
        </div>
      );

    // --- error ---
    case 'error':
      return (
        <div className="space-y-6">
          {state.error && <ErrorBanner error={state.error} />}
          {state.circuitOpen && <CircuitBreakerBanner openUntil={state.circuitOpenUntil} />}
          {actionBar}
        </div>
      );

    // --- aborted ---
    case 'aborted':
      return (
        <div className="space-y-4 text-center py-12">
          <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">分析已取消</p>
          {actionBar}
        </div>
      );
  }
}
