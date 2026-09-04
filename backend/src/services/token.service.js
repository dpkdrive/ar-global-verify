import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export const createAccessToken = (user) => jwt.sign(
  { sub: user.id, role: user.role, tokenVersion: user.tokenVersion },
  env.JWT_ACCESS_SECRET,
  { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN }
);

export const createRefreshToken = (user) => jwt.sign(
  { sub: user.id, tokenVersion: user.tokenVersion },
  env.JWT_REFRESH_SECRET,
  { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN }
);

export const verifyRefreshToken = (token) => jwt.verify(token, env.JWT_REFRESH_SECRET);
export const refreshCookieOptions = { httpOnly: true, secure: env.IS_PRODUCTION, sameSite: 'strict', path: '/api/v1/auth', maxAge: 7 * 24 * 60 * 60 * 1000 };
