import mongoose from 'mongoose';
import { ref, minor, options } from './shared.js';
import { packageSchema } from './Service.js';
const milestone = new mongoose.Schema({
  title: { type: String, required: true }, amountMinor: { ...minor, required: true }, deadline: Date,
  status: { type: String, enum: ['pending', 'submitted', 'revision_requested', 'approved'], default: 'pending' },
  latestDelivery: ref('Delivery'), approvedAt: Date,
}, { timestamps: true });
const schema = new mongoose.Schema({
  title: { type: String, required: true }, service: ref('Service'), job: ref('Job'), proposal: ref('Proposal'),
  client: { ...ref('User'), required: true }, freelancer: { ...ref('User'), required: true },
  packageSnapshot: packageSchema, requirements: String, attachments: [ref('Attachment')],
  milestones: [milestone], deadline: Date,
  status: { type: String, enum: ['pending', 'rejected', 'awaiting_payment', 'active', 'milestone_submitted',
    'delivered', 'revision_requested', 'completed', 'cancelled', 'disputed', 'resolved', 'refunded'], default: 'pending' },
  totalAmountMinor: { ...minor, required: true }, platformFeeMinor: { ...minor, required: true },
  freelancerAmountMinor: { ...minor, required: true }, currency: { type: String, enum: ['INR'], default: 'INR' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refund_pending', 'refunded', 'partially_refunded', 'failed'], default: 'unpaid' },
  paidAt: Date, deliveredAt: Date, completedAt: Date,
  creationKey: String,
}, options);
schema.index({ client: 1, createdAt: -1 });
schema.index({ freelancer: 1, status: 1, createdAt: -1 });
schema.index({ client: 1, creationKey: 1 }, { unique: true, partialFilterExpression: { creationKey: { $type: 'string' } } });
export default mongoose.model('Order', schema);
