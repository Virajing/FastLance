import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import { pipeline } from 'node:stream/promises';
import * as auth from '../controllers/auth.js';
import * as market from '../controllers/marketplace.js';
import * as jobs from '../controllers/jobs.js';
import * as orders from '../controllers/orders.js';
import * as messages from '../controllers/messages.js';
import * as notifications from '../controllers/notifications.js';
import * as dashboard from '../controllers/dashboard.js';
import * as admin from '../controllers/admin.js';
import { protect, allow, authenticate } from '../middleware/auth.js';
import { validate, id, text, money, safeUrl, tags, attachments, profileSchema, onboardingSchema, listQuery } from '../middleware/validate.js';
import { ApiError, asyncHandler, ok, objectId } from '../utils/api.js';
import { createPayment, verifyCheckout, requestRefund } from '../services/payment.js';
import { messageSchema } from '../sockets/index.js';
import { requireStorage, upload, canDownload, storage } from '../services/storage.js';
import Attachment from '../models/Attachment.js';
import { capabilities } from '../config/env.js';

const r = Router(), body = schema => validate(schema), client = allow('client'), freelancer = allow('freelancer'), administrator = allow('admin');
const authLimit = rateLimit({ windowMs: 15 * 60000, limit: 100, standardHeaders: 'draft-8', legacyHeaders: false,
  message: { success: false, message: 'Too many sign-in attempts. Try again in 15 minutes.' } });
r.use(validate(listQuery, 'query'));
for (const parameter of ['id', 'itemId']) r.param(parameter, (req, _res, next, value) => next(objectId(value) ? undefined : new ApiError(400, 'Invalid ' + parameter)));
const password = z.string().min(10).max(72).refine(value => Buffer.byteLength(value) <= 72, 'Password exceeds 72 UTF-8 bytes');
r.get('/capabilities', (_req, res) => ok(res, capabilities()));
r.post('/auth/register', authLimit, body(z.object({ name: text(2, 100), email: z.string().trim().email().max(254), password, role: z.enum(['client', 'freelancer']).optional() })), auth.register);
r.post('/auth/login', authLimit, body(z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(200) })), auth.login);
r.post('/auth/refresh', authLimit, auth.refresh);
r.post('/auth/logout', auth.logout);
r.get('/auth/me', protect, auth.me);
r.patch('/auth/me', protect, body(profileSchema), auth.updateMe);
r.patch('/auth/role', protect, body(z.object({ activeRole: z.enum(['client', 'freelancer']) })), auth.switchRole);
r.post('/auth/onboard', protect, body(onboardingSchema), auth.onboard);
r.patch('/auth/password', protect, body(z.object({ currentPassword: z.string().min(1).max(200), newPassword: password })), auth.changePassword);

r.get('/categories', market.categories);
r.get('/freelancers', market.freelancers);
r.get('/freelancers/:id', market.freelancer);
const portfolio = z.object({ title: text(2, 150), category: text(0, 80).optional(), image: safeUrl.optional(), url: safeUrl.optional(), description: text(), attachments });
r.post('/freelancers/me/portfolio', protect, freelancer, body(portfolio), market.portfolio);
r.patch('/freelancers/me/portfolio/:itemId', protect, freelancer, body(portfolio.partial()), market.portfolio);
r.delete('/freelancers/me/portfolio/:itemId', protect, freelancer, market.portfolio);
r.get('/services', market.services);
r.get('/workspace/services', protect, freelancer, (req, _res, next) => { req.validated.query.mine = 'true'; delete req.validated.query.freelancerId; next(); }, market.services);
r.get('/services/:id', market.service);
const pack = z.object({
  name: text(2, 100), priceMinor: money, deliveryDays: z.number().int().min(1).max(365),
  revisions: z.number().int().min(0).max(100).default(1), description: text(0, 2000).default(''), features: tags.default([]),
});
const service = z.object({
  title: text(3, 150), description: text(20, 10000), shortDesc: text(0, 300).optional(), category: text(1, 80),
  tags: tags.default([]), packages: z.object({ basic: pack.optional(), standard: pack.optional(), premium: pack.optional() }).default({}),
  images: z.array(safeUrl).max(10).default([]), coverImage: safeUrl.optional(), status: z.enum(['draft', 'published', 'unpublished']).default('draft'),
});
r.post('/services', protect, freelancer, body(service), market.createService);
r.patch('/services/:id', protect, freelancer, body(service.partial()), market.updateService);
r.delete('/services/:id', protect, freelancer, market.deleteService);
r.get('/reviews', market.reviews);
r.get('/favorites', protect, client, market.favorites);
r.post('/favorites', protect, client, body(z.object({ kind: z.enum(['service', 'freelancer']), target: id })), market.saveFavorite);
r.delete('/favorites/:id', protect, client, market.removeFavorite);

