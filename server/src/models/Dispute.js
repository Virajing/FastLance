import mongoose from 'mongoose';
import { ref, options } from './shared.js';
const schema = new mongoose.Schema({
  order: { ...ref('Order'), required: true, unique: true }, openedBy: { ...ref('User'), required: true },
  reason: { type: String, required: true, maxlength: 5000 }, previousStatus: String,
  status: { type: String, enum: ['open', 'resolved', 'refund_pending', 'refunded'], default: 'open' },
  resolution: String, resolvedBy: ref('User'), resolvedAt: Date,
}, options);
schema.index({ status: 1, createdAt: -1 });
export default mongoose.model('Dispute', schema);
