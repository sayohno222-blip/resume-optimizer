interface FilePreviewProps {
  file: File;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

const typeLabel: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'text/plain': 'TXT',
};

export default function FilePreview({ file }: FilePreviewProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border shadow-sm">
      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
        {typeLabel[file.type] || '?'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{file.name}</p>
        <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
      </div>
      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
        <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  );
}
