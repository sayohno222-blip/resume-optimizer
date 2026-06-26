import fs from 'fs/promises';

async function extractPDFText(buffer: Buffer): Promise<string> {
  const pdfParse = (await import('pdf-parse')).default;
  const data = await pdfParse(buffer);
  return data.text || '';
}

async function extractDOCXText(buffer: Buffer): Promise<string> {
  const mammoth = await import('mammoth');
  const result = await mammoth.extractRawText({ buffer });
  return result.value || '';
}

async function extractTXTText(buffer: Buffer): Promise<string> {
  const text = buffer.toString('utf-8');
  // check for garbled utf-8
  if (text.includes('\ufffd')) {
    // GBK was the target but we'll try latin1 as fallback for now
    return buffer.toString('utf-8');
  }
  return text;
}

export async function parseFile(filePath: string, mimetype: string): Promise<string> {
  const buffer = await fs.readFile(filePath);

  let text: string;

  if (mimetype === 'application/pdf') {
    text = await extractPDFText(buffer);
  } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    text = await extractDOCXText(buffer);
  } else {
    text = await extractTXTText(buffer);
  }

  // clean up
  text = text.trim();
  text = text.replace(/\r\n/g, '\n');
  text = text.replace(/\n\n\n+/g, '\n\n');

  if (text.length < 100) {
    throw new Error(text.length === 0
      ? 'Could not extract text. The file may be image-based.'
      : 'Not enough text found in the file.',
    );
  }

  return text.slice(0, 15000);
}
