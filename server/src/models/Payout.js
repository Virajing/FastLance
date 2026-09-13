import mongoose from 'mongoose';
import { ref, minor, options } from './shared.js';
const schema = new mongoose.Schema({
  freelancer: { ...ref('User'), required: true }, amountMinor: { ...minor, required: true },
  ledgerEntries: [ref('Ledger')], providerId: { type: String, unique: true, sparse: true },
  status: { type: String, enum: ['pending', 'processing', 'paid', 'failed', 'reversed'], required: true },
}, options);
schema.index({ freelancer: 1, createdAt: -1 });
export default mongoose.model('Payout', schema);
