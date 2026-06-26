import { Router, Request, Response } from 'express';
import fs from 'fs/promises';
import { upload } from '../middleware/upload.js';
import { parseFile } from '../services/parser.js';
import { analyzeWithAIStream, analyzeWithAI } from '../services/ai.js';
import { validateResult } from '../services/scorer.js';
import { setupSSE, createSession, addChunkToSession, getChunksFrom, deleteSession } from '../services/sseManager.js';

export const analyzeStreamRouter = Router();

analyzeStreamRouter.post('/analyze/stream', upload.single('resume'), async (req: Request, res: Response) => {
  const sse = setupSSE(res);
  const heartbeatTimer = sse.startHeartbeat(10000);
  const filePath = req.file?.path;
  let sessionId: string | null = null;

  try {
    if (!req.file) {
      sse.sendEvent('error', { code: 'NO_FILE', message: 'No file uploaded', recoverable: false });
      sse.close();
      return;
    }

    // Check if this is a reconnect (lastChunkId present)
    const lastChunkId = req.body.lastChunkId ? parseInt(req.body.lastChunkId) : undefined;
    sessionId = req.body.sessionId || createSession();

    if (lastChunkId !== undefined && sessionId) {
      // Replay missed chunks
      const missedChunks = getChunksFrom(sessionId, lastChunkId);
      if (missedChunks.length > 0) {
        // Send session ID first
        sse.sendEvent('chunk', { id: -1, text: '', sessionId });
        for (let i = 0; i < missedChunks.length; i++) {
          sse.sendEvent('chunk', { id: lastChunkId + 1 + i, text: missedChunks[i] });
        }
        sse.close();
        clearInterval(heartbeatTimer);
        return;
      }
      // If no buffered chunks, fall through to full re-analysis
    }

    const jobDescription = req.body.jobDescription || undefined;
    const text = await parseFile(req.file.path, req.file.mimetype);

    // Send session ID in first event
    sse.sendEvent('chunk', { id: -1, text: '', sessionId });

    let accumulated = '';
    let chunkId = 0;

    const stream = analyzeWithAIStream(text, jobDescription);

    for await (const delta of stream) {
      accumulated += delta;
      sse.sendEvent('chunk', { id: chunkId, text: delta });
      if (sessionId) {
        addChunkToSession(sessionId, chunkId, delta);
      }
      chunkId++;
    }

    // Parse and validate complete response
    let parsed: unknown;
    try {
      parsed = JSON.parse(accumulated);
    } catch {
      const match = accumulated.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        parsed = JSON.parse(match[1].trim());
      } else {
        throw new Error('Could not parse AI response as JSON');
      }
    }

    const validated = validateResult(parsed);
    sse.sendEvent('complete', { result: validated });

    if (sessionId) {
      deleteSession(sessionId);
    }
  } catch (err: any) {
    if (err.message === 'INVALID_FILE_TYPE') {
      sse.sendEvent('error', { code: 'INVALID_FILE_TYPE', message: 'Please upload a PDF, DOCX, or TXT file.', recoverable: false });
    } else if (err.code === 'LIMIT_FILE_SIZE') {
      sse.sendEvent('error', { code: 'FILE_TOO_LARGE', message: 'File exceeds size limit.', recoverable: false });
    } else if (err.message?.includes('Not enough text') || err.message?.includes('Could not extract')) {
      sse.sendEvent('error', { code: 'PARSE_FAILED', message: err.message, recoverable: false });
    } else {
      sse.sendEvent('error', {
        code: 'API_ERROR',
        message: err.message || 'An unexpected error occurred',
        recoverable: true,
      });
    }
  } finally {
    clearInterval(heartbeatTimer);
    sse.close();
    if (filePath) {
      await fs.unlink(filePath).catch(() => {});
    }
  }
});
