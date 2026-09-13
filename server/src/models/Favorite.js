import mongoose from 'mongoose';
import { options, ref } from './shared.js';
const schema = new mongoose.Schema({
  user: { ...ref('User'), required: true }, kind: { type: String, enum: ['service', 'freelancer'], required: true },
  target: { type: mongoose.Schema.Types.ObjectId, required: true },
}, options);
schema.index({ user: 1, kind: 1, target: 1 }, { unique: true });
export default mongoose.model('Favorite', schema);
