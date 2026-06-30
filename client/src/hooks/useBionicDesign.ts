import { useReducer, useEffect, useCallback, useRef } from 'react';
import type { BionicInput, BionicDesignResult } from '../types/bionic';
import { runBionicMock } from '../services/bionicMockData';

export type BionicStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface BionicState {
  status: BionicStatus;
  input: BionicInput;
  result: BionicDesignResult | null;
  error: string | null;
  requestId: number;
  analysisStage: number;
  analysisLabel: string;
}

type BionicAction =
  | { type: 'SET_INPUT'; input: Partial<BionicInput> }
  | { type: 'SUBMIT' }
  | { type: 'PROGRESS'; stage: number; label: string }
  | { type: 'COMPLETE'; result: BionicDesignResult }
  | { type: 'ERROR'; error: string }
  | { type: 'RESET' };

function createInitialState(): BionicState {
  return {
    status: 'idle',
    input: { productType: '', inspiration: '', styleKeywords: '', targetUsers: '', designGoal: '' },
    result: null,
    error: null,
    requestId: 0,
    analysisStage: 0,
    analysisLabel: '',
  };
}

function reducer(state: BionicState, action: BionicAction): BionicState {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, input: { ...state.input, ...action.input }, error: null };
    case 'SUBMIT':
      return {
        ...state,
        status: 'uploading',
        error: null,
        result: null,
        requestId: state.requestId + 1,
        analysisStage: 0,
        analysisLabel: '',
      };
    case 'PROGRESS':
      return { ...state, analysisStage: action.stage, analysisLabel: action.label };
    case 'COMPLETE':
      return { ...state, status: 'success', result: action.result, analysisStage: 4, analysisLabel: '生成完成' };
    case 'ERROR':
      return { ...state, status: 'error', error: action.error };
    case 'RESET':
      return createInitialState();
    default:
      return state;
  }
}

export function useBionicDesign() {
  const [state, dispatch] = useReducer(reducer, null, createInitialState);
  const abortRef = useRef(false);

  // Mock generation effect
  useEffect(() => {
    if (state.status !== 'uploading') return;

    abortRef.current = false;

    runBionicMock(state.input, {
      onProgress(stage, label) {
        if (!abortRef.current) dispatch({ type: 'PROGRESS', stage, label });
      },
      onComplete(result) {
        if (!abortRef.current) dispatch({ type: 'COMPLETE', result });
      },
    });

    return () => {
      abortRef.current = true;
    };
  }, [state.requestId]);

  const setInput = useCallback((input: Partial<BionicInput>) => dispatch({ type: 'SET_INPUT', input }), []);
  const submit = useCallback(() => dispatch({ type: 'SUBMIT' }), []);
  const reset = useCallback(() => { abortRef.current = true; dispatch({ type: 'RESET' }); }, []);

  return { state, actions: { setInput, submit, reset } };
}
