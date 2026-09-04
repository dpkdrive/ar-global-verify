import Product from '../models/product.model.js';
import VerificationEvent from '../models/verification-event.model.js';
import { AppError, notFound } from '../utils/app-error.js';
import { paginationMeta, sendSuccess } from '../utils/api-response.js';
import { recordAuditLog } from '../services/audit.service.js';

const accessibleFilter = (user) => user.role === 'admin' ? {} : { owner: user.id };
const ensureAccess = async (id, user) => {
  const product = await Product.findOne({ _id: id, ...accessibleFilter(user) });
  if (!product) throw notFound('Product');
  return product;
};
export const createProduct = async (req, res) => {
  const owner = req.user.role === 'admin' && req.body.owner ? req.body.owner : req.user.id;
  let product;
  try {
    product = await Product.create({ ...req.body, owner });
  } catch (err) {
    if (err?.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern ?? {})[0];
      const message = duplicateField === 'authenticationCode'
        ? 'Authentication code already exists. Use a different code.'
        : duplicateField === 'sku'
          ? 'SKU already exists for this owner. Product names may be repeated when authentication codes differ.'
          : 'A product with this unique value already exists.';
      throw new AppError(message, 409, 'DUPLICATE_RESOURCE', [{ field: duplicateField, message }]);
    }
    throw err;
  }
  await recordAuditLog({ req, action: 'product.created', targetType: 'product', targetId: product.id, details: { sku: product.sku } });
  return sendSuccess(res, { status: 201, message: 'Product created', data: { product } });
};
export const listProducts = async (req, res) => {
  const { page, limit, status, search } = req.validated.query;
  const filter = { ...accessibleFilter(req.user), ...(status && { status }), ...(search && { $text: { $search: search } }) };
  const [products, total] = await Promise.all([Product.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('owner', 'name email companyName'), Product.countDocuments(filter)]);
  return sendSuccess(res, { data: { products }, meta: paginationMeta({ page, limit, total }) });
};
export const getProduct = async (req, res) => sendSuccess(res, { data: { product: await ensureAccess(req.params.id, req.user) } });
export const updateProduct = async (req, res) => {
  const product = await ensureAccess(req.params.id, req.user);
  if (req.user.role !== 'admin') delete req.body.owner;
  Object.assign(product, req.body);
  try { await product.save(); } catch (err) { if (err.code === 11000) throw new AppError('Product SKU already exists for this owner', 409, 'DUPLICATE_RESOURCE'); throw err; }
  await recordAuditLog({ req, action: 'product.updated', targetType: 'product', targetId: product.id, details: { fields: Object.keys(req.body).join(',') } });
  return sendSuccess(res, { message: 'Product updated', data: { product } });
};
export const deleteProduct = async (req, res) => { const product = await ensureAccess(req.params.id, req.user); await product.deleteOne(); await recordAuditLog({ req, action: 'product.deleted', targetType: 'product', targetId: product.id, details: { sku: product.sku } }); return res.status(204).send(); };

/**
 * Lists verification attempts for one product. Raw IP addresses are never
 * returned; events retain only the privacy-safe hash stored at scan time.
 */
export const getVerificationHistory = async (req, res) => {
  const product = await ensureAccess(req.params.id, req.user);
  const { page, limit } = req.validated.query;
  const filter = { product: product.id };

  const [events, total] = await Promise.all([
    VerificationEvent.find(filter)
      .select('outcome createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    VerificationEvent.countDocuments(filter),
  ]);

  return sendSuccess(res, {
    data: { productId: product.id, events },
    meta: paginationMeta({ page, limit, total }),
  });
};
