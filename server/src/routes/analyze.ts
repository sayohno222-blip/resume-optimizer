import { Router, Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import { upload } from '../middleware/upload.js';
import { parseFile } from '../services/parser.js';
import { analyzeWithAI } from '../services/ai.js';
import { validateResult } from '../services/scorer.js';

export const analyzeRouter = Router();

analyzeRouter.post('/analyze', upload.single('resume'), async (req: Request, res: Response, next: NextFunction) => {
  const filePath = req.file?.path;

  try {
    if (!req.file) {
      res.status(400).json({ error: 'NO_FILE' });
      return;
    }

    const jobDescription = req.body.jobDescription || undefined;

    const text = await parseFile(req.file.path, req.file.mimetype);
    const result = await analyzeWithAI(text, jobDescription);
    const validated = validateResult(result);

    res.json(validated);
  } catch (err: any) {
    if (err.message === 'INVALID_FILE_TYPE') {
      res.status(400).json({ error: 'INVALID_FILE_TYPE', message: 'Please upload a PDF, DOCX, or TXT file.' });
    } else if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'FILE_TOO_LARGE' });
    } else if (err.message?.includes('Not enough text') || err.message?.includes('Could not extract')) {
      res.status(422).json({ error: 'PARSE_FAILED', message: err.message });
    } else if (err.name === 'ZodError') {
      res.status(500).json({ error: 'VALIDATION_ERROR', message: 'AI response format error.' });
    } else {
      next(err);
    }
  } finally {
    if (filePath) {
      await fs.unlink(filePath).catch(() => {});
    }
  }
});
