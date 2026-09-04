import User from '../models/user.model.js';
import { notFound, AppError } from '../utils/app-error.js';
import { paginationMeta, sendSuccess } from '../utils/api-response.js';
import { recordAuditLog } from '../services/audit.service.js';

export const createUser = async (req, res) => {
  const { password, ...attributes } = req.body;
  const user = await User.create({ ...attributes, passwordHash: await User.hashPassword(password) });
  await recordAuditLog({ req, action: 'user.created', targetType: 'user', targetId: user.id, details: { role: user.role } });
  return sendSuccess(res, { status: 201, message: 'User created', data: { user } });
};
export const listUsers = async (req, res) => {
  const { page, limit, role } = req.validated.query;
  const filter = role ? { role } : {};
  const [users, total] = await Promise.all([User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), User.countDocuments(filter)]);
  return sendSuccess(res, { data: { users }, meta: paginationMeta({ page, limit, total }) });
};
export const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id).select('+tokenVersion');
  if (!user) throw notFound('User');
  if (user.id === req.user.id && req.body.isActive === false) throw new AppError('You cannot deactivate your own account', 422, 'INVALID_OPERATION');
  if (req.body.isActive === false && user.isActive) user.tokenVersion += 1;
  Object.assign(user, req.body);
  await user.save();
  await recordAuditLog({ req, action: 'user.updated', targetType: 'user', targetId: user.id, details: { fields: Object.keys(req.body).join(',') } });
  return sendSuccess(res, { message: 'User updated', data: { user } });
};
export const deactivateUser = async (req, res) => {
  const user = await User.findById(req.params.id).select('+tokenVersion');
  if (!user) throw notFound('User');
  if (user.id === req.user.id) throw new AppError('You cannot deactivate your own account', 422, 'INVALID_OPERATION');
  user.isActive = false; user.tokenVersion += 1; await user.save();
  await recordAuditLog({ req, action: 'user.deactivated', targetType: 'user', targetId: user.id });
  return res.status(204).send();
};
