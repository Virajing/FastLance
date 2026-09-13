import http from 'node:http';
import mongoose from 'mongoose';
import app from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { setupSockets } from './sockets/index.js';
async function start() {
  await connectDb();
  const httpServer = http.createServer(app);
  const io = setupSockets(httpServer, app);
  httpServer.listen(env.PORT, () => console.log('FastLance API listening on port ' + env.PORT));
  const shutdown = () => io.close(() => httpServer.close(async () => { await mongoose.disconnect(); process.exit(0); }));
  process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
}
start().catch(error => { console.error({ code: error.code || error.name, message: 'Server startup failed. Check database connectivity, replica set and environment configuration.' }); process.exitCode = 1; });
