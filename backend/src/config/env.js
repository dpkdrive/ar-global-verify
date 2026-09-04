import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralized, validated environment configuration.
 * The app must not silently continue with missing critical config.
 */

const required = (key) => {
  const value = process.env[key];
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const optional = (key, fallback) => process.env[key] ?? fallback;

const isProduction = process.env.NODE_ENV === 'production';

// In production, secrets and DB URI are mandatory.
// In development, we allow sane fallbacks so the app is easy to boot locally,
// but we still fail loudly if MongoDB URI is entirely absent.
const env = {
  NODE_ENV: optional('NODE_ENV', 'development'),
  PORT: parseInt(optional('PORT', '5000'), 10),
  API_VERSION: optional('API_VERSION', 'v1'),
  IS_PRODUCTION: isProduction,

  MONGODB_URI: isProduction
    ? required('MONGODB_URI')
    : optional('MONGODB_URI', 'mongodb://127.0.0.1:27017/ar_blobal_v1'),

  JWT_ACCESS_SECRET: isProduction
    ? required('JWT_ACCESS_SECRET')
    : optional('JWT_ACCESS_SECRET', 'dev_access_secret_do_not_use_in_prod'),
  JWT_REFRESH_SECRET: isProduction
    ? required('JWT_REFRESH_SECRET')
    : optional('JWT_REFRESH_SECRET', 'dev_refresh_secret_do_not_use_in_prod'),
  ACCESS_TOKEN_EXPIRES_IN: optional('ACCESS_TOKEN_EXPIRES_IN', '15m'),
  REFRESH_TOKEN_EXPIRES_IN: optional('REFRESH_TOKEN_EXPIRES_IN', '7d'),

  CLIENT_URL: optional('CLIENT_URL', 'http://localhost:3000'),
  COOKIE_DOMAIN: optional('COOKIE_DOMAIN', 'localhost'),

  RATE_LIMIT_WINDOW_MS: parseInt(optional('RATE_LIMIT_WINDOW_MS', '900000'), 10),
  RATE_LIMIT_MAX: parseInt(optional('RATE_LIMIT_MAX', '100'), 10),

  LOGIN_RATE_LIMIT_WINDOW_MS: parseInt(optional('LOGIN_RATE_LIMIT_WINDOW_MS', '900000'), 10),
  LOGIN_RATE_LIMIT_MAX: parseInt(optional('LOGIN_RATE_LIMIT_MAX', '5'), 10),

  VERIFICATION_RATE_LIMIT_WINDOW_MS: parseInt(
    optional('VERIFICATION_RATE_LIMIT_WINDOW_MS', '600000'),
    10
  ),
  VERIFICATION_RATE_LIMIT_MAX: parseInt(optional('VERIFICATION_RATE_LIMIT_MAX', '20'), 10),
  SUSPICIOUS_VERIFICATION_THRESHOLD: parseInt(
    optional('SUSPICIOUS_VERIFICATION_THRESHOLD', '10'),
    10
  ),

  LOG_LEVEL: optional('LOG_LEVEL', 'info'),

  AUTH_CODE_SECRET: isProduction
    ? required('AUTH_CODE_SECRET')
    : optional('AUTH_CODE_SECRET', 'dev_auth_code_hmac_secret'),
};

export default env;
