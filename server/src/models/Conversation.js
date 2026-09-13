import mongoose from 'mongoose';
import { ref, options } from './shared.js';
const schema = new mongoose.Schema({
  participants: { type: [ref('User')], validate: value => value.length === 2 },
  pairKey: { type: String, unique: true, sparse: true },
  lastSequence: { type: Number, default: 0 },
  lastMessage: { text: String, sender: ref('User'), createdAt: Date },
}, options);
schema.index({ participants: 1, updatedAt: -1 });
export default mongoose.model('Conversation', schema);
