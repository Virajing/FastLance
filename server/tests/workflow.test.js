import test from 'node:test';import assert from 'node:assert/strict';import {calculateSplit,nextStatus} from '../src/services/workflow.js';
test('commission calculation is server-owned and exact',()=>assert.deepEqual(calculateSplit(125),{platformFee:12.5,freelancerAmount:112.5}));
test('order workflow prevents invalid state changes',()=>{assert.equal(nextStatus('pending','complete'),null);assert.equal(nextStatus('pending','accepted'),'awaiting_payment');assert.equal(nextStatus('delivered','complete'),'completed');});
