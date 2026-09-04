import crypto from 'node:crypto';
import AuditLog from '../models/audit-log.model.js';

const hashIp = (ip) => crypto.createHash('sha256').update(ip ?? '').digest('hex');

/** Records non-sensitive operational activity. Never include passwords or tokens in details. */
export const recordAuditLog = ({ req, action, targetType, targetId, details = {} }) =>
  AuditLog.create({
    actor: req.user?.id,
    action,
    targetType,
    targetId,
    details,
    ipHash: hashIp(req.ip),
  });
