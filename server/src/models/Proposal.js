import mongoose from 'mongoose';
import { ref, minor, options } from './shared.js';
const schema = new mongoose.Schema({
  job: { ...ref('Job'), required: true }, freelancer: { ...ref('User'), required: true },
  client: { ...ref('User'), required: true }, coverLetter: { type: String, required: true, maxlength: 5000 },
  amountMinor: { ...minor, required: true }, deliveryDays: { type: Number, min: 1, max: 365, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'withdrawn'], default: 'pending' },
  order: ref('Order'),
}, options);
schema.index({ job: 1, freelancer: 1 }, { unique: true });
schema.index({ client: 1, status: 1, createdAt: -1 });
schema.index({ freelancer: 1, status: 1, createdAt: -1 });
export default mongoose.model('Proposal', schema);