const job = z.object({
  title: text(3, 150), description: text(20, 10000), category: text(1, 80), skills: tags.default([]),
  budgetType: z.enum(['fixed', 'hourly']), budgetMinor: money,
  deadline: z.coerce.date().refine(value => value > new Date(), 'Deadline must be in the future'),
  attachments, status: z.enum(['draft', 'open', 'paused', 'closed']).default('draft'),
});
r.get('/jobs', protect, jobs.list);
r.get('/jobs/:id', protect, jobs.detail);
r.post('/jobs', protect, client, body(job), jobs.create);
r.patch('/jobs/:id', protect, client, body(job.partial()), jobs.update);
const proposal = z.object({ coverLetter: text(20, 5000), amountMinor: money, deliveryDays: z.number().int().min(1).max(365) });
r.post('/jobs/:id/proposals', protect, freelancer, body(proposal), jobs.propose);
r.get('/jobs/:id/proposals', protect, jobs.proposals);
r.get('/proposals', protect, jobs.proposals);
r.patch('/proposals/:id', protect, freelancer, body(proposal.partial().extend({ action: z.literal('withdraw').optional() })), jobs.updateProposal);
r.post('/proposals/:id/decision', protect, client, body(z.object({ action: z.enum(['accept', 'reject']) })), jobs.decideProposal);

r.get('/orders', protect, orders.orders);
r.get('/orders/:id', protect, orders.detail);
const order = z.object({
  creationKey: z.string().uuid(), serviceId: id.optional(), tier: z.enum(['basic', 'standard', 'premium']).optional(),
  freelancerId: id.optional(), title: text(3, 150).optional(), amountMinor: money.optional(),
  deliveryDays: z.number().int().min(1).max(365).optional(), requirements: text(0, 5000).default(''),
  milestones: z.array(z.object({ title: text(3, 150), amountMinor: money, deadline: z.coerce.date().optional() })).max(20).optional(),
}).refine(value => Boolean(value.serviceId) !== Boolean(value.freelancerId), 'Select a service or freelancer')
  .refine(value => value.serviceId || value.title && value.amountMinor && value.deliveryDays, 'Direct offers require title, amount and delivery days');
r.post('/orders', protect, client, body(order), orders.createOrder);
r.patch('/orders/:id/transition', protect, body(z.object({
  action: z.enum(['accepted', 'rejected', 'cancelled', 'deliver', 'revision', 'approve_milestone', 'complete', 'dispute', 'resolve']),
  notes: text().optional(), milestoneId: id.optional(), attachments,
})), orders.transition);
r.post('/orders/:id/review', protect, client, body(z.object({ rating: z.number().int().min(1).max(5), comment: text(0, 2000) })), orders.review);
r.post('/orders/:id/payment', protect, client, asyncHandler(async (req, res) => ok(res, await createPayment(req.user, req.params.id, req.io))));
r.post('/orders/:id/payment/verify', protect, client, body(z.object({
  razorpay_payment_id: z.string().regex(/^pay_[a-zA-Z0-9]+$/), razorpay_order_id: z.string().regex(/^order_[a-zA-Z0-9]+$/),
  razorpay_signature: z.string().regex(/^[a-fA-F0-9]{64}$/),
})), asyncHandler(async (req, res) => ok(res, await verifyCheckout(req.user, req.params.id, req.validated.body, req.io))));
r.post('/orders/:id/refund', protect, administrator, asyncHandler(async (req, res) => ok(res, await requestRefund(req.params.id, req.user, req.io))));

