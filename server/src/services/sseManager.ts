import type { Response } from 'express';

interface SSEManager {
  sendEvent: (event: string, data: object) => void;
  sendHeartbeat: () => void;
  startHeartbeat: (intervalMs: number) => NodeJS.Timeout;
  close: () => void;
}

export function setupSSE(res: Response): SSEManager {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  let heartbeatTimer: NodeJS.Timeout | null = null;

  function sendEvent(event: string, data: object) {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  }

  function sendHeartbeat() {
    sendEvent('heartbeat', { ts: Date.now() });
  }

  function startHeartbeat(intervalMs: number): NodeJS.Timeout {
    heartbeatTimer = setInterval(sendHeartbeat, intervalMs);
    return heartbeatTimer;
  }

  function close() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
    if (!res.writableEnded) {
      res.end();
    }
  }

  return { sendEvent, sendHeartbeat, startHeartbeat, close };
}

// Session-based chunk buffer for reconnect support
const sessionStore = new Map<string, Map<number, string>>();
const SESSION_TTL = 60000;

export function createSession(): string {
  const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  sessionStore.set(sessionId, new Map());
  setTimeout(() => sessionStore.delete(sessionId), SESSION_TTL);
  return sessionId;
}

export function addChunkToSession(sessionId: string, chunkId: number, text: string): void {
  const chunks = sessionStore.get(sessionId);
  if (chunks) {
    chunks.set(chunkId, text);
  }
}

export function getChunksFrom(sessionId: string, lastChunkId: number): string[] {
  const chunks = sessionStore.get(sessionId);
  if (!chunks) return [];
  const result: string[] = [];
  for (const [id, text] of chunks) {
    if (id > lastChunkId) {
      result.push(text);
    }
  }
  return result;
}

export function deleteSession(sessionId: string): void {
  sessionStore.delete(sessionId);
}
