import mongoose from 'mongoose';
import { options, ref } from './shared.js';
const schema = new mongoose.Schema({
  order: { ...ref('Order'), required: true }, milestoneId: { type: mongoose.Schema.Types.ObjectId, required: true },
  freelancer: { ...ref('User'), required: true }, notes: { type: String, required: true, maxlength: 5000 },
  attachments: [ref('Attachment')],
  status: { type: String, enum: ['submitted', 'revision_requested', 'approved'], default: 'submitted' },
  revisionNote: String,
}, options);
schema.index({ order: 1, createdAt: -1 });
export default mongoose.model('Delivery', schema);
