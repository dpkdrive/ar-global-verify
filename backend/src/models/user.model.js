import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },

    // A plaintext password must never be stored in MongoDB.
    passwordHash: { type: String, required: true, select: false },

    role: { type: String, enum: ['admin', 'manufacturer'], default: 'manufacturer', index: true },
    companyName: { type: String, trim: true, maxlength: 150 },
    isActive: { type: Boolean, default: true, index: true },
    tokenVersion: { type: Number, default: 0, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, result) => {
        delete result.passwordHash;
        delete result.tokenVersion;
        return result;
      },
    },
  }
);

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.hashPassword = (password) => bcrypt.hash(password, 12);

export default mongoose.model('User', userSchema);
