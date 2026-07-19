import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { MachineAction, MachineState } from '../types';
import { createAppError, createInitialState, ErrorCode } from '../types';
import { analyzeResumeLocally } from '../services/localAnalyzer';

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
      return {
        ...state,
        status: 'reconnecting',
        reconnectAttempt: state.reconnectAttempt + 1,
        disconnectCount: state.disconnectCount + 1,
      };
    case 'RECONNECT_SUCCESS':
      return { ...state, status: 'streaming', lastChunkId: action.lastChunkId };
    case 'RECONNECT_MAX_RETRIES':
      return {
        ...state,
        status: 'error',
        error: createAppError(ErrorCode.RECONNECT_FAILED, 'Maximum reconnection attempts reached', false),
        requestEndTime: Date.now(),
        failureCount: state.failureCount + 1,
      };
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

export function useAnalyze() {
  const [state, dispatch] = useReducer(machineReducer, null, createInitialState);
  const abortRef = useRef(false);

  useEffect(() => {
    if (state.status !== 'uploading' || !state.file) return;

    abortRef.current = false;

    const runAnalysis = async () => {
      try {
        const result = await analyzeResumeLocally(state.file!, state.jobDescription, {
          onStage(stage) {
            if (!abortRef.current) dispatch({ type: 'SET_ANALYSIS_STAGE', stage });
          },
        });
        if (!abortRef.current) dispatch({ type: 'STREAM_COMPLETE', result });
      } catch (error) {
        if (abortRef.current) return;
        const message = error instanceof Error ? error.message : '本地分析失败，请更换文件后重试。';
        dispatch({
          type: 'STREAM_ERROR',
          error: createAppError(ErrorCode.VALIDATION_ERROR, message, true),
        });
      }
    };

    void runAnalysis();

    return () => {
      abortRef.current = true;
    };
  }, [state.file, state.jobDescription, state.requestId, state.status]);

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