r.get('/conversations', protect, messages.list);
r.post('/conversations', protect, body(z.object({ participantId: id })), messages.create);
r.get('/conversations/:id', protect, messages.detail);
r.get('/conversations/:id/messages', protect, messages.history);
r.post('/conversations/:id/messages', protect, body(messageSchema), messages.send);
const receipt = z.object({ sequence: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER) });
r.post('/conversations/:id/read', protect, body(receipt), messages.read);
r.post('/conversations/:id/delivered', protect, body(receipt), messages.delivered);
r.get('/notifications', protect, notifications.list);
r.patch('/notifications/read-all', protect, notifications.readAll);
r.patch('/notifications/:id/read', protect, notifications.read);
r.get('/dashboard', protect, dashboard.overview);
r.get('/earnings', protect, freelancer, dashboard.earnings);
r.get('/payouts', protect, freelancer, dashboard.payouts);

const uploadFile = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10485760, files: 1, fields: 2 } });
const uploadLimit = rateLimit({ windowMs: 60 * 60000, limit: 30, keyGenerator: req => req.user.id,
  standardHeaders: 'draft-8', legacyHeaders: false,
  message: { success: false, code: 'UPLOAD_RATE_LIMIT', message: 'Upload limit reached. Try again in an hour.' } });
r.post('/attachments', protect, uploadLimit, (_req, _res, next) => { try { requireStorage(); next(); } catch (error) { next(error); } },
  uploadFile.single('file'), body(z.object({ scope: z.enum(['conversation', 'order', 'job', 'avatar', 'portfolio', 'service']), contextId: id.optional() })),
  asyncHandler(async (req, res) => {
    const attachment = await upload(req.user, req.file, req.validated.body.scope, req.validated.body.contextId);
    ok(res, { attachment: { id: attachment.id, name: attachment.name, size: attachment.size, mimeType: attachment.mimeType } }, 'File uploaded', 201);
  }));
r.get('/attachments/:id/download', asyncHandler(async (req, res) => {
  const attachment = await Attachment.findById(req.params.id);
  if (!attachment) throw new ApiError(404, 'Attachment not found');
  const user = req.headers.authorization?.startsWith('Bearer ') ? (await authenticate(req.headers.authorization.slice(7))).user : null;
  if (!await canDownload(attachment, user)) throw new ApiError(403, 'Attachment access denied');
  const result = await storage.get(attachment.key);
  res.setHeader('Content-Type', attachment.mimeType);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Content-Disposition', (attachment.public && attachment.mimeType.startsWith('image/') ? 'inline' : 'attachment') + `; filename*=UTF-8''` + encodeURIComponent(attachment.name));
  await pipeline(result.Body, res);
}));
r.get('/admin/users', protect, administrator, admin.users);
r.patch('/admin/users/:id/status', protect, administrator, body(z.object({ status: z.enum(['active', 'suspended']) })), admin.setStatus);
r.get('/admin/orders', protect, administrator, admin.orders);
r.get('/admin/disputes', protect, administrator, admin.disputes);
r.patch('/admin/services/:id/unpublish', protect, administrator, admin.unpublish);
const category = z.object({ name: text(2, 100), slug: z.string().regex(/^[a-z0-9-]{2,80}$/), description: text(0, 1000).optional() });
r.post('/admin/categories', protect, administrator, body(category), admin.category);
r.patch('/admin/categories/:id', protect, administrator, body(category), admin.category);
export default r;
