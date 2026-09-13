import { ApiError, sameId } from '../utils/api.js';
export function calculateSplit(totalMinor) {
  if (!Number.isSafeInteger(totalMinor) || totalMinor < 0 || totalMinor > 100000000000)
    throw new ApiError(400, 'Amount must be integer paise within the supported range');
  // Round the 10% fee half-up to the nearest paise; preserve every paise.
  const platformFeeMinor = Number((BigInt(totalMinor) + 5n) / 10n);
  return { platformFeeMinor, freelancerAmountMinor: totalMinor - platformFeeMinor };
}
export const transitions = {
  pending: { accepted: 'awaiting_payment', rejected: 'rejected', cancelled: 'cancelled' },
  awaiting_payment: { cancelled: 'cancelled' },
  active: { deliver: 'delivered', dispute: 'disputed' },
  milestone_submitted: { deliver: 'delivered', revision: 'revision_requested', approve_milestone: 'active', dispute: 'disputed' },
  delivered: { revision: 'revision_requested', approve_milestone: 'delivered', complete: 'completed', dispute: 'disputed' },
  revision_requested: { deliver: 'delivered', dispute: 'disputed' },
  disputed: { resolve: 'resolved' },
  resolved: { deliver: 'delivered', complete: 'completed', revision: 'revision_requested', dispute: 'disputed' },
};
export const nextStatus = (status, action) => transitions[status]?.[action] ?? null;
export function authorizeTransition(order, user, action) {
  const isClient = sameId(order.client, user), isFreelancer = sameId(order.freelancer, user);
  if (action === 'resolve') {
    if (user.role !== 'admin') throw new ApiError(403, 'Only an administrator may resolve a dispute');
  } else {
    if (!isClient && !isFreelancer) throw new ApiError(403, 'Not a contract participant');
    if (['accepted', 'rejected', 'deliver'].includes(action) && (!isFreelancer || user.currentRole() !== 'freelancer'))
      throw new ApiError(403, 'Only the freelancer may perform this action');
    if (['revision', 'complete', 'approve_milestone', 'cancelled'].includes(action) && (!isClient || user.currentRole() !== 'client'))
      throw new ApiError(403, 'Only the client may perform this action');
  }
  const target = nextStatus(order.status, action);
  if (!target) throw new ApiError(409, 'This action is unavailable in the current contract state');
  return target;
}
