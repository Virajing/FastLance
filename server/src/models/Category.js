import mongoose from 'mongoose';
import { options } from './shared.js';
export default mongoose.model('Category', new mongoose.Schema({ name: { type: String, required: true }, slug: { type: String, required: true, unique: true }, icon: String, description: String }, options));
