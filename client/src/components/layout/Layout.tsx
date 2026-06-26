import { useAnalyze } from '../../hooks/useAnalyze';
import StateRouter from './StateRouter';
import DebugPanel from '../debug/DebugPanel';

export default function Layout() {
  const { state, actions } = useAnalyze();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">ATS Resume Optimizer</h1>
              <p className="text-xs text-gray-500">简历 ATS 兼容性分析工具</p>
            </div>
          </div>
          <button
            onClick={actions.toggleDebug}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            {state.debugEnabled ? '关闭调试' : '调试'}
          </button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">
        <StateRouter state={state} actions={actions} />
      </main>
      {state.debugEnabled && (
        <DebugPanel state={state} onClose={actions.toggleDebug} />
      )}
    </div>
  );
}
