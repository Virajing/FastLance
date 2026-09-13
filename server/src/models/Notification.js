import mongoose from 'mongoose';
import { ref, options } from './shared.js';
const schema = new mongoose.Schema({
  user: { ...ref('User'), required: true },
  type: { type: String, enum: ['message', 'order', 'payment', 'review', 'proposal', 'dispute', 'system'], required: true },
  title: { type: String, required: true }, message: String, link: String,
  conversation: ref('Conversation'), read: { type: Boolean, default: false },
}, options);
schema.index({ user: 1, read: 1, createdAt: -1 });
export default mongoose.model('Notification', schema);
