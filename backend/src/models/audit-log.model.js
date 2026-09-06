import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    action: {
      type: String,
      required: true,
      enum: [
        'product.created',
        'product.codes_generated',
        'product.updated',
        'product.deleted',
        'user.created',
        'user.updated',
        'user.deactivated',
        'auth.password_changed',
      ],
      index: true,
    },
    targetType: { type: String, required: true, enum: ['product', 'user'], index: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    details: { type: Map, of: String, default: {} },
    ipHash: { type: String, maxlength: 128 },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

auditLogSchema.index({ actor: 1, createdAt: -1 });
auditLogSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 }, { expireAfterSeconds: 63072000 }); // two years

export default mongoose.model('AuditLog', auditLogSchema);
