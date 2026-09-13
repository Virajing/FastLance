import mongoose from 'mongoose';
export const ref = model => ({ type: mongoose.Schema.Types.ObjectId, ref: model });
export const minor = { type: Number, min: 0, max: 100000000000, validate: Number.isSafeInteger };
export const options = {
  timestamps: true, optimisticConcurrency: true,
  toJSON: { transform(_doc, value) { value.id = String(value._id); delete value.__v; return value; } },
};
