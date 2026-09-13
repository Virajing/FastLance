import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Session from '../models/Session.js';
import Category from '../models/Category.js';
import { env } from '../config/env.js';
import { ApiError, asyncHandler, ok } from '../utils/api.js';
import { accessToken, newRefreshToken, hashToken, refreshCookie } from '../utils/tokens.js';
const expiry = () => new Date(Date.now() + refreshCookie.maxAge);
async function issue(res, user) {
  const token = newRefreshToken();
  const session = await Session.create({ user: user._id, tokenHash: hashToken(token), expiresAt: expiry() });
  const excess = await Session.find({ user: user._id }).sort({ createdAt: -1, _id: -1 }).skip(10).select('_id');
  if (excess.length) await Session.deleteMany({ _id: { $in: excess.map(row => row._id) } });
  res.cookie(env.COOKIE_NAME, token, refreshCookie);
  return ok(res, { user: user.publicData(), accessToken: accessToken(user, session.id) }, 'Authenticated');
}
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.validated.body;
  const user = await User.create({
    name, email: email.toLowerCase(), password: await bcrypt.hash(password, 12),
    role: 'client', roles: ['client'], activeRole: 'client',
  });
  return issue(res, user);
});
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password +tokenVersion');
  if (!user || !await bcrypt.compare(password, user.password)) throw new ApiError(401, 'Invalid email or password');
  if (user.accountStatus !== 'active') throw new ApiError(403, 'Account suspended');
  return issue(res, user);
});
export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies[env.COOKIE_NAME];
  if (typeof token !== 'string' || token.length > 200) throw new ApiError(401, 'Sign in to restore your session.');
  const next = newRefreshToken();
  let user, rotated;
  await mongoose.connection.transaction(async session => {
    rotated = await Session.findOneAndUpdate({
      tokenHash: hashToken(token), expiresAt: { $gt: new Date() },
    }, { tokenHash: hashToken(next), expiresAt: expiry() }, { new: true, session });
    if (!rotated) throw new ApiError(401, 'Refresh token expired or already used');
    user = await User.findById(rotated.user).select('+tokenVersion').session(session);
    if (!user || user.accountStatus !== 'active') throw new ApiError(401, 'Account is unavailable');
  });
  res.cookie(env.COOKIE_NAME, next, refreshCookie);
  ok(res, { user: user.publicData(), accessToken: accessToken(user, rotated.id) }, 'Session renewed');
});
export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies[env.COOKIE_NAME];
  if (typeof token === 'string' && token.length <= 200) await Session.deleteOne({ tokenHash: hashToken(token) });
  res.clearCookie(env.COOKIE_NAME, { ...refreshCookie, maxAge: undefined });
  ok(res, {}, 'Logged out');
});
export const me = (req, res) => ok(res, { user: req.user.publicData() });
export const updateMe = asyncHandler(async (req, res) => {
  Object.assign(req.user, req.validated.body);
  await req.user.save();
  ok(res, { user: req.user.publicData() }, 'Profile updated');
});
export const switchRole = asyncHandler(async (req, res) => {
  const { activeRole } = req.validated.body;
  if (!req.user.ownedRoles().includes(activeRole)) throw new ApiError(403, 'Complete freelancer onboarding before using freelancer mode.');
  req.user.roles = req.user.ownedRoles(); req.user.activeRole = activeRole;
  await req.user.save();
  ok(res, { user: req.user.publicData() });
});
export const onboard = asyncHandler(async (req, res) => {
  const data = req.validated.body;
  const count = await Category.countDocuments({ slug: { $in: data.serviceCategories } });
  if (count !== new Set(data.serviceCategories).size) throw new ApiError(400, 'Choose valid service categories');
  Object.assign(req.user, data);
  req.user.roles = [...new Set([...req.user.ownedRoles(), 'client', 'freelancer'])]; req.user.activeRole = 'freelancer';
  await req.user.save();
  ok(res, { user: req.user.publicData() }, 'Freelancer profile created');
});
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.validated.body;
  const user = await User.findById(req.user.id).select('+password +tokenVersion');
  if (!await bcrypt.compare(currentPassword, user.password)) throw new ApiError(400, 'Current password is incorrect');
  const password = await bcrypt.hash(newPassword, 12);
  await mongoose.connection.transaction(async session => {
    const result = await User.updateOne({ _id: user._id, password: user.password }, {
      $set: { password }, $inc: { tokenVersion: 1 }, $unset: { refreshTokens: 1 },
    }, { session, strict: false });
    if (!result.modifiedCount) throw new ApiError(409, 'Password changed in another session. Sign in again.');
    await Session.deleteMany({ user: user._id }).session(session);
  });
  req.app.get('io')?.to('user:' + user.id).emit('auth:revoked');
  req.app.get('io')?.in('user:' + user.id).disconnectSockets(true);
  res.clearCookie(env.COOKIE_NAME, { ...refreshCookie, maxAge: undefined });
  ok(res, {}, 'Password updated. Sign in again on all devices.');
});
