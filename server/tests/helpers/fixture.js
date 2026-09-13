import crypto from 'node:crypto';
import http from 'node:http';
import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

export async function fixture() {
  const databaseName = 'fastlance_test_' + crypto.randomUUID().replaceAll('-', '');
  process.env.NODE_ENV = 'test';
  process.env.JWT_ACCESS_SECRET = crypto.randomBytes(48).toString('hex');
  process.env.JWT_REFRESH_SECRET = crypto.randomBytes(48).toString('hex');
  process.env.RAZORPAY_KEY_ID = '';
  process.env.RAZORPAY_KEY_SECRET = '';
  process.env.RAZORPAY_WEBHOOK_SECRET = '';
  process.env.STORAGE_PROVIDER = '';
  process.env.CLIENT_URL = 'http://localhost:5173,http://localhost:5174';
  process.env.COOKIE_SAME_SITE = 'lax';
  const mongo = await MongoMemoryReplSet.create({ replSet: { count: 1, storageEngine: 'wiredTiger' }, instanceOpts: [{ dbName: databaseName }] });
  process.env.MONGODB_URI = mongo.getUri(databaseName);
  const { default: app } = await import('../../src/app.js');
  const { connectDb } = await import('../../src/config/db.js');
  const { setupSockets } = await import('../../src/sockets/index.js');
  await connectDb();
  await Promise.all(Object.values(mongoose.models).map(model => model.init()));
  const server = http.createServer(app);
  const io = setupSockets(server, app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  async function api(method, path, { token, cookie, data, headers = {} } = {}) {
    const response = await fetch(base + '/api/v1' + path, {
      method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}), ...(cookie ? { Cookie: cookie } : {}), ...headers },
      body: data === undefined ? undefined : typeof data === 'string' ? data : JSON.stringify(data),
    });
    const result = await response.json();
    return { status: response.status, cookie: response.headers.get('set-cookie')?.split(';')[0], ...result };
  }
  const password = crypto.randomBytes(18).toString('base64url');
  async function register(label, extra = {}) {
    const email = label + '-' + crypto.randomUUID() + '@example.test';
    const response = await api('POST', '/auth/register', { data: { name: label, email, password, ...extra } });
    if (response.status !== 200) throw new Error('Fixture registration failed: ' + response.message);
    return { user: response.data.user, token: response.data.accessToken, cookie: response.cookie, email, password };
  }
  async function close() {
    await new Promise(resolve => io.close(resolve));
    await mongoose.disconnect();
    await mongo.stop();
  }
  return { app, server, io, mongo, base, api, register, close, models: mongoose.models };
}
