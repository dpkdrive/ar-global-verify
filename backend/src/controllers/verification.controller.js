import crypto from 'node:crypto';
import Product from '../models/product.model.js';
import VerificationEvent from '../models/verification-event.model.js';
import { sendSuccess } from '../utils/api-response.js';

const hashIp = (ip) => crypto.createHash('sha256').update(ip ?? '').digest('hex');
const publicProduct = (product) => ({ id: product.id, name: product.name, brand: product.brand, sku: product.sku, category: product.category, batchNumber: product.batchNumber, description: product.description });

// Always returns 200 so a scanner cannot distinguish a malformed code from a valid one by status alone.
export const verifyProduct = async (req, res) => {
  const code = req.body.code.toUpperCase();
  const product = await Product.findOne({ authenticationCode: code });
  const outcome = !product ? 'not_found' : product.status === 'active' ? 'verified' : 'inactive';
  await VerificationEvent.create({ product: product?._id, code, outcome, ipHash: hashIp(req.ip), userAgent: req.get('user-agent') });
  if (outcome !== 'verified') return sendSuccess(res, { data: { verified: false, status: outcome === 'inactive' ? product.status : 'not_found', message: 'This product could not be verified.' } });
  return sendSuccess(res, { data: { verified: true, status: 'authentic', product: publicProduct(product) } });
};
