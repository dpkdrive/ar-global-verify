import AuditLog from '../models/audit-log.model.js';
import { paginationMeta, sendSuccess } from '../utils/api-response.js';

export const listAuditLogs = async (req, res) => {
  const { page, limit, action, targetId } = req.validated.query;
  const filter = {
    ...(req.user.role === 'admin' ? {} : { actor: req.user.id }),
    ...(action && { action }),
    ...(targetId && { targetId }),
  };

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .select('-ipHash')
      .populate('actor', 'name email role companyName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    AuditLog.countDocuments(filter),
  ]);

  return sendSuccess(res, { data: { logs }, meta: paginationMeta({ page, limit, total }) });
};
