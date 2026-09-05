import crypto from 'node:crypto';
import env from '../config/env.js';

export const hashAuthenticationCode = (code) => crypto
  .createHmac('sha256', env.AUTH_CODE_SECRET)
  .update(code.toUpperCase())
  .digest('hex');

export const createAuthenticationCode = () => `AR-${crypto.randomBytes(12).toString('hex').toUpperCase()}`;
