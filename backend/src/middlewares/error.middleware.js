import mongoose from 'mongoose';
import { AppError } from '../utils/app-error.js';
import logger from '../config/logger.js';

export const notFoundHandler = (req, res, next) =>
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404, 'ROUTE_NOT_FOUND'));

export const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  let error = err;
  if (err instanceof mongoose.Error.ValidationError) {
    error = new AppError('Validation failed', 422, 'VALIDATION_ERROR', Object.values(err.errors).map((item) => ({ field: item.path, message: item.message })));
  } else if (err?.code === 11000) {
    error = new AppError('A record with this value already exists', 409, 'DUPLICATE_RESOURCE', Object.keys(err.keyPattern ?? {}).map((field) => ({ field, message: 'Must be unique' })));
  } else if (err instanceof mongoose.Error.CastError) {
    error = new AppError('Invalid resource identifier', 400, 'INVALID_ID');
  } else if (err?.name === 'JsonWebTokenError' || err?.name === 'TokenExpiredError') {
    error = new AppError('Authentication token is invalid or expired', 401, 'UNAUTHORIZED');
  }

  const statusCode = error.isOperational ? error.statusCode : 500;
  if (!error.isOperational) logger.error({ err: error, requestId: req.id }, 'Unhandled request error');
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'An unexpected error occurred' : error.message,
    error: { code: error.isOperational ? error.code : 'INTERNAL_ERROR', details: error.isOperational ? error.details : [] },
  });
};
