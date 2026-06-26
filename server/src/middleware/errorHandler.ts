import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) {
  console.error('Unhandled error:', err.message, err.stack);

  const code = err.status === 429 ? 'RATE_LIMITED'
    : err.status === 413 ? 'FILE_TOO_LARGE'
    : 'INTERNAL_ERROR';

  const status = err.status || 500;

  res.status(status).json({
    code,
    message: err.message || 'An unexpected error occurred',
    recoverable: status >= 500,
  });
}
