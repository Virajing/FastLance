import crypto from 'node:crypto';
import Order from '../models/Order.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import Payment from '../models/Payment.js';
import Delivery from '../models/Delivery.js';
import Dispute from '../models/Dispute.js';
import Ledger from '../models/Ledger.js';
import { ApiError, asyncHandler, ok, page, pagination, pageMeta, sameId, escapeRegex } from '../utils/api.js';
import { calculateSplit, authorizeTransition } from '../services/workflow.js';
import { transaction, emitAfter } from '../services/transaction.js';
import { notify } from '../services/notifications.js';
import { verifyAttachments } from '../services/storage.js';

export const participant = (order, user) => [order.client, order.freelancer].some(id => sameId(id, user));
const populate = query => query.populate('client', 'name avatar').populate('freelancer', 'name avatar');
export const orders = asyncHandler(async (req, res) => {
  const query = req.validated.query, paging = pagination(query);
  const filter = req.user.currentRole() === 'client' ? { client: req.user._id } : { freelancer: req.user._id };
  if (query.status) filter.status = query.status;
  if (query.q) filter.title = { $regex: escapeRegex(query.q), $options: 'i' };
  const [rows, total] = await Promise.all([populate(Order.find(filter)).sort('-createdAt').skip(paging.skip).limit(paging.limit), Order.countDocuments(filter)]);
  page(res, rows, pageMeta(paging, total));
});
export const detail = asyncHandler(async (req, res) => {
  const order = await populate(Order.findById(req.params.id));
  if (!order || !participant(order, req.user) && req.user.role !== 'admin') throw new ApiError(404, 'Contract not found');
  const [deliveries, review, dispute, payment] = await Promise.all([
    Delivery.find({ order: order._id }).sort('-createdAt').limit(100), Review.findOne({ order: order._id }),
    Dispute.findOne({ order: order._id }), Payment.findOne({ order: order._id }).select('amountMinor status refundedMinor paidAt'),
  ]);
  ok(res, { order, deliveries, review, dispute, payment });
});
export const createOrder = asyncHandler(async (req, res) => {
  const data = req.validated.body;
  const existing = await Order.findOne({ client: req.user._id, creationKey: data.clientId });
  if (existing) return ok(res, { order: existing });
  const order = await transaction(async context => {
    let freelancer, packageSnapshot, title, service, totalAmountMinor;
    if (data.serviceId) {
      service = await Service.findOne({ _id: data.serviceId, status: 'published' }).session(context.session);
      if (!service) throw new ApiError(404, 'Service not found');
      packageSnapshot = service.packages?.[data.tier || 'basic']?.toObject();
      if (!Number.isSafeInteger(packageSnapshot?.priceMinor)) throw new ApiError(409, 'Package is unavailable or requires price migration');
      freelancer = await User.findById(service.freelancer).session(context.session);
      totalAmountMinor = packageSnapshot.priceMinor; title = service.title;
    } else {
      freelancer = await User.findById(data.freelancerId).session(context.session);
      title = data.title; totalAmountMinor = data.amountMinor;
      packageSnapshot = { name: title, priceMinor: totalAmountMinor, deliveryDays: data.deliveryDays };
    }
    if (!freelancer || freelancer.accountStatus !== 'active' || !freelancer.ownedRoles().includes('freelancer')) throw new ApiError(404, 'Freelancer unavailable');
    if (sameId(freelancer, req.user)) throw new ApiError(403, 'You cannot order your own work');
    const milestones = data.milestones?.length ? data.milestones : [{ title, amountMinor: totalAmountMinor }];
    if (milestones.reduce((sum, row) => sum + row.amountMinor, 0) !== totalAmountMinor) throw new ApiError(400, 'Milestone amounts must equal the contract total');
    const [created] = await Order.create([{
      title, client: req.user._id, freelancer: freelancer._id, service: service?._id, packageSnapshot,
      requirements: data.requirements, creationKey: data.clientId || crypto.randomUUID(),
      totalAmountMinor, ...calculateSplit(totalAmountMinor), milestones,
    }], { session: context.session });
    await notify(freelancer._id, 'order', 'New contract offer', req.user.name + ' sent a contract offer.',
      '/dashboard/projects/' + created.id, context);
    emitAfter(context, 'user:' + req.user.id, 'dashboard:updated', {});
    return created;
  }, req.io);
  ok(res, { order }, 'Contract created', 201);
});
export const transition = asyncHandler(async (req, res) => {
  const data = req.validated.body;
  const order = await transaction(async context => {
    const order = await Order.findById(req.params.id).session(context.session);
    if (!order) throw new ApiError(404, 'Contract not found');
    const target = authorizeTransition(order, req.user, data.action);
    if (!Number.isSafeInteger(order.totalAmountMinor)) throw new ApiError(409, 'Legacy contract requires financial reconciliation');
    if (data.action === 'cancelled' && await Payment.exists({ order: order._id }).session(context.session))
      throw new ApiError(409, 'Payment was initiated. Contact support to reconcile it before cancellation.');
    if (['deliver', 'revision', 'approve_milestone', 'complete', 'dispute'].includes(data.action) && order.paymentStatus !== 'paid')
      throw new ApiError(409, 'A verified payment is required');
    order.status = target;
    const milestone = data.milestoneId ? order.milestones.id(data.milestoneId) : order.milestones.length === 1 ? order.milestones[0] : null;
    if (data.action === 'deliver') {
      if (!milestone || !['pending', 'revision_requested'].includes(milestone.status)) throw new ApiError(409, 'Select a pending or revision-requested milestone');
      if (!data.notes?.trim()) throw new ApiError(400, 'Delivery notes are required');
      await verifyAttachments(data.attachments, req.user, 'order', order.id, context.session);
      const [delivery] = await Delivery.create([{
        order: order._id, milestoneId: milestone._id, freelancer: req.user._id, notes: data.notes, attachments: data.attachments,
      }], { session: context.session });
      milestone.status = 'submitted'; milestone.latestDelivery = delivery._id;
      order.status = order.milestones.every(row => ['submitted', 'approved'].includes(row.status)) ? 'delivered' : 'milestone_submitted';
      order.deliveredAt = new Date();
    }
    if (['revision', 'approve_milestone'].includes(data.action)) {
      if (!milestone || milestone.status !== 'submitted') throw new ApiError(409, 'Select a submitted milestone');
      if (data.action === 'revision' && !data.notes?.trim()) throw new ApiError(400, 'Explain the requested revision');
      milestone.status = data.action === 'revision' ? 'revision_requested' : 'approved';
      if (milestone.status === 'approved') milestone.approvedAt = new Date();
      await Delivery.updateOne({ _id: milestone.latestDelivery }, {
        status: milestone.status, revisionNote: data.action === 'revision' ? data.notes : undefined,
      }, { session: context.session });
      order.status = order.milestones.some(row => row.status === 'revision_requested') ? 'revision_requested'
        : order.milestones.every(row => ['approved', 'submitted'].includes(row.status)) ? 'delivered'
          : order.milestones.some(row => row.status === 'submitted') ? 'milestone_submitted' : 'active';
    }
    if (data.action === 'complete') {
      if (!order.milestones.length || !order.milestones.every(row => ['submitted', 'approved'].includes(row.status))) throw new ApiError(409, 'Every milestone must be submitted before completion');
      order.completedAt = new Date();
      for (const row of order.milestones) { row.status = 'approved'; row.approvedAt ??= new Date(); }
      await Delivery.updateMany({ order: order._id, status: 'submitted' }, { status: 'approved' }, { session: context.session });
      const ledger = await Ledger.findOneAndUpdate({ order: order._id, status: { $in: ['pending', 'held'] } },
        { status: 'available', availableAt: new Date() }, { new: true, session: context.session });
      if (!ledger) throw new ApiError(409, 'Payable entry is unavailable; contact support');
      await User.updateOne({ _id: order.freelancer }, { $inc: { completedProjects: 1 } }, { session: context.session });
    }
    if (data.action === 'dispute') {
      if (!data.notes?.trim()) throw new ApiError(400, 'A dispute reason is required');
      await Dispute.findOneAndUpdate({ order: order._id }, {
        openedBy: req.user._id, reason: data.notes, status: 'open',
      }, { upsert: true, new: true, session: context.session });
      await Ledger.updateOne({ order: order._id, status: 'pending' }, { status: 'held' }, { session: context.session });
    }
    if (data.action === 'resolve') {
      if (!data.notes?.trim()) throw new ApiError(400, 'A resolution explanation is required');
      await Dispute.updateOne({ order: order._id, status: 'open' }, {
        status: 'resolved', resolution: data.notes, resolvedBy: req.user._id, resolvedAt: new Date(),
      }, { session: context.session });
      await Ledger.updateOne({ order: order._id, status: 'held' }, { status: 'pending' }, { session: context.session });
    }
    await order.save({ session: context.session });
    for (const user of [order.client, order.freelancer]) await notify(user, data.action === 'dispute' ? 'dispute' : 'order',
      'Contract ' + order.status.replaceAll('_', ' '), order.title, '/dashboard/projects/' + order.id, context);
    return order;
  }, req.io);
  ok(res, { order }, 'Contract updated');
});
export const review = asyncHandler(async (req, res) => {
  const review = await transaction(async context => {
    const order = await Order.findOneAndUpdate({ _id: req.params.id, client: req.user._id, status: 'completed', paymentStatus: 'paid', totalAmountMinor: { $exists: true } },
      { $inc: { __v: 1 } }, { new: true, session: context.session });
    if (!order) throw new ApiError(403, 'Only the client of a paid completed contract may review');
    const [review] = await Review.create([{ ...req.validated.body, order: order._id, client: req.user._id, freelancer: order.freelancer, service: order.service, verified: true }], { session: context.session });
    const [summary] = await Review.aggregate([{ $match: { freelancer: order.freelancer, verified: true } }, { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }]).session(context.session);
    await User.updateOne({ _id: order.freelancer }, { averageRating: summary.average, reviewCount: summary.count }, { session: context.session });
    if (order.service) {
      const [serviceSummary] = await Review.aggregate([{ $match: { service: order.service, verified: true } }, { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }]).session(context.session);
      await Service.updateOne({ _id: order.service }, { rating: serviceSummary.average, reviewsCount: serviceSummary.count }, { session: context.session });
    }
    await notify(order.freelancer, 'review', 'New verified review', req.user.name + ' reviewed your work.', '/dashboard/reviews', context);
    return review;
  }, req.io);
  ok(res, { review }, 'Review submitted', 201);
});
