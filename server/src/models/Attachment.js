import mongoose from 'mongoose';
import { options, ref } from './shared.js';
const schema = new mongoose.Schema({
  owner: { ...ref('User'), required: true }, key: { type: String, required: true, unique: true },
  name: { type: String, required: true }, mimeType: { type: String, required: true },
  size: { type: Number, min: 1, max: 10485760, required: true }, checksum: String,
  conversation: ref('Conversation'), order: ref('Order'), job: ref('Job'),
  public: { type: Boolean, default: false },
  state: { type: String, enum: ['pending', 'attached', 'deleting'], default: 'pending' },
  scope: { type: String, enum: ['conversation', 'order', 'job', 'avatar', 'portfolio', 'service'] },
}, options);
schema.index({ owner: 1, createdAt: -1 });
export default mongoose.model('Attachment', schema);
