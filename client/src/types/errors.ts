export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  SSE_PARSE_ERROR = 'SSE_PARSE_ERROR',
  API_ERROR = 'API_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  ABORTED = 'ABORTED',
  CIRCUIT_OPEN = 'CIRCUIT_OPEN',
  RECONNECT_FAILED = 'RECONNECT_FAILED',
  RATE_LIMITED = 'RATE_LIMITED',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  recoverable: boolean;
  statusCode?: number;
  timestamp: number;
  retryAfterMs?: number;
}

export function createAppError(
  code: ErrorCode,
  message: string,
  recoverable: boolean,
  extra?: Partial<Pick<AppError, 'statusCode' | 'retryAfterMs'>>,
): AppError {
  return {
    code,
    message,
    recoverable,
    timestamp: Date.now(),
    ...extra,
  };
}
