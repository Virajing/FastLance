import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';
import { env } from './config/env.js';
import { processWebhook } from './services/payment.js';
import { ApiError, asyncHandler, ok } from './utils/api.js';
const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use((req, res, next) => {
  req.io = app.get('io');
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && !req.path.endsWith('/payments/webhook')) {
    if (req.headers.origin && !env.CLIENT_URL.includes(req.headers.origin) || !req.headers.origin && req.headers['sec-fetch-site'] === 'cross-site')
      return next(new ApiError(403, 'Request origin is not allowed'));
  }
  next();
});
app.post('/api/v1/payments/webhook', express.raw({ type: 'application/json', limit: '256kb' }),
  asyncHandler(async (req, res) => ok(res, await processWebhook(req.body, req.headers, req.io))));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use('/api/v1', rateLimit({
  windowMs: 60000, limit: 500, standardHeaders: 'draft-8', legacyHeaders: false,
  message: { success: false, message: 'Request limit reached. Try again in a minute.' },
}), routes);
app.get('/health', (_req, res) => ok(res, { status: 'ok' }));
app.use(notFound);
app.use(errorHandler);
export default app;
