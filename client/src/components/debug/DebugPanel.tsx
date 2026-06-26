import type { MachineState } from '../../types';
import { useDebugStats } from '../../hooks/useDebug';
import DebugStats from './DebugStats';
import DebugTimeline from './DebugTimeline';

interface DebugPanelProps {
  state: MachineState;
  onClose: () => void;
}

export default function DebugPanel({ state, onClose }: DebugPanelProps) {
  const stats = useDebugStats(state);

  return (
    <div className="fixed bottom-4 right-4 w-80 max-h-96 bg-gray-900 text-gray-100 rounded-xl shadow-2xl overflow-hidden z-50">
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <span className="text-xs font-mono font-semibold">DEBUG PANEL</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-xs cursor-pointer">
          ✕
        </button>
      </div>
      <div className="p-3 overflow-y-auto max-h-80 space-y-3 text-xs font-mono">
        <DebugStats stats={stats} />
        <DebugTimeline log={state.debugLog} />
      </div>
    </div>
  );
}
