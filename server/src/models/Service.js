import mongoose from 'mongoose';
import { minor, options, ref } from './shared.js';
export const packageSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 }, priceMinor: { ...minor, required: true },
  deliveryDays: { type: Number, min: 1, max: 365, required: true },
  revisions: { type: Number, min: 0, max: 100, default: 1 }, description: String, features: [String],
}, { _id: false });
const schema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 150 }, slug: { type: String, unique: true },
  description: { type: String, maxlength: 10000 }, shortDesc: String,
  category: { type: String, required: true }, tags: [String],
  freelancer: { ...ref('User'), required: true },
  packages: { basic: packageSchema, standard: packageSchema, premium: packageSchema },
  images: [String], coverImage: String,
  status: { type: String, enum: ['draft', 'published', 'unpublished'], default: 'draft' },
  rating: { type: Number, min: 0, max: 5, default: 0 }, reviewsCount: { type: Number, min: 0, default: 0 },
  currency: { type: String, enum: ['INR'], default: 'INR' },
}, options);
schema.index({ status: 1, category: 1, createdAt: -1 });
schema.index({ freelancer: 1, status: 1 });
schema.index({ status: 1, 'packages.basic.priceMinor': 1 });
export default mongoose.model('Service', schema);
