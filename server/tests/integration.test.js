import { test, before, after, mock } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { io as connect } from 'socket.io-client';
import { fixture } from './helpers/fixture.js';

let app, client, worker, stranger, service, order, conversation, env, razorpay, paymentEntity;
const configuration = {
  professionalTitle: 'Web developer', bio: 'I build accessible React applications and documented Node APIs.',
  skills: ['React', 'Node.js'], serviceCategories: ['development'], hourlyRateMinor: 150000, availability: 'available',
};
const serviceData = { title: 'Accessible React application', description: 'A complete accessible React application with an API and delivery notes.',
  category: 'development', status: 'published', packages: { basic: { name: 'Application', priceMinor: 12500, deliveryDays: 4, revisions: 2, features: ['React'] } } };
before(async () => {
  app = await fixture();
  ({ env } = await import('../src/config/env.js'));
  ({ razorpay } = await import('../src/services/payment.js'));
  await app.models.Category.create({ name: 'Development', slug: 'development' });
  client = await app.register('Client', { verificationStatus: 'verified', earnings: 90000, accountStatus: 'suspended', averageRating: 5, roles: ['admin', 'freelancer'] });
  worker = await app.register('Freelancer', { role: 'freelancer' });
  stranger = await app.register('Unrelated');
}, { timeout: 180000 });
after(async () => { mock.restoreAll(); if (app) await app.close(); });
const req = (actor, method, path, data) => app.api(method, path, { token: actor?.token, data });
const expect = (result, status) => { assert.equal(result.status, status, result.message); return result.data; };
const connectSocket = actor => new Promise((resolve, reject) => {
  const socket = connect(app.base, { auth: { token: actor.token }, transports: ['websocket'], forceNew: true, reconnection: false });
  socket.once('connect', () => resolve(socket)); socket.once('connect_error', reject);
});
const once = (socket, event) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => { socket.off(event, listener); reject(new Error('Missing socket event: ' + event)); }, 7000);
  const listener = data => { clearTimeout(timer); resolve(data); };
  socket.once(event, listener);
});
const emit = (socket, event, data) => socket.timeout(7000).emitWithAck(event, data);

