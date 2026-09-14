import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { connectDb } from '../src/config/db.js';
import User from '../src/models/User.js';
import Category from '../src/models/Category.js';
import Service from '../src/models/Service.js';
if (process.env.NODE_ENV !== 'development') throw new Error('Development seeding requires NODE_ENV=development');
const seedPassword = process.env.SEED_PASSWORD;
if (!seedPassword || seedPassword.length < 10 || Buffer.byteLength(seedPassword) > 72) throw new Error('Set SEED_PASSWORD to a development-only password of 10-72 bytes.');
try {
 await connectDb();
 const categories = [['Video editing','video'],['Photo editing','photo-editing'],['VFX','vfx'],['Graphic design','graphic-design'],['3D modelling','3d-modelling'],['Web development and design','development'],['Mobile application development and design','mobile-development']];
 for (const [name, slug] of categories) await Category.updateOne({ slug }, { $setOnInsert: { name, slug } }, { upsert: true });
 const password = await bcrypt.hash(seedPassword, 12);
 const freelancer = await User.findOneAndUpdate({ email: 'freelancer@example.test' }, { $setOnInsert: {
  name: 'Development Freelancer', email: 'freelancer@example.test', password, role: 'client', roles: ['client','freelancer'], activeRole: 'freelancer',
  professionalTitle: 'Web developer', bio: 'Development seed account for testing marketplace collaboration.', skills: ['React','Node.js'], serviceCategories: ['development'], hourlyRateMinor: 150000, availability: 'available',
 } }, { upsert: true, new: true, runValidators: true });
 await User.updateOne({ email: 'client@example.test' }, { $setOnInsert: { name: 'Development Client', email: 'client@example.test', password, role: 'client', roles: ['client'], activeRole: 'client' } }, { upsert: true, runValidators: true });
 await Service.updateOne({ slug: 'development-react-service' }, { $setOnInsert: {
  title: 'Development React website', slug: 'development-react-service', description: 'A development fixture for testing a React website service.', category: 'development', freelancer: freelancer.id, status: 'published',
  packages: { basic: { name: 'Website', priceMinor: 12500, deliveryDays: 4, revisions: 2, features: ['React UI','Documentation'] } },
 } }, { upsert: true, runValidators: true });
 console.log('Development records ready: client@example.test and freelancer@example.test. Existing records and passwords are unchanged.');
} finally { await mongoose.disconnect(); }
