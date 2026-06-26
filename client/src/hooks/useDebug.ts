import type { MachineState } from '../types';

export function useDebugStats(state: MachineState) {
  const duration = state.requestStartTime
    ? ((state.requestEndTime || Date.now()) - state.requestStartTime)
    : null;

  return {
    status: state.status,
    duration: duration ? `${(duration / 1000).toFixed(1)}s` : 'N/A',
    chunksReceived: state.streamedChunks.length,
    successCount: state.successCount,
    failureCount: state.failureCount,
    disconnectCount: state.disconnectCount,
    consecutiveFailures: state.consecutiveFailures,
    circuitOpen: state.circuitOpen,
    circuitOpenUntil: state.circuitOpenUntil,
    retryCount: state.retryCount,
    reconnectAttempt: state.reconnectAttempt,
    errorCode: state.error?.code || 'none',
  };
}
