import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import env from '../config/env.js';
import { AppError } from '../utils/app-error.js';

export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new AppError('Authentication is required', 401, 'UNAUTHORIZED'));
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
  const user = await User.findById(payload.sub).select('+tokenVersion');
  if (!user || !user.isActive || payload.tokenVersion !== user.tokenVersion) return next(new AppError('Authentication is no longer valid', 401, 'UNAUTHORIZED'));
  req.user = user;
  return next();
};

export const authorize = (...roles) => (req, res, next) =>
  roles.includes(req.user?.role)
    ? next()
    : next(new AppError('You do not have permission to perform this action', 403, 'FORBIDDEN'));
