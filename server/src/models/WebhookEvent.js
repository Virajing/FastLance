import mongoose from 'mongoose';
import { options } from './shared.js';
export default mongoose.model('WebhookEvent', new mongoose.Schema({
  eventId: { type: String, required: true, unique: true }, bodyHash: { type: String, required: true },
  event: { type: String, required: true },
}, options));
