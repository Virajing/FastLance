import crypto from 'node:crypto';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import Ledger from '../models/Ledger.js';
import Dispute from '../models/Dispute.js';
import WebhookEvent from '../models/WebhookEvent.js';
import { env, capabilities } from '../config/env.js';
import { ApiError, sameId } from '../utils/api.js';
import { transaction, emitAfter } from './transaction.js';
import { notify } from './notifications.js';
import { calculateSplit } from './workflow.js';

export function verifySignature(payload, signature, secret) {
  if (!secret || typeof signature !== 'string' || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest();
  return crypto.timingSafeEqual(expected, Buffer.from(signature, 'hex'));
}
export function requirePayments() {
  if (!capabilities().payments) throw new ApiError(503, capabilities().paymentMessage, 'PAYMENTS_NOT_CONFIGURED');
}
async function providerRequest(path, options = {}) {
  requirePayments();
  let response;
  try {
    response = await fetch('https://api.razorpay.com/v1' + path, {
      ...options, signal: AbortSignal.timeout(15000),
      headers: { Authorization: 'Basic ' + Buffer.from(env.RAZORPAY_KEY_ID + ':' + env.RAZORPAY_KEY_SECRET).toString('base64'), 'Content-Type': 'application/json' },
    });
  } catch { throw new ApiError(502, 'Could not reach Razorpay. Payment confirmation may still arrive by webhook.'); }
  if (!response.ok) throw new ApiError(502, 'Razorpay could not process this request. Check provider configuration and payment status.');
  return response.json();
}
export const razorpay = {
  createOrder: data => providerRequest('/orders', { method: 'POST', body: JSON.stringify(data) }),
  fetchPayment: id => providerRequest('/payments/' + encodeURIComponent(id)),
  refund: (id, data) => providerRequest('/payments/' + encodeURIComponent(id) + '/refund', { method: 'POST', body: JSON.stringify(data) }),
};
export async function createPayment(user, orderId, io) {
  requirePayments();
  const order = await Order.findOne({ _id: orderId, client: user._id });
  if (!order) throw new ApiError(404, 'Contract not found');
  if (order.status !== 'awaiting_payment' || !Number.isSafeInteger(order.totalAmountMinor)) throw new ApiError(409, 'Contract is not awaiting payment or requires price migration');
  let payment = await Payment.findOne({ order: order._id });
  if (!payment) {
    let createdByRequest = false;
    try {
      payment = await transaction(async context => {
        const locked = await Order.findOneAndUpdate({ _id: order.id, status: 'awaiting_payment', paymentStatus: { $in: ['unpaid', 'failed'] } },
          { $inc: { __v: 1 } }, { new: true, session: context.session });
        if (!locked) throw new ApiError(409, 'Contract changed. Refresh before paying.');
        const [created] = await Payment.create([{ order: order._id, amountMinor: order.totalAmountMinor }], { session: context.session });
        return created;
      }, io);
      createdByRequest = true;
    } catch (error) {
      if (error.code !== 11000) throw error;
      payment = await Payment.findOne({ order: order._id });
    }
    if (createdByRequest && payment && !payment.providerOrderId) {
      // Provider calls stay outside retried database transactions.
      const providerOrder = await razorpay.createOrder({
        amount: payment.amountMinor, currency: 'INR', receipt: payment.id, partial_payment: false,
        notes: { fastlance_order_id: order.id },
      });
      if (providerOrder.amount !== payment.amountMinor || providerOrder.currency !== 'INR' || !providerOrder.id)
        throw new ApiError(502, 'Razorpay returned an inconsistent order. Contact support.');
      payment.providerOrderId = providerOrder.id; payment.status = 'created'; await payment.save();
    }
  }
  if (!payment?.providerOrderId) throw new ApiError(409, 'Payment order creation is being reconciled. Contact support before retrying.');
  if (!['created', 'failed'].includes(payment.status)) throw new ApiError(409, 'Payment was already processed');
  return { keyId: env.RAZORPAY_KEY_ID, providerOrderId: payment.providerOrderId, amountMinor: payment.amountMinor, currency: 'INR', orderId: order.id };
}
async function capture(entity, context) {
  const payment = await Payment.findOne({ providerOrderId: entity.order_id }).session(context.session);
  if (!payment) throw new ApiError(404, 'Provider order is not associated with a contract');
  if (entity.status !== 'captured' || entity.captured !== true || entity.currency !== 'INR' || entity.amount !== payment.amountMinor)
    throw new ApiError(400, 'Payment has not been captured for the exact contract amount');
  if (payment.status === 'paid' || ['refunded', 'partially_refunded', 'refund_pending'].includes(payment.status)) {
    if (payment.providerPaymentId !== entity.id) throw new ApiError(409, 'A different payment was already recorded');
    return { duplicate: true, payment };
  }
  const order = await Order.findById(payment.order).session(context.session);
  if (!order || order.status !== 'awaiting_payment') throw new ApiError(409, 'Contract is no longer payable; reconcile this payment with support');
  payment.status = 'paid'; payment.providerPaymentId = entity.id; payment.paidAt = new Date();
  await payment.save({ session: context.session });
  order.paymentStatus = 'paid'; order.status = 'active'; order.paidAt = payment.paidAt;
  order.deadline = new Date(payment.paidAt.getTime() + (order.packageSnapshot?.deliveryDays || 7) * 86400000);
  await order.save({ session: context.session });
  await Ledger.create([{
    order: order._id, freelancer: order.freelancer, grossMinor: order.totalAmountMinor,
    platformFeeMinor: order.platformFeeMinor, payableMinor: order.freelancerAmountMinor, status: 'pending',
  }], { session: context.session });
  for (const user of [order.client, order.freelancer]) await notify(user, 'payment', 'Payment verified',
    'The contract is active.', '/dashboard/projects/' + order.id, context);
  return { duplicate: false, payment };
}
export async function verifyCheckout(user, orderId, data, io) {
  requirePayments();
  const order = await Order.findById(orderId);
  if (!order || !sameId(order.client, user)) throw new ApiError(403, 'Only the contract client may verify payment');
  const payment = await Payment.findOne({ order: order._id });
  if (!payment?.providerOrderId || data.razorpay_order_id !== payment.providerOrderId
    || !verifySignature(payment.providerOrderId + '|' + data.razorpay_payment_id, data.razorpay_signature, env.RAZORPAY_KEY_SECRET))
    throw new ApiError(400, 'Invalid payment signature');
  const entity = await razorpay.fetchPayment(data.razorpay_payment_id);
  return transaction(context => capture(entity, context), io);
}
async function reconcileRefund(entity, context) {
  const payment = await Payment.findOne({ providerPaymentId: entity.id }).session(context.session);
  if (!payment) throw new ApiError(404, 'Payment not found');
  const refunded = entity.amount_refunded;
  if (!Number.isSafeInteger(refunded) || refunded < payment.refundedMinor || refunded > payment.amountMinor
    || entity.amount !== payment.amountMinor || entity.currency !== 'INR')
    throw new ApiError(400, 'Invalid refund amounts');
  if (refunded === payment.refundedMinor) return { duplicate: true };
  const full = refunded === payment.amountMinor;
  payment.refundedMinor = refunded; payment.status = full ? 'refunded' : 'partially_refunded';
  await payment.save({ session: context.session });
  const order = await Order.findById(payment.order).session(context.session);
  const ledger = await Ledger.findOne({ order: order._id }).session(context.session);
  if (ledger?.status === 'paid') throw new ApiError(409, 'Refund requires reconciliation with an existing payout');
  if (ledger) {
    const split = calculateSplit(payment.amountMinor - refunded);
    ledger.refundedMinor = refunded; ledger.platformFeeMinor = split.platformFeeMinor; ledger.payableMinor = split.freelancerAmountMinor;
    ledger.status = full ? 'refunded' : 'held'; await ledger.save({ session: context.session });
  }
  order.paymentStatus = payment.status; order.status = full ? 'refunded' : 'disputed'; await order.save({ session: context.session });
  await Dispute.updateOne({ order: order._id }, { status: full ? 'refunded' : 'open' }, { session: context.session });
  for (const user of [order.client, order.freelancer]) await notify(user, 'payment', full ? 'Payment refunded' : 'Partial refund recorded',
    'Review the contract payment record.', '/dashboard/projects/' + order.id, context);
  return { payment };
}
export async function processWebhook(raw, headers, io) {
  requirePayments();
  if (!Buffer.isBuffer(raw) || !verifySignature(raw, headers['x-razorpay-signature'], env.RAZORPAY_WEBHOOK_SECRET))
    throw new ApiError(400, 'Invalid webhook signature');
  const eventId = headers['x-razorpay-event-id'];
  if (typeof eventId !== 'string' || !/^[\w-]{1,200}$/.test(eventId)) throw new ApiError(400, 'Missing or invalid webhook event ID');
  const bodyHash = crypto.createHash('sha256').update(raw).digest('hex');
  const existing = await WebhookEvent.findOne({ eventId });
  if (existing) {
    if (existing.bodyHash !== bodyHash) throw new ApiError(409, 'Webhook event ID was reused with a different body');
    return { duplicate: true };
  }
  let body;
  try { body = JSON.parse(raw.toString('utf8')); }
  catch { throw new ApiError(400, 'Invalid webhook payload'); }
  if (typeof body.event !== 'string') throw new ApiError(400, 'Missing webhook event');
  const paymentId = body.payload?.payment?.entity?.id || body.payload?.refund?.entity?.payment_id;
  const relevant = ['payment.captured', 'order.paid', 'payment.failed', 'refund.processed'].includes(body.event);
  if (relevant && (typeof paymentId !== 'string' || !/^pay_[a-zA-Z0-9]+$/.test(paymentId))) throw new ApiError(400, 'Missing provider payment ID');
  const entity = relevant ? await razorpay.fetchPayment(paymentId) : null;
  try {
    return await transaction(async context => {
      await WebhookEvent.create([{ eventId, bodyHash, event: body.event }], { session: context.session });
      if (['payment.captured', 'order.paid'].includes(body.event)) return capture(entity, context);
      if (body.event === 'refund.processed') return reconcileRefund(entity, context);
      if (body.event === 'payment.failed' && entity.status === 'failed') {
        const payment = await Payment.findOneAndUpdate({ providerOrderId: entity.order_id, status: { $in: ['created', 'failed'] } },
          { status: 'failed' }, { new: true, session: context.session });
        if (payment) {
          const order = await Order.findOneAndUpdate({ _id: payment.order, status: 'awaiting_payment' }, { paymentStatus: 'failed' }, { new: true, session: context.session });
          if (order) await notify(order.client, 'payment', 'Payment failed', 'You can retry checkout.', '/dashboard/projects/' + order.id, context);
        }
      }
      return { received: true };
    }, io);
  } catch (error) {
    if (error.code === 11000 && await WebhookEvent.exists({ eventId, bodyHash })) return { duplicate: true };
    throw error;
  }
}
export async function requestRefund(orderId, user, io) {
  requirePayments();
  if (user.role !== 'admin') throw new ApiError(403, 'Only an administrator may initiate a refund');
  const payment = await transaction(async context => {
    const order = await Order.findOne({ _id: orderId, status: 'disputed', paymentStatus: 'paid' }).session(context.session);
    if (!order) throw new ApiError(409, 'A paid disputed contract is required');
    const payment = await Payment.findOneAndUpdate({ order: order._id, status: 'paid' },
      { status: 'refund_pending' }, { new: true, session: context.session });
    if (!payment) throw new ApiError(409, 'Refund was already initiated');
    order.paymentStatus = 'refund_pending'; await order.save({ session: context.session });
    await Dispute.updateOne({ order: order._id }, { status: 'refund_pending', resolvedBy: user._id }, { session: context.session });
    emitAfter(context, ['user:' + order.client, 'user:' + order.freelancer], 'dashboard:updated', {});
    return payment;
  }, io);
  await razorpay.refund(payment.providerPaymentId, { amount: payment.amountMinor, receipt: payment.id, notes: { order: orderId } });
  return { status: 'refund_pending', message: 'Refund requested. Awaiting provider confirmation.' };
}
