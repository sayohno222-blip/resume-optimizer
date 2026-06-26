import { useState } from 'react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (v: string) => void;
}

export default function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full p-4 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer"
      >
        + 添加目标职位描述（可选，用于关键词匹配）
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">目标职位描述</label>
        <button
          onClick={() => { setOpen(false); onChange(''); }}
          className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
        >
          移除
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="粘贴目标职位的 JD（职位描述），帮助分析简历关键词匹配度..."
        rows={4}
        className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        maxLength={5000}
      />
      <p className="text-xs text-gray-400 mt-1">{value.length}/5000</p>
    </div>
  );
}
