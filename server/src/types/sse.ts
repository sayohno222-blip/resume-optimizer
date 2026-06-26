export interface SSEChunkData {
  id: number;
  text: string;
}

export interface SSECompleteData {
  result: unknown;
}

export interface SSEErrorData {
  code: string;
  message: string;
  recoverable: boolean;
}

export interface SSEHeartbeatData {
  ts: number;
}

export type SSEEventType = 'chunk' | 'complete' | 'error' | 'heartbeat';

export interface SSEEvent {
  event: SSEEventType;
  data: SSEChunkData | SSECompleteData | SSEErrorData | SSEHeartbeatData;
}
