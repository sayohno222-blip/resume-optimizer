const STAGE_LABELS: Record<number, string> = {
  0: '正在准备本地分析...',
  1: '正在读取简历文字...',
  2: '正在提取岗位关键词...',
  3: '正在检查结构与内容...',
  4: '正在整理规则分析报告...',
};

export default function LoadingOverlay({ stage }: { stage: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="mt-6 text-gray-600 font-medium">{STAGE_LABELS[stage] ?? STAGE_LABELS[0]}</p>
      <p className="text-sm text-gray-400 mt-1">所有处理均在当前浏览器中完成</p>
    </div>
  );
}
