import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

export const config = {
  port: parseInt(process.env.PORT || '3001'),
  deepseekApiKey: process.env.DEEPSEEK_API_KEY || '',
  aiModel: process.env.AI_MODEL || 'deepseek-chat',
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '5'),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  circuitThreshold: 3,
  circuitTimeout: 10000,
  heartbeatInterval: 10000,
  streamTimeout: 120000,
};
