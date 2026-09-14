import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Job from '../models/Job.js';
import Proposal from '../models/Proposal.js';
import Ledger from '../models/Ledger.js';
import Payout from '../models/Payout.js';
import Review from '../models/Review.js';
import Service from '../models/Service.js';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import Notification from '../models/Notification.js';
import { capabilities } from '../config/env.js';
import { asyncHandler, ok, page, pagination, pageMeta } from '../utils/api.js';

export const overview = asyncHandler(async (req, res) => {
  const freelancer = req.user.currentRole() === 'freelancer', userId = new mongoose.Types.ObjectId(req.user.id);
  const filter = freelancer ? { freelancer: userId } : { client: userId };
  const [orders, money, jobs, proposals, services, rating, conversations, notifications] = await Promise.all([
    Order.aggregate([{ $match: { ...filter, totalAmountMinor: { $exists: true } } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    freelancer
      ? Ledger.aggregate([{ $match: { freelancer: userId } }, { $group: { _id: '$status', amountMinor: { $sum: '$payableMinor' } } }])
      : Order.aggregate([{ $match: { client: userId, totalAmountMinor: { $exists: true }, paymentStatus: { $in: ['paid', 'refund_pending'] } } }, { $group: { _id: null, amountMinor: { $sum: '$totalAmountMinor' } } }]),
    Job.countDocuments({ client: userId, status: 'open' }), Proposal.countDocuments({ ...filter, status: 'pending' }),
    freelancer ? Service.countDocuments({ freelancer: userId }) : 0,
    freelancer ? Review.aggregate([{ $match: { freelancer: userId, verified: true } }, { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }]) : [],
    Conversation.find({ participants: userId }).distinct('_id'),
    Notification.countDocuments({ user: userId, read: false }),
  ]);
  const counts = Object.fromEntries(orders.map(row => [row._id, row.count]));
  const balances = Object.fromEntries(money.map(row => [row._id, row.amountMinor]));
  const unreadMessages = await Message.countDocuments({ conversation: { $in: conversations }, sender: { $ne: userId }, readBy: { $ne: userId } });
  const [recentOrders, monthly] = await Promise.all([
    Order.find(filter).populate('client', 'name').populate('freelancer', 'name').sort('-updatedAt').limit(5),
    freelancer
      ? Ledger.aggregate([{ $match: { freelancer: userId, status: { $in: ['available', 'paid'] } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$availableAt' } }, amountMinor: { $sum: '$payableMinor' } } }, { $sort: { _id: -1 } }, { $limit: 12 }])
      : Order.aggregate([{ $match: { client: userId, paymentStatus: 'paid', paidAt: { $exists: true } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$paidAt' } }, amountMinor: { $sum: '$totalAmountMinor' } } }, { $sort: { _id: -1 } }, { $limit: 12 }]),
  ]);
  const shared = { activeContracts: ['active', 'milestone_submitted', 'delivered', 'revision_requested', 'resolved'].reduce((sum, key) => sum + (counts[key] || 0), 0),
    completedContracts: counts.completed || 0, pendingOffers: counts.pending || 0, unreadMessages, unreadNotifications: notifications,
    recentOrders, monthly: monthly.reverse(), proposals, capabilities: capabilities() };
  ok(res, freelancer ? { ...shared, role: 'freelancer', services, rating: rating[0]?.average ?? null, reviewCount: rating[0]?.count ?? 0,
    earningsMinor: (balances.available || 0) + (balances.paid || 0), pendingMinor: balances.pending || 0,
    availableMinor: balances.available || 0, heldMinor: balances.held || 0, paidOutMinor: balances.paid || 0 }
    : { ...shared, role: 'client', jobs, totalSpentMinor: money[0]?.amountMinor || 0 });
});
export const earnings = asyncHandler(async (req, res) => {
  const paging = pagination(req.validated.query), filter = { freelancer: req.user._id };
  const [rows, total] = await Promise.all([Ledger.find(filter).populate('order', 'title').sort('-createdAt').skip(paging.skip).limit(paging.limit), Ledger.countDocuments(filter)]);
  page(res, rows, pageMeta(paging, total));
});
export const payouts = asyncHandler(async (req, res) => {
  const paging = pagination(req.validated.query), filter = { freelancer: req.user._id };
  const [rows, total] = await Promise.all([Payout.find(filter).sort('-createdAt').skip(paging.skip).limit(paging.limit), Payout.countDocuments(filter)]);
  page(res, rows, pageMeta(paging, total));
});
