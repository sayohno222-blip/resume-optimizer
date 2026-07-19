const MAX_EXTRACTED_CHARACTERS = 100_000;

export class FileParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileParseError';
  }
}

function cleanExtractedText(text: string): string {
  return text
    .replace(/\u0000/g, '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\t ]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, MAX_EXTRACTED_CHARACTERS);
}

async function extractPdfText(file: File): Promise<string> {
  const [{ getDocument, GlobalWorkerOptions }, { default: pdfWorkerUrl }] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ]);
  GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

  const data = new Uint8Array(await file.arrayBuffer());
  const document = await getDocument({ data }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => {
        if (!('str' in item)) return '';
        return item.hasEOL ? `${item.str}\n` : `${item.str} `;
      })
      .join('');
    pages.push(pageText);
  }

  return pages.join('\n');
}

async function extractDocxText(file: File): Promise<string> {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

export async function extractResumeText(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  let text = '';

  try {
    if (file.type === 'text/plain' || extension === 'txt') {
      text = await file.text();
    } else if (file.type === 'application/pdf' || extension === 'pdf') {
      text = await extractPdfText(file);
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      || extension === 'docx'
    ) {
      text = await extractDocxText(file);
    } else {
      throw new FileParseError('暂不支持该文件格式，请上传 PDF、DOCX 或 TXT。');
    }
  } catch (error) {
    if (error instanceof FileParseError) throw error;
    throw new FileParseError('无法读取该简历。文件可能已损坏、加密，或 PDF 只有图片而没有文字层。');
  }

  const cleaned = cleanExtractedText(text);
  if (cleaned.length < 80) {
    throw new FileParseError('提取到的文字太少，无法进行可靠分析。扫描版 PDF 请先进行文字识别，或改用 DOCX / TXT。');
  }

  return cleaned;
}
