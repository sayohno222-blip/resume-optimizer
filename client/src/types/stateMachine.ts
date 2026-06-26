import type { AnalysisResult, AppError } from './index';

export type MachineStatus =
  | 'idle'
  | 'uploading'
  | 'streaming'
  | 'success'
  | 'error'
  | 'reconnecting'
  | 'aborted';

export interface StreamedChunk {
  id: number;
  text: string;
}

export interface DebugEntry {
  type: string;
  timestamp: number;
  detail?: unknown;
}

export interface MachineState {
  status: MachineStatus;
  file: File | null;
  jobDescription: string;
  result: AnalysisResult | null;
  error: AppError | null;
  streamedChunks: StreamedChunk[];
  lastChunkId: number;
  requestId: number;           // incremented each request, used as stable effect dep
  retryCount: number;
  reconnectAttempt: number;
  consecutiveFailures: number;
  circuitOpen: boolean;
  circuitOpenUntil: number | null;
  debugEnabled: boolean;
  debugLog: DebugEntry[];
  requestStartTime: number | null;
  requestEndTime: number | null;
  successCount: number;
  failureCount: number;
  disconnectCount: number;
}

export type MachineAction =
  | { type: 'SET_FILE'; file: File | null }
  | { type: 'SET_JD'; jd: string }
  | { type: 'INITIATE' }
  | { type: 'REQUEST_RETRY' }        // retry from error/aborted → uploading directly
  | { type: 'REQUEST_REGENERATE' }   // regenerate from success → uploading directly
  | { type: 'CONNECTION_ESTABLISHED'; chunkId: number }
  | { type: 'CHUNK_RECEIVED'; chunk: string; chunkId: number }
  | { type: 'STREAM_COMPLETE'; result: AnalysisResult }
  | { type: 'STREAM_ERROR'; error: AppError }
  | { type: 'RECONNECT_START' }
  | { type: 'RECONNECT_SUCCESS'; lastChunkId: number }
  | { type: 'RECONNECT_MAX_RETRIES' }
  | { type: 'USER_ABORT' }
  | { type: 'USER_RESET' }
  | { type: 'CIRCUIT_BREAKER_OPEN'; until: number }
  | { type: 'TOGGLE_DEBUG' };

export function createInitialState(): MachineState {
  return {
    status: 'idle',
    file: null,
    jobDescription: '',
    result: null,
    error: null,
    streamedChunks: [],
    lastChunkId: -1,
    requestId: 0,
    retryCount: 0,
    reconnectAttempt: 0,
    consecutiveFailures: 0,
    circuitOpen: false,
    circuitOpenUntil: null,
    debugEnabled: false,
    debugLog: [],
    requestStartTime: null,
    requestEndTime: null,
    successCount: 0,
    failureCount: 0,
    disconnectCount: 0,
  };
}
