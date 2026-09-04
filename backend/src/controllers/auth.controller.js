import User from '../models/user.model.js';
import { AppError } from '../utils/app-error.js';
import { sendSuccess } from '../utils/api-response.js';
import { createAccessToken, createRefreshToken, refreshCookieOptions, verifyRefreshToken } from '../services/token.service.js';
import { recordAuditLog } from '../services/audit.service.js';

const publicUser = (user) => user.toJSON();
const issueTokens = (res, user) => { res.cookie('refreshToken', createRefreshToken(user), refreshCookieOptions); return createAccessToken(user); };

export const login = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  // passwordHash is normally hidden; select it only to verify the login.
  const user = await User.findOne(
    { email: normalizedEmail }
  ).select('+passwordHash +tokenVersion');

  if (!user || !user.isActive) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // comparePassword is defined by the User model and compares password with
  // the stored passwordHash. Never return passwordHash in an API response.
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const accessToken = issueTokens(res, user);

  return sendSuccess(res, { message: 'Signed in successfully', data: { user: publicUser(user), accessToken } });
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  // Load the password hash explicitly; it is intentionally hidden by default.
  const user = await User.findById(req.user.id).select('+passwordHash +tokenVersion');

  if (!user || !user.isActive) {
    throw new AppError('Authentication is no longer valid', 401, 'UNAUTHORIZED');
  }

  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new AppError('Current password is incorrect', 401, 'INVALID_CREDENTIALS');
  }

  user.passwordHash = await User.hashPassword(newPassword);
  // Invalidates every existing access and refresh token, including other devices.
  user.tokenVersion += 1;
  await user.save();
  await recordAuditLog({ req, action: 'auth.password_changed', targetType: 'user', targetId: user.id });

  const accessToken = issueTokens(res, user);
  return sendSuccess(res, {
    message: 'Password changed successfully',
    data: { user: publicUser(user), accessToken },
  });
};

export const refresh = async (req, res) => {
  if (!req.cookies.refreshToken) throw new AppError('Refresh token is required', 401, 'UNAUTHORIZED');
  const payload = verifyRefreshToken(req.cookies.refreshToken);
  const user = await User.findById(payload.sub).select('+tokenVersion');
  if (!user || !user.isActive || user.tokenVersion !== payload.tokenVersion) throw new AppError('Refresh token is no longer valid', 401, 'UNAUTHORIZED');
  return sendSuccess(res, { data: { accessToken: issueTokens(res, user) } });
};

export const logout = (req, res) => { res.clearCookie('refreshToken', refreshCookieOptions); return sendSuccess(res, { message: 'Signed out successfully' }); };
export const me = async (req, res) => sendSuccess(res, { data: { user: publicUser(req.user) } });
