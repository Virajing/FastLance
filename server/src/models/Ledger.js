import mongoose from 'mongoose';
import { ref, minor, options } from './shared.js';
const schema = new mongoose.Schema({
  order: { ...ref('Order'), required: true, unique: true }, freelancer: { ...ref('User'), required: true },
  grossMinor: { ...minor, required: true }, platformFeeMinor: { ...minor, required: true },
  payableMinor: { ...minor, required: true }, refundedMinor: { ...minor, default: 0 },
  status: { type: String, enum: ['pending', 'available', 'held', 'paid', 'refunded'], default: 'pending' },
  availableAt: Date,
}, options);
schema.index({ freelancer: 1, status: 1 });
export default mongoose.model('Ledger', schema);
