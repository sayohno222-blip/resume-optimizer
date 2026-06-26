export default function EmptyState() {
  return (
    <div className="py-12 text-center">
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
        <div className="p-4 bg-white rounded-xl border text-center">
          <div className="text-2xl mb-1">📄</div>
          <p className="text-xs text-gray-500">上传简历</p>
        </div>
        <div className="p-4 bg-white rounded-xl border text-center">
          <div className="text-2xl mb-1">🤖</div>
          <p className="text-xs text-gray-500">AI 分析</p>
        </div>
        <div className="p-4 bg-white rounded-xl border text-center">
          <div className="text-2xl mb-1">📊</div>
          <p className="text-xs text-gray-500">获取报告</p>
        </div>
      </div>
    </div>
  );
}
