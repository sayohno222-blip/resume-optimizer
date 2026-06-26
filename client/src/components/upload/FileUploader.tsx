import { useCallback, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';

interface FileUploaderProps {
  file: File | null;
  onFile: (file: File | null) => void;
}

export default function FileUploader({ file, onFile }: FileUploaderProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      setErrorMsg(null);
      if (accepted.length > 0) {
        onFile(accepted[0]);
      }
    },
    [onFile],
  );

  const onDropRejected = useCallback(
    (rejections: FileRejection[]) => {
      const err = rejections[0]?.errors[0];
      if (err?.code === 'file-too-large') {
        setErrorMsg('文件大小超出限制（最大 5MB）');
      } else if (err?.code === 'file-invalid-type') {
        setErrorMsg('暂不支持此文件格式，请上传 PDF / DOCX / TXT');
      } else {
        setErrorMsg('文件上传失败，请重试');
      }
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  if (file) {
    return null;
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <div>
            <p className="text-gray-700 font-medium">
              {isDragActive ? '松开文件以上传' : '拖拽简历文件到此处，或点击选择'}
            </p>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center mt-2">支持 PDF / DOCX / TXT 格式，最大 5MB</p>
      {errorMsg && (
        <p className="text-xs text-red-500 text-center mt-1.5">{errorMsg}</p>
      )}
    </div>
  );
}
