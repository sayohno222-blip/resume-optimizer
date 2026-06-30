import { useBionicDesign } from '../../hooks/useBionicDesign';
import StateRouter from './StateRouter';

export default function Layout() {
  const { state, actions } = useBionicDesign();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
              🦋
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">AI Design Assistant</h1>
              <p className="text-xs text-gray-500">仿生产品设计助手</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <StateRouter state={state} actions={actions} />
      </main>
    </div>
  );
}
