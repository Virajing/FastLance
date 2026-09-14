import mongoose from 'mongoose';
import { minor, options, ref } from './shared.js';
const portfolio = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 150 }, category: String, image: String, url: String,
  description: { type: String, maxlength: 5000 }, attachments: [ref('Attachment')],
}, { timestamps: true });
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['client', 'freelancer', 'admin'], default: 'client' },
  roles: { type: [{ type: String, enum: ['client', 'freelancer'] }], default: undefined },
  activeRole: { type: String, enum: ['client', 'freelancer'] },
  tokenVersion: { type: Number, default: 0, select: false },
  avatar: String, bio: String, headline: String, company: String, website: String, location: String,
  professionalTitle: String, skills: [String], serviceCategories: [String],
  portfolio: [portfolio], experience: { type: Number, min: 0, max: 80 },
  availability: { type: String, enum: ['available', 'part_time', 'unavailable'], default: 'unavailable' },
  hourlyRateMinor: minor,
  accountStatus: { type: String, enum: ['active', 'suspended'], default: 'active' },
  verificationStatus: { type: String, enum: ['unverified', 'verified'], default: 'unverified' },
  averageRating: { type: Number, min: 0, max: 5, default: 0 }, reviewCount: { type: Number, min: 0, default: 0 },
  completedProjects: { type: Number, min: 0, default: 0 }, lastSeen: Date,
}, options);
userSchema.index({ roles: 1, accountStatus: 1, averageRating: -1 });
userSchema.index({ serviceCategories: 1, hourlyRateMinor: 1 });
userSchema.methods.ownedRoles = function () {
  return this.roles?.length ? [...this.roles] : (this.role === 'freelancer' ? ['freelancer'] : ['client']);
};
userSchema.methods.currentRole = function () {
  return this.ownedRoles().includes(this.activeRole) ? this.activeRole : this.ownedRoles()[0];
};
userSchema.methods.publicData = function () {
  const fields = ['name', 'email', 'avatar', 'bio', 'headline', 'company', 'website', 'location',
    'professionalTitle', 'skills', 'serviceCategories', 'portfolio', 'experience', 'availability',
    'hourlyRateMinor', 'accountStatus', 'verificationStatus', 'averageRating', 'reviewCount', 'completedProjects', 'createdAt', 'updatedAt'];
  return { ...Object.fromEntries(fields.map(key => [key, this[key]])),
    id: this.id, roles: this.ownedRoles(), activeRole: this.currentRole(), isAdmin: this.role === 'admin' };
};
export default mongoose.model('User', userSchema);
