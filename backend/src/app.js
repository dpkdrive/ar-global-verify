import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import verificationRoutes from './routes/verification.routes.js';
import userRoutes from './routes/user.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import auditLogRoutes from './routes/audit-log.routes.js';
import env from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

/**
 * Express application instance.
 *
 * NOTE: Security middleware (Helmet, CORS, rate limiting), centralized
 * error handling, and request validation middleware are intentionally
 * NOT wired up yet — those belong to Phase 2 per the project plan.
 * Phase 1 only establishes server bootstrap, DB connection, and health check.
 */
const app = express();

app.set('trust proxy', 1);
app.set("view engine", "ejs");

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(rateLimit({ windowMs: env.RATE_LIMIT_WINDOW_MS, limit: env.RATE_LIMIT_MAX, standardHeaders: 'draft-7', legacyHeaders: false }));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(cookieParser());

// Health check (unversioned, per spec: GET /api/health)
app.use('/api/health', healthRoutes);
const api = `/api/${env.API_VERSION}`;
app.use(`${api}/auth`, authRoutes);
app.use(`${api}/products`, productRoutes);
app.use(`${api}/users`, userRoutes);
app.use(`${api}/dashboard`, dashboardRoutes);
app.use(`${api}/audit-logs`, auditLogRoutes);
app.use(`${api}/verify`, rateLimit({ windowMs: env.VERIFICATION_RATE_LIMIT_WINDOW_MS, limit: env.VERIFICATION_RATE_LIMIT_MAX, standardHeaders: 'draft-7', legacyHeaders: false }), verificationRoutes);

// Placeholder root
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AR-Blobal-V1 Product Authentication API',
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
