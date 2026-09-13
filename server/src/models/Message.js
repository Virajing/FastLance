import mongoose from 'mongoose';
import { ref, options } from './shared.js';
const schema = new mongoose.Schema({
  conversation: { ...ref('Conversation'), required: true }, sender: { ...ref('User'), required: true },
  text: { type: String, maxlength: 5000, default: '' }, attachments: [ref('Attachment')],
  clientId: { type: String, required: true }, sequence: { type: Number, required: true },
  readBy: [ref('User')], deliveredTo: [ref('User')],
}, options);
schema.index({ conversation: 1, sender: 1, clientId: 1 }, { unique: true });
schema.index({ conversation: 1, sequence: -1 }, { unique: true });
schema.index({ conversation: 1, readBy: 1 });
export default mongoose.model('Message', schema);
