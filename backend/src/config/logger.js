import pino from 'pino';
import env from './env.js';

/**
 * Structured logger.
 * IMPORTANT: Never log passwords, raw authentication codes, JWT secrets,
 * or other sensitive personal information. Use the `redact` list below
 * to defensively strip common sensitive keys if they ever get logged.
 */
const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: [
      'req.headers.cookie',
      'req.headers.authorization',
      'password',
      'passwordHash',
      'code',
      'codeHash',
      'token',
      'accessToken',
      'refreshToken',
      '*.password',
      '*.passwordHash',
      '*.codeHash',
    ],
    censor: '[REDACTED]',
  },
  transport: env.IS_PRODUCTION
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
});

export default logger;
