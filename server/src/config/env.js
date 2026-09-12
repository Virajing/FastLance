import 'dotenv/config';
import { z } from 'zod';
const schema = z.object({ NODE_ENV:z.enum(['development','test','production']).default('development'), PORT:z.coerce.number().default(5000), MONGODB_URI:z.string().min(1), CLIENT_URL:z.string().url().default('http://localhost:5173'), JWT_ACCESS_SECRET:z.string().min(32), JWT_REFRESH_SECRET:z.string().min(32), JWT_ACCESS_EXPIRES_IN:z.string().default('15m'), JWT_REFRESH_EXPIRES_IN:z.string().default('7d'), COOKIE_NAME:z.string().default('fastlance_refresh'), PLATFORM_COMMISSION_RATE:z.coerce.number().min(0).max(1).default(.1), PAYMENT_PROVIDER:z.enum(['mock','stripe','razorpay']).default('mock') });
export const env = schema.parse(process.env);
