import mongoose from 'mongoose';
import { env } from './env.js';
export async function connectDb() {
  if (env.NODE_ENV === 'test' && !/^mongodb:\/\/(?:127\.0\.0\.1|localhost):\d+\/fastlance_test_[a-zA-Z0-9_-]+(?:\?|$)/.test(env.MONGODB_URI))
    throw new Error('Tests require an isolated loopback fastlance_test_ database');
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  const hello = await mongoose.connection.db.admin().command({ hello: 1 });
  if (!hello.setName && hello.msg !== 'isdbgrid') {
    await mongoose.disconnect();
    throw new Error('MongoDB must run as a replica set or sharded cluster for transaction safety');
  }
}
