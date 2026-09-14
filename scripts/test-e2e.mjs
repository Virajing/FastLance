import { fixture } from '../server/tests/helpers/fixture.js';
import { createServer } from '../client/node_modules/vite/dist/node/index.js';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const app = await fixture({ port: 5001, clientUrl: 'http://localhost:5188' });
let vite;
try {
 await app.models.Category.create({ name: 'Web development and design', slug: 'web-development' });
 const client = await app.register('Delivery Client'), worker = await app.register('Delivery Freelancer');
 const call = async (actor, method, path, data) => {
  const response = await app.api(method, path, { token: actor.token, data });
  assert.ok(response.status < 300, response.message); return response.data;
 };
 await call(worker, 'POST', '/auth/onboard', { professionalTitle: 'Delivery developer', bio: 'I provide tested application deliveries with documentation.', skills: ['React'], serviceCategories: ['web-development'], hourlyRateMinor: 12550, availability: 'available' });
 const { order } = await call(client, 'POST', '/orders', { creationKey: crypto.randomUUID(), freelancerId: worker.user.id, title: 'Browser delivery contract', amountMinor: 12550, deliveryDays: 3 });
 await call(worker, 'PATCH', '/orders/' + order.id + '/transition', { action: 'accepted' });
 // Test-only provider double. The browser must still display unconfigured real checkout accurately.
 const { env } = await import('../server/src/config/env.js');
 const { razorpay } = await import('../server/src/services/payment.js');
 const original = { createOrder: razorpay.createOrder, fetchPayment: razorpay.fetchPayment };
 const config = { RAZORPAY_KEY_ID: env.RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET: env.RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET: env.RAZORPAY_WEBHOOK_SECRET };
 Object.assign(env, { RAZORPAY_KEY_ID: 'rzp_test_browser_fixture', RAZORPAY_KEY_SECRET: crypto.randomBytes(32).toString('hex'), RAZORPAY_WEBHOOK_SECRET: crypto.randomBytes(32).toString('hex') });
 try {
  razorpay.createOrder = async data => ({ ...data, id: 'order_BrowserDelivery' });
  razorpay.fetchPayment = async () => ({ id: 'pay_BrowserDelivery', order_id: 'order_BrowserDelivery', status: 'captured', captured: true, amount: 12550, currency: 'INR' });
  await call(client, 'POST', '/orders/' + order.id + '/payment');
  await call(client, 'POST', '/orders/' + order.id + '/payment/verify', { razorpay_order_id: 'order_BrowserDelivery', razorpay_payment_id: 'pay_BrowserDelivery', razorpay_signature: crypto.createHmac('sha256', env.RAZORPAY_KEY_SECRET).update('order_BrowserDelivery|pay_BrowserDelivery').digest('hex') });
 } finally { Object.assign(razorpay, original); Object.assign(env, config); }
 process.env.VITE_API_URL = 'http://localhost:5001/api/v1';
 vite = await createServer({ root: 'client', server: { host: 'localhost', port: 5188, strictPort: true } });
 await vite.listen();
 const child = spawn(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', ...process.argv.slice(2)], { stdio: 'inherit', env: { ...process.env,
  TEST_DELIVERY_CLIENT: client.email, TEST_DELIVERY_WORKER: worker.email, TEST_DELIVERY_PASSWORD: client.password, TEST_DELIVERY_ORDER: order.id,
 } });
 process.exitCode = await new Promise((resolve, reject) => { child.on('error', reject); child.on('exit', code => resolve(code ?? 1)); });
 if (!process.exitCode && !process.argv.slice(2).length) {
  const ledger = await app.models.Ledger.findOne({ order: order.id });
  assert.equal(ledger.status, 'available'); assert.equal(ledger.platformFeeMinor, 1255); assert.equal(ledger.payableMinor, 11295);
  assert.equal(await app.models.Review.countDocuments({ order: order.id, verified: true }), 1);
 }
} finally { await vite?.close(); await app.close(); }
