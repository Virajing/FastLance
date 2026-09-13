import Job from '../models/Job.js';
import Proposal from '../models/Proposal.js';
import Order from '../models/Order.js';
import { ApiError, asyncHandler, ok, page, pagination, pageMeta, escapeRegex, sameId } from '../utils/api.js';
import { ensureCategory } from './marketplace.js';
import { verifyAttachments } from '../services/storage.js';
import { transaction, emitAfter } from '../services/transaction.js';
import { notify } from '../services/notifications.js';
import { calculateSplit } from '../services/workflow.js';

export const list = asyncHandler(async (req, res) => {
  const query = req.validated.query, paging = pagination(query);
  const filter = req.user.currentRole() === 'client' ? { client: req.user._id } : { status: 'open', deadline: { $gt: new Date() }, client: { $ne: req.user._id } };
  if (query.q) filter.$or = ['title', 'description', 'skills'].map(key => ({ [key]: { $regex: escapeRegex(query.q), $options: 'i' } }));
  if (query.category) filter.category = query.category;
  if (query.maxPrice !== undefined) filter.budgetMinor = { $lte: query.maxPrice };
  const [rows, total] = await Promise.all([
    Job.find(filter).populate('client', 'name avatar').sort({ createdAt: -1, _id: -1 }).skip(paging.skip).limit(paging.limit),
    Job.countDocuments(filter),
  ]);
  page(res, rows, pageMeta(paging, total));
});
export const detail = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('client', 'name avatar');
  if (!job || job.status !== 'open' && !sameId(job.client, req.user)) throw new ApiError(404, 'Job not found');
  ok(res, { job });
});
export const create = asyncHandler(async (req, res) => {
  const data = req.validated.body;
  await ensureCategory(data.category);
  if (data.attachments.length) throw new ApiError(400, 'Save the job before uploading attachments');
  const job = await Job.create({ ...data, client: req.user._id });
  ok(res, { job }, 'Job created', 201);
});
export const update = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, client: req.user._id });
  if (!job) throw new ApiError(404, 'Job not found or not owned by you');
  if (job.status === 'closed') throw new ApiError(409, 'Closed jobs cannot be edited');
  const data = req.validated.body;
  if (data.category) await ensureCategory(data.category);
  await verifyAttachments(data.attachments, req.user, 'job', job.id);
  Object.assign(job, data);
  if (job.status === 'open' && job.deadline <= new Date()) throw new ApiError(400, 'Choose a future deadline before publishing');
  await job.save();
  ok(res, { job });
});
export const proposals = asyncHandler(async (req, res) => {
  const paging = pagination(req.validated.query);
  const filter = req.user.currentRole() === 'client' ? { client: req.user._id } : { freelancer: req.user._id };
  if (req.params.id) filter.job = req.params.id;
  const [rows, total] = await Promise.all([
    Proposal.find(filter).populate('job', 'title status').populate('freelancer', 'name avatar').sort('-createdAt').skip(paging.skip).limit(paging.limit),
    Proposal.countDocuments(filter),
  ]);
  page(res, rows, pageMeta(paging, total));
});
export const propose = asyncHandler(async (req, res) => {
  const proposal = await transaction(async context => {
    // Touch the job so closing/accepting and submitting serialize.
    const job = await Job.findOneAndUpdate({ _id: req.params.id, status: 'open', deadline: { $gt: new Date() } },
      { $inc: { __v: 1 } }, { new: true, session: context.session });
    if (!job) throw new ApiError(409, 'Job is no longer accepting proposals');
    if (sameId(job.client, req.user)) throw new ApiError(403, 'You cannot propose on your own job');
    const [proposal] = await Proposal.create([{ ...req.validated.body, job: job._id, client: job.client, freelancer: req.user._id }], { session: context.session });
    await notify(job.client, 'proposal', 'New proposal', req.user.name + ' sent a proposal', '/dashboard/proposals', context);
    return proposal;
  }, req.io);
  ok(res, { proposal }, 'Proposal submitted', 201);
});
export const updateProposal = asyncHandler(async (req, res) => {
  const proposal = await Proposal.findOne({ _id: req.params.id, freelancer: req.user._id });
  if (!proposal) throw new ApiError(404, 'Proposal not found or not owned by you');
  if (proposal.status !== 'pending') throw new ApiError(409, 'Only pending proposals can be edited or withdrawn');
  if (req.validated.body.action === 'withdraw') proposal.status = 'withdrawn';
  else Object.assign(proposal, req.validated.body);
  await proposal.save();
  ok(res, { proposal });
});
export const decideProposal = asyncHandler(async (req, res) => {
  const result = await transaction(async context => {
    const proposal = await Proposal.findOne({ _id: req.params.id, client: req.user._id }).session(context.session);
    if (!proposal) throw new ApiError(404, 'Proposal not found or not owned by you');
    if (proposal.status !== 'pending') throw new ApiError(409, 'Proposal was already decided');
    const accepted = req.validated.body.action === 'accept';
    let order;
    if (accepted) {
      const job = await Job.findOneAndUpdate({ _id: proposal.job, client: req.user._id, status: { $in: ['open', 'paused'] } },
        { status: 'closed' }, { new: true, session: context.session });
      if (!job) throw new ApiError(409, 'Job is no longer available');
      const split = calculateSplit(proposal.amountMinor);
      [order] = await Order.create([{
        title: job.title, job: job._id, proposal: proposal._id, client: req.user._id,
        freelancer: proposal.freelancer, totalAmountMinor: proposal.amountMinor, ...split,
        requirements: job.description, milestones: [{ title: job.title, amountMinor: proposal.amountMinor }],
        packageSnapshot: { name: job.title, priceMinor: proposal.amountMinor, deliveryDays: proposal.deliveryDays },
      }], { session: context.session });
      proposal.order = order._id;
      await Proposal.updateMany({ job: job._id, _id: { $ne: proposal._id }, status: 'pending' }, { status: 'rejected' }, { session: context.session });
    }
    proposal.status = accepted ? 'accepted' : 'rejected';
    await proposal.save({ session: context.session });
    await notify(proposal.freelancer, 'proposal', 'Proposal ' + proposal.status,
      accepted ? 'Review and accept the new contract before payment.' : 'The client declined your proposal.',
      accepted ? '/dashboard/projects/' + order.id : '/dashboard/proposals', context);
    emitAfter(context, 'user:' + req.user.id, 'dashboard:updated', {});
    return { proposal, order };
  }, req.io);
  ok(res, result);
});
