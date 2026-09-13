import mongoose from 'mongoose';
import { ref, minor, options } from './shared.js';
const schema = new mongoose.Schema({
  client: { ...ref('User'), required: true }, title: { type: String, required: true, maxlength: 150 },
  description: { type: String, required: true, maxlength: 10000 }, category: { type: String, required: true },
  skills: [String], budgetType: { type: String, enum: ['fixed', 'hourly'], required: true },
  budgetMinor: { ...minor, required: true }, deadline: { type: Date, required: true },
  attachments: [ref('Attachment')],
  status: { type: String, enum: ['draft', 'open', 'paused', 'closed'], default: 'draft' },
}, options);
schema.index({ status: 1, category: 1, createdAt: -1 });
schema.index({ client: 1, createdAt: -1 });
export default mongoose.model('Job', schema);
