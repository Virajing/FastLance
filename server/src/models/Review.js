import mongoose from 'mongoose';
import { ref, options } from './shared.js';
const schema = new mongoose.Schema({
  verified: { type: Boolean, default: false },
  order: { ...ref('Order'), required: true, unique: true }, client: { ...ref('User'), required: true },
  freelancer: { ...ref('User'), required: true }, service: ref('Service'),
  rating: { type: Number, min: 1, max: 5, required: true, validate: Number.isInteger },
  comment: { type: String, maxlength: 2000 }, response: { type: String, maxlength: 2000 },
}, options);
schema.index({ freelancer: 1, createdAt: -1 });
schema.index({ service: 1, createdAt: -1 });
export default mongoose.model('Review', schema);
