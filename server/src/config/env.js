import 'dotenv/config';
import { z } from 'zod';
const secret = z.string().min(32).refine(value => !value.startsWith('replace-'), 'Set a fresh random secret');
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(0).max(65535).default(5000),
  MONGODB_URI: z.string().min(1),
  CLIENT_URL: z.string().default('http://localhost:5173').transform(value => value.split(',').map(origin => z.string().url().parse(origin.trim()))),
  JWT_ACCESS_SECRET: secret, JWT_REFRESH_SECRET: secret,
  COOKIE_NAME: z.string().default('fastlance_refresh'),
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  RAZORPAY_KEY_ID: z.string().default(''), RAZORPAY_KEY_SECRET: z.string().default(''), RAZORPAY_WEBHOOK_SECRET: z.string().default(''),
  STORAGE_PROVIDER: z.enum(['', 's3']).default(''),
  S3_BUCKET: z.string().default(''), S3_REGION: z.string().default(''),
  S3_ACCESS_KEY_ID: z.string().default(''), S3_SECRET_ACCESS_KEY: z.string().default(''), S3_ENDPOINT: z.string().default(''),
}).refine(value => value.JWT_ACCESS_SECRET !== value.JWT_REFRESH_SECRET, 'Use different JWT secrets');
const result = schema.safeParse(process.env);
if (!result.success) {
  // Configuration errors report names only; never include secret values.
  throw new Error('Invalid server configuration: ' + result.error.issues.map(issue => issue.path.join('.') || 'JWT secret separation').join(', '));
}
export const env = result.data;
export const capabilities = () => ({
  payments: Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET && env.RAZORPAY_WEBHOOK_SECRET),
  storage: Boolean(env.STORAGE_PROVIDER === 's3' && env.S3_BUCKET && env.S3_REGION && env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY),
  payouts: false,
  paymentMessage: 'Payments not configured. Configure Razorpay keys and the webhook secret.',
  storageMessage: 'Attachments not configured. Configure S3-compatible storage.',
  payoutMessage: 'Payouts not configured. Payable balances are recorded; bank transfers are unavailable.',
});
