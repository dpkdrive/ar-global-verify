import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User from '../src/models/user.model.js';
import env from '../src/config/env.js';

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME ?? 'Platform Administrator';
if (!email || !password) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required to seed an administrator.');
if (password.length < 12) throw new Error('ADMIN_PASSWORD must contain at least 12 characters.');
try {
  await mongoose.connect(env.MONGODB_URI);
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) { console.log(`Administrator already exists: ${existing.email}`); }
  else { await User.create({ name, email, passwordHash: await User.hashPassword(password), role: 'admin' }); console.log(`Administrator created: ${email.toLowerCase()}`); }
} finally { await mongoose.disconnect(); }
