import Product from '../models/product.model.js';
import VerificationEvent from '../models/verification-event.model.js';
import env from '../config/env.js';
import { paginationMeta, sendSuccess } from '../utils/api-response.js';

const productMatch = (user) => (user.role === 'admin' ? {} : { owner: user._id });

const eventOwnerMatch = (user) => (
  user.role === 'admin' ? {} : { 'product.owner': user._id }
);

export const getDashboardSummary = async (req, res) => {
  const [productStatuses, verificationData] = await Promise.all([
    Product.aggregate([
      { $match: productMatch(req.user) },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    VerificationEvent.aggregate([
      { $match: { product: { $ne: null } } },
      { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $match: eventOwnerMatch(req.user) },
      {
        $facet: {
          totals: [{ $group: { _id: '$outcome', count: { $sum: 1 } } }],
          recent: [
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            { $project: { outcome: 1, createdAt: 1, email: 1, mobile: 1, code: 1, product: { id: '$product._id', name: '$product.name', sku: '$product.sku', brand: '$product.brand' } } },
          ],
        },
      },
    ]),
  ]);

  const products = { total: 0, active: 0, disabled: 0, recalled: 0 };
  productStatuses.forEach(({ _id, count }) => { products.total += count; products[_id] = count; });

  const outcomes = { total: 0, verified: 0, already_verified: 0, inactive: 0, not_found: 0 };
  const eventTotals = verificationData[0]?.totals ?? [];
  eventTotals.forEach(({ _id, count }) => { outcomes.total += count; outcomes[_id] = count; });

  return sendSuccess(res, {
    data: {
      products,
      verifications: outcomes,
      suspiciousThreshold: env.SUSPICIOUS_VERIFICATION_THRESHOLD,
      recentVerifications: verificationData[0]?.recent ?? [],
    },
  });
};

export const listSuspiciousProducts = async (req, res) => {
  const { page, limit } = req.validated.query;
  const skip = (page - 1) * limit;
  const ownerMatch = req.user.role === 'admin' ? {} : { 'product.owner': req.user._id };

  const [result] = await VerificationEvent.aggregate([
    { $match: { outcome: { $in: ['verified', 'already_verified'] }, product: { $ne: null } } },
    { $group: { _id: '$product', verificationCount: { $sum: 1 }, lastVerifiedAt: { $max: '$createdAt' } } },
    { $match: { verificationCount: { $gte: env.SUSPICIOUS_VERIFICATION_THRESHOLD } } },
    { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
    { $unwind: '$product' },
    { $match: ownerMatch },
    { $sort: { verificationCount: -1, lastVerifiedAt: -1 } },
    {
      $facet: {
        items: [
          { $skip: skip },
          { $limit: limit },
          { $project: { _id: 0, product: { id: '$product._id', name: '$product.name', sku: '$product.sku', brand: '$product.brand', status: '$product.status' }, verificationCount: 1, lastVerifiedAt: 1 } },
        ],
        total: [{ $count: 'value' }],
      },
    },
  ]);

  const total = result?.total[0]?.value ?? 0;
  return sendSuccess(res, {
    data: { threshold: env.SUSPICIOUS_VERIFICATION_THRESHOLD, products: result?.items ?? [] },
    meta: paginationMeta({ page, limit, total }),
  });
};
