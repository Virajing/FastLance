import http from 'http'; 
import app from './app.js';
import {connectDb} from './config/db.js';
import {env} from './config/env.js';
import {setupSockets} from './sockets/index.js';
const start=async()=>{
    await connectDb();
    const httpServer=http.createServer(app);
    setupSockets(httpServer);
    httpServer.listen(env.PORT,()=>console.log(`FastLance API listening on ${env.PORT}`));
    const shut=()=>httpServer.close(()=>process.exit(0));
    process.on('SIGINT',shut);
    process.on('SIGTERM',shut);
};
start().catch(e=>{console.error(e);process.exit(1)});
