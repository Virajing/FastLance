import User from '../models/User.js';
import Session from '../models/Session.js';
import Service from '../models/Service.js';
import Order from '../models/Order.js';
import Dispute from '../models/Dispute.js';
import Category from '../models/Category.js';
import { asyncHandler, ok, page, pagination, pageMeta, ApiError, escapeRegex } from '../utils/api.js';
import { transaction } from '../services/transaction.js';
export const users = asyncHandler(async (req, res) => {
  const query = req.validated.query, paging = pagination(query);
  const filter = query.q ? { name: { $regex: escapeRegex(query.q), $options: 'i' } } : {};
  const [rows, total] = await Promise.all([User.find(filter).sort('-createdAt').skip(paging.skip).limit(paging.limit), User.countDocuments(filter)]);
  page(res, rows.map(user => user.publicData()), pageMeta(paging, total));
});
export const setStatus = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) throw new ApiError(400, 'You cannot suspend your own account');
  const user = await transaction(async context => {
    const user = await User.findByIdAndUpdate(req.params.id, { accountStatus: req.validated.body.status, $inc: { tokenVersion: 1 } }, { new: true, session: context.session });
    if (!user) throw new ApiError(404, 'User not found');
    await Session.deleteMany({ user: user._id }).session(context.session);
    return user;
  }, req.io);
  req.io?.to('user:' + user.id).emit('auth:revoked');
  req.io?.in('user:' + user.id).disconnectSockets(true);
  ok(res, { user: user.publicData() });
});
export const unpublish = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, { status: 'unpublished' }, { new: true });
  if (!service) throw new ApiError(404, 'Service not found');
  ok(res, { service });
});
export const orders = asyncHandler(async (req, res) => {
  const paging = pagination(req.validated.query);
  const [rows, total] = await Promise.all([Order.find().sort('-createdAt').skip(paging.skip).limit(paging.limit), Order.countDocuments()]);
  page(res, rows, pageMeta(paging, total));
});
export const disputes = asyncHandler(async (req, res) => {
  const paging = pagination(req.validated.query);
  const [rows, total] = await Promise.all([Dispute.find().populate('order', 'title').sort('-createdAt').skip(paging.skip).limit(paging.limit), Dispute.countDocuments()]);
  page(res, rows, pageMeta(paging, total));
});
export const category = asyncHandler(async (req, res) => {
  const category = req.params.id ? await Category.findByIdAndUpdate(req.params.id, req.validated.body, { new: true, runValidators: true }) : await Category.create(req.validated.body);
  if (!category) throw new ApiError(404, 'Category not found');
  ok(res, { category });
});
