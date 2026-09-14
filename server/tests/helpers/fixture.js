import crypto from 'node:crypto';
import http from 'node:http';
import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { fileURLToPath } from 'node:url';

export async function fixture({ port = 0, clientUrl = 'http://localhost:5173,http://localhost:5174' } = {}) {
  const databaseName = 'fastlance_test_' + crypto.randomUUID().replaceAll('-', '');
  process.env.NODE_ENV = 'test';
  process.env.JWT_ACCESS_SECRET = crypto.randomBytes(48).toString('hex');
  process.env.JWT_REFRESH_SECRET = crypto.randomBytes(48).toString('hex');
  process.env.RAZORPAY_KEY_ID = '';
  process.env.RAZORPAY_KEY_SECRET = '';
  process.env.RAZORPAY_WEBHOOK_SECRET = '';
  process.env.STORAGE_PROVIDER = '';
  process.env.CLIENT_URL = clientUrl;
  process.env.COOKIE_SAME_SITE = 'lax';
  let mongo, server, io;
  async function close() {
    try {
      if (io) await new Promise(resolve => io.close(resolve));
      else if (server?.listening) await new Promise(resolve => server.close(resolve));
    } finally {
      try {
        if (mongoose.connection.readyState === 1 && mongoose.connection.name === databaseName) await mongoose.connection.dropDatabase();
      } finally {
        try { await mongoose.disconnect(); } finally { await mongo?.stop(); }
      }
    }
  }
  try {
  if (process.env.TEST_MONGODB_URI) {
    const uri = new URL(process.env.TEST_MONGODB_URI);
    if (!['mongodb:', 'mongodb+srv:'].includes(uri.protocol) || uri.pathname !== '/fastlance_test')
      throw new Error('TEST_MONGODB_URI must target a dedicated replica set with database fastlance_test. Never use a development or production server.');
    uri.pathname = '/' + databaseName;
    process.env.MONGODB_URI = uri.toString();
  } else {
    mongo = new MongoMemoryReplSet({
      binary: { version: '8.2.6', downloadDir: fileURLToPath(new URL('../../.cache/mongodb-binaries', import.meta.url)) },
      replSet: { count: 1, storageEngine: 'wiredTiger' }, instanceOpts: [{ dbName: databaseName }],
    });
    await mongo.start();
    process.env.MONGODB_URI = mongo.getUri(databaseName);
  }
  const { default: app } = await import('../../src/app.js');
  const { connectDb } = await import('../../src/config/db.js');
  const { setupSockets } = await import('../../src/sockets/index.js');
  await connectDb();
  const hello = await mongoose.connection.db.admin().command({ hello: 1 });
  if (!hello.setName) throw new Error('Integration tests require a MongoDB replica set.');
  await Promise.all(Object.values(mongoose.models).map(model => model.init()));
  server = http.createServer(app);
  io = setupSockets(server, app);
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
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
    const email = label.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + crypto.randomUUID() + '@example.test';
    const response = await api('POST', '/auth/register', { data: { name: label, email, password, ...extra } });
    if (response.status !== 200) throw new Error('Fixture registration failed: ' + response.message);
    return { user: response.data.user, token: response.data.accessToken, cookie: response.cookie, email, password };
  }
  return { app, server, io, mongo, base, api, register, close, models: mongoose.models };
  } catch (error) {
    await close();
    throw error;
  }
}
