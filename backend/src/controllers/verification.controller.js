import crypto from 'node:crypto';
import Product from '../models/product.model.js';
import ProductCode from '../models/product-code.model.js';
import VerificationEvent from '../models/verification-event.model.js';
import { sendSuccess } from '../utils/api-response.js';
import { hashAuthenticationCode } from '../services/product-code.service.js';

const hashIp = (ip) => crypto.createHash('sha256').update(ip ?? '').digest('hex');
const publicProduct = (product) => ({ id: product.id, name: product.name, brand: product.brand, sku: product.sku, category: product.category, batchNumber: product.batchNumber, description: product.description, imageUrl: product.imageUrl });

// Always returns 200 so a scanner cannot distinguish a malformed code from a valid one by status alone.
export const verifyProduct = async (req, res) => {
  const code = req.body.code.toUpperCase();
  // The validator has already normalized blank optional contact fields.
  const { email, mobile } = req.body;

  const generatedCode = await ProductCode.findOne({ codeHash: hashAuthenticationCode(code) }).populate('product');
  const product = generatedCode?.product ?? await Product.findOne({ authenticationCode: code });
  let outcome = !product ? 'not_found' : product.status === 'active' ? 'verified' : 'inactive';

  if (generatedCode && product?.status === 'active') {
    if (generatedCode.status !== 'active') {
      outcome = 'inactive';
    } else {
      const redeemedCode = await ProductCode.findOneAndUpdate(
        { _id: generatedCode._id, status: 'active', verifiedAt: { $exists: false } },
        { $set: { verifiedAt: new Date() } },
        { new: true }
      );
      outcome = redeemedCode ? 'verified' : 'already_verified';
    }
  } else if (product?.status === 'active') {
    // Codes verified before firstVerifiedAt was introduced are treated as
    // redeemed too, so existing verification history keeps its meaning.
    const previousVerification = !product.firstVerifiedAt
      ? await VerificationEvent.findOne({ product: product._id, outcome: 'verified' })
        .sort({ createdAt: 1 })
        .select('createdAt')
        .lean()
      : null;

    if (previousVerification) {
      await Product.updateOne(
        { _id: product._id, firstVerifiedAt: { $exists: false } },
        { $set: { firstVerifiedAt: previousVerification.createdAt } }
      );
      outcome = 'already_verified';
    } else {
    // Atomically claim the code. Two simultaneous scans cannot both receive
    // a successful verification response.
      const claimedProduct = await Product.findOneAndUpdate(
        { _id: product._id, firstVerifiedAt: { $exists: false } },
        { $set: { firstVerifiedAt: new Date() } },
        { new: true }
      );
      outcome = claimedProduct ? 'verified' : 'already_verified';
    }
  }

  await VerificationEvent.create({
    product: product?._id,
    verificationCode: generatedCode?._id,
    code,
    outcome,
    email,
    mobile,
    ipHash: hashIp(req.ip),
    userAgent: req.get('user-agent'),
  });
  if (outcome === 'already_verified') {
    return sendSuccess(res, {
      data: {
        verified: false,
        status: 'already_verified',
        message: 'This authentication code has already been verified. Please contact support if you did not verify this product first.',
      },
    });
  }
  if (outcome !== 'verified') return sendSuccess(res, { data: { verified: false, status: outcome === 'inactive' ? product.status : 'not_found', message: 'This product could not be verified.' } });
  return sendSuccess(res, { data: { verified: true, status: 'authentic', product: publicProduct(product) } });
};