test('registration whitelists fields and does not grant freelancer access before onboarding', async () => {
  assert.deepEqual(client.user.roles, ['client']);
  assert.equal(client.user.verificationStatus, 'unverified');
  assert.equal(client.user.accountStatus, 'active');
  assert.equal(client.user.earnings, undefined);
  assert.deepEqual(worker.user.roles, ['client']);
  expect(await req(client, 'PATCH', '/auth/role', { activeRole: 'freelancer' }), 403);
  expect(await req(client, 'POST', '/services', serviceData), 403);
  expect(await req(null, 'GET', '/orders'), 401);
  expect(await req(client, 'GET', '/orders/not-an-id'), 400);
  const publicList = expect(await req(null, 'GET', '/freelancers'), 200);
  assert.deepEqual(publicList, []);
});
test('freelancer onboarding and role switching retain account identity', async () => {
  const data = expect(await req(worker, 'POST', '/auth/onboard', { ...configuration, verificationStatus: 'verified' }), 200);
  assert.equal(data.user.id, worker.user.id);
  assert.deepEqual(data.user.roles, ['client', 'freelancer']);
  assert.equal(data.user.activeRole, 'freelancer');
  worker.user = data.user;
  expect(await req(worker, 'PATCH', '/auth/role', { activeRole: 'client' }), 200);
  expect(await req(worker, 'POST', '/services', serviceData), 403);
  expect(await req(worker, 'PATCH', '/auth/role', { activeRole: 'freelancer' }), 200);
  expect(await req(worker, 'PATCH', '/auth/role', { activeRole: 'admin' }), 400);
});
test('service CRUD is persistent, owned and server-filtered; public data excludes private fields', async () => {
  service = expect(await req(worker, 'POST', '/services', { ...serviceData, rating: 5, freelancer: stranger.user.id }), 201).service;
  assert.equal(service.freelancerId, worker.user.id);
  assert.equal(service.rating, 0);
  expect(await req(stranger, 'PATCH', '/services/' + service.id, { title: 'Stolen' }), 403);
  expect(await req(worker, 'PATCH', '/services/' + service.id, { freelancer: stranger.user.id, rating: 5, title: 'Accessible React application' }), 200);
  assert.equal(expect(await req(null, 'GET', '/services/' + service.id), 200).service.freelancerId, worker.user.id);
  const search = await req(null, 'GET', '/services?q=React&limit=1');
  assert.equal(search.pagination.total, 1);
  assert.equal(search.data.length, 1);
  assert.equal(expect(await req(null, 'GET', '/services?q=%28a%2B%29%2B%24'), 200).length, 0);
  const publicWorker = expect(await req(null, 'GET', '/freelancers/' + worker.user.id), 200).freelancer;
  assert.equal(publicWorker.email, undefined); assert.equal(publicWorker.password, undefined); assert.equal(publicWorker.refreshTokens, undefined);
  const draft = expect(await req(worker, 'POST', '/services', { ...serviceData, title: 'Draft without package', status: 'draft', packages: {} }), 201).service;
  assert.equal(draft.startingPriceMinor, null);
  expect(await req(worker, 'PATCH', '/services/' + draft.id, { status: 'published' }), 400);
  expect(await req(worker, 'DELETE', '/services/' + draft.id), 200);
});
test('portfolio CRUD and profile field whitelist', async () => {
  const item = expect(await req(worker, 'POST', '/freelancers/me/portfolio', { title: 'Project sample', description: 'A portfolio description', url: 'https://example.test/project' }), 200).portfolio[0];
  expect(await req(worker, 'PATCH', '/freelancers/me/portfolio/' + item._id, { title: 'Updated sample' }), 200);
  expect(await req(stranger, 'DELETE', '/freelancers/me/portfolio/' + item._id), 403);
  expect(await req(worker, 'DELETE', '/freelancers/me/portfolio/' + item._id), 200);
  const updated = expect(await req(worker, 'PATCH', '/auth/me', { name: 'Freelancer Updated', earnings: 5000, accountStatus: 'suspended', role: 'admin' }), 200).user;
  assert.equal(updated.accountStatus, 'active'); assert.equal(updated.isAdmin, false);
  expect(await req(worker, 'PATCH', '/auth/me', { website: 'javascript:alert(1)' }), 400);
});
test('sessions rotate atomically, old refresh tokens fail, logout revokes access', async () => {
  const account = await app.register('Session account');
  const stored = await app.models.Session.findOne({ user: account.user.id }).select('+tokenHash');
  assert.notEqual(stored.tokenHash, account.cookie.split('=')[1]);
  const refreshed = await app.api('POST', '/auth/refresh', { cookie: account.cookie });
  expect(refreshed, 200);
  assert.notEqual(refreshed.cookie, account.cookie);
  expect(await app.api('POST', '/auth/refresh', { cookie: account.cookie }), 401);
  expect(await app.api('POST', '/auth/logout', { cookie: refreshed.cookie }), 200);
  expect(await app.api('POST', '/auth/refresh', { cookie: refreshed.cookie }), 401);
  expect(await req(account, 'GET', '/auth/me'), 401);
  const login = await app.api('POST', '/auth/login', { data: { email: account.email, password: account.password } });
  expect(login, 200);
  const loggedIn = { token: login.data.accessToken };
  expect(await req(loggedIn, 'PATCH', '/auth/password', { currentPassword: account.password, newPassword: crypto.randomBytes(20).toString('hex') }), 200);
  expect(await req(loggedIn, 'GET', '/auth/me'), 401);
  expect(await app.api('POST', '/auth/refresh', { cookie: login.cookie }), 401);
  const userRecord = await app.models.User.findById(account.user.id);
  userRecord.accountStatus = 'suspended'; await userRecord.save();
  expect(await app.api('POST', '/auth/login', { data: { email: account.email, password: account.password } }), 401);
});
test('suspended accounts cannot restore sessions or authenticate sockets', async () => {
  const account = await app.register('Suspended account');
  await app.models.User.updateOne({ _id: account.user.id }, { accountStatus: 'suspended' });
  expect(await app.api('POST', '/auth/login', { data: { email: account.email, password: account.password } }), 403);
  expect(await app.api('POST', '/auth/refresh', { cookie: account.cookie }), 401);
  expect(await req(account, 'GET', '/auth/me'), 401);
  await assert.rejects(connectSocket(account), /Authentication required/);
});
test('jobs and proposals enforce ownership, editable pending state and single acceptance', async () => {
  const job = expect(await req(client, 'POST', '/jobs', { title: 'Build a React dashboard', description: 'Please build an accessible dashboard with documented API integration.',
    category: 'development', skills: ['React'], budgetType: 'fixed', budgetMinor: 25000,
    deadline: new Date(Date.now() + 86400000 * 30).toISOString(), status: 'open' }), 201).job;
  expect(await req(stranger, 'PATCH', '/jobs/' + job.id, { title: 'Steal the job' }), 404);
  const proposal = expect(await req(worker, 'POST', '/jobs/' + job.id + '/proposals', { coverLetter: 'I can build and test this complete dashboard.', amountMinor: 20000, deliveryDays: 7 }), 201).proposal;
  expect(await req(stranger, 'POST', '/proposals/' + proposal.id + '/decision', { action: 'accept' }), 404);
  expect(await req(worker, 'PATCH', '/proposals/' + proposal.id, { amountMinor: 22000, client: stranger.user.id }), 200);
  const accepted = expect(await req(client, 'POST', '/proposals/' + proposal.id + '/decision', { action: 'accept' }), 200);
  assert.equal(accepted.order.totalAmountMinor, 22000);
  expect(await req(client, 'POST', '/proposals/' + proposal.id + '/decision', { action: 'accept' }), 409);
  expect(await req(worker, 'PATCH', '/proposals/' + proposal.id, { action: 'withdraw' }), 409);
  expect(await req(worker, 'GET', '/jobs?q=dashboard'), 200);
});
test('conversation creation, unauthorized rooms, real-time delivery, REST fallback, duplicate protection and reads', async () => {
  conversation = expect(await req(client, 'POST', '/conversations', { participantId: worker.user.id }), 201).conversation;
  const again = expect(await req(client, 'POST', '/conversations', { participantId: worker.user.id }), 201).conversation;
  assert.equal(again.id, conversation.id);
  expect(await req(stranger, 'GET', '/conversations/' + conversation.id + '/messages'), 403);
  expect(await req(stranger, 'POST', '/conversations/' + conversation.id + '/read', { sequence: 0 }), 403);
  const a = await connectSocket(client), b = await connectSocket(worker), c = await connectSocket(stranger);
  try {
    assert.equal((await emit(a, 'conversation:join', { conversationId: conversation.id })).success, true);
    assert.equal((await emit(b, 'conversation:join', { conversationId: conversation.id })).success, true);
    assert.equal((await emit(c, 'conversation:join', { conversationId: conversation.id })).error.status, 403);
    const data = { conversationId: conversation.id, clientId: crypto.randomUUID(), text: 'Hello from the client', attachments: [] };
    const incoming = once(b, 'message:new'), notification = once(b, 'notification:new');
    const ack = await emit(a, 'message:send', data);
    assert.equal(ack.success, true);
    const message = (await incoming).message;
    assert.equal(message.id, ack.data.message.id);
    assert.equal((await notification).type, 'message');
    const duplicate = await emit(a, 'message:send', data);
    assert.equal(duplicate.data.duplicate, true);
    assert.equal(await app.models.Message.countDocuments({ conversation: conversation.id }), 1);
    assert.equal((await emit(c, 'message:send', data)).error.status, 403);
    const list = expect(await req(worker, 'GET', '/conversations'), 200);
    assert.equal(list.find(row => row.id === conversation.id).unreadCount, 1);
    assert.equal(list.find(row => row.id === conversation.id).participant.online, true);
    const delivered = once(a, 'message:delivered');
    assert.equal((await emit(b, 'message:delivered', { conversationId: conversation.id, sequence: message.sequence })).success, true);
    await delivered;
    const read = once(a, 'message:read');
    await emit(b, 'message:read', { conversationId: conversation.id, sequence: message.sequence });
    assert.equal((await read).userId, worker.user.id);
    assert.equal(expect(await req(worker, 'GET', '/conversations'), 200)[0].unreadCount, 0);
    const fromRest = once(a, 'message:new');
    const response = expect(await req(worker, 'POST', '/conversations/' + conversation.id + '/messages',
      { clientId: crypto.randomUUID(), text: 'Hello from the freelancer', attachments: [] }), 201);
    assert.equal((await fromRest).message.id, response.message.id);
    assert.equal(response.message.sequence, 2);
    const history = expect(await req(client, 'GET', '/conversations/' + conversation.id + '/messages'), 200);
    assert.equal(history.length, 2);
    assert.ok(history[0].readBy.includes(worker.user.id));
    const typing = once(b, 'typing:updated');
    await emit(a, 'typing:start', { conversationId: conversation.id });
    assert.equal((await typing).typing, true);
    assert.equal((await emit(a, 'conversation:join', { conversationId: 'invalid' })).error.status, 400);
  } finally { a.disconnect(); b.disconnect(); c.disconnect(); }
});
test('order creation and transition permissions cannot be forged', async () => {
  const clientId = crypto.randomUUID();
  order = expect(await req(client, 'POST', '/orders', { serviceId: service.id, tier: 'basic', clientId,
    platformFeeMinor: 0, freelancerAmountMinor: 12500, status: 'completed', paymentStatus: 'paid' }), 201).order;
  assert.equal(order.status, 'pending'); assert.equal(order.platformFeeMinor, 1250); assert.equal(order.freelancerAmountMinor, 11250);
  assert.equal(expect(await req(client, 'POST', '/orders', { serviceId: service.id, clientId }), 200).order.id, order.id);
  for (const action of ['cancelled', 'accepted', 'deliver', 'complete', 'dispute']) expect(await req(stranger, 'PATCH', '/orders/' + order.id + '/transition', { action }), 403);
  expect(await req(client, 'PATCH', '/orders/' + order.id + '/transition', { action: 'accepted' }), 403);
  expect(await req(worker, 'PATCH', '/orders/' + order.id + '/transition', { action: 'accepted' }), 200);
  expect(await req(client, 'PATCH', '/orders/' + order.id + '/transition', { action: 'paid' }), 400);
  expect(await req(worker, 'PATCH', '/orders/' + order.id + '/transition', { action: 'deliver', notes: 'Premature work' }), 409);
  expect(await req(client, 'POST', '/orders/' + order.id + '/payment'), 503);
  expect(await req(client, 'POST', '/attachments'), 503);
});
test('checkout HMAC and webhook signatures reject forgery; captured payments and webhooks are idempotent', async () => {
  env.RAZORPAY_KEY_ID = 'rzp_test_integration';
  env.RAZORPAY_KEY_SECRET = crypto.randomBytes(32).toString('hex');
  env.RAZORPAY_WEBHOOK_SECRET = crypto.randomBytes(32).toString('hex');
  mock.method(razorpay, 'createOrder', async data => ({ id: 'order_Integration1', amount: data.amount, currency: data.currency }));
  mock.method(razorpay, 'fetchPayment', async () => paymentEntity);
  const checkout = expect(await req(client, 'POST', '/orders/' + order.id + '/payment'), 200);
  assert.equal(checkout.amountMinor, 12500);
  expect(await req(client, 'POST', '/orders/' + order.id + '/payment'), 200);
  assert.equal(razorpay.createOrder.mock.callCount(), 1);
  expect(await req(client, 'POST', '/orders/' + order.id + '/payment/verify', {
    razorpay_order_id: checkout.providerOrderId, razorpay_payment_id: 'pay_Integration1', razorpay_signature: '0'.repeat(64),
  }), 400);
  const { verifySignature } = await import('../src/services/payment.js');
  assert.equal(verifySignature('payload', 'invalid', env.RAZORPAY_KEY_SECRET), false);
  paymentEntity = { id: 'pay_Integration1', order_id: checkout.providerOrderId, status: 'captured', captured: true, amount: 12500, currency: 'INR', amount_refunded: 0 };
  const signature = crypto.createHmac('sha256', env.RAZORPAY_KEY_SECRET).update(checkout.providerOrderId + '|' + paymentEntity.id).digest('hex');
  const raw = JSON.stringify({ event: 'payment.captured', payload: { payment: { entity: paymentEntity } } });
  expect(await app.api('POST', '/payments/webhook', { data: raw }), 400);
  const signed = { 'x-razorpay-event-id': 'event-integration-one', 'x-razorpay-signature': crypto.createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET).update(raw).digest('hex') };
  const verify = { razorpay_order_id: checkout.providerOrderId, razorpay_payment_id: paymentEntity.id, razorpay_signature: signature };
  expect(await req(stranger, 'POST', '/orders/' + order.id + '/payment/verify', verify), 403);
  expect(await req(client, 'POST', '/orders/' + order.id + '/payment/verify', verify), 200);
  expect(await app.api('POST', '/payments/webhook', { data: raw, headers: signed }), 200);
  assert.equal(expect(await app.api('POST', '/payments/webhook', { data: raw, headers: signed }), 200).duplicate, true);
  expect(await req(client, 'POST', '/orders/' + order.id + '/payment/verify', verify), 200);
  assert.equal(await app.models.Ledger.countDocuments({ order: order.id }), 1);
  assert.equal((await app.models.Order.findById(order.id)).status, 'active');
});
test('delivery, revision, completion, review and dashboard ledger values persist exactly once', async () => {
  const path = '/orders/' + order.id;
  expect(await req(worker, 'PATCH', path + '/transition', { action: 'deliver', notes: 'First delivery with source notes.' }), 200);
  expect(await req(client, 'PATCH', path + '/transition', { action: 'revision', notes: 'Please improve keyboard navigation.' }), 200);
  expect(await req(worker, 'PATCH', path + '/transition', { action: 'deliver', notes: 'Keyboard navigation revised and checked.' }), 200);
  const completions = await Promise.all([req(client, 'PATCH', path + '/transition', { action: 'complete' }), req(client, 'PATCH', path + '/transition', { action: 'complete' })]);
  assert.deepEqual(completions.map(row => row.status).sort(), [200, 409]);
  expect(await req(worker, 'POST', path + '/review', { rating: 5, comment: 'Self review' }), 403);
  expect(await req(stranger, 'POST', path + '/review', { rating: 5, comment: 'Unrelated review' }), 403);
  expect(await req(client, 'POST', path + '/review', { rating: 5, comment: 'Great work delivered after revision.', freelancer: stranger.user.id }), 201);
  expect(await req(client, 'POST', path + '/review', { rating: 4, comment: 'Duplicate' }), 409);
  const ledger = await app.models.Ledger.findOne({ order: order.id });
  assert.equal(ledger.status, 'available'); assert.equal(ledger.payableMinor, 11250); assert.equal(ledger.platformFeeMinor, 1250);
  const freelancerDashboard = expect(await req(worker, 'GET', '/dashboard'), 200);
  assert.equal(freelancerDashboard.availableMinor, 11250);
  assert.equal(freelancerDashboard.earningsMinor, 11250);
  assert.equal(freelancerDashboard.completedContracts, 1);
  assert.equal(freelancerDashboard.rating, 5);
  const clientDashboard = expect(await req(client, 'GET', '/dashboard'), 200);
  assert.equal(clientDashboard.totalSpentMinor, 12500);
  assert.equal(clientDashboard.completedContracts, 1);
  assert.equal(freelancerDashboard.totalSpentMinor, undefined);
  assert.equal((await req(worker, 'GET', '/notifications')).data.unreadCount > 0, true);
  expect(await req(worker, 'PATCH', '/notifications/read-all'), 200);
  assert.equal((await req(worker, 'GET', '/notifications')).data.unreadCount, 0);
  assert.equal(expect(await req(null, 'GET', '/reviews?serviceId=' + service.id), 200).length, 1);
});
