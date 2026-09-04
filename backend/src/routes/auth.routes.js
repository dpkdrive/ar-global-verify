import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { changePassword, login, logout, me, refresh } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { changePasswordSchema, loginSchema } from '../validators/auth.validator.js';
import { asyncHandler } from '../utils/async-handler.js';
import env from '../config/env.js';

const router = Router();
const loginLimiter = rateLimit({ windowMs: env.LOGIN_RATE_LIMIT_WINDOW_MS, limit: env.LOGIN_RATE_LIMIT_MAX, standardHeaders: 'draft-7', legacyHeaders: false, message: { success: false, message: 'Too many sign-in attempts. Please try again later.', error: { code: 'RATE_LIMITED', details: [] } } });
router.post('/login', loginLimiter, validate(loginSchema), asyncHandler(login));
router.post('/refresh', asyncHandler(refresh));
router.post('/logout', logout);
router.get('/me', requireAuth, asyncHandler(me));
router.patch('/change-password', requireAuth, validate(changePasswordSchema), asyncHandler(changePassword));
export default router;
