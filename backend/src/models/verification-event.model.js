import mongoose from 'mongoose';

const verificationEventSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true },
  code: { type: String, required: true, uppercase: true, trim: true },
  outcome: { type: String, enum: ['verified', 'not_found', 'inactive'], required: true, index: true },
  ipHash: { type: String, maxlength: 128 },
  userAgent: { type: String, maxlength: 500 },
}, { timestamps: { createdAt: true, updatedAt: false }, versionKey: false });
verificationEventSchema.index({ product: 1, createdAt: -1 });
verificationEventSchema.index({ createdAt: -1 }, { expireAfterSeconds: 31536000 });
export default mongoose.model('VerificationEvent', verificationEventSchema);
