import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { analyzeRouter } from './routes/analyze.js';
import { analyzeStreamRouter } from './routes/analyzeStream.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter, streamLimiter } from './middleware/rateLimiter.js';
import { circuitBreakerMiddleware } from './middleware/circuitBreaker.js';

const app = express();

app.use(cors({ origin: config.clientOrigin }));
app.use(express.json({ limit: '1mb' }));

// Health check (no rate limit)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// Non-streaming endpoint with rate limit and circuit breaker
app.use('/api', apiLimiter, circuitBreakerMiddleware, analyzeRouter);

// Streaming endpoint with stricter rate limit
app.use('/api', streamLimiter, analyzeStreamRouter);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
