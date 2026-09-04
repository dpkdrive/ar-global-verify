import { AppError } from '../utils/app-error.js';

export const validate = (schema) => (req, res, next) => {
  // Express does not initialize req.body for GET/DELETE requests without a
  // request body. Treat it as an empty object so route schemas stay uniform.
  const result = schema.safeParse({ body: req.body ?? {}, params: req.params ?? {}, query: req.query ?? {} });
  if (!result.success) {
    return next(new AppError('Request validation failed', 422, 'VALIDATION_ERROR', result.error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }))));
  }
  req.body = result.data.body;
  req.params = result.data.params;
  // In Express 5, req.query is a read-only getter. Keep the parsed query in a
  // dedicated request property rather than trying to overwrite it.
  req.validated = result.data;
  return next();
};
