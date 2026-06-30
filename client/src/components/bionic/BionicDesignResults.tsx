import { useCallback } from 'react';
import type { BionicDesignResult } from '../../types/bionic';

interface BionicDesignResultsProps {
  result: BionicDesignResult;
  onReset: () => void;
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).catch(() => {});
  }, [text]);
  return (
    <button
      onClick={handleCopy}
      className='text-xs text-gray-400 hover:text-blue-600 hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors cursor-pointer flex items-center gap-1'
    >
      <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
      </svg>
      {label || '复制'}
    </button>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className='bg-white rounded-2xl border p-6'>
      <h3 className='text-base font-semibold text-gray-900 mb-3'>{title}</h3>
      {children}
    </div>
  );
}

function Tag({ children }: { children: string }) {
  return (
    <span className='inline-block px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium'>
      {children}
    </span>
  );
}

function ColorSwatch({ name, hex, description }: { name: string; hex: string; description: string }) {
  return (
    <div className='flex items-center gap-3'>
      <div className='w-8 h-8 rounded-lg border border-gray-200 flex-shrink-0' style={{ backgroundColor: hex }} />
      <div>
        <p className='text-sm font-medium text-gray-800'>{name}</p>
        <p className='text-xs text-gray-400'>{hex} - {description}</p>
      </div>
    </div>
  );
}

export default function BionicDesignResults({ result, onReset }: BionicDesignResultsProps) {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-bold text-gray-900'>设计方案</h2>
          <p className='text-sm text-gray-400 mt-0.5'>仿生设计分析报告</p>
        </div>
        <button
          onClick={onReset}
          className='px-4 py-2 text-sm font-medium bg-white text-gray-600 border rounded-lg hover:bg-gray-50 hover:text-gray-800 transition-colors cursor-pointer'
        >
          重新设计
        </button>
      </div>

      <SectionCard title='灵感来源分析'>
        <p className='text-sm text-gray-700 leading-relaxed whitespace-pre-line'>{result.inspirationAnalysis}</p>
      </SectionCard>

      <SectionCard title='形态 / 结构 / 功能提取'>
        <div className='space-y-5'>
          <div>
            <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>形态特征</h4>
            <ul className='space-y-1.5 list-disc list-inside text-sm text-gray-700'>
              {result.formExtraction.form.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>结构特征</h4>
            <ul className='space-y-1.5 list-disc list-inside text-sm text-gray-700'>
              {result.formExtraction.structure.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>功能特征</h4>
            <ul className='space-y-1.5 list-disc list-inside text-sm text-gray-700'>
              {result.formExtraction.function.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </SectionCard>

      <SectionCard title='产品设计方向'>
        <div className='space-y-4'>
          {result.designDirections.map((dir, i) => (
            <div key={i} className='border border-gray-100 rounded-xl p-4'>
              <h4 className='text-sm font-semibold text-gray-900 mb-1'>{dir.title}</h4>
              <p className='text-sm text-gray-600 leading-relaxed'>{dir.description}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title='CMF 建议（色彩 / 材料 / 工艺）'>
        <div className='space-y-6'>
          <div>
            <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>色彩方案</h4>
            <div className='space-y-3'>
              {result.cmfAdvice.colors.map((c, i) => (
                <ColorSwatch key={i} name={c.name} hex={c.hex} description={c.description} />
              ))}
            </div>
          </div>
          <div>
            <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>材料推荐</h4>
            <ul className='space-y-2 text-sm text-gray-700'>
              {result.cmfAdvice.materials.map((m, i) => (
                <li key={i}><span className='font-medium text-gray-800'>{m.name}</span> <span className='text-gray-400'>-</span> <span className='text-gray-500'>{m.description}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>表面处理</h4>
            <ul className='space-y-2 text-sm text-gray-700'>
              {result.cmfAdvice.finish.map((f, i) => (
                <li key={i}><span className='font-medium text-gray-800'>{f.name}</span> <span className='text-gray-400'>-</span> <span className='text-gray-500'>{f.description}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </SectionCard>

      <SectionCard title='AI 绘图提示词'>
        <div className='space-y-4'>
          {result.aiPrompts.map((p, i) => (
            <div key={i} className='border border-gray-100 rounded-xl p-4'>
              <div className='flex items-center justify-between mb-2'>
                <Tag>{p.platform}</Tag>
                <CopyButton text={p.prompt} label='复制提示词' />
              </div>
              <p className='text-sm text-gray-700 leading-relaxed font-mono bg-gray-50 rounded-lg p-3'>
                {p.prompt}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title='设计说明文案'>
        <div className='relative'>
          <div className='absolute top-0 right-0'>
            <CopyButton text={result.designStatement} label='复制全部' />
          </div>
          <p className='text-sm text-gray-700 leading-relaxed whitespace-pre-line pt-1'>
            {result.designStatement}
          </p>
        </div>
      </SectionCard>

      <div className='flex justify-center pt-2'>
        <button
          onClick={onReset}
          className='px-6 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors cursor-pointer shadow-sm'
        >
          重新设计
        </button>
      </div>
    </div>
  );
}
