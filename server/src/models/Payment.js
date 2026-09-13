import mongoose from 'mongoose';
import { ref, minor, options } from './shared.js';
const schema = new mongoose.Schema({
  order: { ...ref('Order'), required: true, unique: true },
  provider: { type: String, enum: ['razorpay'], default: 'razorpay' },
  providerOrderId: { type: String, unique: true, sparse: true },
  providerPaymentId: { type: String, unique: true, sparse: true },
  amountMinor: { ...minor, required: true }, currency: { type: String, enum: ['INR'], default: 'INR' },
  status: { type: String, enum: ['creating', 'created', 'paid', 'failed', 'refund_pending', 'partially_refunded', 'refunded'], default: 'creating' },
  refundedMinor: { ...minor, default: 0 }, paidAt: Date,
}, options);
export default mongoose.model('Payment', schema);
