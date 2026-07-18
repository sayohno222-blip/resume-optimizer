// The public AI endpoint is intentionally disabled.
// The deployed product is a Mock demo and must not consume a configured API key.

export default function handler(_req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(503).json({
    error: 'API_DISABLED',
    message: 'AI analysis is disabled. This deployment uses Mock data.',
  });
}
