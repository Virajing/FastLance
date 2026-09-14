import { test } from 'node:test';
import assert from 'node:assert/strict';
import { money, toMinor, rupees } from '../src/lib/format.js';
import { mergeMessages } from '../src/lib/messages.js';
test('INR amounts round trip without floating-point multiplication or truncation', () => {
 for (const value of [0, 1, 101, 12500, 99999999999]) assert.equal(toMinor(rupees(value)), value);
 assert.equal(toMinor('1.01'), 101); assert.match(money(12500), /125/);
 for (const value of ['1.001', '-1', 'Infinity', '1e3', 'abc']) assert.throws(() => toMinor(value));
 assert.equal(money(1.5), 'Price unavailable');
});
test('duplicate socket/REST events replace optimistic messages and use server sequence order', () => {
 const optimistic = { clientId: 'a', pending: true, text: 'A' };
 const saved = { clientId: 'a', id: '1', sequence: 2, text: 'A' };
 const first = { clientId: 'b', id: '2', sequence: 1, text: 'B' };
 assert.deepEqual(mergeMessages([optimistic], [saved, first], [saved], [optimistic]), [first, saved]);
 assert.equal(mergeMessages([saved], [{ ...saved, readBy: ['recipient'] }])[0].readBy[0], 'recipient');
});
