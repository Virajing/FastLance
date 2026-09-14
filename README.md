# FastLance

FastLance is a MERN marketplace with separate client and freelancer workspaces on the same account. React Query consumes the Express/Mongoose API; authenticated Socket.IO delivers MongoDB-backed messages, receipts, presence and notifications. Money is integer paise, displayed as INR. Platform commission is 10%, rounded half-up to a paise; the remainder is freelancer payable. A payable ledger entry is not a bank transfer.

## Install and run

Use Node.js 22.12+ (or a compatible newer release), npm, and a MongoDB replica set. Transactions are required for authentication, orders, payments and messaging. A standalone MongoDB server is insufficient. Use MongoDB Atlas or start local MongoDB with `--replSet rs0` and initialize with `rs.initiate()` in mongosh.

From the root, run `npm run install:all`. Copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env`. Configure the database and two different random JWT secrets of at least 32 characters. Run `npm run dev` to start both applications.

The frontend defaults to `http://localhost:5173`; the API is `http://localhost:5000/api/v1`. Use the same hostname locally for SameSite cookies. `npm start` starts only the API; `npm run build` produces `client/dist`.

## Environment

Client: `VITE_API_URL` includes `/api/v1`. Socket.IO uses this URL's origin. Never put secrets in VITE variables.

| Server variables | Purpose |
| --- | --- |
| NODE_ENV, PORT | Deployment mode and API port |
| MONGODB_URI | Application replica-set database URI |
| CLIENT_URL | Comma-separated exact allowed frontend origins |
| JWT_ACCESS_SECRET, JWT_REFRESH_SECRET | Different random server secrets |
| COOKIE_NAME, COOKIE_SAME_SITE | Refresh-cookie name; lax, strict or none policy |
| RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET | Payment configuration |
| STORAGE_PROVIDER | Empty disables uploads; s3 enables them |
| S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY | Private storage configuration |
| S3_ENDPOINT | Optional S3-compatible endpoint |
| SEED_PASSWORD | Optional development-only seed password |

Registration creates a client account. Freelancer selection routes to professional onboarding, which adds the freelancer role without changing identity. Password reset, social login, biometric/2FA and unpersisted notification preferences are not advertised.

## Payments and storage

Configure all Razorpay test keys and the webhook secret. Register the HTTPS endpoint `/api/v1/payments/webhook` for `payment.captured`, `order.paid`, `payment.failed` and `refund.processed`. Configure payment capture in the provider dashboard. Checkout requires server HMAC validation, a provider payment fetch, exact amount/currency/capture checks and a committed database transaction. Signed webhooks are deduplicated.

Lost order-create responses are reconciled against the persisted receipt. Ambiguous or absent results require operator reconciliation; the API never automatically creates a second order. Refund retries use the same receipt and `X-Refund-Idempotency`. References: [order lookup](https://razorpay.com/docs/api/orders/fetch-all/) and [refund idempotency](https://razorpay.com/docs/api/refunds/normal-refunds-idempotent/?preferred-country=IN).

Uploads pass through the authenticated API to a private S3 bucket. Grant only required object put/get/delete permissions and enable AES256 server-side encryption support. The API validates file contents and the 10 MB limit, permits up to 10 attachments per resource, and limits accounts to 30 uploads/hour. Public downloads require a referenced avatar, portfolio or published service. Conversation/order downloads require authorization. Unused uploads are not automatically public.

Schedule `npm run cleanup:attachments --prefix server` to remove unreferenced uploads older than 24 hours, up to 100 removals per run. Metadata is persisted before provider upload so uncertain failures remain discoverable. Run a single cleanup instance and verify bucket permissions before production use.

Missing credentials disable provider controls with an explanation. Payouts are not configured; automated bank transfers are unavailable. No legal escrow, insurance or money-back guarantees are offered.

## Development seed

Set `NODE_ENV=development` and a development-only `SEED_PASSWORD` of at least 10 characters, then run `npm run seed`. This inserts the seven supported categories, `client@example.test`, `freelancer@example.test` and a service. It never deletes collections or overwrites existing account passwords. It adds no fabricated reviews, ratings or balances. There are no frontend demo-login buttons or runtime seed imports.

## Verification

```sh
npx playwright install chromium
npm run lint
npm run build
npm run test:server
npm run test:client
npm run test:e2e
npm run secret-scan
npm run check:repository
npm run verify
```

`verify` runs all checks plus production dependency audits for root/client/server and reports every exit status. It never seeds the application database, commits, pushes or rewrites history. Backend integration tests use actual Socket.IO and replica-set transactions. Client tests cover money and message merging. Playwright uses two independent browser contexts and an isolated API/database. Test-only provider doubles test payment integrity and transitions; they do not establish live provider success.

Tests pin MongoDB **8.2.6** in ignored `server/.cache/mongodb-binaries`. This binary starts on the Windows host used here. Linux CI must provide MongoDB's required system libraries; a Linux execution result remains to be obtained in CI. If startup/download fails, enable `MONGOMS_DEBUG=1` and check the actual process logs, free disk space, OS libraries and antivirus restrictions. The earlier code-100 startup failure did not reproduce; malformed fixture emails were the observed baseline failures.

If memory-server startup is impossible, set `TEST_MONGODB_URI` to a dedicated **test-only** replica set with database path exactly `/fastlance_test`. The fixture substitutes a random `fastlance_test_*` database, checks replica-set support and drops only that generated database during cleanup. Never use a development or production server. `MONGODB_URI` is not used as a test override. Tests are not skipped on setup failure.

The browser runner owns ports 5001 and 5188 and fails if occupied. It closes its Vite/API/database instances after each run. Ignored `test-results` traces may contain test credentials; do not commit them.

## Deployment

- Vercel: root `client`, build `npm run build`, output `dist`, and configure VITE_API_URL before building. `client/vercel.json` supplies SPA routing.
- Render: root `server`, install `npm ci --omit=dev`, start `npm start`. Supply production environment variables and use Render's port. Allow the exact frontend origin in CLIENT_URL.
- Separate-site deployment needs COOKIE_SAME_SITE=none and NODE_ENV=production for Secure cookies. Third-party-cookie restrictions may require frontend/API custom domains on the same site.
- Use one API instance until a shared Socket.IO adapter, presence and distributed rate limiter are configured. Current presence/rate limits are process-local.
- Keep the database/bucket private. Complete actual Razorpay test checkout/webhook and S3 upload/download checks before enabling providers for users.

## Historical credentials

Rotate the MongoDB database-user password and **both JWT secrets** exposed in `ae4c672`, even though the current files are sanitized. Decide separately whether to rewrite Git history. Scans report locations and rule names without printing values. No history rewrite is performed.

See [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) for tested scope, outstanding checks and the next task.
