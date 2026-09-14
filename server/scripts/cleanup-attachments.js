import mongoose from 'mongoose';
import { connectDb } from '../src/config/db.js';
import { cleanupOrphans } from '../src/services/storage.js';
try { await connectDb(); console.log(await cleanupOrphans()); }
finally { await mongoose.disconnect(); }
