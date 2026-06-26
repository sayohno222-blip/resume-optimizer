import { Request, Response, NextFunction } from 'express';
import { config } from '../config.js';

let failureCount = 0;
let openUntil: number | null = null;
const FAILURE_THRESHOLD = config.circuitThreshold;
const TIMEOUT = config.circuitTimeout;

export function circuitBreakerMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (openUntil) {
    if (Date.now() < openUntil) {
      res.status(503).json({
        code: 'CIRCUIT_OPEN',
        message: 'Service temporarily unavailable',
        recoverable: false,
        retryAfterMs: openUntil - Date.now(),
      });
      return;
    }
    // timeout expired, allow probe (half-open)
    openUntil = null;
  }

  // Wrap response to track failures
  const originalJson = res.json.bind(res);
  res.json = function (body: any) {
    if (res.statusCode >= 500) {
      recordFailure();
    } else {
      failureCount = 0;
    }
    return originalJson(body);
  };

  // Also track unhandled errors through SSE
  res.on('close', () => {
    // If client disconnected before complete, don't count as failure
  });

  next();
}

export function recordAIFailure(): void {
  recordFailure();
}

export function recordAISuccess(): void {
  failureCount = 0;
}

function recordFailure(): void {
  failureCount++;
  if (failureCount >= FAILURE_THRESHOLD) {
    openUntil = Date.now() + TIMEOUT;
    console.warn(`Circuit breaker OPEN for ${TIMEOUT}ms (${failureCount} consecutive failures)`);
  }
}

export function isCircuitOpen(): boolean {
  return openUntil !== null && Date.now() < openUntil;
}
