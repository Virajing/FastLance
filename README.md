# FastLance

FastLance is a React marketplace with an Express, MongoDB, Socket.IO backend.

Install dependencies with `cd client && npm install`, then `cd ../server && npm install`. Copy `server/.env.example` to `server/.env`, set MongoDB and long JWT secrets, then run `npm run seed` and `npm run dev` in `server`; run `npm run dev` in `client` separately. Set `VITE_API_URL=http://localhost:5000/api/v1` in `client/.env`.

Demo accounts after seeding: `julian@fastlance.demo` / `DemoPass123!` (client), and `elena@fastlance.demo` / `DemoPass123!` (freelancer).

The REST API is under `/api/v1`: auth, categories, freelancers, services, orders, conversations, notifications, payments/webhook, and protected admin resources. Access tokens are held in memory; refresh tokens are httpOnly cookies. The mock payment provider creates development escrow payments only and is rejected in production. Replace `services/payment.js` provider methods with Razorpay or Stripe calls and validate their signed webhooks before deployment.

Deploy the Vite client to Vercel and the server to Render with `CLIENT_URL` set to the deployed client URL, MongoDB Atlas URI, production JWT secrets, HTTPS, and a real payment provider. Do not use the seed script in production.
