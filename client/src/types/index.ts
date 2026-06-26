export interface CategoryScore {
  score: number;
  label: string;
  maxScore: number;
}

export interface FeedbackItem {
  severity: 'high' | 'medium' | 'low';
  category: 'format' | 'keywords' | 'structure' | 'content';
  message: string;
  suggestion: string;
}

export interface KeywordAnalysis {
  matched: string[];
  missing: string[];
  overused: string[];
}

export interface AnalysisResult {
  overallScore: number;
  categories: {
    format: CategoryScore;
    keywords: CategoryScore;
    structure: CategoryScore;
    content: CategoryScore;
  };
  keywords: KeywordAnalysis;
  feedback: FeedbackItem[];
  summary: string;
}

export type AnalysisState = 'idle' | 'uploading' | 'done' | 'error';

export { ErrorCode, createAppError } from './errors';
export type { AppError } from './errors';
export { createInitialState } from './stateMachine';
export type { MachineStatus, MachineState, MachineAction, StreamedChunk, DebugEntry } from './stateMachine';
