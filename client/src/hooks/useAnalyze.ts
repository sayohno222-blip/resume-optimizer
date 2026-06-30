import { useReducer, useEffect, useCallback, useRef } from 'react';
import type { MachineState, MachineAction } from '../types';
import { createInitialState } from '../types';
import { runMockAnalysis } from '../services/mockAnalyzer';

// --- Pure Reducer ---

function enterUploading(state: MachineState): MachineState {
  return {
    ...state,
    status: 'uploading',
    analysisStage: 0,
    error: null,
    streamedChunks: [],
    lastChunkId: -1,
    requestId: state.requestId + 1,
    requestStartTime: Date.now(),
    requestEndTime: null,
    result: null,
    reconnectAttempt: 0,
  };
}

function machineReducer(state: MachineState, action: MachineAction): MachineState {
  switch (action.type) {
    case 'SET_FILE':
      return { ...state, file: action.file, error: null };

    case 'SET_JD':
      return { ...state, jobDescription: action.jd };

    case 'INITIATE':
      return enterUploading(state);

    case 'REQUEST_RETRY':
      return enterUploading({ ...state, retryCount: state.retryCount + 1 });

    case 'REQUEST_REGENERATE':
      return enterUploading({ ...state, result: null });

    case 'CHUNK_RECEIVED':
      return {
        ...state,
        status: 'streaming',
        streamedChunks: [...state.streamedChunks, { id: action.chunkId, text: action.chunk }],
        lastChunkId: action.chunkId,
      };

    case 'STREAM_COMPLETE':
      return {
        ...state,
        status: 'success',
        result: action.result,
        requestEndTime: Date.now(),
        successCount: state.successCount + 1,
      };

    case 'STREAM_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.error,
        requestEndTime: Date.now(),
        failureCount: state.failureCount + 1,
      };

    case 'RECONNECT_START':
      return { ...state, status: 'reconnecting', reconnectAttempt: state.reconnectAttempt + 1, disconnectCount: state.disconnectCount + 1 };

    case 'RECONNECT_SUCCESS':
      return { ...state, status: 'streaming', lastChunkId: action.lastChunkId };

    case 'RECONNECT_MAX_RETRIES':
      return { ...state, status: 'error', error: { code: 'RECONNECT_FAILED' as any, message: 'Maximum reconnection attempts reached', recoverable: false, timestamp: Date.now() }, requestEndTime: Date.now(), failureCount: state.failureCount + 1 };

    case 'USER_ABORT':
      return { ...state, status: 'aborted', requestEndTime: Date.now() };

    case 'USER_RESET':
      return createInitialState();

    case 'CIRCUIT_BREAKER_OPEN':
      return { ...state, circuitOpen: true, circuitOpenUntil: action.until };

    case 'TOGGLE_DEBUG':
      return { ...state, debugEnabled: !state.debugEnabled };

    case 'SET_ANALYSIS_STAGE':
      return { ...state, analysisStage: action.stage };

    default:
      return state;
  }
}

// --- Hook ---

export function useAnalyze() {
  const [state, dispatch] = useReducer(machineReducer, null, createInitialState);
  const abortRef = useRef(false);

  // Mock analysis effect
  useEffect(() => {
    if (state.status !== 'uploading') return;
    if (!state.file) return;

    abortRef.current = false;

    runMockAnalysis({
      onChunk(chunk, id) {
        if (!abortRef.current) dispatch({ type: 'CHUNK_RECEIVED', chunk, chunkId: id });
      },
      onComplete(result) {
        if (!abortRef.current) dispatch({ type: 'STREAM_COMPLETE', result });
      },
      onProgress(_progress) {
        // progress info already conveyed by chunk count in UI
      },
    });

    return () => {
      abortRef.current = true;
    };
  }, [state.requestId]);

  // Stage progression timer
  useEffect(() => {
    if (state.status !== 'uploading') return;

    dispatch({ type: 'SET_ANALYSIS_STAGE', stage: 1 });

    const timer1 = setTimeout(() => {
      if (!abortRef.current) dispatch({ type: 'SET_ANALYSIS_STAGE', stage: 2 });
    }, 1200);
    const timer2 = setTimeout(() => {
      if (!abortRef.current) dispatch({ type: 'SET_ANALYSIS_STAGE', stage: 3 });
    }, 2800);
    const timer3 = setTimeout(() => {
      if (!abortRef.current) dispatch({ type: 'SET_ANALYSIS_STAGE', stage: 4 });
    }, 4200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [state.requestId]);

  const setFile = useCallback((file: File | null) => dispatch({ type: 'SET_FILE', file }), []);
  const setJobDescription = useCallback((jd: string) => dispatch({ type: 'SET_JD', jd }), []);
  const analyze = useCallback(() => dispatch({ type: 'INITIATE' }), []);
  const abort = useCallback(() => { abortRef.current = true; dispatch({ type: 'USER_ABORT' }); }, []);
  const retry = useCallback(() => dispatch({ type: 'REQUEST_RETRY' }), []);
  const regenerate = useCallback(() => dispatch({ type: 'REQUEST_REGENERATE' }), []);
  const reset = useCallback(() => { abortRef.current = true; dispatch({ type: 'USER_RESET' }); }, []);
  const toggleDebug = useCallback(() => dispatch({ type: 'TOGGLE_DEBUG' }), []);

  return {
    state,
    actions: { setFile, setJobDescription, analyze, abort, retry, regenerate, reset, toggleDebug },
  };
}
