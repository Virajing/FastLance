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
  let closing = false;
  const shutdown = async () => {
    if (closing) return;
    closing = true;
    const deadline = setTimeout(() => { httpServer.closeAllConnections(); process.exit(1); }, 15000);
    deadline.unref();
    try {
      await new Promise(resolve => io.close(resolve));
      await mongoose.disconnect();
      clearTimeout(deadline);
    } catch { process.exitCode = 1; }
  };
  process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
}
start().catch(error => { console.error({ code: error.code || error.name, message: 'Server startup failed. Check database connectivity, replica set and environment configuration.' }); process.exitCode = 1; });
