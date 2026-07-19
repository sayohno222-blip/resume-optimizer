import type { AnalysisResult } from '../../types';
import ScoreGauge from './ScoreGauge';
import CategoryBreakdown from './CategoryBreakdown';
import KeywordAnalysis from './KeywordAnalysis';
import FeedbackList from './FeedbackList';
import BeforeAfterComparison from './BeforeAfterComparison';
import { ANALYSIS_MODE_LABEL, RESULT_DISCLAIMER } from '../../config';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  const hasBeforeAfterExamples = result.feedback.some((item) => item.exampleBefore && item.exampleAfter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">分析报告</h2>
          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
            {ANALYSIS_MODE_LABEL}
          </span>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium bg-white text-gray-600 border rounded-lg hover:bg-gray-50 hover:text-gray-800 transition-colors cursor-pointer"
        >
          分析新简历
        </button>
      </div>

      {/* Score + Summary */}
      <div className="bg-white rounded-2xl border p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <ScoreGauge score={result.overallScore} />
          <div className="flex-1 text-center md:text-left">
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              {result.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Category Scores + Keyword Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-6">
          <CategoryBreakdown categories={result.categories} />
        </div>
        <div className="bg-white rounded-2xl border p-6">
          <KeywordAnalysis keywords={result.keywords} />
        </div>
      </div>

      {/* Before / After Comparison */}
      {hasBeforeAfterExamples && (
        <div className="bg-white rounded-2xl border p-6">
          <BeforeAfterComparison feedback={result.feedback} />
        </div>
      )}

      {/* Feedback */}
      <div className="bg-white rounded-2xl border p-6">
        <FeedbackList feedback={result.feedback} />
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-400">{RESULT_DISCLAIMER}</p>
      </div>
    </div>
  );
}
