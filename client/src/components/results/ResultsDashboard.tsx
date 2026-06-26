import type { AnalysisResult } from '../../types';
import ScoreGauge from './ScoreGauge';
import CategoryBreakdown from './CategoryBreakdown';
import KeywordAnalysis from './KeywordAnalysis';
import FeedbackList from './FeedbackList';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">分析报告</h2>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
        >
          重新分析
        </button>
      </div>

      <div className="bg-white rounded-2xl border p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <ScoreGauge score={result.overallScore} />
          <div className="flex-1">
            <p className="text-gray-700 leading-relaxed">{result.summary}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-6">
          <CategoryBreakdown categories={result.categories} />
        </div>
        <div className="bg-white rounded-2xl border p-6">
          <KeywordAnalysis keywords={result.keywords} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-6">
        <FeedbackList feedback={result.feedback} />
      </div>
    </div>
  );
}
