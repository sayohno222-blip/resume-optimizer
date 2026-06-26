export default function LoadingOverlay() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="mt-6 text-gray-600 font-medium">正在分析您的简历...</p>
      <p className="text-sm text-gray-400 mt-1">AI 正在评估 ATS 兼容性，请稍候</p>
    </div>
  );
}
