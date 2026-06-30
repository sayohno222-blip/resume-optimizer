import type { BionicStatus } from '../../hooks/useBionicDesign';
import type { BionicInput } from '../../types/bionic';

interface BionicDesignFormProps {
  input: BionicInput;
  status: BionicStatus;
  onInput: (input: Partial<BionicInput>) => void;
  onSubmit: () => void;
}

const FIELDS: {
  key: keyof BionicInput;
  label: string;
  placeholder: string;
  multiline?: boolean;
  required?: boolean;
  hint?: string;
}[] = [
  {
    key: 'productType' as const,
    label: '产品类型',
    placeholder: '例如：手机支架、水杯、台灯、椅子...',
    required: true,
    hint: '你想设计什么产品？',
  },
  {
    key: 'inspiration' as const,
    label: '灵感来源',
    placeholder: '例如：云朵、竹叶、贝壳、蜂巢...',
    required: true,
    hint: '从什么自然物或生物中获取灵感？',
  },
  {
    key: 'styleKeywords' as const,
    label: '风格关键词',
    placeholder: '例如：极简、自然、未来感、温暖...',
    hint: '多个关键词用空格或逗号隔开',
  },
  {
    key: 'targetUsers' as const,
    label: '目标用户',
    placeholder: '例如：办公室白领、学生、户外爱好者...',
    multiline: true,
    hint: '谁会使用这个产品？',
  },
  {
    key: 'designGoal' as const,
    label: '设计目标',
    placeholder: '例如：解决桌面收纳问题、提升使用仪式感...',
    multiline: true,
    hint: '你想通过设计解决什么问题？',
  },
];

export default function BionicDesignForm({ input, status, onInput, onSubmit }: BionicDesignFormProps) {
  const isSubmitting = status === 'uploading';
  const isValid = input.productType.trim() && input.inspiration.trim();

  return (
    <div className='space-y-6'>
      <div className='text-center mb-2'>
        <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight'>
          仿生产品设计助手
        </h1>
        <p className='text-gray-500 max-w-xl mx-auto leading-relaxed text-sm md:text-base'>
          从自然界获取灵感，AI 帮你完成从生物特征提取到产品设计方案的全流程
        </p>
      </div>
      <div className='bg-white rounded-2xl border p-6 md:p-8 space-y-5'>
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className='block text-sm font-medium text-gray-700 mb-1.5'>
              {field.label}
              {field.required && <span className='text-red-400 ml-1'>*</span>}
            </label>
            {field.multiline ? (
              <textarea
                value={input[field.key] as string}
                onChange={(e) => onInput({ [field.key]: e.target.value })}
                placeholder={field.placeholder}
                rows={3}
                disabled={isSubmitting}
                className='w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-500 transition-colors resize-none'
              />
            ) : (
              <input
                type='text'
                value={input[field.key] as string}
                onChange={(e) => onInput({ [field.key]: e.target.value })}
                placeholder={field.placeholder}
                disabled={isSubmitting}
                className='w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-500 transition-colors'
              />
            )}
            {field.hint && (
              <p className='mt-1 text-xs text-gray-400'>{field.hint}</p>
            )}
          </div>
        ))}
        <button
          onClick={onSubmit}
          disabled={!isValid || isSubmitting}
          className={[
            'w-full py-3 rounded-xl font-medium text-base transition-all cursor-pointer',
            isValid && !isSubmitting
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md active:scale-[0.98]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          ].join(' ')}
        >
          {isSubmitting ? '正在生成设计方案...' : '\u{1F98B} 生成设计方案'}
        </button>
      </div>
      <div className='bg-blue-50/50 border border-blue-100 rounded-xl p-4'>
        <p className='text-xs text-blue-700 leading-relaxed'>
          {'\u{1F4A1}'} <span className='font-medium'>提示：</span>
          灵感来源可以是动物、植物、微生物或自然现象。越具体的描述，AI 生成的设计方案越有针对性。
          例如蜂巢的六边形结构比蜜蜂更精准。
        </p>
      </div>
    </div>
  );
}
