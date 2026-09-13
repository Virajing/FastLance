import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { calculateSplit, nextStatus, authorizeTransition } from '../src/services/workflow.js';
import { escapeRegex } from '../src/utils/api.js';

test('10% commission preserves integer paise with half-up rounding', () => {
  assert.deepEqual(calculateSplit(12500), { platformFeeMinor: 1250, freelancerAmountMinor: 11250 });
  assert.deepEqual(calculateSplit(125), { platformFeeMinor: 13, freelancerAmountMinor: 112 });
  for (const amount of [0, 1, 5, 9, 999, 100000000000]) {
    const split = calculateSplit(amount);
    assert.equal(split.platformFeeMinor + split.freelancerAmountMinor, amount);
    assert.ok(Number.isInteger(split.freelancerAmountMinor));
  }
  for (const amount of [-1, 0.1, NaN, Infinity, Number.MAX_SAFE_INTEGER]) assert.throws(() => calculateSplit(amount));
});
test('workflow disallows payment shortcuts and unrelated cancellations', () => {
  assert.equal(nextStatus('pending', 'complete'), null);
  assert.equal(nextStatus('awaiting_payment', 'paid'), null);
  const user = { id: crypto.randomUUID(), currentRole: () => 'client' };
  assert.throws(() => authorizeTransition({ client: 'owner', freelancer: 'worker', status: 'pending' }, user, 'cancelled'), /participant/);
  assert.equal(nextStatus('delivered', 'complete'), 'completed');
});
test('search expressions match literals rather than evaluating user regex', () => {
  const value = '(a+)+$ [x] .*';
  const regex = new RegExp(escapeRegex(value));
  assert.equal(regex.test(value), true);
  assert.equal(regex.test('aaaaaaa'), false);
});
