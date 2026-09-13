import mongoose from 'mongoose';
import { ref, options } from './shared.js';
const schema = new mongoose.Schema({
  user: { ...ref('User'), required: true, index: true },
  tokenHash: { type: String, required: true, select: false, unique: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
}, options);
export default mongoose.model('Session', schema);
